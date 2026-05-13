// ─── Navbar ───────────────────────────────────────────────────────────────────
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',        label: 'Dashboard' },
  { to: '/profile', label: 'Profile'   },
  { to: '/contact', label: 'Contact Mentor' },
  { to: '/history', label: 'History'   },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center
                          shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white text-sm font-bold font-mono">NS</span>
          </div>
          <span className="font-display font-bold text-lg text-white">
            Neuro<span className="text-blue-400">Sense</span>
          </span>
        </Link>

        {/* Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${active
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* User controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:block text-slate-400 text-sm font-mono truncate max-w-[120px]">
                {user.name}
              </span>
              <button onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm text-slate-400 border border-slate-700
                           hover:border-red-500/50 hover:text-red-400 transition">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white transition">
                Login
              </Link>
              <Link to="/register"
                className="px-3 py-1.5 rounded-lg text-sm bg-blue-500 text-white
                           hover:bg-blue-600 transition shadow-lg">
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
