import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Sparkles, HeartHandshake, Lock, Activity, EyeOff, Users, ArrowRight, CheckCircle2, Wind } from 'lucide-react';
import { useAuth } from '../services/authContext';

export const LandingPage: React.FC = () => {
  const { user, demoLogin } = useAuth();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-600/40 text-teal-300 text-xs sm:text-sm font-semibold shadow-lg shadow-teal-950/50">
          <Sparkles className="w-4 h-4 text-teal-400" />
          Proactive AI Distress Prediction & Trauma Care
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
          A Safe Sanctuary That <br />
          <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
            Forecasts & Protects
          </span>{' '}
          Before Crisis Escalates
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed font-normal">
          MindGuard AI bridges the gap for victims of social trauma and severe distress. Through trauma-informed daily check-ins and Google Gemini predictive intelligence, we empower survivors with continuous emotional safety and automated clinical escalation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {user ? (
            <Link
              to={user.role === 'counselor' ? '/counselor/dashboard' : '/dashboard'}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 shadow-xl shadow-teal-800/30 transition-all text-base group"
            >
              <span>Go to Your {user.role === 'counselor' ? 'Clinical Portal' : 'Safe Dashboard'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 shadow-xl shadow-teal-800/30 transition-all text-base group"
              >
                <span>Join Anonymously</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-gray-200 bg-gray-900/90 hover:bg-gray-800 border border-gray-700/80 transition-all text-base"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Instant 1-Click Interactive Demo Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">
            Interactive Test Logins:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => demoLogin('survivor')}
              className="px-3.5 py-1.5 rounded-xl bg-teal-950/70 hover:bg-teal-900 text-teal-300 text-xs font-semibold border border-teal-800 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Test as Survivor (Phoenix_92)
            </button>
            <button
              type="button"
              onClick={() => demoLogin('counselor')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold border border-indigo-800 transition-colors flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Test as Counselor (Dr. Lin)
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Trauma-Informed Architecture */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel glass-card-hover p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Gemini Predictive AI</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Analyzes subtle linguistic markers, mood variances, and somatic shifts with low temperature (0.2) consistency to forecast distress indices (0-100).
            </p>
          </div>

          <div className="glass-panel glass-card-hover p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Survivor Pseudonymity</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Zero legal name mandate. Full alias protection, client-side encryption support, and instant Quick Exit redirect for dangerous living situations.
            </p>
          </div>

          <div className="glass-panel glass-card-hover p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Proactive Escalation</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              When distress reaches Orange or Red thresholds, alerts are instantly queued for certified counselors before acute panic or crisis sets in.
            </p>
          </div>

          <div className="glass-panel glass-card-hover p-6 rounded-2xl border border-gray-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Supabase PostgreSQL RLS</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Enterprise Row-Level Security isolates survivor logs. Complete immutable audit trails track any clinical access to patient timelines.
            </p>
          </div>
        </div>
      </section>

      {/* Clinical Risk Tiers Breakdown */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-gray-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Dynamic 4-Tier Distress Stratification
            </h2>
            <p className="text-sm text-gray-400">
              Continuously calibrated against baseline emotional patterns and trauma indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-700/50 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                Green (0-30)
              </span>
              <h4 className="font-bold text-white text-base">Stable Baseline</h4>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Normal emotional equilibrium. Grounding habits maintained; no intervention triggered.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-700/50 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-300 text-xs font-bold uppercase tracking-wider">
                Yellow (31-55)
              </span>
              <h4 className="font-bold text-white text-base">Elevated Strain</h4>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Early signs of stress accumulation or insomnia. Self-care and breathing exercises activated.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-orange-950/40 border border-orange-700/50 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-900/80 text-orange-300 text-xs font-bold uppercase tracking-wider">
                Orange (56-80)
              </span>
              <h4 className="font-bold text-white text-base">High Risk Tier</h4>
              <p className="text-xs text-orange-200/80 leading-relaxed">
                Pronounced mental fatigue or panic spikes. Automated counselor review alert generated.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-red-950/40 border border-red-700/50 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-900/80 text-red-300 text-xs font-bold uppercase tracking-wider">
                Red (81-100)
              </span>
              <h4 className="font-bold text-white text-base">Critical Emergency</h4>
              <p className="text-xs text-red-200/80 leading-relaxed">
                Immediate crisis indicators detected. Automated emergency escalation & 24/7 hotline dispatched.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
