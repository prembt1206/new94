import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckInForm } from '../components/CheckInForm';
import { EmergencyModal } from '../components/EmergencyModal';
import { GroundingTool } from '../components/GroundingTool';
import { Shield, Heart, Wind, ArrowLeft } from 'lucide-react';

export const CheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Back button & page title */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGroundingOpen(!isGroundingOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-teal-300 text-xs font-semibold border border-gray-700 transition-colors"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breathing Tool</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEmergencyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800 transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-red-400" />
            <span>Crisis Support</span>
          </button>
        </div>
      </div>

      {isGroundingOpen && (
        <div className="animate-fade-in">
          <GroundingTool onClose={() => setIsGroundingOpen(false)} />
        </div>
      )}

      {/* Check In Form */}
      <CheckInForm
        onCheckInCompleted={(result) => {
          console.log('Check-in submitted and analyzed:', result);
        }}
        onTriggerEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onOpenGrounding={() => setIsGroundingOpen(true)}
      />
    </div>
  );
};
