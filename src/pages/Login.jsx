// ─── Login Page ───────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();
  const location              = useLocation();

  // Redirect to the page the user tried to access, or Dashboard
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async ({ email, password }) => {
    setError('');
    setLoading(true);

    // Simulate slight async delay for realistic feel
    await new Promise((r) => setTimeout(r, 600));

    const result = loginUser({ email, password });
    setLoading(false);

    if (result.success) {
      login(result.user, result.token);
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="neural-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md page-enter">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                          bg-neural-500 shadow-neural mb-4">
            <span className="text-white text-2xl font-display font-bold">NS</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-body">
            Sign in to continue your cognitive assessment
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card p-8">
          <AuthForm mode="login" onSubmit={handleSubmit} error={error} loading={loading} />

          <div className="mt-6 text-center text-sm text-slate-400 font-body">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-neural-400 hover:text-neural-300 font-medium transition">
              Register here
            </Link>
          </div>
        </div>

        {/* Demo credentials hint */}
        <p className="text-center text-xs text-slate-600 mt-4 font-mono">
          First time? Create a free account above.
        </p>

      </div>
    </div>
  );
};

export default Login;
