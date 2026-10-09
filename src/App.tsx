import { useState } from 'react';
import Generator from './pages/Generator';
import Dashboard from './pages/Dashboard';

type Page = 'generator' | 'dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('generator');

  if (page === 'dashboard') {
    return <Dashboard onBack={() => setPage('generator')} />;
  }

  return <Generator onNavigateDashboard={() => setPage('dashboard')} />;
}
