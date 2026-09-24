import React, { useState } from 'react';
import { GroundingTool } from '../components/GroundingTool';
import { EmergencyModal } from '../components/EmergencyModal';
import {
  Heart,
  Wind,
  Phone,
  Shield,
  Sparkles,
  BookOpen,
  LifeBuoy,
  PhoneCall,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const [isGroundingActive, setIsGroundingActive] = useState<boolean>(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  const helplines = [
    {
      country: 'United States & Canada',
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      desc: 'Free, confidential support available 24/7 via call or text.',
      color: 'border-red-600/40 bg-red-950/20'
    },
    {
      country: 'United States & Canada',
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      desc: 'Free 24/7 crisis counseling via text messaging.',
      color: 'border-indigo-600/40 bg-indigo-950/20'
    },
    {
      country: 'United States',
      name: 'RAINN (National Sexual Assault Hotline)',
      number: '1-800-656-4673',
      desc: 'Confidential 24/7 support for survivors of sexual trauma.',
      color: 'border-teal-600/40 bg-teal-950/20'
    },
    {
      country: 'United States',
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      desc: '24/7 confidential safety planning and emergency shelter referral.',
      color: 'border-purple-600/40 bg-purple-950/20'
    },
    {
      country: 'United Kingdom',
      name: 'Samaritans UK',
      number: '116 123',
      desc: 'Free 24/7 emotional support for anyone in distress.',
      color: 'border-sky-600/40 bg-sky-950/20'
    },
    {
      country: 'India',
      name: 'Vandrevala Foundation Helpline',
      number: '+91 9999 666 555',
      desc: '24/7 free mental health counseling and crisis intervention.',
      color: 'border-emerald-600/40 bg-emerald-950/20'
    },
    {
      country: 'India',
      name: 'KIRAN National Mental Health Helpline',
      number: '1800-599-0019',
      desc: 'Govt. 24/7 multi-lingual helpline for psychological distress.',
      color: 'border-amber-600/40 bg-amber-950/20'
    },
    {
      country: 'International',
      name: 'IASP Crisis Centre Finder',
      number: 'iasp.info/resources/Crisis_Centres',
      desc: 'Directory of verified helplines in over 50 countries.',
      color: 'border-gray-600/40 bg-gray-900/60'
    }
  ];

  const copingStrategies = [
    {
      title: 'The Containment Box Technique',
      desc: 'Mentally place intrusive traumatic memories or fears into an imaginary steel box with a heavy lock. Tell yourself: "I will open this only when I am with my counselor in a safe room."',
      category: 'Cognitive Shield'
    },
    {
      title: 'Vagus Nerve Reset (Cold Splash)',
      desc: 'Fill a basin with cool water or hold an ice cube against your wrists and neck. The sudden cool stimulus activates the mammalian dive reflex, immediately dropping rapid heart rates.',
      category: 'Physiological'
    },
    {
      title: 'Progressive Somatic Unclench',
      desc: 'Check in with three specific zones: loosen your jaw from clenching, lower your shoulders away from your ears, and release your abdominal muscles to allow full diaphragmatic breath.',
      category: 'Somatic Release'
    },
    {
      title: 'Orientation Statement Anchor',
      desc: 'Repeat slowly aloud: "Today is [Day]. The time is [Time]. I am in [Location]. The traumatic event is in the past. I am in the present, and right now I am physically safe."',
      category: 'Grounding Mantra'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 border border-teal-800 text-teal-300 text-xs font-semibold">
          <LifeBuoy className="w-3.5 h-3.5" />
          Safe Coping & Crisis Intervention Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Trauma Support & Grounding Sanctuary
        </h1>
        <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
          Evidence-based psychological grounding tools, crisis intervention directories, and somatic de-escalation exercises designed to support you whenever distress spikes.
        </p>
      </div>

      {/* Embedded Somatic Grounding Tool */}
      <div className="space-y-4">
        <GroundingTool />
      </div>

      {/* Safe Coping Strategies Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          Trauma Containment & Self-Care Protocols
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {copingStrategies.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-5 border border-gray-800 space-y-2 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crisis Helplines Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-400" />
            24/7 Verified Emergency Helplines Directory
          </h2>
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-950 text-red-300 border border-red-800 hover:bg-red-900 transition-colors"
          >
            Launch Crisis Modal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helplines.map((line, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${line.color} space-y-2 flex flex-col justify-between`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                  {line.country}
                </span>
                <h3 className="font-bold text-white text-sm">{line.name}</h3>
                <p className="text-xs text-gray-300 mt-1">{line.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <span className="font-mono text-sm font-black text-teal-300 block select-all">
                  {line.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
};
