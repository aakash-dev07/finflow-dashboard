import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, monthlyData } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, AlertTriangle, CheckCircle, Target } from 'lucide-react';

const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;

const COLOR = {
  emerald: { bg:'bg-emerald-500/10', border:'border-emerald-500/20', text:'text-emerald-400', badge:'bg-emerald-500/20 text-emerald-400' },
  amber:   { bg:'bg-amber-500/10',   border:'border-amber-500/20',   text:'text-amber-400',   badge:'bg-amber-500/20 text-amber-400'   },
  rose:    { bg:'bg-rose-500/10',    border:'border-rose-500/20',    text:'text-rose-400',    badge:'bg-rose-500/20 text-rose-400'    },
  orange:  { bg:'bg-orange-500/10',  border:'border-orange-500/20',  text:'text-orange-400',  badge:'bg-orange-500/20 text-orange-400'  },
  violet:  { bg:'bg-violet-500/10',  border:'border-violet-500/20',  text:'text-violet-400',  badge:'bg-violet-500/20 text-violet-400'  },
};

const BarTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const cat = CATEGORIES[d.payload.name];
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-300 font-medium">{cat?.icon} {d.payload.name}</p>
      <p style={{ color: d.payload.color }} className="font-bold mt-1">₹{d.value.toLocaleString('en-IN')}</p>
    </div>
  );
};

const MonthTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{color:p.color}}>{p.name}: ₹{(p.value/1000).toFixed(1)}K</p>)}
    </div>
  );
};

export default function InsightsPage() {
  const { transactions } = useApp();

  const ins = useMemo(() => {
    const catSpend = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catSpend[t.category] = (catSpend[t.category] || 0) + t.amount;
    });
    const catEntries = Object.entries(catSpend).sort((a,b) => b[1]-a[1]);
    const topCat = catEntries[0];

    const byMonth = (y, m) => transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear()===y && d.getMonth()+1===m;
    });
    const aprExp = byMonth(2026,4).filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const marExp = byMonth(2026,3).filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const diff   = aprExp - marExp;
    const pct    = marExp ? ((diff/marExp)*100).toFixed(1) : 0;

    const income   = transactions.filter(t=>t.type==='income') .reduce((s,t)=>s+t.amount,0);
    const expenses = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const savings  = income ? (((income-expenses)/income)*100).toFixed(1) : 0;
    const days     = new Set(transactions.filter(t=>t.type==='expense').map(t=>t.date)).size;
    const avgDaily = days ? (expenses/days).toFixed(0) : 0;

    return { catEntries, topCat, aprExp, marExp, diff, pct, savings, avgDaily, income, expenses };
  }, [transactions]);

  const cards = [
    { icon: Target,      label:'Savings Rate',   value:`${ins.savings}%`,
      sub:`${fmt(ins.income-ins.expenses)} saved of ${fmt(ins.income)}`,
      color: +ins.savings>=20?'emerald': +ins.savings>=10?'amber':'rose',
      status: +ins.savings>=20?'Excellent': +ins.savings>=10?'Moderate':'Low' },
    { icon: Zap,         label:'Top Spending',   value: ins.topCat?ins.topCat[0]:'—',
      sub: ins.topCat?`${fmt(ins.topCat[1])} total ${CATEGORIES[ins.topCat[0]]?.icon}`:'No data',
      color:'orange', status:'Highest category' },
    { icon: ins.diff>0?TrendingUp:TrendingDown, label:'Month vs Last',
      value:`${ins.diff>=0?'+':''}${ins.pct}%`,
      sub:`Apr: ${fmt(ins.aprExp)} vs Mar: ${fmt(ins.marExp)}`,
      color: ins.diff>0?'rose':'emerald', status: ins.diff>0?'Spending up':'Spending down' },
    { icon: AlertTriangle, label:'Daily Avg Spend', value:`₹${Number(ins.avgDaily).toLocaleString('en-IN')}`,
      sub:'Average per active spending day', color:'violet', status:'All time' },
  ];

  const barData = ins.catEntries.slice(0,6).map(([name,value])=>({
    name, value, color: CATEGORIES[name]?.color||'#64748b',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-grey">Insights</h1>
        <p className="text-slate-500 text-sm">Smart observations from your spending</p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c,i) => {
          const cl = COLOR[c.color];
          const Icon = c.icon;
          return (
            <div key={c.label} className={`animate-fade-up stagger-${i+1} rounded-xl p-5 border ${cl.bg} ${cl.border}`}>
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className={cl.text} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cl.badge}`}>{c.status}</span>
              </div>
              <p className="text-slate-400 text-xs mb-1 font-medium uppercase tracking-wider">{c.label}</p>
              <p className={`font-display font-bold text-2xl ${cl.text}`}>{c.value}</p>
              <p className="text-slate-500 text-xs mt-1">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Category Bar */}
      <div className="animate-fade-up stagger-5 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-display font-semibold text-white mb-1">Spending by Category</h3>
        <p className="text-slate-500 text-xs mb-4">Top 6 categories</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{top:5,right:10,bottom:5,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
            <XAxis dataKey="name" tick={{fill:'#64748b',fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'#64748b',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`}/>
            <Tooltip cursor={{fill:'#1e293b'}} content={<BarTip/>}/>
            <Bar dataKey="value" radius={[6,6,0,0]}>
              {barData.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Comparison */}
      <div className="animate-fade-up stagger-6 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="font-display font-semibold text-white mb-1">Monthly Income vs Expenses</h3>
        <p className="text-slate-500 text-xs mb-4">6-month comparison</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} margin={{top:5,right:10,bottom:0,left:0}} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:'#64748b',fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'#64748b',fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`}/>
            <Tooltip cursor={{fill:'#1e293b'}} content={<MonthTip/>}/>
            <Bar dataKey="income"   name="Income"   fill="#10b981" radius={[4,4,0,0]}/>
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500"/><span className="text-slate-400 text-xs">Income</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-rose-500"/><span className="text-slate-400 text-xs">Expenses</span></div>
        </div>
      </div>

      {/* Tip */}
      <div className="animate-fade-up bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5"/>
        <div>
          <p className="text-emerald-400 font-semibold text-sm">Financial Health Tip</p>
          <p className="text-slate-400 text-sm mt-0.5">
            {+ins.savings >= 20
              ? `Great job! You're saving ${ins.savings}% of your income. Consider investing the surplus in diversified mutual funds or index funds.`
              : `Try to save at least 20% of your income. Your current savings rate is ${ins.savings}%. Cutting down on ${ins.topCat?.[0]} expenses could help.`}
          </p>
        </div>
      </div>
    </div>
  );
}
