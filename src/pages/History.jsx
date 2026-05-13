// ─── History Page ─────────────────────────────────────────────────────────────
// Shows all saved test results for the current user.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';
import { getUserHistory, deleteResult } from '../services/testService';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const { user }           = useAuth();
  const navigate           = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (user?.id) {
      setRecords(getUserHistory(user.id));
    }
  }, [user]);

  const handleDelete = (id) => {
    deleteResult(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="neural-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 page-enter">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-white">Test History</h1>
            <p className="text-slate-400 mt-1 font-body text-sm">
              {records.length} assessment{records.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-slate-600 text-slate-300 rounded-xl text-sm
                       hover:border-slate-400 hover:text-white transition"
          >
            ← Dashboard
          </button>
        </div>

        {/* ── Results list ── */}
        {records.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4">
            <div className="text-5xl">📋</div>
            <h2 className="font-display text-xl font-bold text-white">No assessments yet</h2>
            <p className="text-slate-400 text-sm font-body">
              Complete the full learning → quiz → test flow to generate your first result.
            </p>
            <button
              onClick={() => navigate('/learning')}
              className="px-6 py-3 bg-neural-500 text-white rounded-xl text-sm font-bold
                         hover:bg-neural-600 transition shadow-neural mt-2"
            >
              Start Now →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <ResultCard
                key={record.id}
                result={record}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* ── Summary stats (if records exist) ── */}
        {records.length > 1 && (
          <div className="glass-card p-6">
            <h2 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-4">
              Trend Summary
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display text-2xl font-bold text-white">
                  {Math.round(records.reduce((s, r) => s + r.score, 0) / records.length)}%
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">Avg Score</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white">
                  {Math.max(...records.map((r) => r.score))}%
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">Best Score</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-white">
                  {records.length}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">Total Tests</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default History;
