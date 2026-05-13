// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Router setup. Quiz route removed. Profile and Contact added.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider }  from './context/AppContext';
import ProtectedRoute   from './components/ProtectedRoute';
import Navbar           from './components/Navbar';

// Pages
import Home     from './pages/Home';
import Login    from './pages/Login';
import Register from './pages/Register';
import Learning from './pages/Learning';
import Test     from './pages/Test';
import Results  from './pages/Results';
import History  from './pages/History';
import Profile  from './pages/Profile';
import Contact  from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            <Route path="/learning"
              element={<ProtectedRoute><Learning /></ProtectedRoute>} />

            <Route path="/test"
              element={<ProtectedRoute requires="test"><Test /></ProtectedRoute>} />

            <Route path="/results"
              element={<ProtectedRoute><Results /></ProtectedRoute>} />

            <Route path="/history"
              element={<ProtectedRoute><History /></ProtectedRoute>} />

            <Route path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/contact"
              element={<ProtectedRoute><Contact /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
