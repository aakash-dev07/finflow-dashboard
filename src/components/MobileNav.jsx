import { useApp } from '../context/AppContext';
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb       },
];

export default function MobileNav() {
  const { activeTab, setActiveTab } = useApp();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex md:hidden z-40">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors cursor-pointer ${
            activeTab === id ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </nav>
  );
}
