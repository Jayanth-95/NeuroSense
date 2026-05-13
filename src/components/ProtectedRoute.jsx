// ─── Protected Route ──────────────────────────────────────────────────────────
// Guards routes behind auth + progress checks.
// 'test' requires learningComplete. Quiz gate removed.

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp }  from '../context/AppContext';

const ProtectedRoute = ({ children, requires }) => {
  const { isAuthenticated, loading } = useAuth();
  const { progress }                 = useApp();
  const location                     = useLocation();

  if (loading) {
    return (
      <div className="neural-bg min-h-screen flex items-center justify-center">
        <div className="text-blue-400 font-mono animate-pulse">Initialising…</div>
      </div>
    );
  }

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  // Must complete learning before accessing test
  if (requires === 'test' && !progress.learningComplete)
    return <Navigate to="/learning" replace />;

  return children;
};

export default ProtectedRoute;
