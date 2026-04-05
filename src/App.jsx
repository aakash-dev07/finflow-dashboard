import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import DashboardPage    from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage     from './pages/InsightsPage';

const PAGES = {
  dashboard:    <DashboardPage />,
  transactions: <TransactionsPage />,
  insights:     <InsightsPage />,
};

function AppContent() {
  const { activeTab, darkMode } = useApp();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <div className="flex min-h-screen">

        {/* Sidebar — desktop only */}
        <div className="hidden md:flex sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">

          {/* Mobile header */}
          <div className={`md:hidden flex items-center justify-between px-4 py-4 border-b sticky top-0 z-30 transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xs font-display">₹</span>
              </div>
              <span className={`font-display font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>FinFlow</span>
            </div>
            <span className="text-xs text-emerald-500 font-medium">React 19 ⚡ Vite</span>
          </div>

          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {PAGES[activeTab]}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
