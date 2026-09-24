import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import checkInRoutes from './routes/checkInRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import counselorRoutes from './routes/counselorRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import { standardLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allows API consumption from frontend
}));
app.use(cors({
  origin: '*', // In production, tighten to FRONTEND_URL
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('dev'));

// Apply standard rate limiter to all API routes
app.use('/api', standardLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'MindGuard AI - Trauma Distress Prediction System',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL),
    timestamp: new Date().toISOString()
  });
});

// Mount Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/check-ins', checkInRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/alerts', alertRoutes);

// 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.originalUrl} does not exist.` });
});

// Centralized Trauma-Informed Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🛡️ MindGuard AI Server running securely on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});

export default app;
