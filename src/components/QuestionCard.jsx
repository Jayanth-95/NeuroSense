// ─── Question Card ────────────────────────────────────────────────────────────
// Accepts 'category' (new questions.js) or 'domain' (legacy) field.

const DOMAIN_STYLE = {
  memory:      'cat-memory',
  attention:   'cat-attention',
  language:    'cat-language',
  orientation: 'cat-orientation',
};

const QuestionCard = ({ question, index, total, selected, onSelect, showResult = false, disabled = false }) => {
  const { question: text, options, correctAnswer, category, domain, hint } = question;
  const domainKey = category || domain;

  const getOptionCls = (option) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ';
    if (!showResult) {
      if (selected === option)
        return base + 'border-blue-500 bg-blue-500/20 text-blue-300';
      return base + (disabled
        ? 'border-slate-700 text-slate-500 cursor-not-allowed'
        : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50 cursor-pointer');
    }
    if (option === correctAnswer)   return base + 'border-green-500 bg-green-500/15 text-green-300';
    if (option === selected)         return base + 'border-red-500 bg-red-500/15 text-red-300';
    return base + 'border-slate-700 text-slate-500';
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-slate-500">Question {index} of {total}</span>
        {domainKey && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono capitalize ${DOMAIN_STYLE[domainKey] || 'bg-slate-700 text-slate-300'}`}>
            {domainKey}
          </span>
        )}
      </div>
      <p className="text-white text-base leading-relaxed mb-5">{text}</p>
      <div className="space-y-2.5">
        {options.map((option) => (
          <button key={option} className={getOptionCls(option)}
            onClick={() => !disabled && onSelect(option)} disabled={disabled}>
            <span className="flex items-center gap-2">
              {showResult && option === correctAnswer && <span className="text-green-400 font-bold">✓</span>}
              {showResult && option === selected && selected !== correctAnswer && <span className="text-red-400 font-bold">✗</span>}
              {option}
            </span>
          </button>
        ))}
      </div>
      {showResult && hint && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <span className="text-xs font-mono text-blue-400">Hint: </span>
          <span className="text-xs text-slate-300">{hint}</span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
