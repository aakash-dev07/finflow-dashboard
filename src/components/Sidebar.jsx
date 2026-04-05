import { useApp } from '../context/AppContext';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Sun, Moon, ShieldCheck, Eye, RotateCcw } from 'lucide-react';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight   },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb        },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, darkMode, setDarkMode, role, setRole, resetData } = useApp();

  const dark = darkMode;

  return (
    <aside className={`w-64 shrink-0 flex flex-col min-h-screen transition-colors duration-300 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-r`}>

      {/* Logo */}
      <div className={`px-6 py-6 border-b ${dark ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <span className="text-slate-900 font-bold text-sm font-display">₹</span>
          </div>
          <span className={`font-display font-bold text-lg tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>FinFlow</span>
        </div>
        <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Personal Finance Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                : dark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className={`px-4 py-4 border-t space-y-3 ${dark ? 'border-slate-800' : 'border-gray-200'}`}>

        {/* Role switcher */}
        <p className={`text-xs px-1 uppercase tracking-wider font-medium ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Role</p>
        <div className={`rounded-lg p-1 flex gap-1 ${dark ? 'bg-slate-800' : 'bg-gray-100'}`}>
          {['admin', 'viewer'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                role === r
                  ? r === 'admin' ? 'bg-emerald-500 text-slate-900' : dark ? 'bg-slate-600 text-white' : 'bg-slate-700 text-white'
                  : dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r === 'admin' ? <ShieldCheck size={11} /> : <Eye size={11} />}
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <p className={`text-xs text-center ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          {role === 'admin' ? '✏️ Can add / edit / delete' : '👁️ View only mode'}
        </p>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!dark)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
            dark
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100'
          }`}
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Reset */}
        <button
          onClick={resetData}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
            dark
              ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-500/10'
              : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          <RotateCcw size={13} /> Reset Demo Data
        </button>
      </div>
    </aside>
  );
}
