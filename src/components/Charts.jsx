import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { monthlyData, CATEGORIES } from '../data/mockData';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-300 font-medium mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: ₹{(p.value / 1000).toFixed(1)}K
        </p>
      ))}
    </div>
  );
};

export function BalanceTrendChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-full">
      <h3 className="font-display font-semibold text-white mb-1">Balance Trend</h3>
      <p className="text-slate-500 text-xs mb-4">Income vs Expenses — Last 7 months</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
            </linearGradient>
            <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={v => `₹${v / 1000}K`} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="income"   name="Income"   stroke="#10b981" strokeWidth={2} fill="url(#gIncome)"  />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#gExpense)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const RADIAN = Math.PI / 180;
const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * RADIAN)}
      y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={10} fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function SpendingPieChart() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const map = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: CATEGORIES[name]?.color || '#64748b' }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-full">
      <h3 className="font-display font-semibold text-white mb-1">Spending Breakdown</h3>
      <p className="text-slate-500 text-xs mb-4">By category — all time</p>
      {data.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-12">No expense data</p>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="value" labelLine={false} label={<PieLabel />}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {data.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="text-slate-400 text-xs flex-1 truncate">{item.name}</span>
                <span className="text-slate-300 text-xs font-medium">
                  ₹{(item.value / 1000).toFixed(1)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
