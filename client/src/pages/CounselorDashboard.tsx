import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { counselorApi, alertApi } from '../services/api';
import { CounselorQueue, AlertItem } from '../components/CounselorQueue';
import { RiskBadge } from '../components/RiskBadge';
import {
  Users,
  AlertTriangle,
  Flame,
  CheckCircle,
  ExternalLink,
  Shield,
  Activity,
  RefreshCw,
  Search
} from 'lucide-react';

export const CounselorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchPatient, setSearchPatient] = useState<string>('');
  const navigate = useNavigate();

  const fetchCounselorData = async () => {
    setLoading(true);
    try {
      const [patientsRes, alertsRes] = await Promise.all([
        counselorApi.getPatients().catch(() => ({ patients: [] })),
        counselorApi.getAlerts().catch(() => ({ alerts: [] }))
      ]);

      setPatients(patientsRes.patients || []);
      setAlerts(alertsRes.alerts || []);
    } catch (err) {
      console.error('Failed to load counselor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselorData();
  }, []);

  const handleAlertUpdated = (updatedAlert: AlertItem) => {
    setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
  };

  const pendingAlertsCount = alerts.filter(a => a.status === 'pending').length;
  const criticalRedCount = alerts.filter(a => a.risk_level === 'red' && a.status !== 'resolved').length;
  const highOrangeCount = alerts.filter(a => a.risk_level === 'orange' && a.status !== 'resolved').length;

  const filteredPatients = patients.filter(p =>
    !searchPatient ||
    (p.alias && p.alias.toLowerCase().includes(searchPatient.toLowerCase())) ||
    (p.full_name && p.full_name.toLowerCase().includes(searchPatient.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            Licensed Clinical Intervention Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Clinical Distress Monitoring & Escalation Queue
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Proactively monitor assigned trauma survivors, inspect predictive risk flags, and coordinate emergency care
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCounselorData}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 border border-gray-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queues</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-teal-400" />
            Monitored Survivors
          </span>
          <p className="text-3xl font-black text-white font-mono">{patients.length}</p>
          <p className="text-[11px] text-gray-500">Active trauma cases assigned</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-red-800/40 bg-red-950/10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            Critical Red Flags
          </span>
          <p className="text-3xl font-black text-red-400 font-mono">{criticalRedCount}</p>
          <p className="text-[11px] text-red-300/70">Score &gt; 80 requires instant outreach</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-orange-800/40 bg-orange-950/10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            High Risk (Orange)
          </span>
          <p className="text-3xl font-black text-orange-400 font-mono">{highOrangeCount}</p>
          <p className="text-[11px] text-orange-300/70">Pronounced trauma deterioration</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-indigo-800/40 bg-indigo-950/10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-400" />
            Pending Action Items
          </span>
          <p className="text-3xl font-black text-indigo-300 font-mono">{pendingAlertsCount}</p>
          <p className="text-[11px] text-indigo-200/70">Unacknowledged automated alerts</p>
        </div>
      </div>

      {/* Counselor Escalation Alert Queue (Mandatory Component) */}
      <div className="space-y-4">
        <CounselorQueue alerts={alerts} onAlertUpdated={handleAlertUpdated} />
      </div>

      {/* Patient Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              Assigned Survivor Patient Directory
            </h3>
            <p className="text-xs text-gray-400">
              Access individual longitudinal histories, check-in timelines, and safety plans
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              placeholder="Search by alias..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="glass-panel rounded-2xl p-5 border border-gray-800 space-y-4 shadow-md hover:border-indigo-600/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-white text-base">
                      {patient.alias || 'Anonymous Patient'}
                    </h4>
                    {patient.full_name && (
                      <p className="text-xs text-gray-400">Legal: {patient.full_name}</p>
                    )}
                  </div>
                  <RiskBadge
                    level={patient.latestRisk || 'green'}
                    score={patient.latestDistressScore}
                    size="sm"
                  />
                </div>

                <div className="space-y-1.5 text-xs text-gray-400 pt-2 border-t border-gray-800 font-mono">
                  <p className="flex justify-between">
                    <span>Emergency Contact:</span>
                    <span className="text-gray-200 font-sans truncate max-w-[150px]">
                      {patient.emergency_contact || 'None configured'}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span>Pending Alerts:</span>
                    <span className={`font-bold ${patient.alertCount > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {patient.alertCount || 0}
                    </span>
                  </p>
                </div>
              </div>

              <Link
                to={`/counselor/patient/${patient.id}`}
                className="w-full py-2 px-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold border border-indigo-800/80 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Psychological Timeline</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
