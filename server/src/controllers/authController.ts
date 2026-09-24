import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { dbService, localStore } from '../services/supabaseService.js';
import { registerSchema, loginSchema, profileUpdateSchema } from '../schemas/validationSchemas.js';
import { generateToken, AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const validated = registerSchema.parse(req.body);
      
      // Check existing email
      const existing = await dbService.getProfileByEmail(validated.email);
      if (existing) {
        return res.status(409).json({
          error: 'Conflict',
          message: 'An account with this email address already exists.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(validated.password, salt);
      const userId = uuidv4();

      const newProfile = await dbService.upsertProfile({
        id: userId,
        role: validated.role,
        full_name: validated.fullName || null,
        alias: validated.alias,
        email: validated.email,
        emergency_contact: validated.emergencyContact || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        passwordHash
      });

      const token = generateToken({
        id: newProfile.id,
        role: newProfile.role,
        email: validated.email,
        alias: newProfile.alias || 'Anonymous'
      });

      return res.status(201).json({
        message: 'Account successfully registered.',
        token,
        user: {
          id: newProfile.id,
          role: newProfile.role,
          alias: newProfile.alias,
          fullName: newProfile.full_name,
          email: validated.email,
          emergencyContact: newProfile.emergency_contact
        }
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const validated = loginSchema.parse(req.body);
      const email = validated.email.toLowerCase();

      // Check predefined demo accounts or registered users
      const profile = await dbService.getProfileByEmail(email);

      if (!profile) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid email credentials or account does not exist.'
        });
      }

      // If user has a hashed password, verify it; for seeded demo accounts allow test passwords
      let isMatch = false;
      if (profile.passwordHash) {
        isMatch = await bcrypt.compare(validated.password, profile.passwordHash);
      } else {
        // Pre-seeded demo credentials allow common demo passwords or any password for seamless demo
        isMatch = true;
      }

      if (!isMatch) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Incorrect password provided.'
        });
      }

      const token = generateToken({
        id: profile.id,
        role: profile.role,
        email: profile.email || email,
        alias: profile.alias || 'Anonymous'
      });

      return res.status(200).json({
        message: 'Authentication successful.',
        token,
        user: {
          id: profile.id,
          role: profile.role,
          alias: profile.alias,
          fullName: profile.full_name,
          email: profile.email || email,
          emergencyContact: profile.emergency_contact
        }
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  },

  async getMe(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const profile = await dbService.getProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Not Found', message: 'Profile not found.' });
    }

    return res.status(200).json({
      user: {
        id: profile.id,
        role: profile.role,
        alias: profile.alias,
        fullName: profile.full_name,
        email: profile.email || req.user.email,
        emergencyContact: profile.emergency_contact,
        createdAt: profile.created_at
      }
    });
  },

  async updateSettings(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const validated = profileUpdateSchema.parse(req.body);
      const updated = await dbService.updateProfile(req.user.id, {
        alias: validated.alias,
        full_name: validated.fullName,
        emergency_contact: validated.emergencyContact
      });

      return res.status(200).json({
        message: 'Settings updated successfully.',
        user: updated
      });
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation Error', details: err.errors });
      }
      return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  }
};
