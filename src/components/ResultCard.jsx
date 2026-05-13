// ─── Result Card v2 ──────────────────────────────────────────────────────────
// History list card — shows score, risk, confidence, speed, domains.

import { formatDate } from '../services/testService';
import ProgressBar    from './ProgressBar';

const RISK_CFG = {
  'Low Risk':      { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/25',  icon: '🟢' },
  'Moderate Risk': { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25', icon: '🟡' },
  'High Risk':     { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/25',    icon: '🔴' },
};

const DOMAIN_ICONS = { memory: '🧠', attention: '🎯', language: '💬', orientation: '🧭' };

const ResultCard = ({ result, onDelete }) => {
  const { id, timestamp, score, riskLevel, confidence, domainScores,
          difficulty, responseSpeed, strongest, weakest, recommendation } = result;
  const cfg = RISK_CFG[riskLevel] || RISK_CFG['High Risk'];
  const barCls = riskLevel === 'Low Risk' ? 'bg-green-500' : riskLevel === 'Moderate Risk' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`bg-slate-800 rounded-xl shadow-lg p-5 border ${cfg.border} hover:border-opacity-60 transition-all animate-fade-up`}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{cfg.icon}</span>
            <span className={`font-display font-bold text-lg ${cfg.text}`}>{riskLevel}</span>
          </div>
          <span className="text-xs font-mono text-slate-500">{formatDate(timestamp)}</span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-3xl font-bold text-white">{score}%</div>
          {confidence !== undefined && (
            <div className="text-xs text-slate-500 font-mono">conf. {confidence}%</div>
          )}
        </div>
      </div>

      {/* Score bar */}
      <ProgressBar value={score} colorClass={barCls} showValue={false} size="sm" />

      {/* Meta pills */}
      <div className="flex flex-wrap gap-2 mt-3 mb-3">
        {difficulty && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono capitalize">
            {difficulty}
          </span>
        )}
        {responseSpeed && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
            ⏱ {responseSpeed}
          </span>
        )}
        {strongest && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-mono capitalize">
            ★ {strongest}
          </span>
        )}
        {weakest && weakest !== strongest && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-mono capitalize">
            ↓ {weakest}
          </span>
        )}
      </div>

      {/* Domain breakdown */}
      {domainScores && (
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {Object.entries(domainScores).map(([domain, pct]) => (
            <div key={domain} className="bg-slate-900/50 rounded-lg px-3 py-1.5 flex items-center justify-between">
              <span className="text-xs text-slate-400 capitalize flex items-center gap-1">
                {DOMAIN_ICONS[domain]} {domain}
              </span>
              <span className="text-xs font-bold text-white font-mono">{pct}%</span>
            </div>
          ))}
        </div>
      )}

      {recommendation && (
        <p className="text-xs text-slate-500 italic mb-3">"{recommendation}"</p>
      )}

      {onDelete && (
        <button onClick={() => onDelete(id)}
          className="text-xs text-slate-700 hover:text-red-400 transition font-mono">
          Delete record
        </button>
      )}
    </div>
  );
};

export default ResultCard;
