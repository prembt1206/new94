import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { dbService } from '../services/supabaseService.js';

export const predictionController = {
  async getLatestPrediction(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const latest = await dbService.getLatestPredictionForUser(req.user.id);
      if (!latest) {
        return res.status(200).json({
          prediction: null,
          message: 'No previous distress predictions recorded yet. Complete your first check-in to begin tracking.'
        });
      }

      return res.status(200).json({
        prediction: latest
      });
    } catch (err: any) {
      console.error('Error fetching latest prediction:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  },

  async getTrends(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const limit = parseInt(req.query.limit as string) || 14;
      const predictions = await dbService.getPredictionsForUser(req.user.id, limit);
      const checkIns = await dbService.getCheckInsForUser(req.user.id, limit);

      const checkInMap = new Map(checkIns.map(c => [c.id, c]));

      // Format for Recharts (chronological order)
      const trendPoints = predictions
        .map(p => {
          const associatedCheckIn = p.check_in_id ? checkInMap.get(p.check_in_id) : null;
          return {
            date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: p.created_at,
            distressScore: p.distress_score,
            riskLevel: p.risk_level,
            moodScore: associatedCheckIn?.mood_score ?? null,
            anxietyScore: associatedCheckIn?.anxiety_score ?? null,
            sleepQuality: associatedCheckIn?.sleep_quality ?? null,
            tension: associatedCheckIn?.physical_tension ?? null,
            summary: p.ai_analysis_summary
          };
        })
        .reverse(); // oldest to newest for linear chart

      return res.status(200).json({
        trends: trendPoints
      });
    } catch (err: any) {
      console.error('Error fetching trends:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }
};
