import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { checkInSubmissionSchema } from '../schemas/validationSchemas.js';
import { dbService } from '../services/supabaseService.js';
import { analyzeCheckIn } from '../services/geminiService.js';

export const checkInController = {
  async submitCheckIn(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
      }

      // 1. Validate payload with Zod
      const validated = checkInSubmissionSchema.parse(req.body);

      // 2. Persist Check-In
      const checkIn = await dbService.createCheckIn({
        user_id: req.user.id,
        mood_score: validated.moodScore,
        anxiety_score: validated.anxietyScore,
        sleep_quality: validated.sleepQuality,
        physical_tension: validated.physicalTension ?? 1,
        free_text_reflection: validated.freeTextReflection || ''
      });

      // 3. Trigger Gemini AI Predictive Analysis Engine
      const aiResult = await analyzeCheckIn(
        validated.freeTextReflection || '',
        {
          mood: validated.moodScore,
          anxiety: validated.anxietyScore,
          sleep: validated.sleepQuality,
          physicalTension: validated.physicalTension
        }
      );

      // 4. Save Distress Prediction to Database
      const prediction = await dbService.createPrediction({
        user_id: req.user.id,
        check_in_id: checkIn.id,
        distress_score: aiResult.distressScore,
        risk_level: aiResult.riskLevel,
        ai_analysis_summary: aiResult.analysisSummary,
        recommended_actions: aiResult.recommendedActions
      });

      // 5. Automated Alert Escalation: If risk is Orange or Red, queue counselor alert
      let alertCreated = false;
      let alertRecord = null;
      if (aiResult.riskLevel === 'orange' || aiResult.riskLevel === 'red') {
        alertRecord = await dbService.createAlert({
          user_id: req.user.id,
          counselor_id: null, // Queued for any assigned or on-call counselor
          prediction_id: prediction.id,
          status: 'pending',
          risk_level: aiResult.riskLevel,
          distress_score: aiResult.distressScore,
          ai_analysis_summary: aiResult.analysisSummary
        });
        alertCreated = true;
      }

      // 6. Security Audit Log
      await dbService.createAuditLog(
        req.user.id,
        'CHECK_IN_SUBMITTED',
        req.user.id,
        {
          checkInId: checkIn.id,
          distressScore: aiResult.distressScore,
          riskLevel: aiResult.riskLevel,
          alertTriggered: alertCreated
        }
      );

      return res.status(201).json({
        message: 'Check-in processed and psychological analysis completed.',
        checkIn,
        prediction,
        alertCreated,
        alert: alertRecord,
        emergencyEscalation: aiResult.riskLevel === 'red' || aiResult.riskLevel === 'orange'
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      console.error('Error submitting check-in:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  },

  async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const checkIns = await dbService.getCheckInsForUser(req.user.id, limit);
      const predictions = await dbService.getPredictionsForUser(req.user.id, limit);

      // Join predictions with check-ins for complete timeline
      const predMap = new Map(predictions.map(p => [p.check_in_id, p]));

      const combinedHistory = checkIns.map(c => ({
        ...c,
        prediction: predMap.get(c.id) || null
      }));

      return res.status(200).json({
        checkIns: combinedHistory,
        total: combinedHistory.length
      });
    } catch (err: any) {
      console.error('Error fetching history:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }
};
