import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Shield, Lock, Mail, ArrowRight, HeartHandshake, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Retrieve the saved user from storage
      const user = JSON.parse(localStorage.getItem('mindguard_user') || '{}');
      if (user.role === 'counselor') {
        navigate('/counselor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'survivor' | 'counselor') => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin(role);
      if (role === 'counselor') {
        navigate('/counselor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('Demo login failed. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-teal-600/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to MindGuard
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Secure, encrypted authentication for survivors & care specialists
          </p>
        </div>

        {/* Demo Fast-Login Box */}
        <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block text-center">
            One-Click Evaluator Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('survivor')}
              className="p-2.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-teal-300 text-xs font-semibold border border-teal-800/80 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              Survivor Demo
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemo('counselor')}
              className="p-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold border border-indigo-800/80 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Counselor Demo
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/90 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/90 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 shadow-lg shadow-teal-700/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold underline ml-1">
              Create an anonymous profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
