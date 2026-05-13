// ─── Test Page v3 ────────────────────────────────────────────────────────────
// Age-personalised test with: timer, smooth transitions, progress bar,
// answer highlighting, disabled next until answered, medical disclaimer.

import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { useApp }  from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getQuestionSetByAge } from '../data/questions';
import { analyseResultsAsync } from '../services/aiService';

const DOMAIN_ICONS = { memory: '🧠', attention: '🎯', language: '💬', orientation: '🧭' };

const DIFF_BADGE = {
  easy:   { label: 'Easy (Ages 10–25)',     cls: 'bg-green-500/20 text-green-400'   },
  medium: { label: 'Moderate (Ages 26–45)', cls: 'bg-yellow-500/20 text-yellow-400' },
  hard:   { label: 'Advanced (Ages 46+)',   cls: 'bg-red-500/20 text-red-400'       },
};

// Medical disclaimer banner
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

const Test = () => {
  const { user }         = useAuth();
  const { completeTest } = useApp();
  const navigate         = useNavigate();

  const { set: questions, difficulty, label: diffLabel } =
    useMemo(() => getQuestionSetByAge(user?.age || 30), [user?.age]);

  const [currentIndex, setCurrentIndex]   = useState(0);
  const [answers,      setAnswers]         = useState({});
  const [analysing,    setAnalysing]       = useState(false);
  const [animating,    setAnimating]       = useState(false);

  // Timer
  const startTimeRef = useRef(Date.now());
  const [elapsed,    setElapsed]           = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const currentQ = questions[currentIndex];
  const selected = answers[currentQ?.id] || null;
  const isLast   = currentIndex === questions.length - 1;
  const progress = Math.round(((currentIndex) / questions.length) * 100);
  const badge    = DIFF_BADGE[difficulty];

  const handleSelect = (option) => {
    if (animating) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: option }));
  };

  const advanceQuestion = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((i) => i + 1);
      setAnimating(false);
    }, 280);
  };

  const handleNext = () => {
    if (!selected || animating) return;
    if (!isLast) advanceQuestion();
  };

  const handleSubmit = async () => {
    if (!selected) return;
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setAnalysing(true);
    const evaluated = questions.map((q) => ({
      category:  q.category,
      isCorrect: answers[q.id] === q.correctAnswer,
    }));
    const result = await analyseResultsAsync(evaluated, difficulty, timeTaken);
    completeTest(result);
    setAnalysing(false);
    navigate('/results');
  };

  // ── AI Analysing Screen ────────────────────────────────────────────────────
  if (analysing) {
    return (
      <div className="neural-bg min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 page-enter px-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 border border-blue-500/30
                          flex items-center justify-center text-4xl animate-pulse-slow">🤖</div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">Analysing Results…</h2>
            <p className="text-slate-400 text-sm">Computing weighted scores and generating your personalised report</p>
          </div>
          <div className="flex justify-center gap-6 pt-2">
            {Object.entries(DOMAIN_ICONS).map(([d, icon]) => (
              <div key={d} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl animate-pulse">{icon}</span>
                <span className="text-xs font-mono text-slate-500 capitalize">{d}</span>
              </div>
            ))}
          </div>
          <div className="w-48 mx-auto h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // ── Active Test ────────────────────────────────────────────────────────────
  return (
    <div className="neural-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 page-enter">

        {/* Disclaimer */}
        <Disclaimer />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-1">Step 2 of 3</p>
            <h1 className="font-display text-3xl font-bold text-white">Cognitive Assessment</h1>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-xs px-2.5 py-1 rounded-lg font-mono mb-1 ${badge.cls}`}>
              {diffLabel}
            </div>
            <div className="text-slate-400 font-mono text-sm">{formatTime(elapsed)}</div>
          </div>
        </div>

        {/* Progress panel */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Question <span className="text-white font-bold">{currentIndex + 1}</span> of {questions.length}</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span>{DOMAIN_ICONS[currentQ?.category]}</span>
              <span className="capitalize">{currentQ?.category}</span>
            </span>
          </div>
          <ProgressBar value={progress} showValue={false} size="sm" colorClass="bg-blue-500" />

          {/* Domain counter pills */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            {Object.entries(DOMAIN_ICONS).map(([domain, icon]) => {
              const total    = questions.filter((q) => q.category === domain).length;
              const answered = questions.filter((q) => q.category === domain && answers[q.id]).length;
              const isCurrent = currentQ?.category === domain;
              return (
                <div key={domain}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-all
                    ${isCurrent ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700/50 text-slate-500'}`}>
                  <span>{icon}</span>
                  <span className="capitalize hidden sm:inline">{domain}</span>
                  <span className="font-bold">{answered}/{total}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question card */}
        <div className={`transition-all duration-280 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
          style={{ transform: animating ? 'translateX(16px)' : 'translateX(0)', opacity: animating ? 0 : 1, transition: 'opacity 0.28s ease, transform 0.28s ease' }}>
          <div className="bg-slate-800 rounded-xl shadow-lg p-6">

            {/* Domain tag + index */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500">Q{currentIndex + 1} / {questions.length}</span>
              {currentQ?.category && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono capitalize
                  ${currentQ.category === 'memory'      ? 'bg-purple-500/20 text-purple-300' : ''}
                  ${currentQ.category === 'attention'   ? 'bg-sky-500/20    text-sky-300'    : ''}
                  ${currentQ.category === 'language'    ? 'bg-green-500/20  text-green-300'  : ''}
                  ${currentQ.category === 'orientation' ? 'bg-orange-500/20 text-orange-300' : ''}`}>
                  {DOMAIN_ICONS[currentQ.category]} {currentQ.category}
                </span>
              )}
            </div>

            {/* Question text */}
            <p className="text-white text-base leading-relaxed mb-5 font-body">{currentQ?.question}</p>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ?.options.map((option) => {
                const isSelected = selected === option;
                return (
                  <button key={option} onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm
                                font-body transition-all duration-200
                      ${isSelected
                        ? 'border-blue-500 bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-500/10 scale-[1.01]'
                        : 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700/60 hover:scale-[1.005]'
                      }`}>
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
                        ${isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'}`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <button onClick={() => setCurrentIndex((i) => i - 1)}
              className="px-5 py-3 rounded-xl border border-slate-600 text-slate-300
                         hover:border-slate-400 hover:text-white text-sm transition">
              ← Back
            </button>
          )}
          {!isLast ? (
            <button onClick={handleNext} disabled={!selected}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all
                ${selected
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg cursor-pointer'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'}`}>
              Next Question →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!selected}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all
                ${selected
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg cursor-pointer'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'}`}>
              🤖 Submit for AI Analysis
            </button>
          )}
        </div>

        <p className="text-center text-xs text-slate-600">Select an answer to enable the next button.</p>

      </div>
    </div>
  );
};

export default Test;
