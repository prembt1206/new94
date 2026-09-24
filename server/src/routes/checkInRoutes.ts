import { Router } from 'express';
import { checkInController } from '../controllers/checkInController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { checkInLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', requireAuth, checkInLimiter, checkInController.submitCheckIn);
router.get('/history', requireAuth, checkInController.getHistory);

export default router;
