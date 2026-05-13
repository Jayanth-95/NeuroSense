// ─── ContactMentor v2 ─────────────────────────────────────────────────────────
// Smart contact form: pre-fills subject based on risk level, shows urgency banner.

import { useState } from 'react';

const SUBJECTS = [
  '',
  'Understanding my test results',
  'High-risk follow-up consultation',
  'Scheduling a specialist appointment',
  'Dementia prevention advice',
  'Care planning for a family member',
  'Cognitive exercises and training',
  'Technical support',
  'Other',
];

const MESSAGES_KEY = 'neurosense_mentor_messages';

const saveMessage = (msg) => {
  const existing = (() => { try { return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || []; } catch { return []; } })();
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([
    { id: `msg_${Date.now()}`, ...msg, timestamp: new Date().toISOString() }, ...existing,
  ]));
};

// Map risk level to suggested default subject
const RISK_SUBJECT_MAP = {
  'High Risk':     'High-risk follow-up consultation',
  'Moderate Risk': 'Understanding my test results',
  'Low Risk':      'Dementia prevention advice',
};

// Urgency banner config
const URGENCY_CONFIG = {
  'High Risk':     { cls: 'bg-red-500/10 border-red-500/30 text-red-300',       icon: '🚨', label: 'Urgent' },
  'Moderate Risk': { cls: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300', icon: '💡', label: 'Suggested' },
  'Low Risk':      { cls: 'bg-green-500/10 border-green-500/30 text-green-300',  icon: '💬', label: 'Optional' },
};

/**
 * @param {object} props
 * @param {object} props.user      - Current user
 * @param {string} [props.riskLevel] - Pre-fill subject based on result
 * @param {string} [props.consultMessage] - Custom message from AI result
 */
const ContactMentor = ({ user, riskLevel, consultMessage }) => {
  const defaultSubject = RISK_SUBJECT_MAP[riskLevel] || '';
  const urgency        = riskLevel ? (URGENCY_CONFIG[riskLevel] || null) : null;

  const [form, setForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    subject: defaultSubject,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.subject) return setError('Please select a subject.');
    if (form.message.trim().length < 20) return setError('Message must be at least 20 characters.');

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    saveMessage({ ...form, riskLevel: riskLevel || 'N/A' });
    setLoading(false);
    setSubmitted(true);
  };

  const inputCls = 'w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition';
  const lblCls   = 'block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-widest';

  if (submitted) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 text-center space-y-4 animate-fade-up">
        <div className="text-5xl">✅</div>
        <h3 className="font-display text-xl font-bold text-white">Message Sent!</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Thank you, <strong className="text-white">{form.name}</strong>. A specialist will
          respond to <strong className="text-blue-400">{form.email}</strong> within 24–48 hours.
        </p>
        <button onClick={() => setSubmitted(false)}
          className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-xl text-sm hover:border-slate-400 hover:text-white transition">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Urgency banner */}
      {urgency && (
        <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${urgency.cls}`}>
          <span className="text-lg flex-shrink-0">{urgency.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-mono font-bold uppercase">{urgency.label}</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {consultMessage || `Based on your ${riskLevel} assessment, we recommend consulting a specialist.`}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl shadow-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lblCls}>Your Name</label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="Full name" required className={inputCls} />
          </div>
          <div>
            <label className={lblCls}>Email Address</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required className={inputCls} />
          </div>
        </div>

        <div>
          <label className={lblCls}>Subject <span className="text-red-400">*</span></label>
          <select value={form.subject} onChange={set('subject')} required className={inputCls + ' cursor-pointer'}>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s || '— Select a subject —'}</option>)}
          </select>
        </div>

        <div>
          <label className={lblCls}>Message <span className="text-red-400">*</span></label>
          <textarea value={form.message} onChange={set('message')} rows={5}
            placeholder="Describe your question or concern in detail (min. 20 characters)…"
            required className={inputCls + ' resize-none'} />
          <p className="text-xs text-slate-600 mt-1">{form.message.length} characters</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">⚠ {error}</div>
        )}

        <button type="submit" disabled={loading}
          className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all
            ${loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 hover:scale-[1.01]'}`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </span>
          ) : 'Send Message →'}
        </button>
      </form>
    </div>
  );
};

export default ContactMentor;
