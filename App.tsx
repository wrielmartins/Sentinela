import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import {
  Dashboard,
  DayShift,
  NightShift,
  SwapList,
  Reports,
  Profile,
  Login
} from './pages';

// Inner App component to use the context
const AppContent: React.FC = () => {
  const { user, toggleSidebar } = useApp();

  if (!user) {
    return <Login />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
          {/* Mobile Header Trigger */}
          <div className="md:hidden flex items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111318] shrink-0">
            <button onClick={toggleSidebar} className="text-slate-500 hover:text-primary p-1">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="ml-3 font-bold text-lg">Gestão Policial</span>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/day-shift" element={<DayShift />} />
            <Route path="/night-shift" element={<NightShift />} />
            <Route path="/swaps" element={<SwapList />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

// Root component providing the context
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
