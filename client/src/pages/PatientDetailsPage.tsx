import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { counselorApi, alertApi } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { TrendChart } from '../components/TrendChart';
import {
  ArrowLeft,
  User,
  Phone,
  ShieldCheck,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Check,
  Activity,
  Lock
} from 'lucide-react';

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatientDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await counselorApi.getPatientDetails(id);
      setPatient(data.patient);
      setTimeline(data.timeline || []);
      setAlerts(data.alerts || []);
      setLatestPrediction(data.latestPrediction);
    } catch (err: any) {
      console.error('Failed to load patient details:', err);
      setError(err.response?.data?.message || 'Failed to fetch patient details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const handleResolveAlert = async (alertId: string) => {
    try {
      await alertApi.updateStatus(alertId, 'resolved');
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3 max-w-4xl mx-auto">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Decrypting patient clinical timeline and audit logs...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-red-400 text-sm font-semibold">{error || 'Patient not found'}</p>
        <Link
          to="/counselor/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-200 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Clinical Queue
        </Link>
      </div>
    );
  }

  // Format trend data from timeline
  const trendData = timeline
    .filter(t => t.prediction)
    .map(t => ({
      date: new Date(t.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      distressScore: t.prediction.distress_score,
      riskLevel: t.prediction.risk_level,
      moodScore: t.mood_score,
      anxietyScore: t.anxiety_score,
      sleepQuality: t.sleep_quality,
      summary: t.prediction.ai_analysis_summary
    }))
    .reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/counselor/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clinical Escalation Queue
      </Link>

      {/* Patient Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-900/60 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shadow-md">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {patient.alias || 'Anonymous Patient'}
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Internal Case ID: {patient.id}
              </p>
              {patient.fullName && (
                <p className="text-xs text-indigo-300 mt-0.5">Legal Name: {patient.fullName}</p>
              )}
            </div>
          </div>

          {latestPrediction && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Current Risk Rating:</span>
              <RiskBadge
                level={latestPrediction.risk_level}
                score={latestPrediction.distress_score}
                size="lg"
              />
            </div>
          )}
        </div>

        {/* Audit Compliance Banner */}
        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Secure Clinical Audit: Access to this trauma timeline is encrypted and logged in compliance with HIPAA/GDPR standards.</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">RLS Active</span>
        </div>

        {/* Emergency Contact & Enrollment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-400 font-semibold uppercase block mb-1">
              Registered Emergency Support Contact
            </span>
            <p className="font-mono text-sm text-teal-300">
              {patient.emergencyContact || 'No emergency contact provided'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-400 font-semibold uppercase block mb-1">
              Active Assessment Logs
            </span>
            <p className="font-mono text-sm text-white">
              {timeline.length} Recorded Check-ins
            </p>
          </div>
        </div>
      </div>

      {/* Active Escalation Alerts for this Patient */}
      {alerts.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-red-900/40 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Critical Escalation Alerts ({alerts.length})
          </h3>

          <div className="space-y-2.5">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      al.status === 'pending' ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {al.status}
                    </span>
                    <span className="text-gray-400 font-mono">
                      {new Date(al.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300">{al.ai_analysis_summary}</p>
                </div>

                {al.status !== 'resolved' && (
                  <button
                    type="button"
                    onClick={() => handleResolveAlert(al.id)}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Longitudinal Chart */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          Patient Psychological Fluctuation Curve
        </h3>
        <TrendChart data={trendData} height={280} />
      </div>

      {/* Full Timeline of Check-Ins */}
      <div className="glass-panel rounded-3xl p-6 border border-gray-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          Detailed Psychological Check-in History
        </h3>

        <div className="space-y-3">
          {timeline.map((entry) => (
            <div
              key={entry.id}
              className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/60 pb-2">
                <span className="text-xs font-bold text-gray-200">
                  {new Date(entry.created_at).toLocaleString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {entry.prediction && (
                  <RiskBadge
                    level={entry.prediction.risk_level}
                    score={entry.prediction.distress_score}
                    size="sm"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-gray-800/40">Mood: {entry.mood_score}/5</div>
                <div className="p-2 rounded-lg bg-gray-800/40">Anxiety: {entry.anxiety_score}/5</div>
                <div className="p-2 rounded-lg bg-gray-800/40">Sleep: {entry.sleep_quality}/5</div>
                <div className="p-2 rounded-lg bg-gray-800/40">Tension: {entry.physical_tension || 1}/5</div>
              </div>

              {entry.free_text_reflection && (
                <div className="text-xs text-gray-300 italic p-3 rounded-xl bg-gray-900/40 border border-gray-800">
                  "{entry.free_text_reflection}"
                </div>
              )}

              {entry.prediction && (
                <div className="text-xs text-gray-300 p-3 rounded-xl bg-teal-950/20 border border-teal-800/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-400 font-semibold text-[11px] uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Predictive Engine Clinical Summary:
                  </div>
                  <p>{entry.prediction.ai_analysis_summary}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
