import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const fmt = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
};

const CARDS = [
  {
    key: 'balance', label: 'Total Balance',  icon: Wallet,
    gradient: 'from-emerald-500/20 to-cyan-500/10', border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400', textColor: 'text-emerald-400',
    sub: 'Net across all transactions',
  },
  {
    key: 'income', label: 'Total Income', icon: TrendingUp,
    gradient: 'from-blue-500/20 to-indigo-500/10', border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', textColor: 'text-blue-400',
    sub: 'Total earned',
  },
  {
    key: 'expenses', label: 'Total Expenses', icon: TrendingDown,
    gradient: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/20', iconColor: 'text-rose-400', textColor: 'text-rose-400',
    sub: 'Total spent',
  },
];

export default function SummaryCards() {
  const { stats } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARDS.map((c, i) => {
        const Icon = c.icon;
        const value = stats[c.key];
        return (
          <div
            key={c.key}
            className={`animate-fade-up stagger-${i + 1} relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${c.gradient} border ${c.border}`}
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 bg-white" />
            <div className="relative">
              <div className={`inline-flex p-2 rounded-lg ${c.iconBg} mb-3`}>
                <Icon size={18} className={c.iconColor} />
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{c.label}</p>
              <p className={`font-display font-bold text-2xl ${c.textColor}`}>{fmt(value)}</p>
              <p className="text-slate-500 text-xs mt-1">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
