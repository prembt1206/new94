import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { dbService } from '../services/supabaseService.js';

export const counselorController = {
  async getPatients(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user.role !== 'counselor' && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Access restricted to licensed counselors and mental health administrators.'
        });
      }

      const survivors = await dbService.getAllSurvivors();

      return res.status(200).json({
        patients: survivors,
        total: survivors.length
      });
    } catch (err: any) {
      console.error('Error fetching counselor patients:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  },

  async getPatientDetails(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user.role !== 'counselor' && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Access restricted to licensed counselors and mental health administrators.'
        });
      }

      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!id) {
        return res.status(400).json({ error: 'Bad Request', message: 'Patient ID is required.' });
      }

      const patient = await dbService.getProfile(id);
      if (!patient) {
        return res.status(404).json({ error: 'Not Found', message: 'Patient profile not found.' });
      }

      const checkIns = await dbService.getCheckInsForUser(id, 50);
      const predictions = await dbService.getPredictionsForUser(id, 50);
      const allAlerts = await dbService.getAlerts();
      const patientAlerts = allAlerts.filter(a => a.user_id === id);

      const predMap = new Map(predictions.map(p => [p.check_in_id, p]));
      const timeline = checkIns.map(c => ({
        ...c,
        prediction: predMap.get(c.id) || null
      }));

      // Security Audit Trail
      await dbService.createAuditLog(
        req.user.id,
        'COUNSELOR_VIEWED_PATIENT_TIMELINE',
        id,
        {
          counselorAlias: req.user.alias,
          viewedAt: new Date().toISOString()
        }
      );

      return res.status(200).json({
        patient: {
          id: patient.id,
          alias: patient.alias,
          fullName: patient.full_name,
          emergencyContact: patient.emergency_contact,
          createdAt: patient.created_at
        },
        timeline,
        alerts: patientAlerts,
        totalCheckIns: checkIns.length,
        latestPrediction: predictions[0] || null
      });
    } catch (err: any) {
      console.error('Error fetching patient details:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }
};
