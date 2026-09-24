import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Flame } from 'lucide-react';

export type RiskTier = 'green' | 'yellow' | 'orange' | 'red';

interface RiskBadgeProps {
  level: RiskTier | string;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showScore = true,
  size = 'md'
}) => {
  const normalizedLevel = (level || 'green').toLowerCase() as RiskTier;

  const config = {
    green: {
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-600/40',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-900/20',
      label: 'Stable Baseline',
      icon: ShieldCheck,
      dot: 'bg-emerald-400',
      desc: 'Normal baseline fluctuation'
    },
    yellow: {
      bg: 'bg-amber-950/80',
      border: 'border-amber-600/40',
      text: 'text-amber-400',
      glow: 'shadow-amber-900/20',
      label: 'Elevated Stress',
      icon: AlertTriangle,
      dot: 'bg-amber-400',
      desc: 'Early stress accumulation requiring self-care'
    },
    orange: {
      bg: 'bg-orange-950/80',
      border: 'border-orange-600/50',
      text: 'text-orange-400',
      glow: 'shadow-orange-900/30',
      label: 'High Risk',
      icon: AlertCircle,
      dot: 'bg-orange-500 animate-pulse',
      desc: 'Mental fatigue or trauma spikes requiring clinical review'
    },
    red: {
      bg: 'bg-red-950/90',
      border: 'border-red-600/60',
      text: 'text-red-400',
      glow: 'shadow-red-900/40 shadow-lg',
      label: 'Critical Emergency',
      icon: Flame,
      dot: 'bg-red-500 animate-ping',
      desc: 'Immediate crisis indicators requiring active intervention'
    }
  }[normalizedLevel] || {
    bg: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-300',
    glow: '',
    label: 'Unknown',
    icon: ShieldCheck,
    dot: 'bg-gray-400',
    desc: 'Unclassified'
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-2',
    lg: 'px-3.5 py-1.5 text-sm sm:text-base gap-2.5 font-semibold'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  return (
    <div
      title={config.desc}
      className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`rounded-full h-2 w-2 ${config.dot}`}></span>
      </span>
      <Icon className={iconSizes} />
      <span className="font-semibold uppercase tracking-wider">{config.label}</span>
      {showScore && typeof score === 'number' && (
        <span className="ml-1 pl-1.5 border-l border-white/10 font-mono text-[11px] opacity-90">
          {score.toFixed(1)}/100
        </span>
      )}
    </div>
  );
};
