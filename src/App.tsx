import { useState } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

type Page = 'landing' | 'dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('landing');

  if (page === 'dashboard') {
    return <Dashboard onBack={() => setPage('landing')} />;
  }

  return <Landing onNavigateDashboard={() => setPage('dashboard')} />;
}
