import React, { useState } from 'react';
import { useAuth } from '../services/authContext';
import { authApi } from '../services/api';
import {
  User,
  Shield,
  Phone,
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  Trash2,
  AlertOctagon,
  EyeOff
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [alias, setAlias] = useState(user?.alias || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      await authApi.updateSettings({
        alias,
        fullName: fullName || undefined,
        emergencyContact: emergencyContact || undefined
      });

      updateUser({
        alias,
        fullName: fullName || undefined,
        emergencyContact: emergencyContact || undefined
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearSession = () => {
    if (window.confirm('Are you sure you want to securely clear all local session tokens and log out?')) {
      logout();
      window.location.replace('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-teal-400" />
          Privacy Controls & Safety Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Manage your anonymous handle, emergency intervention contacts, and security preferences
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-teal-950/80 border border-teal-700/80 text-teal-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Your privacy settings and emergency contacts were securely updated.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-700/80 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 shadow-xl">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-teal-400" />
            Identity Pseudonymization
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Anonymous Alias (Public display handle)
            </label>
            <input
              type="text"
              required
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              This alias protects your real name across all counselor queues and predictive logs.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Legal Name (Optional)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Can remain blank"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-400" />
            Emergency Crisis Contact
          </h3>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Emergency Contact Phone Number or Organization
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="e.g. +1-800-273-8255 or trusted friend"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Dispatched automatically when Critical Red alerts are confirmed.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-900/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Securely...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Privacy Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Account Info & Emergency Clear */}
      <div className="glass-panel rounded-3xl p-6 border border-gray-800 space-y-4">
        <h3 className="text-base font-bold text-white">Account Security & Role</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-500 block mb-0.5">Role Tier</span>
            <span className="text-teal-400 font-bold uppercase">{user?.role}</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-500 block mb-0.5">Encrypted Email</span>
            <span className="text-gray-300 truncate block">{user?.email}</span>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
            <span className="text-gray-500 block mb-0.5">Row-Level Security</span>
            <span className="text-emerald-400 font-bold">Enforced</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
          <button
            type="button"
            onClick={handleClearSession}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/80 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Local Session & Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
