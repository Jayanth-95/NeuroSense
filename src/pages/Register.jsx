// ─── Register Page ────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async ({ name, email, password, age, gender, occupation }) => {
    setError('');
    if (!name || name.trim().length < 2)
      return setError('Please enter your full name (at least 2 characters).');
    if (password.length < 6)
      return setError('Password must be at least 6 characters.');
    if (!age || Number(age) < 10 || Number(age) > 110)
      return setError('Please enter a valid age between 10 and 110.');

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = registerUser({ name: name.trim(), email, password, age, gender, occupation });
    setLoading(false);

    if (result.success) { login(result.user, result.token); navigate('/', { replace: true }); }
    else setError(result.message);
  };

  return (
    <div className="neural-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md page-enter">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-blue-500 shadow-lg mb-4">
            <span className="text-white text-2xl font-display font-bold">NS</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 text-sm mt-2">Join NeuroSense for AI-powered cognitive screening</p>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-lg p-8">
          <AuthForm mode="register" onSubmit={handleSubmit} error={error} loading={loading} />
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-slate-600 mt-4 leading-relaxed px-4">
          ⚠ Educational screening only — not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};

export default Register;
