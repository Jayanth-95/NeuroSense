// ─── Dashboard v3 ─────────────────────────────────────────────────────────────
// Enhanced: last score, risk level, quick actions, disclaimer strip.

import { useNavigate } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext';
import { useApp }   from '../context/AppContext';
import ProgressBar  from './ProgressBar';
import { getQuestionSetByAge } from '../data/questions';

const STEPS = [
  { key: 'learning', label: 'Learning Module', icon: '📚', route: '/learning', desc: 'Study 4 cognitive domains' },
  { key: 'test',     label: 'Cognitive Test',  icon: '🧠', route: '/test',     desc: 'Age-personalised 15-question assessment' },
  { key: 'results',  label: 'AI Analysis',     icon: '🤖', route: '/results',  desc: 'Weighted risk scoring & report' },
];

const RISK_CLS = {
  'Low Risk':      { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
  'Moderate Risk': { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  'High Risk':     { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
};

const DIFF_CLS  = { easy: 'text-green-400', medium: 'text-yellow-400', hard: 'text-red-400' };

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { progress, resetProgress } = useApp();
  const navigate = useNavigate();

  const { difficulty, label: diffLabel } = getQuestionSetByAge(user?.age || 30);
  const lastResult = progress.lastResult;
  const riskStyle  = lastResult ? (RISK_CLS[lastResult.riskLevel] || RISK_CLS['High Risk']) : null;

  const completedSteps = [progress.learningComplete, progress.testComplete, progress.testComplete].filter(Boolean).length;
  const overallPct     = Math.round((completedSteps / 3) * 100);

  const getStatus = (key) => {
    if (key === 'learning') return progress.learningComplete ? 'done'   : 'active';
    if (key === 'test')     return progress.testComplete     ? 'done'   : progress.learningComplete ? 'active' : 'locked';
    if (key === 'results')  return progress.testComplete     ? 'active' : 'locked';
    return 'locked';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 page-enter space-y-6">

      {/* Disclaimer strip */}
      <div className="flex gap-2 bg-yellow-500/8 border border-yellow-500/25 rounded-xl px-4 py-2.5">
        <span className="text-yellow-400 text-xs mt-0.5 flex-shrink-0">⚕</span>
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="text-yellow-400 font-semibold">Disclaimer: </span>
          This system provides a preliminary cognitive assessment and is not a medical diagnosis.
          Please consult a healthcare professional for accurate evaluation.
        </p>
      </div>

      {/* Welcome card */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-blue-400 font-mono text-sm mb-1">Welcome back,</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{user?.name} 👋</h1>
            <p className="text-slate-400 text-sm mt-1">
              Age {user?.age || '—'} ·{' '}
              <span className={DIFF_CLS[difficulty]}>{diffLabel} questions</span>
            </p>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="px-4 py-2 border border-slate-600 text-slate-400 rounded-xl text-sm
                       hover:border-red-500/40 hover:text-red-400 transition">
            Logout
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-500">
            <span>Progress</span><span>{completedSteps} / 3 steps complete</span>
          </div>
          <ProgressBar value={overallPct} showValue colorClass="bg-blue-500" />
        </div>
      </div>

      {/* Last result (if available) */}
      {lastResult && (
        <div className={`bg-slate-800 rounded-xl shadow-lg p-5 border ${riskStyle.border}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest">Latest Assessment</h3>
            <button onClick={() => navigate('/results')}
              className="text-xs text-blue-400 hover:text-blue-300 transition font-mono">
              Full report →
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`font-display text-4xl font-bold ${riskStyle.text}`}>{lastResult.score}%</div>
              <div className="text-xs text-slate-500 font-mono">Score</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-white">{lastResult.confidence}%</div>
              <div className="text-xs text-slate-500 font-mono">Confidence</div>
            </div>
            <div className="flex-1">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono
                               mb-1 ${riskStyle.bg} border ${riskStyle.border}`}>
                <span className={riskStyle.text}>●</span>
                <span className={riskStyle.text}>{lastResult.riskLevel}</span>
              </div>
              <ProgressBar value={lastResult.score} showValue={false} size="sm"
                colorClass={lastResult.riskLevel === 'Low Risk' ? 'bg-green-500' : lastResult.riskLevel === 'Moderate Risk' ? 'bg-yellow-500' : 'bg-red-500'} />
              {lastResult.responseSpeed && (
                <p className="text-xs text-slate-500 mt-1">
                  Response Speed: <span className={lastResult.responseSpeed.cls || 'text-white'}>{lastResult.responseSpeed.label}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Journey steps */}
      <div>
        <h2 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-3">Your Journey</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((step, i) => {
            const status   = getStatus(step.key);
            const isDone   = status === 'done';
            const isActive = status === 'active';
            const isLocked = status === 'locked';
            return (
              <button key={step.key} disabled={isLocked}
                onClick={() => !isLocked && navigate(step.route)}
                className={`bg-slate-800 rounded-xl shadow-lg p-5 text-left transition-all
                  ${isDone   ? 'border border-green-500/30 hover:border-green-500/50' : ''}
                  ${isActive ? 'border border-blue-500/40 hover:border-blue-500' : ''}
                  ${isLocked ? 'opacity-40 cursor-not-allowed border border-slate-700' : 'cursor-pointer hover:scale-105'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3
                  ${isDone ? 'bg-green-500/15' : isActive ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
                  {isDone ? '✅' : step.icon}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-slate-500">Step {i + 1}</span>
                  {isActive && <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-mono">Next</span>}
                  {isDone   && <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded font-mono">Done</span>}
                  {isLocked && <span className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-500 rounded font-mono">🔒</span>}
                </div>
                <h3 className="font-display font-bold text-white text-sm">{step.label}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{step.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate(progress.learningComplete ? '/test' : '/learning')}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition shadow-lg">
          {progress.testComplete ? '🔄 Retake Test' : progress.learningComplete ? '🧠 Start Test' : '📚 Start Learning'}
        </button>
        <button onClick={() => navigate('/profile')}
          className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:border-blue-500/40 hover:text-blue-400 transition">
          👤 View Profile
        </button>
        <button onClick={() => navigate('/contact')}
          className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:border-blue-500/40 hover:text-blue-400 transition">
          📩 Contact Mentor
        </button>
        <button onClick={() => navigate('/history')}
          className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:border-slate-400 hover:text-white transition">
          📜 View History
        </button>
        {progress.testComplete && (
          <button onClick={resetProgress}
            className="px-5 py-2.5 border border-yellow-500/40 text-yellow-400 rounded-xl text-sm hover:bg-yellow-500/10 transition">
            ↺ Reset & Retry
          </button>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
