// ─── Auth Form ────────────────────────────────────────────────────────────────
// Handles both login (email + password) and register (all fields).

import { useState } from 'react';

const GENDERS      = ['', 'Male', 'Female', 'Non-binary', 'Prefer not to say'];
const OCCUPATIONS  = ['', 'Student', 'Healthcare', 'Education', 'Engineering', 'Business', 'Retired', 'Other'];

const AuthForm = ({ mode, onSubmit, error, loading }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', gender: '', occupation: '',
  });

  const isRegister = mode === 'register';
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputCls =
    'w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm ' +
    'placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 ' +
    'focus:ring-blue-500/40 transition font-body';

  const labelCls = 'block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-widest';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      {/* Name — register only */}
      {isRegister && (
        <div>
          <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
          <input type="text" placeholder="Dr. Jane Smith" value={form.name}
            onChange={set('name')} required className={inputCls} />
        </div>
      )}

      {/* Email */}
      <div>
        <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
        <input type="email" placeholder="you@example.com" value={form.email}
          onChange={set('email')} required className={inputCls} />
      </div>

      {/* Password */}
      <div>
        <label className={labelCls}>Password <span className="text-red-400">*</span></label>
        <input type="password"
          placeholder={isRegister ? 'Create a strong password (min 6 chars)' : 'Enter your password'}
          value={form.password} onChange={set('password')} required minLength={6}
          className={inputCls} />
      </div>

      {/* Age — register only */}
      {isRegister && (
        <div>
          <label className={labelCls}>Age <span className="text-red-400">*</span></label>
          <input type="number" placeholder="e.g. 34" min="10" max="110"
            value={form.age} onChange={set('age')} required className={inputCls} />
          <p className="text-xs text-slate-600 mt-1 font-body">
            Age determines your personalised question difficulty.
          </p>
        </div>
      )}

      {/* Gender — register optional */}
      {isRegister && (
        <div>
          <label className={labelCls}>Gender <span className="text-slate-600">(optional)</span></label>
          <select value={form.gender} onChange={set('gender')} className={inputCls + ' cursor-pointer'}>
            {GENDERS.map((g) => <option key={g} value={g}>{g || '— Select —'}</option>)}
          </select>
        </div>
      )}

      {/* Occupation — register optional */}
      {isRegister && (
        <div>
          <label className={labelCls}>Occupation <span className="text-slate-600">(optional)</span></label>
          <select value={form.occupation} onChange={set('occupation')}
            className={inputCls + ' cursor-pointer'}>
            {OCCUPATIONS.map((o) => <option key={o} value={o}>{o || '— Select —'}</option>)}
          </select>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <span className="text-red-400">⚠</span>
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={loading}
        className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all
          ${loading
            ? 'bg-slate-600 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] active:scale-100'}`}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {isRegister ? 'Creating account...' : 'Signing in...'}
          </span>
        ) : (
          isRegister ? 'Create Account →' : 'Sign In →'
        )}
      </button>
    </form>
  );
};

export default AuthForm;
