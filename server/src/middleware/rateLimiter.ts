import rateLimit from 'express-rate-limit';

// Standard API rate limiter
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again after a few minutes.'
  }
});

// Stricter limiter for check-in submission and AI calls
export const checkInLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 check-ins / minute bursts prevented
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Please take a brief pause before submitting another psychological assessment.'
  }
});

// Auth endpoints limiter (brute-force defense)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate Limit Exceeded',
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});
