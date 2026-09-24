import { Router } from 'express';
import { predictionController } from '../controllers/predictionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/latest', requireAuth, predictionController.getLatestPrediction);
router.get('/trends', requireAuth, predictionController.getTrends);

export default router;
