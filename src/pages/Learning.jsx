// ─── Learning Page ────────────────────────────────────────────────────────────
// User must expand all 4 cards, then navigates directly to /test (no quiz).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningCard from '../components/LearningCard';
import { useApp }   from '../context/AppContext';
import { learningContent } from '../data/learningContent';

const Learning = () => {
  const [expanded, setExpanded] = useState(null);
  const [viewed,   setViewed]   = useState(new Set());
  const { completeLearning, progress } = useApp();
  const navigate = useNavigate();

  const handleToggle = (id) => {
    setViewed((prev) => new Set([...prev, id]));
    setExpanded((cur) => (cur === id ? null : id));
  };

  const allViewed = learningContent.every((c) => viewed.has(c.id));

  const handleComplete = () => {
    completeLearning();
    navigate('/test');
  };

  return (
    <div className="neural-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10 page-enter space-y-8">

        <div>
          <p className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">
            Step 1 of 3
          </p>
          <h1 className="font-display text-4xl font-bold text-white">Learning Module</h1>
          <p className="text-slate-400 mt-2 font-body leading-relaxed">
            Study the four cognitive domains. Expand each card before proceeding to the test.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20
                        rounded-xl px-4 py-3 text-sm text-blue-300">
          <span>📖</span>
          <span>
            {viewed.size} of {learningContent.length} topics reviewed
            {!allViewed && ' — expand all cards to unlock the test'}
          </span>
        </div>

        <div className="space-y-4">
          {learningContent.map((content) => (
            <LearningCard key={content.id} content={content}
              isExpanded={expanded === content.id}
              onToggle={() => handleToggle(content.id)} />
          ))}
        </div>

        {progress.learningComplete && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30
                          rounded-xl px-4 py-3 text-sm text-green-300">
            <span>✅</span>
            <span>Module already completed. You can go straight to the test.</span>
          </div>
        )}

        <button onClick={handleComplete}
          disabled={!allViewed && !progress.learningComplete}
          className={`w-full py-4 rounded-xl font-display font-bold text-base transition-all
            ${allViewed || progress.learningComplete
              ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-[1.01] shadow-lg'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
          {progress.learningComplete
            ? 'Go to Cognitive Test →'
            : allViewed
              ? 'Complete Learning & Start Test →'
              : `Open all ${learningContent.length} cards to continue`}
        </button>

      </div>
    </div>
  );
};

export default Learning;
