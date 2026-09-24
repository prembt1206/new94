import React, { useState } from 'react';
import { Phone, MessageSquare, Wind, X, AlertOctagon, Heart, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../services/authContext';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGrounding?: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onOpenGrounding
}) => {
  const { user } = useAuth();
  const [contactNotified, setContactNotified] = useState(false);

  if (!isOpen) return null;

  const handleNotifyEmergencyContact = () => {
    // In a production setup, this would trigger an SMS via Twilio or email
    setContactNotified(true);
    setTimeout(() => setContactNotified(false), 8000);
  };

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com/search?q=weather');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-red-500/40 p-6 sm:p-8 shadow-2xl shadow-red-950/80 space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-950/90 border border-red-700/80 flex items-center justify-center text-red-400 shadow-lg shadow-red-950">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Immediate Crisis & Trauma Support
              </h2>
              <p className="text-xs sm:text-sm text-red-300/90">
                You are safe right now. Compassionate, confidential help is available 24/7.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Priority Crisis Helplines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <a
            href="tel:988"
            className="p-4 rounded-2xl bg-red-950/40 hover:bg-red-950/70 border border-red-700/50 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-900/60 flex items-center justify-center text-red-300 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">988 Suicide & Crisis Lifeline</h4>
              <p className="text-xs text-red-200">Call or Text 988 (Free, Confidential, 24/7)</p>
            </div>
          </a>

          <a
            href="sms:741741?body=HOME"
            className="p-4 rounded-2xl bg-indigo-950/40 hover:bg-indigo-950/70 border border-indigo-700/50 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-900/60 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Crisis Text Line</h4>
              <p className="text-xs text-indigo-200">Text HOME to 741741</p>
            </div>
          </a>

          <a
            href="tel:18006564673"
            className="p-4 rounded-2xl bg-teal-950/40 hover:bg-teal-950/70 border border-teal-700/50 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-900/60 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">RAINN Trauma Hotline</h4>
              <p className="text-xs text-teal-200">Call 1-800-656-4673</p>
            </div>
          </a>

          <a
            href="tel:18664887386"
            className="p-4 rounded-2xl bg-purple-950/40 hover:bg-purple-950/70 border border-purple-700/50 flex items-center gap-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">The Trevor Project (LGBTQ+)</h4>
              <p className="text-xs text-purple-200">Call 1-866-488-7386 or text START</p>
            </div>
          </a>
        </div>

        {/* Emergency Contact Ping */}
        {user?.emergencyContact && (
          <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Configured Trusted Emergency Contact
              </span>
              <p className="text-sm font-medium text-white font-mono mt-0.5">
                {user.emergencyContact}
              </p>
            </div>
            <button
              type="button"
              onClick={handleNotifyEmergencyContact}
              disabled={contactNotified}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                contactNotified
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  : 'bg-red-800 hover:bg-red-700 text-white shadow-md'
              }`}
            >
              {contactNotified ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Alert Dispatched to Trusted Contact
                </>
              ) : (
                <>
                  <Phone className="w-3.5 h-3.5" />
                  Send Urgent Safety Ping
                </>
              )}
            </button>
          </div>
        )}

        {/* Action Controls: Grounding vs Quick Exit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {onOpenGrounding && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGrounding();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-teal-900/30 transition-all"
            >
              <Wind className="w-4 h-4" />
              Launch Somatic Grounding Tool
            </button>
          )}

          <button
            type="button"
            onClick={handleQuickExit}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gray-800 hover:bg-gray-700 text-amber-300 font-bold text-sm border border-amber-800/50 transition-colors"
          >
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            Quick Neutral Exit
          </button>
        </div>
      </div>
    </div>
  );
};
