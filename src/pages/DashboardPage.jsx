import { useApp } from '../context/AppContext';
import SummaryCards from '../components/SummaryCards';
import { BalanceTrendChart, SpendingPieChart } from '../components/Charts';
import { CATEGORIES } from '../data/mockData';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function DashboardPage() {
  const { transactions } = useApp();

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
       
        <h1 className="font-display font-bold text-2xl text-grey">Overview</h1>
        <p className="text-slate-500 text-sm">Your financial snapshot</p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="animate-fade-up stagger-4"><BalanceTrendChart /></div>
        <div className="animate-fade-up stagger-5"><SpendingPieChart /></div>
      </div>

      {/* Recent Transactions */}
      <div className="animate-fade-up stagger-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-display font-semibold text-white mb-1">Recent Transactions</h3>
        <p className="text-slate-500 text-xs mb-4">Latest 5 activities</p>

        {recent.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-slate-500 text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recent.map(tx => {
              const cat = CATEGORIES[tx.category] || { color: '#64748b', icon: '💰' };
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: cat.color + '22' }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-slate-500 text-xs">
                      {tx.category} · {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
