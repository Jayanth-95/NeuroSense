// ─── Contact Page v2 ─────────────────────────────────────────────────────────
// Smart contact: reads last result from AppContext to pre-fill urgency.

import ContactMentor from '../components/ContactMentor';
import { useAuth } from '../context/AuthContext';
import { useApp  } from '../context/AppContext';

const MENTOR_PROFILES = [
  { name: 'Dr. Anika Sharma',  role: 'Neurologist',            avatar: '👩‍⚕️', spec: 'Memory & cognitive decline' },
  { name: 'Prof. Rajan Mehta', role: 'Cognitive Psychologist', avatar: '👨‍🔬', spec: 'Attention & executive function' },
  { name: 'Dr. Priya Nair',    role: 'Geriatric Specialist',   avatar: '👩‍🏫', spec: 'Orientation & senior care' },
];

const Contact = () => {
  const { user }     = useAuth();
  const { progress } = useApp();
  const lastResult   = progress.lastResult;

  return (
    <div className="neural-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 page-enter">

        <div>
          <h1 className="font-display text-4xl font-bold text-white">Contact a Mentor</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">
            Our cognitive health specialists are here to help you interpret your results and plan next steps.
          </p>
        </div>

        {/* Mentor profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MENTOR_PROFILES.map((m) => (
            <div key={m.name} className="bg-slate-800 rounded-xl shadow-lg p-4 text-center hover:scale-105 transition">
              <div className="text-4xl mb-2">{m.avatar}</div>
              <p className="font-display font-bold text-white text-sm">{m.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{m.role}</p>
              <p className="text-slate-500 text-xs mt-1 italic">{m.spec}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-mono">Available</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 text-sm text-blue-300">
          <span>⏱</span>
          <span>Average response time: <strong>24–48 hours</strong> on business days.</span>
        </div>

        {/* Smart contact form — passes risk level if available */}
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-4">Send a Message</h2>
          <ContactMentor
            user={user}
            riskLevel={lastResult?.riskLevel}
            consultMessage={lastResult?.recommendation?.consultMessage}
          />
        </div>

        <p className="text-xs text-slate-600 text-center leading-relaxed">
          ⚠ Mentors provide general guidance only. This service does not replace professional clinical diagnosis.
        </p>

      </div>
    </div>
  );
};

export default Contact;
