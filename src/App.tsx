import { useCallback, useEffect, useState } from 'react';
import LoginScreen from '@/components/login/LoginScreen';
import TerminalApp from '@/components/terminal/TerminalApp';
import { endDemoSession, isDemoLoggedIn, startDemoSession } from '@/lib/demo-session';

const DASHBOARD_PATH = '/dashboard';

function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  }, []);

  const handleLogin = () => {
    startDemoSession();
    navigate(DASHBOARD_PATH);
  };

  const handleLogout = () => {
    endDemoSession();
    navigate('/');
  };

  if (path === DASHBOARD_PATH && isDemoLoggedIn()) {
    return <TerminalApp onLogout={handleLogout} />;
  }

  return <LoginScreen onLogin={handleLogin} />;
}

export default App;
