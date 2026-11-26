// Hearth & Ledger — bootstrap and store.
//
// Routes (hash): #/ dashboard, #/transactions, #/budgets, #/trends,
// #/goals, #/bills. All state lives here: the embedded data in data.js
// plus the household's own changes, kept in localStorage so an added
// transaction or a paid bill is still there tomorrow. If storage is
// unavailable (a private window, a hosted sandbox) the site still works
// in memory for the visit.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { BILLS, BUDGETS, CATEGORIES, GOALS, HOUSEHOLD, MONTH_LABELS, TRANSACTIONS, TRENDS } from './data.js';
import { billsPage, budgetsPage, dashboard, goalsPage, notFound, transactionsPage, trendsPage } from './views.js';

const STORE_KEY = 'hearth-ledger-v1';
const app = document.getElementById('app');

// ---------- persistence ----------

function loadSaved() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return { added: [], updated: {}, deleted: [], goals: {}, bills: {} };
    const parsed = JSON.parse(raw);
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      updated: parsed.updated && typeof parsed.updated === 'object' ? parsed.updated : {},
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
      goals: parsed.goals && typeof parsed.goals === 'object' ? parsed.goals : {},
      bills: parsed.bills && typeof parsed.bills === 'object' ? parsed.bills : {},
    };
  } catch {
    return { added: [], updated: {}, deleted: [], goals: {}, bills: {} };
  }
}

const saved = loadSaved();

function persist() {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(saved));
  } catch {
    // Storage unavailable: the visit still works in memory.
  }
}

// ---------- the store ----------

const S = {
  months: HOUSEHOLD.months,
  month: '2026-11',
  editingId: null,
  txFilter: { cat: 'all', month: '2026-11', q: '', sort: 'date-desc' },

  transactions() {
    const base = TRANSACTIONS.filter((t) => !saved.deleted.includes(t.id)).map((t) =>
      saved.updated[t.id] ? { ...t, ...saved.updated[t.id] } : t,
    );
    return base.concat(saved.added);
  },

  goals() {
    return GOALS.map((g) => (saved.goals[g.id] != null ? { ...g, saved: saved.goals[g.id] } : g));
  },

  bills() {
    return BILLS.map((b) => (saved.bills[b.id] != null ? { ...b, paid: saved.bills[b.id] } : b));
  },

  monthSummary(month) {
    const ts = this.transactions().filter((t) => t.date.startsWith(month));
    const income = ts.filter((t) => t.type === 'in').reduce((s, t) => s + t.amount, 0);
    const spending = ts.filter((t) => t.type === 'out').reduce((s, t) => s + t.amount, 0);
    const savedAmt = income - spending;
    return { income, spending, saved: savedAmt, rate: income > 0 ? (savedAmt / income) * 100 : 0 };
  },

  categorySpending(month) {
    const ts = this.transactions().filter((t) => t.type === 'out' && t.date.startsWith(month));
    const byCat = new Map(CATEGORIES.map((c) => [c, 0]));
    for (const t of ts) byCat.set(t.cat, (byCat.get(t.cat) || 0) + t.amount);
    return [...byCat.entries()]
      .map(([cat, spent]) => ({ cat, spent }))
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent);
  },

  budgetSummary(month) {
    const budget = BUDGETS[month];
    const spentByCat = new Map(this.categorySpending(month).map((c) => [c.cat, c.spent]));
    const rows = CATEGORIES.map((cat) => ({
      cat,
      budget: budget[cat] || 0,
      spent: spentByCat.get(cat) || 0,
    }));
    const total = rows.reduce((s, r) => s + r.budget, 0);
    const spent = rows.reduce((s, r) => s + r.spent, 0);
    const overRows = rows.filter((r) => r.spent > r.budget);
    const biggestOver = overRows.length
      ? overRows.map((r) => ({ cat: r.cat, over: r.spent - r.budget, budget: r.budget }))
          .sort((a, b) => b.over - a.over)[0]
      : null;
    return { rows, total, spent, overCount: overRows.length, biggestOver };
  },

  trendMonths() {
    const months = TRENDS.map((m) => ({ ...m }));
    for (const key of HOUSEHOLD.months) {
      const sum = this.monthSummary(key);
      months.push({ month: key, label: MONTH_LABELS[key].slice(0, 3) + ' 26', income: sum.income, spending: sum.spending });
    }
    return months;
  },

  filteredTransactions() {
    const f = this.txFilter;
    let list = this.transactions();
    if (f.month !== 'all') list = list.filter((t) => t.date.startsWith(f.month));
    if (f.cat !== 'all') list = list.filter((t) => t.cat === f.cat);
    if (f.q.trim()) {
      const q = f.q.trim().toLowerCase();
      list = list.filter((t) => t.desc.toLowerCase().includes(q));
    }
    const byDate = (a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
    if (f.sort === 'date-asc') list = list.slice().sort(byDate);
    else if (f.sort === 'date-desc') list = list.slice().sort((a, b) => byDate(b, a));
    else if (f.sort === 'amount-desc') list = list.slice().sort((a, b) => b.amount - a.amount);
    else if (f.sort === 'amount-asc') list = list.slice().sort((a, b) => a.amount - b.amount);
    return list;
  },

  addTransaction(t) {
    saved.added.push(t);
    persist();
  },

  updateTransaction(id, fields) {
    const base = TRANSACTIONS.find((t) => t.id === id);
    if (base) {
      saved.updated[id] = { ...(saved.updated[id] || {}), ...fields };
    } else {
      const added = saved.added.find((t) => t.id === id);
      if (added) Object.assign(added, fields);
    }
    persist();
  },

  deleteTransaction(id) {
    if (TRANSACTIONS.some((t) => t.id === id)) {
      if (!saved.deleted.includes(id)) saved.deleted.push(id);
      delete saved.updated[id];
    } else {
      const i = saved.added.findIndex((t) => t.id === id);
      if (i !== -1) saved.added.splice(i, 1);
    }
    persist();
  },

  addFunds(goalId, amount) {
    const goal = this.goals().find((g) => g.id === goalId);
    if (!goal) return null;
    const next = Math.round((goal.saved + amount) * 100) / 100;
    saved.goals[goalId] = next;
    persist();
    return { ...goal, saved: next };
  },

  toggleBill(billId) {
    const bill = this.bills().find((b) => b.id === billId);
    if (!bill) return;
    saved.bills[billId] = !bill.paid;
    persist();
  },
};

// ---------- routing ----------

const ROUTES = {
  '': dashboard,
  transactions: transactionsPage,
  budgets: budgetsPage,
  trends: trendsPage,
  goals: goalsPage,
  bills: billsPage,
};

function render() {
  window.__shotReady = false;
  const route = (location.hash.match(/^#\/([a-z]*)/) || [])[1] || '';
  const view = ROUTES[route] || notFound;
  document.title = `${route ? route[0].toUpperCase() + route.slice(1) : 'Dashboard'} | Hearth & Ledger`;
  app.innerHTML = view(S);
  for (const a of document.querySelectorAll('.main-nav a')) {
    a.classList.toggle('active', (a.dataset.route === 'dashboard' && route === '') || a.dataset.route === route);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// ---------- events ----------

function money(n) {
  return '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

app.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'month') {
    if (S.months.includes(el.dataset.month)) S.month = el.dataset.month;
    render();
  } else if (action === 'toggle-bill') {
    S.toggleBill(el.dataset.bill);
    render();
  } else if (action === 'add-funds') {
    const input = app.querySelector(`[data-goal-input="${el.dataset.goal}"]`);
    const note = app.querySelector(`[data-goal-note="${el.dataset.goal}"]`);
    const amount = input ? Number(input.value) : NaN;
    if (!Number.isFinite(amount) || amount <= 0) {
      if (note) note.textContent = 'Enter an amount above $0 first.';
      return;
    }
    const goal = S.addFunds(el.dataset.goal, amount);
    render();
    const after = app.querySelector(`[data-goal-note="${el.dataset.goal}"]`);
    if (after && goal) after.textContent = `Added ${money(amount)} to ${goal.name} — now ${money(goal.saved)} of ${money(goal.target)}.`;
  } else if (action === 'edit') {
    S.editingId = el.dataset.id;
    render();
  } else if (action === 'cancel-edit') {
    S.editingId = null;
    render();
  } else if (action === 'save-edit') {
    const row = el.closest('tr');
    if (!row) return;
    const get = (name) => row.querySelector(`[data-edit="${name}"]`);
    const amount = Number(get('amount').value);
    if (!get('date').value || !get('desc').value.trim() || !Number.isFinite(amount) || amount < 0) return;
    S.updateTransaction(el.dataset.id, {
      date: get('date').value,
      desc: get('desc').value.trim(),
      cat: get('cat').value,
      amount: Math.round(amount * 100) / 100,
    });
    S.editingId = null;
    render();
  } else if (action === 'delete') {
    S.deleteTransaction(el.dataset.id);
    render();
  }
});

app.addEventListener('submit', (ev) => {
  if (ev.target.id !== 'add-form') return;
  ev.preventDefault();
  const date = document.getElementById('f-date').value;
  const desc = document.getElementById('f-desc').value.trim();
  const cat = document.getElementById('f-cat').value;
  const amount = Number(document.getElementById('f-amount').value);
  const note = document.getElementById('add-note');
  if (!date || !desc || !Number.isFinite(amount) || amount <= 0) {
    if (note) note.textContent = 'Fill in a date, a description and an amount above $0.';
    return;
  }
  S.addTransaction({
    id: `u${Date.now()}`,
    date,
    desc,
    cat,
    amount: Math.round(amount * 100) / 100,
    type: cat === 'Income' ? 'in' : 'out',
  });
  render();
  const after = document.getElementById('add-note');
  if (after) after.textContent = `Added “${desc}” — ${money(amount)} on ${date}. The totals above already include it.`;
});

app.addEventListener('change', (ev) => {
  const id = ev.target.id;
  if (id === 'flt-cat') S.txFilter.cat = ev.target.value;
  else if (id === 'flt-month') S.txFilter.month = ev.target.value;
  else if (id === 'flt-sort') S.txFilter.sort = ev.target.value;
  else return;
  render();
});

app.addEventListener('input', (ev) => {
  if (ev.target.id !== 'flt-q') return;
  S.txFilter.q = ev.target.value;
  const pos = ev.target.selectionStart;
  render();
  const box = document.getElementById('flt-q');
  if (box) {
    box.focus();
    try { box.setSelectionRange(pos, pos); } catch { /* older browsers */ }
  }
});

window.addEventListener('hashchange', render);
render();
