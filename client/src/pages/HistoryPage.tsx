import React, { useState, useEffect } from 'react';
import { checkInApi, predictionApi } from '../services/api';
import { TrendChart } from '../components/TrendChart';
import { RiskBadge } from '../components/RiskBadge';
import { Activity, Calendar, Search, Filter, Shield, Sparkles, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [histRes, trendRes] = await Promise.all([
        checkInApi.getHistory(50),
        predictionApi.getTrends(30)
      ]);
      setHistory(histRes.checkIns || []);
      setTrendData(trendRes.trends || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchTerm ||
      (item.free_text_reflection && item.free_text_reflection.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.prediction?.ai_analysis_summary && item.prediction.ai_analysis_summary.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRisk = selectedRisk === 'all' || item.prediction?.risk_level === selectedRisk;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-teal-400" />
            Historical Psychological Timeline & Trends
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Review your dynamic distress trajectory, emotional fluctuations, and clinical summaries over time
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHistory}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 border border-gray-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Main Longitudinal Trend Chart */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Longitudinal Distress Trajectory
            </h3>
            <p className="text-xs text-gray-400">
              Evaluated with Gemini AI low-temperature scoring (0-100 index)
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
            {trendData.length} Data Points
          </span>
        </div>
        <TrendChart data={trendData} height={300} />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl glass-panel border border-gray-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords or reflections..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Risk Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 mr-1" />
          {['all', 'green', 'yellow', 'orange', 'red'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedRisk(tier)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                selectedRisk === tier
                  ? 'bg-teal-600 text-white font-bold'
                  : 'bg-gray-800/80 text-gray-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading psychological timeline records...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-gray-500 glass-panel rounded-2xl border border-gray-800 text-sm">
            No check-in entries found matching your search criteria.
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-2xl p-5 sm:p-6 border border-gray-800 space-y-4 shadow-md hover:border-gray-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-teal-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      {new Date(item.created_at).toLocaleDateString([], {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h4>
                    <span className="text-xs text-gray-500 font-mono">
                      Logged at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {item.prediction && (
                  <RiskBadge
                    level={item.prediction.risk_level}
                    score={item.prediction.distress_score}
                    size="md"
                  />
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <span className="text-gray-400 block text-[11px]">Mood State</span>
                  <span className="font-bold text-gray-200 text-sm">{item.mood_score} / 5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <span className="text-gray-400 block text-[11px]">Anxiety Level</span>
                  <span className="font-bold text-gray-200 text-sm">{item.anxiety_score} / 5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <span className="text-gray-400 block text-[11px]">Sleep Quality</span>
                  <span className="font-bold text-gray-200 text-sm">{item.sleep_quality} / 5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
                  <span className="text-gray-400 block text-[11px]">Physical Tension</span>
                  <span className="font-bold text-gray-200 text-sm">{item.physical_tension || 1} / 5</span>
                </div>
              </div>

              {/* Free Text Reflection */}
              {item.free_text_reflection && (
                <div className="p-3.5 rounded-xl bg-gray-900/40 border border-gray-800 text-xs text-gray-300">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] block mb-1">
                    Survivor Reflection:
                  </span>
                  <p className="italic leading-relaxed">"{item.free_text_reflection}"</p>
                </div>
              )}

              {/* AI Clinical Summary */}
              {item.prediction && (
                <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-800/30 text-xs text-gray-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-teal-400 font-semibold text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    MindGuard AI Assessment
                  </div>
                  <p className="leading-relaxed">{item.prediction.ai_analysis_summary}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
