import { useState, useEffect, useActionState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

const EMPTY = {
  description: '', amount: '', category: 'Food',
  type: 'expense', date: new Date().toISOString().split('T')[0],
};

// React 19: useActionState for form submission handling
function validate(form) {
  const errors = {};
  if (!form.description.trim()) errors.description = 'Required';
  if (!form.amount || isNaN(form.amount) || +form.amount <= 0) errors.amount = 'Enter a valid amount';
  return errors;
}

export default function TransactionModal({ isOpen, onClose, editData }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(editData ? { ...editData, amount: String(editData.amount) } : EMPTY);
  }, [editData, isOpen]);

  // React 19: useActionState replaces manual loading/error state
  const [state, submitAction, isPending] = useActionState(
    async (_prevState, formData) => {
      const errors = validate(form);
      if (Object.keys(errors).length) return { errors };
      // Simulate async (e.g. API call) — React 19 actions are async-first
      await new Promise(r => setTimeout(r, 200));
      if (editData) editTransaction(editData.id, form);
      else addTransaction(form);
      onClose();
      return { errors: {} };
    },
    { errors: {} }
  );

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));
  const err = state?.errors || {};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl animate-fade-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-white text-lg">
              {editData ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            {/* React 19 badge */}
            <span className="text-xs text-emerald-500 font-medium">⚡ React 19 Action</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Form — React 19: <form action={submitAction}> */}
        <form action={submitAction} className="space-y-4">
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block font-medium">Description</label>
            <input
              type="text" value={form.description} onChange={set('description')}
              placeholder="e.g. Swiggy Order"
              className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-600 ${err.description ? 'border-rose-500' : 'border-slate-700'}`}
            />
            {err.description && <p className="text-rose-400 text-xs mt-1">{err.description}</p>}
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1.5 block font-medium">Amount (₹)</label>
            <input
              type="number" value={form.amount} onChange={set('amount')}
              placeholder="0.00" min="0"
              className={`w-full bg-slate-800 border rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-600 ${err.amount ? 'border-rose-500' : 'border-slate-700'}`}
            />
            {err.amount && <p className="text-rose-400 text-xs mt-1">{err.amount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block font-medium">Type</label>
              <select value={form.type} onChange={set('type')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block font-medium">Category</label>
              <select value={form.category} onChange={set('category')}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {Object.entries(CATEGORIES).map(([name, { icon }]) => (
                  <option key={name} value={name}>{icon} {name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1.5 block font-medium">Date</label>
            <input type="date" value={form.date} onChange={set('date')}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors cursor-pointer">
              Cancel
            </button>
            {/* React 19: isPending from useActionState */}
            <button type="submit" disabled={isPending}
              className="flex-1 py-2.5 rounded-lg bg-emerald-500 text-slate-900 text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-60 cursor-pointer">
              {isPending ? 'Saving…' : editData ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
