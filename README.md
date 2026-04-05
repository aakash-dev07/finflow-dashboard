# FinFlow — Finance Dashboard

> Built with **React 19** + **Vite** + **Tailwind CSS v4**

## Setup & Run

```bash
npm install
npm run dev      # dev server — http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

---

## React 19 Features Used

| Feature | Where Used |
|---|---|
| `use()` hook | `useApp()` — replaces `useContext()` |
| `<Context value={...}>` | `AppContext.jsx` — no more `.Provider` wrapper |
| `useActionState()` | `TransactionModal.jsx` — async form actions with isPending |
| `useCallback` | CRUD functions — stable refs, React 19 best practice |
| `crypto.randomUUID()` | Generating unique transaction IDs |

---

## Why Vite over Create React App?

| | CRA | Vite |
|---|---|---|
| Dev start time | ~30s | ~300ms |
| Hot reload | Slow | Instant |
| Maintained | ❌ Dead (last update 2022) | ✅ Active |
| Vulnerabilities | 26 | **0** |
| React 19 support | ❌ Issues | ✅ Perfect |

---

## Features

### Dashboard
- Summary cards — Balance, Income, Expenses
- Area chart — 7-month income vs expense trend
- Donut pie chart — spending by category
- Recent 5 transactions

### Transactions
- Full list with search, filter (category/type), sort (date/amount)
- Export to CSV
- Admin: add, edit, delete | Viewer: read-only

### Insights
- Savings rate with health badge (Excellent / Moderate / Low)
- Top spending category
- Month-over-month comparison (Apr vs Mar)
- Average daily spend
- Category bar chart (top 6)
- 6-month grouped bar chart
- Dynamic financial tip

### UX
- Dark mode default + light mode toggle
- Responsive: sidebar desktop / bottom nav mobile
- localStorage persistence
- Staggered load animations
- Empty state handling
- Role switcher (Admin / Viewer)

---

## Tech Stack

- **React 19.2** — latest features (use, useActionState, Context shorthand)
- **Vite 6** — lightning fast dev + build
- **Tailwind CSS v4** — new `@import "tailwindcss"` syntax
- **Recharts** — AreaChart, BarChart, PieChart
- **Lucide React** — icons
- **Context API + useMemo** — state management

## Project Structure

```
src/
  context/AppContext.jsx     # Global state with React 19 patterns
  data/mockData.js           # 45 mock transactions + monthly data
  components/
    Sidebar.jsx              # Desktop nav + role + dark mode
    MobileNav.jsx            # Mobile bottom navigation
    SummaryCards.jsx         # 3 summary stat cards
    Charts.jsx               # BalanceTrendChart + SpendingPieChart
    TransactionModal.jsx     # Add/Edit modal (useActionState)
  pages/
    DashboardPage.jsx
    TransactionsPage.jsx
    InsightsPage.jsx
  App.jsx                    # Root layout
  main.jsx                   # Entry point
```
