// ─── AI Analysis Service v3 ───────────────────────────────────────────────────
// Weighted domain scoring + difficulty multiplier + confidence + time analysis.

const DOMAIN_WEIGHTS      = { memory: 3, attention: 2, orientation: 2, language: 1 };
const DIFFICULTY_MULT     = { easy: 0.8, medium: 1.0, hard: 1.2 };
const RISK_THRESHOLDS     = { LOW: 80, MODERATE: 50 };

// Time thresholds per question (seconds)
const TIME_THRESHOLDS = { FAST: 20, MODERATE: 35 };  // per question avg

const DOMAIN_META = {
  memory:      { label: 'Memory',      icon: '🧠' },
  attention:   { label: 'Attention',   icon: '🎯' },
  language:    { label: 'Language',    icon: '💬' },
  orientation: { label: 'Orientation', icon: '🧭' },
};

const RECOMMENDATIONS = {
  'Low Risk': {
    headline: 'Cognitive health appears strong.',
    detail: 'Your responses indicate no significant cognitive concerns. Continue mentally stimulating activities, good sleep, regular exercise, and a balanced diet.',
    actions: [
      'Stay socially and intellectually active',
      'Maintain aerobic exercise (≥150 min/week)',
      'Annual cognitive wellness check recommended',
      'Keep learning new skills',
    ],
    consultUrgency: 'optional',
    consultMessage: 'Your results look good! A routine check-up is always a healthy choice.',
    color: 'green',
  },
  'Moderate Risk': {
    headline: 'Some areas warrant attention.',
    detail: 'Mild difficulties in one or more domains detected. This is not a diagnosis — consult your GP or a neurologist for a comprehensive evaluation.',
    actions: [
      'Schedule an appointment with your GP soon',
      'Consider formal neuropsychological assessment',
      'Keep a cognitive diary to track changes',
      'Reduce risk factors: improve sleep, reduce stress',
    ],
    consultUrgency: 'suggested',
    consultMessage: 'Based on your results, we suggest consulting a cognitive health specialist for further evaluation.',
    color: 'yellow',
  },
  'High Risk': {
    headline: 'Significant cognitive concerns detected.',
    detail: 'Notable difficulties across multiple domains. Professional evaluation is strongly recommended. Early diagnosis enables better management.',
    actions: [
      'Consult a neurologist or geriatrician promptly',
      'Bring a trusted family member to appointments',
      'Request formal cognitive testing (MMSE, MoCA)',
      'Explore available support services',
    ],
    consultUrgency: 'strongly_recommended',
    consultMessage: 'Based on your results, we strongly recommend consulting a specialist as soon as possible.',
    color: 'red',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Simulated confidence score: score ± random offset within 10 pts, clamped 0–100 */
const calcConfidence = (score) => {
  const offset = Math.floor(Math.random() * 20) - 10;   // –10 to +10
  return Math.min(100, Math.max(0, score + offset));
};

/** Derive response speed category from total seconds and question count */
const calcResponseSpeed = (totalSeconds, questionCount) => {
  if (!totalSeconds || !questionCount) return null;
  const avgPerQ = totalSeconds / questionCount;
  if (avgPerQ < TIME_THRESHOLDS.FAST)     return { label: 'Fast',     icon: '⚡', cls: 'text-green-400',  detail: 'Quick cognitive response time — well within normal range.' };
  if (avgPerQ < TIME_THRESHOLDS.MODERATE) return { label: 'Moderate', icon: '⏱', cls: 'text-yellow-400', detail: 'Average response time — within acceptable range.' };
  return                                         { label: 'Slow',     icon: '🐢', cls: 'text-red-400',    detail: 'Slower response time detected — may indicate processing difficulty.' };
};

/** Find strongest and weakest domains from domainScores object */
const calcStrengthWeakness = (domainScores) => {
  const entries = Object.entries(domainScores);
  if (!entries.length) return { strongest: null, weakest: null };
  const sorted  = [...entries].sort((a, b) => b[1] - a[1]);
  const strongest = sorted[0];
  const weakest   = sorted[sorted.length - 1];
  const meta = (key) => DOMAIN_META[key] || { label: key, icon: '●' };
  return {
    strongest: { key: strongest[0], score: strongest[1], ...meta(strongest[0]) },
    weakest:   { key: weakest[0],   score: weakest[1],   ...meta(weakest[0])   },
  };
};

// ─── Core Algorithm ───────────────────────────────────────────────────────────
/**
 * @param {Array<{category: string, isCorrect: boolean}>} answers
 * @param {'easy'|'medium'|'hard'} difficulty
 * @param {number|null} timeTakenSeconds  — total test duration
 */
export const analyseResults = (answers, difficulty = 'medium', timeTakenSeconds = null) => {
  // 1. Group by domain
  const domainData = {};
  for (const d of Object.keys(DOMAIN_WEIGHTS)) domainData[d] = { correct: 0, total: 0 };
  answers.forEach(({ category, isCorrect }) => {
    if (domainData[category]) {
      domainData[category].total += 1;
      if (isCorrect) domainData[category].correct += 1;
    }
  });

  // 2. Domain accuracy %
  const domainScores = {};
  for (const [d, data] of Object.entries(domainData))
    domainScores[d] = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

  // 3. Weighted score
  let weightedSum = 0, maxWeighted = 0;
  for (const [d, w] of Object.entries(DOMAIN_WEIGHTS)) {
    weightedSum += (domainScores[d] / 100) * w;
    maxWeighted += w;
  }

  // 4. Normalise + difficulty multiplier
  const multiplier = DIFFICULTY_MULT[difficulty] || 1.0;
  const rawScore   = (weightedSum / maxWeighted) * 100;
  const score      = Math.min(100, Math.round(rawScore * multiplier));

  // 5. Classify risk
  const riskLevel =
    score >= RISK_THRESHOLDS.LOW      ? 'Low Risk' :
    score >= RISK_THRESHOLDS.MODERATE ? 'Moderate Risk' : 'High Risk';

  // 6. Enriched outputs
  const confidence     = calcConfidence(score);
  const responseSpeed  = calcResponseSpeed(timeTakenSeconds, answers.length);
  const { strongest, weakest } = calcStrengthWeakness(domainScores);

  return {
    score,
    riskLevel,
    confidence,
    domainScores,
    difficulty,
    multiplier,
    timeTakenSeconds,
    responseSpeed,
    strongest,
    weakest,
    recommendation: RECOMMENDATIONS[riskLevel],
    generatedAt: new Date().toISOString(),
  };
};

export const analyseResultsAsync = (answers, difficulty, timeTakenSeconds) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(analyseResults(answers, difficulty, timeTakenSeconds)), 1800)
  );

// Re-export domain meta for use in UI
export { DOMAIN_META };
