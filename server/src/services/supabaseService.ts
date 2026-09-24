import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, CheckIn, DistressPrediction, Alert, UserRole, RiskLevel, AlertStatus } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL || 'https://wrkpxbwmezhuwoqqyqjb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;
let useRealSupabase = false;

if (supabaseUrl && supabaseKey && supabaseKey.length > 20) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    useRealSupabase = true;
    console.log('✅ Connected to Supabase at:', supabaseUrl);
  } catch (err: any) {
    console.warn('⚠️ Supabase client initialization failed, falling back to local secure storage:', err.message);
  }
} else {
  console.log('ℹ️ Supabase key not provided or placeholder. Initializing high-performance local trauma-safe data store.');
}

// In-Memory fallback store with seeded trauma-informed data
class LocalDataStore {
  profiles: Map<string, UserProfile & { passwordHash?: string; email?: string }> = new Map();
  checkIns: CheckIn[] = [];
  predictions: DistressPrediction[] = [];
  alerts: Alert[] = [];
  auditLogs: any[] = [];

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const survivorId = '11111111-1111-4111-a111-111111111111';
    const counselorId = '22222222-2222-4222-a222-222222222222';
    const adminId = '33333333-3333-4333-a333-333333333333';

    // Seed Survivor Profile
    this.profiles.set(survivorId, {
      id: survivorId,
      role: 'survivor',
      full_name: 'Elena Rostova',
      alias: 'Phoenix_92',
      email: 'survivor@mindguard.org',
      emergency_contact: '+1-800-273-8255 (Safe Helpline / Trusted Friend)',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    });

    // Seed Counselor Profile
    this.profiles.set(counselorId, {
      id: counselorId,
      role: 'counselor',
      full_name: 'Dr. Sarah Lin, Psy.D, Trauma Specialist',
      alias: 'Dr_Lin_TraumaLead',
      email: 'counselor@mindguard.org',
      emergency_contact: '+1-800-555-0199',
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    });

    // Seed Admin Profile
    this.profiles.set(adminId, {
      id: adminId,
      role: 'admin',
      full_name: 'MindGuard Security Operations',
      alias: 'SecOps_Admin',
      email: 'admin@mindguard.org',
      emergency_contact: '+1-800-555-0100',
      created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    });

    // Seed 7 days of realistic historical check-ins & predictions for Phoenix_92
    const pastDays = [
      { day: 6, mood: 4, anxiety: 2, sleep: 4, tension: 1, text: "Felt relatively grounded after morning sensory walk.", score: 24.5, risk: 'green' as RiskLevel },
      { day: 5, mood: 3, anxiety: 3, sleep: 3, tension: 2, text: "Mild triggers during crowded subway commute, but used 4-7-8 breathing.", score: 38.0, risk: 'yellow' as RiskLevel },
      { day: 4, mood: 3, anxiety: 3, sleep: 4, tension: 2, text: "Quiet afternoon reading, nervous system settling down.", score: 32.5, risk: 'yellow' as RiskLevel },
      { day: 3, mood: 2, anxiety: 4, sleep: 2, tension: 4, text: "Disturbed sleep from loud sudden noise outside. Heightened startle response.", score: 62.0, risk: 'orange' as RiskLevel },
      { day: 2, mood: 2, anxiety: 5, sleep: 1, tension: 5, text: "Intense somatic flashbacks and heart palpitations. Difficulty staying in present.", score: 86.5, risk: 'red' as RiskLevel },
      { day: 1, mood: 3, anxiety: 4, sleep: 3, tension: 3, text: "Spoke with crisis counselor, feeling a bit safer now.", score: 58.0, risk: 'orange' as RiskLevel },
      { day: 0, mood: 3, anxiety: 3, sleep: 3, tension: 2, text: "Grounding exercises helping. Focusing on breath and physical safety.", score: 42.0, risk: 'yellow' as RiskLevel },
    ];

    pastDays.forEach(item => {
      const cId = uuidv4();
      const pId = uuidv4();
      const checkInDate = new Date(Date.now() - item.day * 86400000).toISOString();

      this.checkIns.push({
        id: cId,
        user_id: survivorId,
        mood_score: item.mood,
        anxiety_score: item.anxiety,
        sleep_quality: item.sleep,
        physical_tension: item.tension,
        free_text_reflection: item.text,
        created_at: checkInDate
      });

      this.predictions.push({
        id: pId,
        user_id: survivorId,
        check_in_id: cId,
        distress_score: item.score,
        risk_level: item.risk,
        ai_analysis_summary: `Psychological assessment: Mood ${item.mood}/5, Anxiety ${item.anxiety}/5. Somatic tension elevated. Calculated distress tier: ${item.risk.toUpperCase()}.`,
        recommended_actions: [
          '5-4-3-2-1 Sensory Grounding',
          'Vagus nerve reset (cold water face splash)',
          'Reach out to on-call counselor Dr. Sarah Lin'
        ],
        created_at: checkInDate
      });

      // If orange or red, add an alert
      if (item.risk === 'orange' || item.risk === 'red') {
        this.alerts.push({
          id: uuidv4(),
          user_id: survivorId,
          counselor_id: counselorId,
          prediction_id: pId,
          status: item.day === 2 ? 'pending' : (item.day === 1 ? 'acknowledged' : 'resolved'),
          created_at: checkInDate,
          patient_alias: 'Phoenix_92',
          distress_score: item.score,
          risk_level: item.risk,
          ai_analysis_summary: `Acute distress threshold triggered with score ${item.score} (${item.risk.toUpperCase()}).`
        });
      }
    });

    // Seed an additional second patient for counselor view
    const patient2Id = '44444444-4444-4444-a444-444444444444';
    this.profiles.set(patient2Id, {
      id: patient2Id,
      role: 'survivor',
      full_name: 'Marcus Vance',
      alias: 'Atlas_SafeSpace',
      email: 'marcus@mindguard.org',
      emergency_contact: '+1-800-950-6264 (NAMI Helpline)',
      created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    });

    const cId2 = uuidv4();
    const pId2 = uuidv4();
    const nowIso = new Date().toISOString();
    this.checkIns.push({
      id: cId2,
      user_id: patient2Id,
      mood_score: 1,
      anxiety_score: 5,
      sleep_quality: 1,
      physical_tension: 5,
      free_text_reflection: "Extreme hypervigilance and fear of leaving the house.",
      created_at: nowIso
    });
    this.predictions.push({
      id: pId2,
      user_id: patient2Id,
      check_in_id: cId2,
      distress_score: 89.0,
      risk_level: 'red',
      ai_analysis_summary: 'Severe crisis markers: severe hypervigilance, insomnia, acute agoraphobic fear.',
      recommended_actions: [
        'Immediate counselor outreach required',
        'Helpline dispatch',
        'Physical safety protocol confirmation'
      ],
      created_at: nowIso
    });
    this.alerts.push({
      id: uuidv4(),
      user_id: patient2Id,
      counselor_id: counselorId,
      prediction_id: pId2,
      status: 'pending',
      created_at: nowIso,
      patient_alias: 'Atlas_SafeSpace',
      distress_score: 89.0,
      risk_level: 'red',
      ai_analysis_summary: 'High-urgency alert: Patient Atlas_SafeSpace triggered Critical RED status.'
    });
  }
}

export const localStore = new LocalDataStore();

// Unified Database Access Layer
export const dbService = {
  // Profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (useRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (!error && data) return data as UserProfile;
      } catch (e) {
        console.warn('Supabase fetch profile error, checking local store:', e);
      }
    }
    return localStore.profiles.get(userId) || null;
  },

  async getProfileByEmail(email: string): Promise<(UserProfile & { passwordHash?: string }) | null> {
    for (const profile of localStore.profiles.values()) {
      if (profile.email && profile.email.toLowerCase() === email.toLowerCase()) {
        return profile;
      }
    }
    return null;
  },

  async upsertProfile(profile: UserProfile & { passwordHash?: string }): Promise<UserProfile> {
    localStore.profiles.set(profile.id, profile);
    if (useRealSupabase && supabase) {
      try {
        await supabase.from('profiles').upsert({
          id: profile.id,
          role: profile.role,
          full_name: profile.full_name,
          alias: profile.alias,
          emergency_contact: profile.emergency_contact,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Supabase upsert profile error:', e);
      }
    }
    return profile;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const existing = localStore.profiles.get(userId);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    localStore.profiles.set(userId, updated);
    if (useRealSupabase && supabase) {
      try {
        await supabase.from('profiles').update(updates).eq('id', userId);
      } catch (e) {
        console.warn('Supabase update profile error:', e);
      }
    }
    return updated;
  },

  // Check-ins
  async createCheckIn(checkIn: Omit<CheckIn, 'id' | 'created_at'>): Promise<CheckIn> {
    const newCheckIn: CheckIn = {
      ...checkIn,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    localStore.checkIns.push(newCheckIn);

    if (useRealSupabase && supabase) {
      try {
        await supabase.from('check_ins').insert(newCheckIn);
      } catch (e) {
        console.warn('Supabase check_in insert error:', e);
      }
    }
    return newCheckIn;
  },

  async getCheckInsForUser(userId: string, limit: number = 50): Promise<CheckIn[]> {
    if (useRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('check_ins')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);
        if (!error && data && data.length > 0) return data as CheckIn[];
      } catch (e) {
        console.warn('Supabase getCheckIns error:', e);
      }
    }
    return localStore.checkIns
      .filter(c => c.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  // Distress Predictions
  async createPrediction(prediction: Omit<DistressPrediction, 'id' | 'created_at'>): Promise<DistressPrediction> {
    const newPrediction: DistressPrediction = {
      ...prediction,
      id: uuidv4(),
      created_at: new Date().toISOString()
    };
    localStore.predictions.push(newPrediction);

    if (useRealSupabase && supabase) {
      try {
        await supabase.from('distress_predictions').insert(newPrediction);
      } catch (e) {
        console.warn('Supabase prediction insert error:', e);
      }
    }
    return newPrediction;
  },

  async getLatestPredictionForUser(userId: string): Promise<DistressPrediction | null> {
    if (useRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('distress_predictions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (!error && data) return data as DistressPrediction;
      } catch (e) {
        console.warn('Supabase latest prediction error:', e);
      }
    }
    const userPredictions = localStore.predictions
      .filter(p => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return userPredictions[0] || null;
  },

  async getPredictionsForUser(userId: string, limit: number = 30): Promise<DistressPrediction[]> {
    if (useRealSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from('distress_predictions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);
        if (!error && data && data.length > 0) return data as DistressPrediction[];
      } catch (e) {
        console.warn('Supabase getPredictions error:', e);
      }
    }
    return localStore.predictions
      .filter(p => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  // Alerts
  async createAlert(alert: Omit<Alert, 'id' | 'created_at'>): Promise<Alert> {
    const profile = localStore.profiles.get(alert.user_id);
    const newAlert: Alert = {
      ...alert,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      patient_alias: profile?.alias || 'Anonymous Survivor'
    };
    localStore.alerts.unshift(newAlert);

    if (useRealSupabase && supabase) {
      try {
        await supabase.from('alerts').insert({
          id: newAlert.id,
          user_id: newAlert.user_id,
          counselor_id: newAlert.counselor_id,
          prediction_id: newAlert.prediction_id,
          status: newAlert.status,
          created_at: newAlert.created_at
        });
      } catch (e) {
        console.warn('Supabase alert insert error:', e);
      }
    }
    return newAlert;
  },

  async getAlerts(counselorId?: string): Promise<Alert[]> {
    if (useRealSupabase && supabase) {
      try {
        const query = supabase.from('alerts').select('*').order('created_at', { ascending: false });
        if (counselorId) {
          query.or(`counselor_id.eq.${counselorId},counselor_id.is.null`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as Alert[];
      } catch (e) {
        console.warn('Supabase getAlerts error:', e);
      }
    }
    return localStore.alerts;
  },

  async updateAlertStatus(alertId: string, status: AlertStatus, counselorId?: string): Promise<Alert | null> {
    const alert = localStore.alerts.find(a => a.id === alertId);
    if (!alert) return null;
    alert.status = status;
    if (counselorId) alert.counselor_id = counselorId;

    if (useRealSupabase && supabase) {
      try {
        await supabase.from('alerts').update({ status, counselor_id: counselorId }).eq('id', alertId);
      } catch (e) {
        console.warn('Supabase updateAlertStatus error:', e);
      }
    }
    return alert;
  },

  // Counselors: Patient Monitoring
  async getAllSurvivors(): Promise<Array<UserProfile & { latestRisk?: RiskLevel; latestDistressScore?: number; alertCount?: number }>> {
    const survivors: Array<UserProfile & { latestRisk?: RiskLevel; latestDistressScore?: number; alertCount?: number }> = [];

    for (const profile of localStore.profiles.values()) {
      if (profile.role === 'survivor') {
        const latestPred = await this.getLatestPredictionForUser(profile.id);
        const pendingAlerts = localStore.alerts.filter(a => a.user_id === profile.id && a.status === 'pending').length;

        survivors.push({
          ...profile,
          latestRisk: latestPred?.risk_level || 'green',
          latestDistressScore: latestPred?.distress_score || 0,
          alertCount: pendingAlerts
        });
      }
    }

    return survivors;
  },

  // Audit Logs
  async createAuditLog(actorId: string, action: string, targetUserId?: string, details?: any) {
    const entry = {
      id: uuidv4(),
      actor_id: actorId,
      action,
      target_user_id: targetUserId,
      details,
      created_at: new Date().toISOString()
    };
    localStore.auditLogs.push(entry);
    if (useRealSupabase && supabase) {
      try {
        await supabase.from('audit_logs').insert(entry);
      } catch (e) {
        // silent fail on audit log
      }
    }
    return entry;
  }
};
