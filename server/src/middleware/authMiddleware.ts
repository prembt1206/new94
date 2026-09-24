import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/supabaseService.js';
import { UserRole } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mindguard-trauma-safe-secure-jwt-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
    alias: string;
  };
}

export function generateToken(payload: { id: string; role: UserRole; email: string; alias: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token is required to access sensitive mental health records.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Malformed authorization token.' });
    }

    // Verify JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const profile = await dbService.getProfile(decoded.id);

      if (!profile) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User profile no longer exists.' });
      }

      req.user = {
        id: profile.id,
        role: profile.role,
        email: profile.email || decoded.email || '',
        alias: profile.alias || 'Anonymous'
      };

      return next();
    } catch (jwtErr) {
      // If token expired or invalid
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired session token.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to authenticate user.' });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Role '${req.user.role}' is not authorized for this resource.`
      });
    }

    next();
  };
}
