import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', alertController.getAlerts);
router.patch('/:id', requireRole(['counselor', 'admin']), alertController.updateAlertStatus);

export default router;
