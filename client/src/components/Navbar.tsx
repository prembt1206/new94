import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { Shield, ShieldAlert, HeartHandshake, LogOut, User, Activity, Sparkles, BookOpen, AlertOctagon } from 'lucide-react';

interface NavbarProps {
  onOpenEmergencyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEmergencyModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Trauma-Informed Quick Exit: Instantly navigates away to an innocuous page
  const handleQuickExit = () => {
    // Replace history state and redirect to a weather or news site
    window.location.replace('https://www.google.com/search?q=weather');
  };

  const isLinkActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-300 via-emerald-200 to-sky-300 bg-clip-text text-transparent">
                  MindGuard AI
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-teal-950 text-teal-400 border border-teal-800/60">
                  Trauma-Safe
                </span>
              </div>
            </Link>

            {/* Navigation Links for Authenticated Users */}
            {user && (
              <nav className="hidden md:flex items-center ml-8 gap-1">
                {user.role === 'survivor' ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive('/dashboard')
                          ? 'bg-teal-950/80 text-teal-300 border border-teal-800/50'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/check-in"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive('/check-in')
                          ? 'bg-teal-950/80 text-teal-300 border border-teal-800/50'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                      }`}
                    >
                      Daily Check-in
                    </Link>
                    <Link
                      to="/history"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive('/history')
                          ? 'bg-teal-950/80 text-teal-300 border border-teal-800/50'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                      }`}
                    >
                      History & Trends
                    </Link>
                    <Link
                      to="/resources"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive('/resources')
                          ? 'bg-teal-950/80 text-teal-300 border border-teal-800/50'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                      }`}
                    >
                      Coping Hub
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/counselor/dashboard"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive('/counselor/dashboard')
                          ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/50'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                      }`}
                    >
                      Clinical Portal
                    </Link>
                    <Link
                      to="/resources"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive('/resources')
                          ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/50'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                      }`}
                    >
                      Intervention Protocols
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Quick Emergency Help Trigger Modal */}
            {onOpenEmergencyModal && (
              <button
                type="button"
                onClick={onOpenEmergencyModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/60 transition-all shadow-sm hover:shadow-red-900/30"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-red-400" />
                Emergency Help
              </button>
            )}

            {/* Trauma-Informed Quick Exit Safety Feature */}
            <button
              type="button"
              onClick={handleQuickExit}
              title="Instantly exit this application to a neutral Google Weather page"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800/60 transition-colors"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Exit</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-800/70 hover:bg-gray-800 text-xs font-medium text-gray-200 border border-gray-700/60"
                  title="Account and privacy settings"
                >
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span className="max-w-[100px] truncate">{user.alias || 'User'}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    user.role === 'counselor' ? 'bg-indigo-900 text-indigo-300' : 'bg-teal-900 text-teal-300'
                  }`}>
                    {user.role}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  title="Sign out securely"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-sm shadow-teal-700/30 transition-all"
                >
                  Safe Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
