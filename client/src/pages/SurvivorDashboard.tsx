import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { predictionApi, checkInApi } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import { TrendChart } from '../components/TrendChart';
import { EmergencyModal } from '../components/EmergencyModal';
import { GroundingTool } from '../components/GroundingTool';
import {
  Sparkles,
  Activity,
  Heart,
  Calendar,
  Wind,
  PlusCircle,
  Shield,
  ArrowRight,
  RefreshCw,
  PhoneCall
} from 'lucide-react';

export const SurvivorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [latestPrediction, setLatestPrediction] = useState<any | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [predRes, trendRes, historyRes] = await Promise.all([
        predictionApi.getLatest().catch(() => ({ prediction: null })),
        predictionApi.getTrends(14).catch(() => ({ trends: [] })),
        checkInApi.getHistory(5).catch(() => ({ checkIns: [] }))
      ]);

      setLatestPrediction(predRes.prediction);
      setTrendData(trendRes.trends || []);
      setRecentCheckIns(historyRes.checkIns || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome & Safety Affirmation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-teal-500/20 shadow-xl bg-gradient-to-r from-gray-900/90 via-[#0d1f2d]/80 to-gray-900/90">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-700/60 text-teal-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            Protected Safe Space
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-teal-400">{user?.alias || 'Survivor'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Your healing is a continuous journey. Take a gentle breath, check in with yourself, and remember support is always one tap away.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/check-in"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-teal-900/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Daily Check-In</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsGroundingOpen(!isGroundingOpen)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-sm border border-gray-700 transition-colors"
          >
            <Wind className="w-4 h-4 text-teal-400" />
            <span>Somatic Reset</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEmergencyOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-950/80 hover:bg-red-900 text-red-200 font-semibold text-sm border border-red-800/80 transition-all shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-red-400" />
            <span>Emergency Help</span>
          </button>
        </div>
      </div>

      {/* Grounding Tool Overlay if opened */}
      {isGroundingOpen && (
        <div className="animate-fade-in">
          <GroundingTool onClose={() => setIsGroundingOpen(false)} />
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Dynamic Distress Index & AI Diagnosis */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-gray-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-400" />
                Current Psychological Distress Index
              </span>
              <button
                type="button"
                onClick={fetchDashboardData}
                title="Refresh Metrics"
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {latestPrediction ? (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                      {latestPrediction.distress_score?.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/ 100</span>
                    <p className="text-[11px] text-gray-500 font-mono">
                      Evaluated {new Date(latestPrediction.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <RiskBadge
                    level={latestPrediction.risk_level}
                    score={latestPrediction.distress_score}
                    size="md"
                  />
                </div>

                {/* AI Summary Box */}
                <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-xs text-gray-300 space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-1.5 text-teal-400 font-semibold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Clinical Evaluation
                  </div>
                  <p>{latestPrediction.ai_analysis_summary}</p>
                </div>

                {/* Recommended Actions */}
                {latestPrediction.recommended_actions?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-gray-400">
                      Personalized Action Plan:
                    </span>
                    <ul className="space-y-1.5">
                      {latestPrediction.recommended_actions.slice(0, 2).map((act: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-xs text-gray-300 flex items-center gap-2 p-2 rounded-xl bg-gray-800/40 border border-gray-800"
                        >
                          <span className="w-4 h-4 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                            ✓
                          </span>
                          <span className="truncate">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <p className="text-sm text-gray-400">No distress assessment on record yet.</p>
                <Link
                  to="/check-in"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Take Initial Check-in
                </Link>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs">
            <span className="text-gray-400">Automatic counselor notification:</span>
            <span className="text-teal-400 font-semibold font-mono">Active (Orange/Red)</span>
          </div>
        </div>

        {/* Widget 2: Trend Chart Progression (Spans 2 columns) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-7 border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                Distress & Mood Fluctuation Timeline
              </h3>
              <p className="text-xs text-gray-400">
                14-day chronological progression generated from trauma check-in logs
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              Full History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <TrendChart data={trendData} height={260} />
        </div>
      </div>

      {/* Recent Check-Ins & Trauma Support Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Check-ins List */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-gray-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              Recent Emotional Check-in Entries
            </h3>
            <Link to="/check-in" className="text-xs text-teal-400 hover:text-teal-300 font-medium">
              + Add New
            </Link>
          </div>

          {recentCheckIns.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No recent entries. Start your daily log to help the predictive engine protect your wellbeing.
            </div>
          ) : (
            <div className="space-y-3">
              {recentCheckIns.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-200">
                        {new Date(item.created_at).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-gray-500 font-mono">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {item.free_text_reflection && (
                      <p className="text-gray-400 italic line-clamp-1">
                        "{item.free_text_reflection}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-1 rounded-lg bg-gray-800 text-gray-300 font-mono">
                      Mood: {item.mood_score}/5
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-gray-800 text-gray-300 font-mono">
                      Anxiety: {item.anxiety_score}/5
                    </span>
                    {item.prediction && (
                      <RiskBadge level={item.prediction.risk_level} score={item.prediction.distress_score} size="sm" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Resource Cards */}
        <div className="glass-panel rounded-3xl p-6 border border-gray-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-gray-800 pb-3">
            <Heart className="w-4 h-4 text-rose-400" />
            Trauma Coping Protocols
          </h3>

          <div className="space-y-3">
            <div
              onClick={() => setIsGroundingOpen(true)}
              className="p-3.5 rounded-2xl bg-gray-900/80 hover:bg-gray-800/80 border border-gray-800 cursor-pointer transition-colors space-y-1 group"
            >
              <h4 className="font-bold text-sm text-teal-300 group-hover:text-teal-200 flex items-center justify-between">
                <span>Box Breathing (4-4-4-4)</span>
                <Wind className="w-4 h-4 text-teal-400" />
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                De-escalate panic attacks and somatic hyperarousal through parasympathetic reactivation.
              </p>
            </div>

            <div
              onClick={() => setIsGroundingOpen(true)}
              className="p-3.5 rounded-2xl bg-gray-900/80 hover:bg-gray-800/80 border border-gray-800 cursor-pointer transition-colors space-y-1 group"
            >
              <h4 className="font-bold text-sm text-sky-300 group-hover:text-sky-200 flex items-center justify-between">
                <span>5-4-3-2-1 Sensory Reset</span>
                <Sparkles className="w-4 h-4 text-sky-400" />
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Anchors your awareness to the immediate present when dissociating or experiencing flashbacks.
              </p>
            </div>

            <div
              onClick={() => setIsEmergencyOpen(true)}
              className="p-3.5 rounded-2xl bg-red-950/40 hover:bg-red-950/70 border border-red-800/60 cursor-pointer transition-colors space-y-1 group"
            >
              <h4 className="font-bold text-sm text-red-300 group-hover:text-red-200 flex items-center justify-between">
                <span>24/7 Crisis Hotline Directory</span>
                <PhoneCall className="w-4 h-4 text-red-400" />
              </h4>
              <p className="text-xs text-red-200/80 leading-relaxed">
                Direct phone and text access to confidential crisis lifelines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onOpenGrounding={() => setIsGroundingOpen(true)}
      />
    </div>
  );
};
