// ─── Results Page v3 ─────────────────────────────────────────────────────────
// Full enhanced report: score, confidence, domain breakdown, strongest/weakest,
// response speed, consult mentor CTA, download report, disclaimer.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { useApp }  from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { saveResult, formatDate } from '../services/testService';

// ─── Constants ────────────────────────────────────────────────────────────────
const DOMAIN_META = {
  memory:      { icon: '🧠', label: 'Memory',      color: 'bg-purple-500', weight: 3 },
  attention:   { icon: '🎯', label: 'Attention',    color: 'bg-sky-500',    weight: 2 },
  orientation: { icon: '🧭', label: 'Orientation',  color: 'bg-orange-500', weight: 2 },
  language:    { icon: '💬', label: 'Language',     color: 'bg-green-500',  weight: 1 },
};

const RISK_STYLE = {
  'Low Risk':      { text: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/40',  emoji: '🟢' },
  'Moderate Risk': { text: 'text-yellow-400', bg: 'bg-yellow-500/10',  border: 'border-yellow-500/40', emoji: '🟡' },
  'High Risk':     { text: 'text-red-400',    bg: 'bg-red-500/10',     border: 'border-red-500/40',    emoji: '🔴' },
};

const CONSULT_STYLE = {
  optional:             { label: 'Optional', cls: 'border-green-500/30  bg-green-500/5  text-green-300',   btn: 'bg-green-600  hover:bg-green-700'   },
  suggested:            { label: 'Suggested', cls: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300',  btn: 'bg-yellow-600 hover:bg-yellow-700'  },
  strongly_recommended: { label: 'Strongly Recommended', cls: 'border-red-500/30 bg-red-500/5 text-red-300', btn: 'bg-red-600 hover:bg-red-700' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Disclaimer = () => (
  <div className="flex gap-3 bg-yellow-500/8 border border-yellow-500/25 rounded-xl px-4 py-3">
    <span className="text-yellow-400 mt-0.5 flex-shrink-0">⚕</span>
    <p className="text-xs text-slate-400 leading-relaxed">
      <span className="text-yellow-400 font-semibold">Medical Disclaimer: </span>
      This system provides a preliminary cognitive assessment and is not a medical diagnosis.
      Please consult a healthcare professional for accurate evaluation.
    </p>
  </div>
);

// ─── Download Report ──────────────────────────────────────────────────────────
const generateReport = (user, result) => {
  const d = new Date().toLocaleString('en-IN');
  const domainLines = Object.entries(DOMAIN_META)
    .map(([k, m]) => `  ${m.label.padEnd(15)} ${result.domainScores?.[k] ?? 0}%`)
    .join('\n');
  const actions = result.recommendation?.actions?.map((a) => `  • ${a}`).join('\n') || '';

  return [
    '╔══════════════════════════════════════════════╗',
    '║         NEUROSENSE COGNITIVE REPORT          ║',
    '╚══════════════════════════════════════════════╝',
    '',
    `Report Generated : ${d}`,
    `Patient Name     : ${user?.name || 'N/A'}`,
    `Age              : ${user?.age || 'N/A'}`,
    `Gender           : ${user?.gender || 'N/A'}`,
    `Occupation       : ${user?.occupation || 'N/A'}`,
    '',
    '─── ASSESSMENT SUMMARY ─────────────────────────',
    `Overall Score    : ${result.score}%`,
    `Risk Level       : ${result.riskLevel}`,
    `Confidence       : ${result.confidence}%`,
    `Difficulty       : ${result.difficulty || 'medium'}`,
    `Response Speed   : ${result.responseSpeed?.label || 'N/A'}`,
    `Time Taken       : ${result.timeTakenSeconds ? Math.floor(result.timeTakenSeconds / 60) + 'm ' + (result.timeTakenSeconds % 60) + 's' : 'N/A'}`,
    '',
    '─── DOMAIN SCORES ───────────────────────────────',
    domainLines,
    '',
    `Strongest Area   : ${result.strongest?.label || 'N/A'} (${result.strongest?.score ?? 'N/A'}%)`,
    `Weakest Area     : ${result.weakest?.label   || 'N/A'} (${result.weakest?.score   ?? 'N/A'}%)`,
    '',
    '─── RECOMMENDATION ──────────────────────────────',
    result.recommendation?.headline || '',
    '',
    result.recommendation?.detail || '',
    '',
    '─── SUGGESTED ACTIONS ───────────────────────────',
    actions,
    '',
    '─────────────────────────────────────────────────',
    'DISCLAIMER: This report is for educational screening',
    'purposes only and does not constitute a medical',
    'diagnosis. Please consult a qualified healthcare',
    'professional for accurate evaluation.',
    '─────────────────────────────────────────────────',
  ].join('\n');
};

const downloadReport = (user, result) => {
  const text = generateReport(user, result);
  const blob = new Blob([text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `neurosense-report-${user?.name?.replace(/\s+/g, '-').toLowerCase() || 'report'}-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Results = () => {
  const { progress, resetProgress } = useApp();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [saved, setSaved]   = useState(false);
  const [downloading, setDownloading] = useState(false);

  const result = progress.lastResult;

  if (!result) {
    return (
      <div className="neural-bg min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <p className="text-slate-400">No result found. Please complete the cognitive test first.</p>
          <button onClick={() => navigate('/test')}
            className="px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition">
            Go to Test
          </button>
        </div>
      </div>
    );
  }

  const { score, riskLevel, confidence, domainScores, responseSpeed,
          strongest, weakest, recommendation, timeTakenSeconds, difficulty } = result;

  const style        = RISK_STYLE[riskLevel]  || RISK_STYLE['High Risk'];
  const consultStyle = CONSULT_STYLE[recommendation?.consultUrgency] || CONSULT_STYLE.optional;
  const scoreBarCls  = riskLevel === 'Low Risk' ? 'bg-green-500' : riskLevel === 'Moderate Risk' ? 'bg-yellow-500' : 'bg-red-500';

  const handleSave = () => {
    if (!saved) { saveResult(user.id, result); setSaved(true); }
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => { downloadReport(user, result); setDownloading(false); }, 300);
  };

  const timeStr = timeTakenSeconds
    ? `${Math.floor(timeTakenSeconds / 60)}m ${timeTakenSeconds % 60}s`
    : null;

  return (
    <div className="neural-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 page-enter">

        {/* Disclaimer */}
        <Disclaimer />

        {/* Header */}
        <div>
          <p className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-1">AI Analysis Complete</p>
          <h1 className="font-display text-4xl font-bold text-white">Your Results</h1>
          <p className="text-slate-500 text-xs mt-1 font-mono">
            {result.generatedAt ? formatDate(result.generatedAt) : ''} ·{' '}
            Difficulty: <span className="text-slate-400 capitalize">{difficulty}</span>
          </p>
        </div>

        {/* ── Hero score card ── */}
        <div className={`bg-slate-800 rounded-xl shadow-lg p-7 border-2 ${style.border} text-center`}>
          <div className="text-5xl mb-3">{style.emoji}</div>

          {/* Score + Confidence row */}
          <div className="flex items-end justify-center gap-6 mb-3">
            <div>
              <div className={`font-display text-6xl font-bold ${style.text}`}>{score}%</div>
              <div className="text-slate-500 text-xs font-mono mt-1">Weighted Score</div>
            </div>
            <div className="pb-1 text-left">
              <div className="text-white font-display text-2xl font-bold">{confidence}%</div>
              <div className="text-slate-500 text-xs font-mono">Confidence</div>
            </div>
          </div>

          {/* Risk badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm
                           font-mono mb-4 ${style.bg} border ${style.border}`}>
            <span className={style.text}>●</span>
            <span className={`${style.text} font-semibold`}>{riskLevel}</span>
          </div>

          <p className="text-white font-display text-lg font-bold mb-2">{recommendation?.headline}</p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">{recommendation?.detail}</p>
        </div>

        {/* ── Score bar + thresholds ── */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-5 space-y-3">
          <h2 className="font-mono text-xs text-slate-500 uppercase tracking-widest">Score Visualisation</h2>
          <ProgressBar value={score} size="lg" colorClass={scoreBarCls} />
          <div className="flex justify-between text-xs font-mono text-slate-600">
            <span>High Risk &lt;50%</span><span>Moderate 50–79%</span><span>Low Risk ≥80%</span>
          </div>
        </div>

        {/* ── Quick stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Confidence',  value: `${confidence}%`, icon: '🎯' },
            { label: 'Speed',       value: responseSpeed?.label || 'N/A', icon: responseSpeed?.icon || '⏱', cls: responseSpeed?.cls },
            { label: 'Time Taken',  value: timeStr || 'N/A',  icon: '⏳' },
            { label: 'Multiplier',  value: `×${result.multiplier?.toFixed(1) || '1.0'}`, icon: '⚙️' },
          ].map(({ label, value, icon, cls }) => (
            <div key={label} className="bg-slate-800 rounded-xl shadow-lg p-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className={`font-bold text-sm ${cls || 'text-white'}`}>{value}</div>
              <div className="text-xs text-slate-500 font-mono">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Category-wise analysis ── */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 space-y-4">
          <h2 className="font-mono text-xs text-slate-500 uppercase tracking-widest">Domain Breakdown</h2>

          {/* Strongest / Weakest callout */}
          {strongest && weakest && (
            <div className="grid grid-cols-2 gap-3 pb-2">
              <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3 text-center">
                <div className="text-lg mb-0.5">{strongest.icon}</div>
                <div className="text-green-400 text-xs font-mono font-bold uppercase">{strongest.label}</div>
                <div className="text-white font-display font-bold">{strongest.score}%</div>
                <div className="text-slate-500 text-xs mt-0.5">Strongest Area</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-center">
                <div className="text-lg mb-0.5">{weakest.icon}</div>
                <div className="text-red-400 text-xs font-mono font-bold uppercase">{weakest.label}</div>
                <div className="text-white font-display font-bold">{weakest.score}%</div>
                <div className="text-slate-500 text-xs mt-0.5">Needs Improvement</div>
              </div>
            </div>
          )}

          {Object.entries(DOMAIN_META).map(([key, meta]) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{meta.icon}</span>
                  <span className="text-sm text-slate-300">{meta.label}</span>
                  <span className="text-xs font-mono text-slate-600">(×{meta.weight})</span>
                  {strongest?.key === key && <span className="text-xs text-green-400 font-mono">★ Best</span>}
                  {weakest?.key === key   && strongest?.key !== key && <span className="text-xs text-red-400 font-mono">↓ Improve</span>}
                </div>
                <span className="text-sm font-mono text-white">{domainScores?.[key] ?? 0}%</span>
              </div>
              <ProgressBar value={domainScores?.[key] ?? 0} colorClass={meta.color} showValue={false} size="sm" />
            </div>
          ))}
        </div>

        {/* ── Recommended actions ── */}
        {recommendation?.actions && (
          <div className="bg-slate-800 rounded-xl shadow-lg p-6 space-y-3">
            <h2 className="font-mono text-xs text-slate-500 uppercase tracking-widest">Recommended Actions</h2>
            <ul className="space-y-2">
              {recommendation.actions.map((action, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">›</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Consult Mentor CTA ── */}
        <div className={`rounded-xl border p-5 ${consultStyle.cls}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">
              {recommendation?.consultUrgency === 'strongly_recommended' ? '🚨' :
               recommendation?.consultUrgency === 'suggested' ? '💡' : '💬'}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Consult a Mentor</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 font-mono">
                  {consultStyle.label}
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-80 mb-3">
                {recommendation?.consultMessage}
              </p>
              <button onClick={() => navigate('/contact')}
                className={`px-4 py-2 rounded-lg text-white text-xs font-bold transition ${consultStyle.btn}`}>
                Contact a Specialist →
              </button>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onClick={handleSave} disabled={saved}
            className={`py-3 rounded-xl font-bold text-xs transition-all
              ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
            {saved ? '✅ Saved' : '💾 Save Result'}
          </button>

          <button onClick={handleDownload} disabled={downloading}
            className="py-3 rounded-xl border border-slate-600 text-slate-300 text-xs font-bold
                       hover:border-blue-500/50 hover:text-blue-400 transition">
            {downloading ? '⏳ …' : '⬇ Download Report'}
          </button>

          <button onClick={() => navigate('/history')}
            className="py-3 rounded-xl border border-slate-600 text-slate-300 text-xs font-bold
                       hover:border-slate-400 hover:text-white transition">
            📜 History
          </button>

          <button onClick={() => { resetProgress(); navigate('/learning'); }}
            className="py-3 rounded-xl border border-slate-600 text-slate-300 text-xs font-bold
                       hover:border-yellow-500/40 hover:text-yellow-400 transition">
            ↺ New Test
          </button>
        </div>

      </div>
    </div>
  );
};

export default Results;
