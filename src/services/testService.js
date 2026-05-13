// ─── Test Service v2 ──────────────────────────────────────────────────────────
// Stores full enriched results including time, confidence, domain scores.

const HISTORY_KEY = 'neurosense_history';

export const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
};

export const saveResult = (userId, result) => {
  const history = loadHistory();
  const record  = {
    id:              `result_${Date.now()}`,
    userId,
    timestamp:       new Date().toISOString(),
    score:           result.score,
    riskLevel:       result.riskLevel,
    confidence:      result.confidence,
    domainScores:    result.domainScores,
    difficulty:      result.difficulty,
    timeTakenSeconds: result.timeTakenSeconds,
    responseSpeed:   result.responseSpeed?.label || null,
    strongest:       result.strongest?.key || null,
    weakest:         result.weakest?.key   || null,
    recommendation:  result.recommendation?.headline || '',
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...history]));
  return record;
};

export const getUserHistory = (userId) =>
  loadHistory().filter((r) => r.userId === userId);

/** Get the last N scores for a user — used for trend analysis */
export const getRecentScores = (userId, n = 3) =>
  getUserHistory(userId).slice(0, n).map((r) => r.score);

export const deleteResult = (id) => {
  localStorage.setItem(HISTORY_KEY,
    JSON.stringify(loadHistory().filter((r) => r.id !== id)));
};

export const clearAllHistory = () => localStorage.removeItem(HISTORY_KEY);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

/** Compute trend from an array of scores (newest first) */
export const computeTrend = (scores) => {
  if (!scores || scores.length < 2) return null;
  const [latest, previous] = scores;
  const delta = latest - previous;
  if (delta > 3)  return { label: 'Improving', icon: '📈', cls: 'text-green-400',  desc: `Up ${delta}pts from last test` };
  if (delta < -3) return { label: 'Declining', icon: '📉', cls: 'text-red-400',    desc: `Down ${Math.abs(delta)}pts from last test` };
  return               { label: 'Stable',    icon: '➡️', cls: 'text-yellow-400', desc: 'Consistent with previous test' };
};
