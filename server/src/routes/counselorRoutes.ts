import { Router } from 'express';
import { counselorController } from '../controllers/counselorController.js';
import { alertController } from '../controllers/alertController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['counselor', 'admin']));

router.get('/patients', counselorController.getPatients);
router.get('/patient/:id', counselorController.getPatientDetails);
router.get('/alerts', alertController.getAlerts);

export default router;
