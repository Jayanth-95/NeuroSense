// ─── App Context ──────────────────────────────────────────────────────────────
// Tracks progress: Learning → Test → Results (quiz removed).

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext   = createContext(null);
const PROGRESS_KEY = 'neurosense_progress';

const defaultProgress = {
  learningComplete: false,
  testComplete:     false,
  lastResult:       null,
};

const loadProgress = () => {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || defaultProgress; }
  catch { return defaultProgress; }
};

export const AppProvider = ({ children }) => {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeLearning = useCallback(() =>
    setProgress((p) => ({ ...p, learningComplete: true })), []);

  const completeTest = useCallback((result) =>
    setProgress((p) => ({ ...p, testComplete: true, lastResult: result })), []);

  const resetProgress = useCallback(() =>
    setProgress(defaultProgress), []);

  return (
    <AppContext.Provider value={{ progress, completeLearning, completeTest, resetProgress }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside <AppProvider>');
  return ctx;
};

export default AppContext;
