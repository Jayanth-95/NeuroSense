// ─── Quiz Page ────────────────────────────────────────────────────────────────
// Wraps the reusable Quiz component with page-level context.

import { useNavigate } from 'react-router-dom';
import Quiz from '../components/Quiz';
import { useApp } from '../context/AppContext';
import { quizQuestions } from '../data/questions';

const QuizPage = () => {
  const { passQuiz, progress } = useApp();
  const navigate = useNavigate();

  const handlePass = () => {
    passQuiz();
    navigate('/test');
  };

  return (
    <div className="neural-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10 page-enter space-y-8">

        {/* ── Header ── */}
        <div>
          <p className="text-neural-400 font-mono text-xs uppercase tracking-widest mb-2">
            Step 2 of 4
          </p>
          <h1 className="font-display text-4xl font-bold text-white">
            Knowledge Quiz
          </h1>
          <p className="text-slate-400 mt-2 font-body">
            Answer questions about the learning content. Score ≥70% to proceed to the cognitive test.
          </p>
        </div>

        {/* ── Already passed banner ── */}
        {progress.quizPassed && (
          <div className="flex items-center justify-between bg-green-500/10
                          border border-green-500/30 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-green-300">
              <span>✅</span>
              <span>You have already passed this quiz.</span>
            </div>
            <button
              onClick={() => navigate('/test')}
              className="text-xs text-neural-400 hover:text-neural-300 transition font-mono"
            >
              Go to Test →
            </button>
          </div>
        )}

        {/* ── Quiz Component ── */}
        <Quiz questions={quizQuestions} onPass={handlePass} />

      </div>
    </div>
  );
};

export default QuizPage;
