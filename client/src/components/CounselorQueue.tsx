import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiskBadge, RiskTier } from './RiskBadge';
import { alertApi } from '../services/api';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Filter, Check, ShieldAlert } from 'lucide-react';

export interface AlertItem {
  id: string;
  user_id: string;
  patient_alias?: string;
  distress_score?: number;
  risk_level?: RiskTier | string;
  ai_analysis_summary?: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  created_at: string;
}

interface CounselorQueueProps {
  alerts: AlertItem[];
  onAlertUpdated?: (updatedAlert: AlertItem) => void;
}

export const CounselorQueue: React.FC<CounselorQueueProps> = ({ alerts, onAlertUpdated }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'acknowledged' | 'resolved'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const handleStatusChange = async (alertId: string, newStatus: 'pending' | 'acknowledged' | 'resolved') => {
    setUpdatingId(alertId);
    try {
      const response = await alertApi.updateStatus(alertId, newStatus);
      if (onAlertUpdated && response.alert) {
        onAlertUpdated(response.alert);
      }
    } catch (err) {
      console.error('Failed to update alert status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            Automated Escalation & Patient Alert Queue
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time critical triggers evaluated by Gemini AI predictive engine
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-900 border border-gray-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'pending' ? 'bg-red-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pending ({alerts.filter(a => a.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('acknowledged')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'acknowledged' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Acknowledged
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('resolved')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === 'resolved' ? 'bg-emerald-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Alerts Table */}
      {filteredAlerts.length === 0 ? (
        <div className="p-12 text-center text-gray-500 text-sm">
          No alerts found matching current filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900/80 text-xs font-semibold uppercase text-gray-400 border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4">Patient Alias</th>
                <th className="py-3.5 px-4">Risk Severity</th>
                <th className="py-3.5 px-4">AI Analysis Summary</th>
                <th className="py-3.5 px-4">Logged</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-sans">
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <Link
                      to={`/counselor/patient/${alert.user_id}`}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-bold"
                    >
                      {alert.patient_alias || 'Anonymous Survivor'}
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </Link>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <RiskBadge
                      level={alert.risk_level || 'orange'}
                      score={alert.distress_score}
                      size="sm"
                    />
                  </td>
                  <td className="py-4 px-4 max-w-xs text-xs text-gray-300">
                    <p className="line-clamp-2">
                      {alert.ai_analysis_summary || 'Threshold score trigger detected.'}
                    </p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                    {new Date(alert.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        alert.status === 'pending'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : alert.status === 'acknowledged'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {alert.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                      {alert.status === 'acknowledged' && <Clock className="w-3 h-3" />}
                      {alert.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {alert.status === 'pending' && (
                        <button
                          type="button"
                          disabled={updatingId === alert.id}
                          onClick={() => handleStatusChange(alert.id, 'acknowledged')}
                          className="px-2.5 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-medium transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status !== 'resolved' && (
                        <button
                          type="button"
                          disabled={updatingId === alert.id}
                          onClick={() => handleStatusChange(alert.id, 'resolved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700/80 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Resolve
                        </button>
                      )}
                      <Link
                        to={`/counselor/patient/${alert.user_id}`}
                        className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium border border-gray-700 transition-colors"
                      >
                        Review Timeline
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
