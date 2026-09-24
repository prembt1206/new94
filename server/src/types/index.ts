export type UserRole = 'survivor' | 'counselor' | 'admin';
export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';
export type AlertStatus = 'pending' | 'acknowledged' | 'resolved';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string | null;
  alias: string | null;
  emergency_contact: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  mood_score: number; // 1-5
  anxiety_score: number; // 1-5
  sleep_quality: number; // 1-5
  physical_tension?: number; // 1-5
  free_text_reflection?: string | null;
  created_at: string;
}

export interface DistressPrediction {
  id: string;
  user_id: string;
  check_in_id: string | null;
  distress_score: number; // 0.00 to 100.00
  risk_level: RiskLevel;
  ai_analysis_summary: string;
  recommended_actions: string[];
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  counselor_id: string | null;
  prediction_id: string;
  status: AlertStatus;
  created_at: string;
  patient_alias?: string;
  distress_score?: number;
  risk_level?: RiskLevel;
  ai_analysis_summary?: string;
}

export interface DistressAnalysisResult {
  distressScore: number;
  riskLevel: RiskLevel;
  analysisSummary: string;
  recommendedActions: string[];
}

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  email: string;
  alias: string;
}
