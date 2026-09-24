import React, { useState } from 'react';
import { checkInApi, CheckInPayload } from '../services/api';
import { RiskBadge } from './RiskBadge';
import { Heart, Moon, Wind, Activity, Send, CheckCircle2, AlertTriangle, Sparkles, Shield, RotateCcw } from 'lucide-react';

interface CheckInFormProps {
  onCheckInCompleted?: (result: any) => void;
  onTriggerEmergency?: () => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({
  onCheckInCompleted,
  onTriggerEmergency
}) => {
  const [moodScore, setMoodScore] = useState<number>(3);
  const [anxietyScore, setAnxietyScore] = useState<number>(2);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [physicalTension, setPhysicalTension] = useState<number>(2);
  const [freeTextReflection, setFreeTextReflection] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const moodLabels = [
    { score: 1, label: 'Severely Depressed / Numb', desc: 'Feeling overwhelmed, heavy, or disconnected' },
    { score: 2, label: 'Low / Struggling', desc: 'Noticeable emotional heaviness or sadness' },
    { score: 3, label: 'Neutral / Managing', desc: 'Getting through routine tasks with effort' },
    { score: 4, label: 'Stable / Grounded', desc: 'Able to experience moments of calm and hope' },
    { score: 5, label: 'Optimistic / Peaceful', desc: 'Deeply anchored, emotionally clear' }
  ];

  const anxietyLabels = [
    { score: 1, label: 'Deeply Calm', desc: 'Nervous system feels settled and safe' },
    { score: 2, label: 'Mild Restlessness', desc: 'Occasional worry, but manageable' },
    { score: 3, label: 'Noticeable Tension', desc: 'Heart rate slightly elevated or hypervigilant' },
    { score: 4, label: 'High Anxiety', desc: 'Significant panic symptoms or difficulty focusing' },
    { score: 5, label: 'Severe Panic / Overwhelm', desc: 'Acute physiological distress or dissociation' }
  ];

  const sleepLabels = [
    { score: 1, label: 'Severe Disruption', desc: 'Insomnia, vivid flashbacks, or intense nightmares' },
    { score: 2, label: 'Restless Sleep', desc: 'Woke up multiple times feeling unrefreshed' },
    { score: 3, label: 'Average Rest', desc: 'Slept adequately with minor disruptions' },
    { score: 4, label: 'Restorative Sleep', desc: 'Mostly continuous and calming sleep' },
    { score: 5, label: 'Deeply Restful', desc: 'Woke feeling physically and mentally renewed' }
  ];

  const tensionLabels = [
    { score: 1, label: 'Relaxed Body', desc: 'Muscles loose, breathing unconstrained' },
    { score: 2, label: 'Mild Tightness', desc: 'Slight jaw, neck, or shoulder tension' },
    { score: 3, label: 'Moderate Aches', desc: 'Noticeable somatic guarding or clenching' },
    { score: 4, label: 'Heavy Constriction', desc: 'Chest tightness, shallow breath, or tremors' },
    { score: 5, label: 'Extreme Somatic Lock', desc: 'Intense physical freeze or shaking' }
  ];

  const promptChips = [
    "Experienced a trigger today",
    "Completed grounding breathwork",
    "Feeling emotionally numb",
    "Safe in my physical space",
    "Overwhelmed by intrusive memories",
    "Found comfort in a peaceful moment"
  ];

  const handleChipClick = (chip: string) => {
    if (freeTextReflection.includes(chip)) return;
    setFreeTextReflection(prev => prev ? `${prev} • ${chip}` : chip);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CheckInPayload = {
      moodScore,
      anxietyScore,
      sleepQuality,
      physicalTension,
      freeTextReflection
    };

    try {
      const data = await checkInApi.submit(payload);
      setSubmittedResult(data);
      if (onCheckInCompleted) {
        onCheckInCompleted(data);
      }

      // If high distress or emergency detected, trigger counselor escalation modal
      if (data.emergencyEscalation && onTriggerEmergency) {
        onTriggerEmergency();
      }
    } catch (err: any) {
      console.error('Check-in submission failed:', err);
      setError(err.response?.data?.message || 'Unable to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedResult(null);
    setFreeTextReflection('');
    setMoodScore(3);
    setAnxietyScore(2);
    setSleepQuality(3);
    setPhysicalTension(2);
  };

  if (submittedResult) {
    const { prediction, alertCreated } = submittedResult;
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-teal-500/30 shadow-xl shadow-teal-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800/80 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Assessment Evaluated by MindGuard AI
                <Sparkles className="w-4 h-4 text-teal-400" />
              </h3>
              <p className="text-xs text-gray-400">Encrypted analysis processed with Gemini 2.5/3.6 Flash engine</p>
            </div>
          </div>
          <RiskBadge level={prediction.risk_level} score={prediction.distress_score} size="lg" />
        </div>

        {alertCreated && (
          <div className="p-4 rounded-xl bg-orange-950/60 border border-orange-700/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-orange-300">Counselor Notification Dispatched</p>
              <p className="text-orange-200/90 text-xs mt-0.5">
                Because your calculated distress score breached safety thresholds, an automated notification has been prioritized in your care team's queue. You are not alone.
              </p>
            </div>
          </div>
        )}

        {/* AI Analysis Summary */}
        <div className="p-5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Clinical AI Summary
          </h4>
          <p className="text-gray-200 text-sm leading-relaxed">
            {prediction.ai_analysis_summary}
          </p>
        </div>

        {/* Actionable Self-Care / Intervention Steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Recommended Immediate Actions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {prediction.recommended_actions?.map((action: string, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-gray-800/60 border border-gray-700/50 flex items-start gap-2.5 text-xs text-gray-300"
              >
                <span className="w-5 h-5 rounded-full bg-teal-950 text-teal-300 border border-teal-800 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-sm transition-colors border border-gray-700"
          >
            <RotateCcw className="w-4 h-4 text-teal-400" />
            New Assessment Entry
          </button>
          {prediction.risk_level !== 'green' && (
            <button
              type="button"
              onClick={onTriggerEmergency}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-200 font-medium text-sm transition-colors border border-red-700/60"
            >
              <Heart className="w-4 h-4 text-red-400" />
              Open Emergency Coping Support
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8 border border-gray-800">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Trauma-Safe Dynamic Check-In
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Take your time. There are no right or wrong answers. Your answers are private, encrypted, and monitored by compassionate AI to keep you safe.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Metric 1: Mood Score (Likert 1-5) */}
      <div className="space-y-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/80">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            Current Emotional State / Mood
          </label>
          <span className="font-mono text-sm px-2.5 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800 font-bold">
            {moodScore} / 5
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={moodScore}
          onChange={(e) => setMoodScore(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-teal-300">{moodLabels[moodScore - 1].label}</span>
          <span className="text-gray-400 italic hidden sm:inline">{moodLabels[moodScore - 1].desc}</span>
        </div>
      </div>

      {/* Metric 2: Anxiety Level (Likert 1-5) */}
      <div className="space-y-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/80">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Wind className="w-4 h-4 text-sky-400" />
            Anxiety & Internal Agitation
          </label>
          <span className="font-mono text-sm px-2.5 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-800 font-bold">
            {anxietyScore} / 5
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={anxietyScore}
          onChange={(e) => setAnxietyScore(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-sky-300">{anxietyLabels[anxietyScore - 1].label}</span>
          <span className="text-gray-400 italic hidden sm:inline">{anxietyLabels[anxietyScore - 1].desc}</span>
        </div>
      </div>

      {/* Metric 3: Sleep Quality (Likert 1-5) */}
      <div className="space-y-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/80">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            Sleep Restfulness & Nocturnal Triggers
          </label>
          <span className="font-mono text-sm px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
            {sleepQuality} / 5
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={sleepQuality}
          onChange={(e) => setSleepQuality(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-indigo-300">{sleepLabels[sleepQuality - 1].label}</span>
          <span className="text-gray-400 italic hidden sm:inline">{sleepLabels[sleepQuality - 1].desc}</span>
        </div>
      </div>

      {/* Metric 4: Physical Tension & Somatic Load (Likert 1-5) */}
      <div className="space-y-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/80">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Physical Tension & Somatic Guarding
          </label>
          <span className="font-mono text-sm px-2.5 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800 font-bold">
            {physicalTension} / 5
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={physicalTension}
          onChange={(e) => setPhysicalTension(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-amber-300">{tensionLabels[physicalTension - 1].label}</span>
          <span className="text-gray-400 italic hidden sm:inline">{tensionLabels[physicalTension - 1].desc}</span>
        </div>
      </div>

      {/* Free Text Reflection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-200">
            How are you feeling in your own words? (Optional)
          </label>
          <span className="text-xs text-gray-500 font-mono">
            {freeTextReflection.length} / 2000
          </span>
        </div>

        {/* Quick Feeling Tags */}
        <div className="flex flex-wrap gap-2">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/60 transition-colors"
            >
              + {chip}
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          maxLength={2000}
          value={freeTextReflection}
          onChange={(e) => setFreeTextReflection(e.target.value)}
          placeholder="You can write freely here. If you experienced flashbacks, numbness, or moments of peace, recording them helps the predictive model identify triggers before distress escalates..."
          className="w-full p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 shadow-lg shadow-teal-700/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Psychological Indicators...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>Submit Daily Check-in & Run AI Assessment</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
