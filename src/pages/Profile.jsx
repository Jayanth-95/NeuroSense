// ─── Profile Page v2 ─────────────────────────────────────────────────────────
// Shows user info, test difficulty, cognitive trend (last 3 scores), edit form.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }   from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';
import { getQuestionSetByAge } from '../data/questions';
import { getRecentScores, computeTrend, formatDate } from '../services/testService';
import ProgressBar from '../components/ProgressBar';

const GENDERS     = ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say'];
const OCCUPATIONS = ['', 'Student', 'Healthcare', 'Education', 'Engineering', 'Business', 'Retired', 'Other'];
const DIFF_INFO   = {
  easy:   { label: 'Easy',     cls: 'text-green-400',  ring: 'ring-green-500/30',  desc: 'Ages 10–25 · ×0.8 multiplier' },
  medium: { label: 'Moderate', cls: 'text-yellow-400', ring: 'ring-yellow-500/30', desc: 'Ages 26–45 · ×1.0 multiplier' },
  hard:   { label: 'Advanced', cls: 'text-red-400',    ring: 'ring-red-500/30',    desc: 'Ages 46+   · ×1.2 multiplier' },
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [trend,   setTrend]   = useState(null);
  const [scores,  setScores]  = useState([]);

  const [form, setForm] = useState({
    age:        user?.age        || '',
    gender:     user?.gender     || '',
    occupation: user?.occupation || '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { difficulty } = getQuestionSetByAge(user?.age || 30);
  const diffInfo = DIFF_INFO[difficulty];

  useEffect(() => {
    if (user?.id) {
      const recent = getRecentScores(user.id, 3);
      setScores(recent);
      setTrend(computeTrend(recent));
    }
  }, [user?.id]);

  const handleSave = () => {
    setError('');
    if (!form.age || Number(form.age) < 10 || Number(form.age) > 110)
      return setError('Please enter a valid age between 10 and 110.');

    const result = updateUserProfile(user.id, {
      age:        Number(form.age),
      gender:     form.gender,
      occupation: form.occupation,
    });
    if (result.success) {
      updateUser(result.user);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } else setError(result.message);
  };

  const inputCls = 'w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition';
  const lblCls   = 'block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-widest';

  return (
    <div className="neural-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 page-enter">

        {/* Header */}
        <div>
          <h1 className="font-display text-4xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 text-sm mt-1">Your account details and cognitive test settings.</p>
        </div>

        {/* Avatar + basic info */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center
                           text-3xl font-display font-bold text-blue-400
                           bg-blue-500/15 ring-2 ${diffInfo.ring} flex-shrink-0`}>
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 text-sm font-mono">{user?.email}</p>
            {user?.createdAt && (
              <p className="text-slate-500 text-xs mt-0.5">
                Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {/* Test difficulty */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Test Difficulty</p>
          <div className="flex items-center justify-between">
            <div>
              <span className={`font-display text-2xl font-bold ${diffInfo.cls}`}>{diffInfo.label}</span>
              <p className="text-slate-500 text-xs mt-1">{diffInfo.desc}</p>
            </div>
            <button onClick={() => navigate('/test')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition">
              Take Test →
            </button>
          </div>
        </div>

        {/* Cognitive Trend */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-5">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Cognitive Trend</p>
          {scores.length < 2 ? (
            <p className="text-slate-500 text-sm">Complete at least 2 tests to see your trend.</p>
          ) : (
            <div className="space-y-3">
              {trend && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{trend.icon}</span>
                  <div>
                    <span className={`font-display text-xl font-bold ${trend.cls}`}>{trend.label}</span>
                    <p className="text-slate-400 text-xs mt-0.5">{trend.desc}</p>
                  </div>
                </div>
              )}
              {/* Mini score timeline */}
              <div className="space-y-2 pt-1">
                {scores.map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-500">
                      <span>{i === 0 ? 'Latest' : i === 1 ? 'Previous' : '2 Tests Ago'}</span>
                      <span className="text-white">{s}%</span>
                    </div>
                    <ProgressBar value={s} showValue={false} size="sm"
                      colorClass={s >= 80 ? 'bg-green-500' : s >= 50 ? 'bg-yellow-500' : 'bg-red-500'} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Editable personal details */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white">Personal Details</h3>
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="px-3 py-1.5 text-xs border border-slate-600 text-slate-300
                           hover:border-blue-500 hover:text-blue-400 rounded-lg transition">
                ✏ Edit
              </button>
            )}
          </div>

          {/* Read-only */}
          <div className="grid grid-cols-2 gap-4">
            <div><p className={lblCls}>Name</p><p className="text-white text-sm">{user?.name || '—'}</p></div>
            <div><p className={lblCls}>Email</p><p className="text-white text-sm break-all">{user?.email || '—'}</p></div>
          </div>

          {editing ? (
            <div className="space-y-4 pt-2 border-t border-slate-700">
              <div>
                <label className={lblCls}>Age <span className="text-red-400">*</span></label>
                <input type="number" min="10" max="110" value={form.age}
                  onChange={set('age')} className={inputCls} />
                <p className="text-xs text-slate-600 mt-1">
                  Changing age will update your test difficulty for future tests.
                </p>
              </div>
              <div>
                <label className={lblCls}>Gender</label>
                <select value={form.gender} onChange={set('gender')} className={inputCls + ' cursor-pointer'}>
                  {GENDERS.map((g) => <option key={g} value={g}>{g || '— Select —'}</option>)}
                </select>
              </div>
              <div>
                <label className={lblCls}>Occupation</label>
                <select value={form.occupation} onChange={set('occupation')} className={inputCls + ' cursor-pointer'}>
                  {OCCUPATIONS.map((o) => <option key={o} value={o}>{o || '— Select —'}</option>)}
                </select>
              </div>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">⚠ {error}</div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave}
                  className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition">
                  Save Changes
                </button>
                <button onClick={() => { setEditing(false); setError(''); }}
                  className="flex-1 py-2.5 border border-slate-600 text-slate-300 text-sm hover:border-slate-400 rounded-xl transition">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-700">
              <div><p className={lblCls}>Age</p><p className="text-white text-sm">{user?.age || '—'}</p></div>
              <div><p className={lblCls}>Gender</p><p className="text-white text-sm">{user?.gender || '—'}</p></div>
              <div><p className={lblCls}>Occupation</p><p className="text-white text-sm">{user?.occupation || '—'}</p></div>
            </div>
          )}
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/40
                          rounded-xl px-4 py-3 text-green-300 text-sm animate-fade-up">
            ✅ Profile updated! Your next test will reflect the new difficulty level.
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
