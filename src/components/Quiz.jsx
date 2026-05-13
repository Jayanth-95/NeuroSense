// ─── Quiz Component ───────────────────────────────────────────────────────────
// Reusable quiz engine used on the QuizPage.
// Tracks score, shows pass/fail, allows retry.

import { useState } from 'react';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';

const PASS_THRESHOLD = 70; // percentage

/**
 * @param {object}   props
 * @param {Array}    props.questions   - Array of question objects
 * @param {function} props.onPass      - Called when user passes the quiz
 * @param {function} [props.onFail]    - Called after fail result shown
 */
const Quiz = ({ questions, onPass }) => {
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [answers, setAnswers]             = useState({});  // { questionId: selectedOption }
  const [submitted, setSubmitted]         = useState(false);
  const [quizComplete, setQuizComplete]   = useState(false);
  const [score, setScore]                 = useState(0);
  const [passed, setPassed]               = useState(false);

  const currentQ  = questions[currentIndex];
  const selected  = answers[currentQ?.id] || null;
  const isLast    = currentIndex === questions.length - 1;

  // Select an answer for current question
  const handleSelect = (option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
  };

  // Confirm current answer and move on
  const handleNext = () => {
    if (!selected) return;

    if (!isLast) {
      setSubmitted(false);
      setCurrentIndex((i) => i + 1);
    } else {
      // Calculate final score
      const correct = questions.filter(
        (q) => answers[q.id] === q.correctAnswer
      ).length;
      const pct = Math.round((correct / questions.length) * 100);
      setScore(pct);
      setPassed(pct >= PASS_THRESHOLD);
      setQuizComplete(true);
    }
  };

  // Retry from scratch
  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setQuizComplete(false);
    setScore(0);
    setPassed(false);
  };

  // ── Quiz Complete Screen ──────────────────────────────────────────────────
  if (quizComplete) {
    const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;

    return (
      <div className="max-w-lg mx-auto space-y-6 page-enter">
        {/* Score card */}
        <div
          className={`glass-card p-8 text-center border-2 ${
            passed ? 'border-green-500/40' : 'border-red-500/40'
          }`}
        >
          <div className={`text-6xl mb-4 ${passed ? '' : ''}`}>
            {passed ? '🎉' : '😔'}
          </div>
          <h2 className={`font-display text-3xl font-bold mb-1 ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {passed
              ? 'Great work! You can now proceed to the cognitive test.'
              : `You need ${PASS_THRESHOLD}% to pass. Please review the material and try again.`}
          </p>

          {/* Score display */}
          <div className="bg-slate-900/60 rounded-xl p-4 mb-6">
            <div className="text-5xl font-display font-bold text-white mb-1">{score}%</div>
            <div className="text-slate-400 text-sm">
              {correct} correct out of {questions.length} questions
            </div>
          </div>

          <ProgressBar
            value={score}
            colorClass={passed ? 'bg-green-500' : 'bg-red-500'}
            showValue={false}
            size="lg"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300
                       hover:border-slate-400 hover:text-white transition font-body"
          >
            ↺ Retry Quiz
          </button>
          {passed && (
            <button
              onClick={onPass}
              className="flex-1 py-3 rounded-xl bg-neural-500 text-white font-bold
                         hover:bg-neural-600 transition shadow-neural font-body"
            >
              Continue →
            </button>
          )}
        </div>

        {/* Per-question review */}
        <div className="space-y-3">
          <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest">Review</h3>
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i + 1}
              total={questions.length}
              selected={answers[q.id]}
              onSelect={() => {}}
              showResult
              disabled
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Active Quiz ───────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-500">
          <span>Progress</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <ProgressBar
          value={Math.round(((currentIndex) / questions.length) * 100)}
          showValue={false}
          size="sm"
        />
      </div>

      {/* Question */}
      <QuestionCard
        question={currentQ}
        index={currentIndex + 1}
        total={questions.length}
        selected={selected}
        onSelect={handleSelect}
        showResult={false}
        disabled={false}
      />

      {/* Navigation */}
      <button
        onClick={handleNext}
        disabled={!selected}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-voxel
          ${selected
            ? 'bg-neural-500 text-white hover:bg-neural-600 cursor-pointer'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
      >
        {isLast ? 'Submit Quiz' : 'Next Question →'}
      </button>
    </div>
  );
};

export default Quiz;
