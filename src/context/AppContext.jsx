import { createContext, use, useState, useEffect, useMemo, useCallback } from 'react';
import { initialTransactions } from '../data/mockData';

// React 19: createContext stays same but we use `use()` hook instead of useContext()
const AppContext = createContext(null);

const STORAGE_KEY = 'finflow_v2_data';

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [role, setRole]         = useState('admin');   // 'admin' | 'viewer'
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters]   = useState({
    search: '', category: 'All', type: 'All', sort: 'date-desc',
  });

  // Persist transactions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Dark mode class on <html>
  useEffect(() => {
    const html = document.documentElement; if (darkMode) { html.classList.add('dark'); } else { html.classList.remove('dark'); }
  }, [darkMode]);

  // ── CRUD (useCallback = React 19 best practice for stable refs) ──
  const addTransaction = useCallback((tx) => {
    setTransactions(prev => [
      { ...tx, id: crypto.randomUUID(), amount: parseFloat(tx.amount) },
      ...prev,
    ]);
  }, []);

  const editTransaction = useCallback((id, updated) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updated, amount: parseFloat(updated.amount) } : t)
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const resetData = useCallback(() => setTransactions(initialTransactions), []);

  // ── Derived: filtered + sorted list ──
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'All') result = result.filter(t => t.category === filters.category);
    if (filters.type !== 'All')     result = result.filter(t => t.type === filters.type);

    result.sort((a, b) => {
      switch (filters.sort) {
        case 'date-desc':   return new Date(b.date) - new Date(a.date);
        case 'date-asc':    return new Date(a.date) - new Date(b.date);
        case 'amount-desc': return b.amount - a.amount;
        case 'amount-asc':  return a.amount - b.amount;
        default:            return 0;
      }
    });
    return result;
  }, [transactions, filters]);

  // ── Derived: summary stats ──
  const stats = useMemo(() => {
    const income   = transactions.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const value = {
    transactions, filteredTransactions,
    addTransaction, editTransaction, deleteTransaction, resetData,
    role, setRole,
    darkMode, setDarkMode,
    filters, setFilters,
    activeTab, setActiveTab,
    stats,
  };

  return <AppContext value={value}>{children}</AppContext>;
  // React 19: <AppContext value={...}> directly — no more <AppContext.Provider>!
}

// React 19: use() hook instead of useContext()
export const useApp = () => use(AppContext);
