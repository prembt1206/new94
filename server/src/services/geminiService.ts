import { GoogleGenAI, Type, Schema } from '@google/genai';
import { DistressAnalysisResult, RiskLevel } from '../types/index.js';

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is missing. Fallback engine will be used.");
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export const distressAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    distressScore: {
      type: Type.NUMBER,
      description: "Numerical distress index from 0.00 to 100.00 representing psychological strain."
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["green", "yellow", "orange", "red"],
      description: "Categorized risk tier based on distress score thresholds."
    },
    analysisSummary: {
      type: Type.STRING,
      description: "Clinical yet compassionate summary of psychological patterns detected in the current entry."
    },
    recommendedActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of actionable self-care or professional intervention steps."
    }
  },
  required: ["distressScore", "riskLevel", "analysisSummary", "recommendedActions"],
};

export const SYSTEM_INSTRUCTION = `You are MindGuard AI, an expert clinical psychological assessment engine designed to assist mental health professionals and monitor trauma survivors. Your evaluations must be objective, trauma-informed, deeply empathetic, and scientifically grounded. You analyze check-in logs, mood scores, and unstructured reflections to detect early markers of severe psychological distress, depressive episodes, and trauma triggers. Always output structured JSON matching the requested schema precisely.
Risk Tiers:
- green (0-30): Stable, normal baseline fluctuation.
- yellow (31-55): Elevated stress, accumulation of fatigue, early coping strain.
- orange (56-80): High risk, pronounced mental fatigue, trauma triggers, counselor attention needed.
- red (81-100): Critical emergency, severe acute distress, acute panic, dissociation, or crisis indicators.`;

export async function analyzeCheckIn(
  checkInText: string,
  scores: { mood: number; anxiety: number; sleep: number; physicalTension?: number }
): Promise<DistressAnalysisResult> {
  const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Analyze the following survivor check-in data:
- Mood Score (1-5, where 1 is worst/lowest, 5 is best): ${scores.mood}
- Anxiety Score (1-5, where 1 is calm, 5 is extreme panic): ${scores.anxiety}
- Sleep Quality (1-5, where 1 is insomnia/nightmares, 5 is restful): ${scores.sleep}
- Physical Tension (1-5, where 1 is relaxed, 5 is severe somatic tension): ${scores.physicalTension ?? 1}
- Reflection: "${checkInText || 'No verbal reflection provided.'}"`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: distressAnalysisSchema,
          temperature: 0.2,
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini model');
      }

      const parsed = JSON.parse(responseText);

      // Validate parsed fields
      const distressScore = Math.min(100, Math.max(0, Number(parsed.distressScore) || 0));
      let riskLevel: RiskLevel = 'green';
      if (distressScore >= 80) riskLevel = 'red';
      else if (distressScore >= 56) riskLevel = 'orange';
      else if (distressScore >= 31) riskLevel = 'yellow';
      else riskLevel = 'green';

      // Override if AI specified a valid level
      if (['green', 'yellow', 'orange', 'red'].includes(parsed.riskLevel)) {
        riskLevel = parsed.riskLevel as RiskLevel;
      }

      return {
        distressScore: Number(distressScore.toFixed(2)),
        riskLevel,
        analysisSummary: parsed.analysisSummary || 'Evaluation completed based on clinical markers.',
        recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0
          ? parsed.recommendedActions
          : ['Practice 4-7-8 grounding breaths', 'Stay hydrated', 'Contact support specialist if symptoms intensify']
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini analysis attempt with ${model} failed:`, err?.message || err);
    }
  }

  console.error("All Gemini models encountered an error, activating resilient clinical heuristic engine:", lastError?.message);

  // Trauma-informed Clinical Heuristic Fallback Engine
  // Ensures zero downtime or loss of patient distress tracking
  return calculateClinicalHeuristic(checkInText, scores);
}

function calculateClinicalHeuristic(
  text: string,
  scores: { mood: number; anxiety: number; sleep: number; physicalTension?: number }
): DistressAnalysisResult {
  // mood: 1 (worst) -> 5 (best) => distress contrib = (5 - mood) * 20 (max 80)
  // anxiety: 1 (calm) -> 5 (severe) => distress contrib = (anxiety - 1) * 20 (max 80)
  // sleep: 1 (severe disruption) -> 5 (restful) => distress contrib = (5 - sleep) * 15 (max 60)
  // tension: 1 (relaxed) -> 5 (tense) => distress contrib = (tension - 1) * 10 (max 40)
  const tension = scores.physicalTension ?? 1;

  let baseScore =
    ((5 - scores.mood) / 4) * 35 +
    ((scores.anxiety - 1) / 4) * 35 +
    ((5 - scores.sleep) / 4) * 20 +
    ((tension - 1) / 4) * 10;

  const lowerText = (text || '').toLowerCase();
  const criticalKeywords = ['suicid', 'end it', 'die', 'hurt myself', 'hopeless', 'cannot go on', 'severe panic', 'flashback'];
  const highKeywords = ['panic', 'overwhelm', 'shaking', 'crying', 'numb', 'nightmare', 'terrified', 'scared'];

  let foundCritical = criticalKeywords.some(k => lowerText.includes(k));
  let foundHigh = highKeywords.some(k => lowerText.includes(k));

  if (foundCritical) {
    baseScore = Math.max(baseScore, 85);
  } else if (foundHigh) {
    baseScore = Math.max(baseScore, 65);
  }

  const distressScore = Math.min(100, Math.max(0, Number(baseScore.toFixed(2))));

  let riskLevel: RiskLevel = 'green';
  let summary = '';
  let actions: string[] = [];

  if (distressScore >= 80) {
    riskLevel = 'red';
    summary = `Critical psychological distress markers identified. Elevated panic indicators (anxiety score: ${scores.anxiety}/5) and acute trauma reactivity detected. Priority intervention recommended.`;
    actions = [
      'Immediate crisis helpline support (Call 988 or text HOME to 741741)',
      'Activate safety plan and grounding protocol',
      'Direct connection with on-call trauma counselor dispatched',
      'Engage in 5-4-3-2-1 sensory re-anchoring'
    ];
  } else if (distressScore >= 56) {
    riskLevel = 'orange';
    summary = `High distress patterns observed. Notable anxiety accumulation (${scores.anxiety}/5) combined with compromised sleep (${scores.sleep}/5) reflects heightened sympathetic nervous system activation.`;
    actions = [
      'Initiate box-breathing exercise (4 seconds in, hold 4s, out 4s, hold 4s)',
      'Scheduled check-in review flagged for assigned counselor',
      'Limit sensory stimuli and find a secure, warm environment',
      'Review somatic grounding exercises in the Resources hub'
    ];
  } else if (distressScore >= 31) {
    riskLevel = 'yellow';
    summary = `Elevated strain detected. Mild fluctuation in emotional regulation and restorative sleep (${scores.sleep}/5) indicates early stress accumulation.`;
    actions = [
      'Implement scheduled restorative downtime',
      'Gentle physical release exercises for somatic tension',
      'Hydrate and journal unstructured feelings',
      'Monitor for persistent anxiety spikes over the next 24 hours'
    ];
  } else {
    riskLevel = 'green';
    summary = `Psychological markers indicate stable baseline functioning. Emotional regulation and restorative patterns are well-balanced.`;
    actions = [
      'Continue proactive daily mindfulness habits',
      'Maintain steady sleep hygiene routine',
      'Celebrate sustained emotional stabilization'
    ];
  }

  return {
    distressScore,
    riskLevel,
    analysisSummary: summary,
    recommendedActions: actions
  };
}
