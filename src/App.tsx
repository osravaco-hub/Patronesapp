import { useState } from 'react';

type Page = 'landing' | 'generator' | 'dashboard';

// Lazy imports to avoid circular dependencies
import NewLanding from './pages/NewLanding';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('landing');

  if (page === 'generator') {
    return <Landing onNavigateDashboard={() => setPage('dashboard')} />;
  }

  if (page === 'dashboard') {
    return <Dashboard onBack={() => setPage('landing')} />;
  }

  return (
    <NewLanding
      onNavigateGenerator={() => setPage('generator')}
      onNavigateDashboard={() => setPage('dashboard')}
    />
  );
}
