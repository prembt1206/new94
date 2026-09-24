import { z } from 'zod';

export const checkInSubmissionSchema = z.object({
  moodScore: z.number().int().min(1).max(5),
  anxietyScore: z.number().int().min(1).max(5),
  sleepQuality: z.number().int().min(1).max(5),
  physicalTension: z.number().int().min(1).max(5).optional().default(1),
  freeTextReflection: z.string().max(2000).optional().default(''),
});

export const alertUpdateSchema = z.object({
  status: z.enum(['pending', 'acknowledged', 'resolved']),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['survivor', 'counselor', 'admin']).default('survivor'),
  alias: z.string().min(2).max(50),
  fullName: z.string().max(100).optional(),
  emergencyContact: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  alias: z.string().min(2).max(50).optional(),
  fullName: z.string().max(100).optional(),
  emergencyContact: z.string().max(100).optional(),
});
