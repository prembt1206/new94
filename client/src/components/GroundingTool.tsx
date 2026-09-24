import React, { useState, useEffect } from 'react';
import { Wind, Eye, Hand, Ear, Sparkles, Check, RefreshCw } from 'lucide-react';

interface GroundingToolProps {
  onClose?: () => void;
}

export const GroundingTool: React.FC<GroundingToolProps> = ({ onClose }) => {
  // Box breathing phases: Inhale (4s), Hold (4s), Exhale (4s), Hold (4s)
  const phases = [
    { label: 'Inhale deeply through your nose...', duration: 4, scale: 'scale-125', color: 'from-teal-500 to-cyan-500' },
    { label: 'Hold gently... feeling supported', duration: 4, scale: 'scale-125', color: 'from-cyan-500 to-blue-500' },
    { label: 'Exhale slowly through your mouth...', duration: 4, scale: 'scale-75', color: 'from-blue-500 to-indigo-500' },
    { label: 'Rest and pause in calm silence...', duration: 4, scale: 'scale-75', color: 'from-indigo-500 to-teal-500' }
  ];

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(true);

  // 5-4-3-2-1 Sensory items checked
  const [checkedSensory, setCheckedSensory] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setPhaseIdx((current) => (current + 1) % 4);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleCheck = (id: string) => {
    setCheckedSensory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sensorySteps = [
    { id: 's5', count: 5, icon: Eye, title: '5 Things You Can See', prompt: 'Notice five distinct objects around you (e.g., a pen, the floor pattern, a shadow).' },
    { id: 's4', count: 4, icon: Hand, title: '4 Things You Can Physically Feel', prompt: 'Notice the texture of your shirt, the chair supporting your spine, or your feet on the ground.' },
    { id: 's3', count: 3, icon: Ear, title: '3 Things You Can Hear', prompt: 'Listen carefully: the hum of a fan, birds outside, or your own breath.' },
    { id: 's2', count: 2, icon: Sparkles, title: '2 Things You Can Smell', prompt: 'Notice the ambient scent of clean air, soap, coffee, or clothing fabric.' },
    { id: 's1', count: 1, icon: Sparkles, title: '1 Thing You Can Taste', prompt: 'Notice the lingering taste of mint, tea, or sip cool water.' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-teal-500/40 space-y-8 shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Wind className="w-6 h-6 text-teal-400" />
            Trauma Grounding & Somatic Reset
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Calm sympathetic nervous system hyperarousal through guided pacing and sensory anchoring
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            Close Tool
          </button>
        )}
      </div>

      {/* Part 1: Interactive Box Breathing Visualizer */}
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gray-900/80 border border-gray-800 relative overflow-hidden">
        <div className="text-center z-10 space-y-3">
          <p className="text-xs uppercase font-mono tracking-widest text-teal-400">
            Guided Box Breathing (4-4-4-4)
          </p>
          <div className="h-10 flex items-center justify-center">
            <h4 className="text-lg sm:text-xl font-bold text-white transition-opacity duration-300">
              {phases[phaseIdx].label}
            </h4>
          </div>
        </div>

        {/* Dynamic Breathing Bubble */}
        <div className="my-10 relative flex items-center justify-center">
          <div
            className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr ${phases[phaseIdx].color} opacity-40 blur-2xl transition-all duration-1000 ${phases[phaseIdx].scale}`}
          />
          <div
            className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-teal-400/80 bg-teal-950/70 backdrop-blur-md flex flex-col items-center justify-center shadow-2xl transition-transform duration-1000 ${phases[phaseIdx].scale}`}
          >
            <span className="font-mono text-4xl sm:text-5xl font-black text-white">
              {secondsLeft}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 mt-1">
              Seconds
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 border border-gray-700 transition-colors"
          >
            {isActive ? 'Pause Pacing' : 'Resume Pacing'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPhaseIdx(0);
              setSecondsLeft(4);
            }}
            className="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
            title="Reset Breathing Loop"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Part 2: 5-4-3-2-1 Sensory Grounding Technique */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          5-4-3-2-1 Sensory Re-Anchoring Exercise
        </h4>
        <div className="grid grid-cols-1 gap-2.5">
          {sensorySteps.map((step) => {
            const isDone = Boolean(checkedSensory[step.id]);
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                onClick={() => toggleCheck(step.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-teal-950/40 border-teal-600/50 text-teal-200'
                    : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isDone
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-800 border border-gray-700 text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : step.count}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Icon className="w-3.5 h-3.5 text-teal-400" />
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs text-gray-400">{step.prompt}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
