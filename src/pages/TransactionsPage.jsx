import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import TransactionModal from '../components/TransactionModal';
import { Search, SlidersHorizontal, Plus, Pencil, Trash2, ArrowUpRight, ArrowDownLeft, Download } from 'lucide-react';

function exportCSV(txs) {
  const header = 'Date,Description,Category,Type,Amount\n';
  const rows   = txs.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join('\n');
  const blob   = new Blob([header + rows], { type: 'text/csv' });
  const a      = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob), download: 'finflow-transactions.csv',
  });
  a.click();
}

export default function TransactionsPage() {
  const { filteredTransactions, filters, setFilters, role, deleteTransaction } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editData,  setEditData]  = useState(null);

  const openAdd  = ()   => { setEditData(null); setModalOpen(true); };
  const openEdit = (tx) => { setEditData(tx);   setModalOpen(true); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-grey">Transactions</h1>
          <p className="text-slate-500 text-sm">{filteredTransactions.length} records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(filteredTransactions)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm hover:bg-slate-700 transition-colors cursor-pointer">
            <Download size={13} /> Export CSV
          </button>
          {role === 'admin' && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-lg text-slate-900 text-sm font-bold hover:bg-emerald-400 transition-colors cursor-pointer">
              <Plus size={14} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <label className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={13} className="text-slate-500 shrink-0" />
          <input
            type="text" placeholder="Search…" value={filters.search}
            onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
            className="bg-transparent text-white text-sm outline-none placeholder:text-slate-600 w-full"
          />
        </label>

        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={13} className="text-slate-500" />
          <select value={filters.category} onChange={e => setFilters(p => ({ ...p, category: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
            <option value="All">All Categories</option>
            {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <select value={filters.type} onChange={e => setFilters(p => ({ ...p, type: e.target.value }))}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
          <option value="All">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filters.sort} onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
          <option value="date-desc">Date: Newest</option>
          <option value="date-asc">Date: Oldest</option>
          <option value="amount-desc">Amount: High→Low</option>
          <option value="amount-asc">Amount: Low→High</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-400 font-medium">No transactions found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Transaction', 'Category', 'Date', 'Amount', role === 'admin' ? 'Actions' : ''].filter(Boolean).map(h => (
                    <th key={h} className={`px-4 py-3 text-slate-500 text-xs font-medium uppercase tracking-wider ${h === 'Amount' || h === 'Actions' ? 'text-right' : 'text-left'} ${h === 'Category' ? 'hidden sm:table-cell' : ''} ${h === 'Date' ? 'hidden md:table-cell' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => {
                  const cat = CATEGORIES[tx.category] || { color: '#64748b', icon: '💰' };
                  return (
                    <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                            style={{ background: cat.color + '22' }}>
                            {cat.icon}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{tx.description}</p>
                            <p className="text-slate-600 text-xs sm:hidden">{tx.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: cat.color + '22', color: cat.color }}>
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-400 text-sm">
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`flex items-center justify-end gap-1 text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'income' ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      {role === 'admin' && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(tx)}
                              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => deleteTransaction(tx.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editData={editData} />
    </div>
  );
}
