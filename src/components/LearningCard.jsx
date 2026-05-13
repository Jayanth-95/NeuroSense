// ─── Learning Card Component ──────────────────────────────────────────────────
// Displays one cognitive domain with its description, key points, and example.

import { useState } from 'react';

/**
 * @param {object} props
 * @param {object} props.content - One entry from learningContent.js
 * @param {boolean} props.isExpanded - Controls expand/collapse
 * @param {function} props.onToggle - Called when the card header is clicked
 */
const LearningCard = ({ content, isExpanded, onToggle }) => {
  const { category, icon, colorClass, tagline, description, keyPoints, example, warningSign } =
    content;

  return (
    <div
      className={`
        glass-card overflow-hidden transition-all duration-300
        ${isExpanded ? 'shadow-neural' : 'hover:border-slate-600'}
        cursor-pointer
      `}
      onClick={onToggle}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-4 p-5">
        <div className={`${colorClass} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg text-white">{category}</h3>
          <p className="text-slate-400 text-sm mt-0.5 font-body italic">{tagline}</p>
        </div>
        <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </div>
      </div>

      {/* ── Expanded Content ── */}
      {isExpanded && (
        <div className="border-t border-slate-700/50 px-5 pb-5 pt-4 space-y-5 animate-fade-up">

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed font-body">{description}</p>

          {/* Key Points */}
          <div>
            <h4 className="text-xs font-mono text-neural-400 uppercase tracking-widest mb-2">
              Key Facts
            </h4>
            <ul className="space-y-1.5">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-neural-400 mt-0.5 flex-shrink-0">›</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Example Scenario */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-neural-400 uppercase tracking-widest">
                Example
              </span>
              <span className="text-xs text-slate-500">— {example.scenario}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{example.detail}</p>
          </div>

          {/* Warning Sign */}
          <div className="flex gap-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
            <span className="text-yellow-400 text-base flex-shrink-0">⚠</span>
            <div>
              <span className="text-xs font-mono text-yellow-400 uppercase tracking-wide">
                Warning sign:
              </span>
              <p className="text-slate-300 text-sm mt-0.5">{warningSign}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default LearningCard;
