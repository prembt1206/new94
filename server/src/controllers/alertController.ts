import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { alertUpdateSchema } from '../schemas/validationSchemas.js';
import { dbService } from '../services/supabaseService.js';

export const alertController = {
  async updateAlertStatus(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user.role !== 'counselor' && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Only counselors and administrators can acknowledge or resolve patient crisis alerts.'
        });
      }

      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      if (!id) {
        return res.status(400).json({ error: 'Bad Request', message: 'Alert ID is required.' });
      }

      const validated = alertUpdateSchema.parse(req.body);

      const updated = await dbService.updateAlertStatus(id, validated.status, req.user.id);
      if (!updated) {
        return res.status(404).json({ error: 'Not Found', message: 'Alert not found.' });
      }

      // Security audit log
      await dbService.createAuditLog(
        req.user.id,
        'ALERT_STATUS_UPDATED',
        updated.user_id,
        {
          alertId: id,
          newStatus: validated.status,
          updatedByRole: req.user.role
        }
      );

      return res.status(200).json({
        message: `Alert status updated to '${validated.status}'.`,
        alert: updated
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      console.error('Error updating alert status:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  },

  async getAlerts(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const alerts = await dbService.getAlerts(req.user.role === 'counselor' ? req.user.id : undefined);

      return res.status(200).json({
        alerts
      });
    } catch (err: any) {
      console.error('Error fetching alerts:', err);
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }
};
