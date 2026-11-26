// Hearth & Ledger — page renderers. Each function takes the store S and
// returns the HTML for one hash route. Every value that came from a person
// (a transaction description, a search box) is escaped before it is shown.

import { CATEGORIES, MONTH_LABELS } from './data.js';
import { hbar, money, monthlyChart, rateRing } from './charts.js';

export function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

function monthSwitcher(S) {
  const months = S.months;
  const i = months.indexOf(S.month);
  const prev = months[Math.max(0, i - 1)];
  const next = months[Math.min(months.length - 1, i + 1)];
  return `<div class="switcher" role="group" aria-label="Choose month">` +
    `<button class="secondary" data-action="month" data-month="${prev}" ${i === 0 ? 'disabled' : ''}>&larr; Earlier</button>` +
    `<span class="current-month">${esc(MONTH_LABELS[S.month])}</span>` +
    `<button class="secondary" data-action="month" data-month="${next}" ${i === months.length - 1 ? 'disabled' : ''}>Later &rarr;</button>` +
    `</div>`;
}

function upcomingBills(S) {
  const unpaid = S.bills().filter((b) => !b.paid).sort((a, b) => a.dueDay - b.dueDay);
  if (unpaid.length === 0) {
    return `<p class="empty-note">Every bill for ${esc(MONTH_LABELS[S.month])} is paid. Nothing is due.</p>`;
  }
  return `<ul style="list-style:none;margin:0;padding:0">` + unpaid.map((b) => `<li class="bill-row">` +
    `<span class="bill-name"><strong>${esc(b.name)}</strong>` +
    `<span class="bill-due">Due ${b.dueDay} ${esc(MONTH_LABELS[S.month].split(' ')[0])}</span></span>` +
    `<span class="bill-amount">${money(b.amount)}</span>` +
    `<span class="pill due">Due</span></li>`).join('') + `</ul>` +
    `<p class="small muted" style="margin-top:0.7rem">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} ` +
    `still to pay, ${money(unpaid.reduce((s, b) => s + b.amount, 0))} in total. ` +
    `<a href="#/bills">See all bills &rarr;</a></p>`;
}

function recentTransactions(S, n) {
  const rows = S.transactions()
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, n);
  return `<div style="overflow-x:auto"><table><thead><tr><th>Date</th><th>What</th><th>Category</th>` +
    `<th class="num">Amount</th></tr></thead><tbody>` +
    rows.map((t) => `<tr><td>${esc(t.date.slice(5))}</td><td>${esc(t.desc)}</td>` +
      `<td><span class="tag${t.type === 'in' ? ' income' : ''}">${esc(t.cat)}</span></td>` +
      `<td class="num ${t.type === 'in' ? 'pos' : 'neg'}">${t.type === 'in' ? '+' : '&minus;'}${money(t.amount)}</td></tr>`).join('') +
    `</tbody></table></div><p class="small muted" style="margin-top:0.7rem">` +
    `<a href="#/transactions">All ${S.transactions().length} transactions &rarr;</a></p>`;
}

export function dashboard(S) {
  const sum = S.monthSummary(S.month);
  const budget = S.budgetSummary(S.month);
  const top = S.categorySpending(S.month).slice(0, 5);
  const maxTop = top.length ? top[0].spent : 1;
  const healthPct = Math.min(100, (sum.spending / budget.total) * 100);
  const over = budget.overCount;

  return `<div class="page-head"><div><h1>${esc(MONTH_LABELS[S.month])} at a glance</h1>` +
    `<p class="muted">What the Marlowe household earned, spent and set aside in ` +
    `${esc(MONTH_LABELS[S.month])}, and what is still due.</p></div>${monthSwitcher(S)}</div>` +

    `<div class="kpis">` +
    `<div class="kpi"><div class="kpi-label">Money in</div><div class="kpi-value">${money(sum.income)}</div>` +
    `<div class="kpi-sub">Salaries, Tom&rsquo;s weekend work, interest</div></div>` +
    `<div class="kpi terra"><div class="kpi-label">Money out</div><div class="kpi-value">${money(sum.spending)}</div>` +
    `<div class="kpi-sub">Across ${S.transactions().filter((t) => t.type === 'out' && t.date.startsWith(S.month)).length} payments</div></div>` +
    `<div class="kpi amber"><div class="kpi-label">Set aside</div><div class="kpi-value">${money(sum.saved)}</div>` +
    `<div class="kpi-sub">${sum.rate.toFixed(0)}% of income kept, not spent</div></div>` +
    `<div class="kpi"><div class="kpi-label">Budget health</div><div class="kpi-value">${healthPct.toFixed(0)}% used</div>` +
    `<div class="kpi-sub">${over === 0 ? 'Every category inside its budget' : over + ' categor' + (over === 1 ? 'y' : 'ies') + ' over budget'}</div></div>` +
    `</div>` +

    `<div class="grid-2">` +
    `<section class="card"><h2><span class="rule">&#9670;</span> Savings rate</h2>` +
    `<div style="display:flex;gap:1.2rem;align-items:center;flex-wrap:wrap">` +
    `${rateRing(sum.rate, 'saved')}` +
    `<div style="flex:1;min-width:12rem"><p>The Marlowes aim to keep at least ` +
    `<strong>20% of income</strong>. This month they kept <strong>${sum.rate.toFixed(1)}%</strong> ` +
    `&mdash; ${money(sum.saved)} of ${money(sum.income)}.</p>` +
    `<p class="small muted">The rest went to the emergency fund and the car fund. ` +
    `See <a href="#/goals">Goals</a>.</p></div></div></section>` +
    `<section class="card"><h2><span class="rule">&#9670;</span> Where the money went</h2>` +
    `${top.map((c) => hbar(c.cat, c.spent, maxTop)).join('')}` +
    `<p class="small muted" style="margin-top:0.7rem">Top five spending categories in ` +
    `${esc(MONTH_LABELS[S.month])}. <a href="#/budgets">Full budget &rarr;</a></p></section>` +
    `</div>` +

    `<div class="grid-2">` +
    `<section class="card"><h2><span class="rule">&#9670;</span> Bills still due</h2>${upcomingBills(S)}</section>` +
    `<section class="card"><h2><span class="rule">&#9670;</span> Recent spending</h2>${recentTransactions(S, 8)}</section>` +
    `</div>` +

    `<div class="callout"><p><strong>How this household budgets:</strong> on payday the ` +
    `mortgage and the savings transfers go out first, groceries are shopped once a week ` +
    `from a list, and every receipt is entered here the same evening. If a category runs ` +
    `over, the next week&rsquo;s spending in that category stops &mdash; the budget is a plan, ` +
    `not a guess.</p></div>`;
}

export function transactionsPage(S) {
  const f = S.txFilter;
  const list = S.filteredTransactions();
  const totalOut = list.filter((t) => t.type === 'out').reduce((s, t) => s + t.amount, 0);
  const totalIn = list.filter((t) => t.type === 'in').reduce((s, t) => s + t.amount, 0);
  const catOptions = ['all', ...CATEGORIES, 'Income'].map((c) =>
    `<option value="${esc(c)}" ${f.cat === c ? 'selected' : ''}>${c === 'all' ? 'All categories' : esc(c)}</option>`).join('');
  const monthOptions = ['all', ...S.months].map((m) =>
    `<option value="${m}" ${f.month === m ? 'selected' : ''}>${m === 'all' ? 'All three months' : esc(MONTH_LABELS[m])}</option>`).join('');

  const rows = list.map((t) => {
    if (S.editingId === t.id) {
      return `<tr><td><input type="date" data-edit="date" value="${esc(t.date)}"></td>` +
        `<td><input type="text" data-edit="desc" value="${esc(t.desc)}" style="width:100%"></td>` +
        `<td><select data-edit="cat">${[...CATEGORIES, 'Income'].map((c) =>
          `<option ${c === t.cat ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></td>` +
        `<td class="num"><input type="number" data-edit="amount" value="${t.amount}" min="0" step="0.01" style="width:7rem;text-align:right"></td>` +
        `<td><button class="small-btn" data-action="save-edit" data-id="${t.id}">Save</button> ` +
        `<button class="small-btn secondary" data-action="cancel-edit">Cancel</button></td></tr>`;
    }
    return `<tr><td>${esc(t.date)}</td><td>${esc(t.desc)}</td>` +
      `<td><span class="tag${t.type === 'in' ? ' income' : ''}">${esc(t.cat)}</span></td>` +
      `<td class="num ${t.type === 'in' ? 'pos' : 'neg'}">${t.type === 'in' ? '+' : '&minus;'}${money(t.amount)}</td>` +
      `<td><button class="small-btn secondary" data-action="edit" data-id="${t.id}">Edit</button> ` +
      `<button class="small-btn danger" data-action="delete" data-id="${t.id}">Delete</button></td></tr>`;
  }).join('');

  return `<div class="page-head"><div><h1>Transactions</h1>` +
    `<p class="muted">Every dollar in and out, September to November 2026. ` +
    `Add a row, fix a mistake, or filter the list &mdash; the totals below follow at once.</p></div></div>` +

    `<section class="card"><h2><span class="rule">&#9670;</span> Add a transaction</h2>` +
    `<form class="add-form" id="add-form">` +
    `<div class="field"><label for="f-date">Date</label>` +
    `<input type="date" id="f-date" value="${S.month}-29" min="2026-09-01" max="2026-11-30" required></div>` +
    `<div class="field wide"><label for="f-desc">What was it?</label>` +
    `<input type="text" id="f-desc" placeholder="e.g. GreenMart weekly shop" maxlength="80" required></div>` +
    `<div class="field"><label for="f-cat">Category</label>` +
    `<select id="f-cat">${[...CATEGORIES, 'Income'].map((c) => `<option>${esc(c)}</option>`).join('')}</select></div>` +
    `<div class="field"><label for="f-amount">Amount ($)</label>` +
    `<input type="number" id="f-amount" min="0.01" step="0.01" placeholder="0.00" required></div>` +
    `<button type="submit">Add it</button></form>` +
    `<p class="small muted" id="add-note" style="margin-top:0.6rem">Money in counts as income; ` +
    `everything else counts as spending for the month it falls in.</p></section>` +

    `<section class="card"><h2><span class="rule">&#9670;</span> The ledger</h2>` +
    `<div class="controls">` +
    `<div class="field"><label for="flt-cat">Category</label><select id="flt-cat">${catOptions}</select></div>` +
    `<div class="field"><label for="flt-month">Month</label><select id="flt-month">${monthOptions}</select></div>` +
    `<div class="field search"><label for="flt-q">Search</label>` +
    `<input type="search" id="flt-q" placeholder="Search descriptions…" value="${esc(f.q)}"></div>` +
    `<div class="field"><label for="flt-sort">Sort by</label><select id="flt-sort">` +
    `<option value="date-desc" ${f.sort === 'date-desc' ? 'selected' : ''}>Newest first</option>` +
    `<option value="date-asc" ${f.sort === 'date-asc' ? 'selected' : ''}>Oldest first</option>` +
    `<option value="amount-desc" ${f.sort === 'amount-desc' ? 'selected' : ''}>Largest amount</option>` +
    `<option value="amount-asc" ${f.sort === 'amount-asc' ? 'selected' : ''}>Smallest amount</option>` +
    `</select></div></div>` +
    `<p>Showing <strong>${list.length}</strong> of ${S.transactions().length} transactions &mdash; ` +
    `<span class="pos money">+${money(totalIn)} in</span> &middot; ` +
    `<span class="neg money">&minus;${money(totalOut)} out</span></p>` +
    (list.length === 0
      ? `<p class="empty-note">Nothing matches those filters. Try clearing the search.</p>`
      : `<div style="overflow-x:auto"><table class="tx-table"><thead><tr><th>Date</th><th>What</th>` +
        `<th>Category</th><th class="num">Amount</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`) +
    `</section>`;
}

export function budgetsPage(S) {
  const budget = S.budgetSummary(S.month);
  const cards = budget.rows.map((r) => {
    const pct = r.budget > 0 ? (r.spent / r.budget) * 100 : 0;
    const over = r.spent - r.budget;
    const cls = over > 0 ? 'over' : '';
    return `<div class="card" style="margin-bottom:0.8rem"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap">` +
      `<strong>${esc(r.cat)}</strong>` +
      `<span class="money">${money(r.spent)} of ${money(r.budget)}</span></div>` +
      `<div class="meter ${cls}" style="margin:0.55rem 0 0.35rem"><span style="width:${Math.min(100, pct).toFixed(1)}%"></span></div>` +
      `<div style="display:flex;justify-content:space-between;gap:1rem;font-size:0.88rem">` +
      `<span class="muted">${pct.toFixed(0)}% of budget used</span>` +
      (over > 0
        ? `<span class="neg"><strong>${money(over)} over budget</strong></span>`
        : `<span class="pos">${money(-over)} left</span>`) +
      `</div></div>`;
  });

  return `<div class="page-head"><div><h1>Budgets</h1>` +
    `<p class="muted">What each category may spend in ${esc(MONTH_LABELS[S.month])}, ` +
    `against what it actually spent. Switch months to compare.</p></div>${monthSwitcher(S)}</div>` +

    `<div class="kpis">` +
    `<div class="kpi"><div class="kpi-label">Total budget</div><div class="kpi-value">${money(budget.total)}</div>` +
    `<div class="kpi-sub">Across ${budget.rows.length} categories</div></div>` +
    `<div class="kpi terra"><div class="kpi-label">Total spent</div><div class="kpi-value">${money(budget.spent)}</div>` +
    `<div class="kpi-sub">${(budget.spent / budget.total * 100).toFixed(0)}% of the month&rsquo;s budget</div></div>` +
    `<div class="kpi amber"><div class="kpi-label">Left to spend</div><div class="kpi-value">${money(budget.total - budget.spent)}</div>` +
    `<div class="kpi-sub">${budget.overCount === 0 ? 'No category over budget' : budget.overCount + ' categor' + (budget.overCount === 1 ? 'y' : 'ies') + ' over budget'}</div></div>` +
    `<div class="kpi"><div class="kpi-label">Biggest overspend</div>` +
    `<div class="kpi-value">${budget.biggestOver ? money(budget.biggestOver.over) : '$0'}</div>` +
    `<div class="kpi-sub">${budget.biggestOver ? esc(budget.biggestOver.cat) + ' is over its ' + money(budget.biggestOver.budget) + ' budget' : 'Nothing over'}</div></div>` +
    `</div>` +

    `<div class="grid-2"><div>${cards.slice(0, Math.ceil(cards.length / 2)).join('')}</div>` +
    `<div>${cards.slice(Math.ceil(cards.length / 2)).join('')}</div></div>` +

    (S.month === '2026-11'
      ? `<div class="callout"><p><strong>November&rsquo;s story:</strong> groceries ran ` +
        `${money(30.5)} over &mdash; the third week&rsquo;s shop included the Christmas food order &mdash; ` +
        `and Mia&rsquo;s winter coat pushed clothing ${money(23.99)} over. Both were covered from the ` +
        `dining-out underspend, so the month still finished ${money(budget.total - budget.spent)} inside its budget.</p></div>`
      : `<div class="callout"><p><strong>${esc(MONTH_LABELS[S.month])} in one line:</strong> ` +
        `the household spent ${money(budget.spent)} of its ${money(budget.total)} budget, ` +
        `leaving ${money(budget.total - budget.spent)} unspent` +
        (budget.overCount === 0 ? '.' : `, with ${budget.overCount} categor${budget.overCount === 1 ? 'y' : 'ies'} over budget.`) +
        `</p></div>`);
}

export function trendsPage(S) {
  const months = S.trendMonths();
  const cat = S.categorySpending(S.month);
  const maxCat = cat.length ? cat[0].spent : 1;
  const best = months.reduce((a, m) => ((m.income - m.spending) > (a.income - a.spending) ? m : a), months[0]);
  const worst = months.reduce((a, m) => ((m.income - m.spending) < (a.income - a.spending) ? m : a), months[0]);
  const avgSave = months.reduce((s, m) => s + (m.income - m.spending), 0) / months.length;

  return `<div class="page-head"><div><h1>Trends</h1>` +
    `<p class="muted">Twelve months of money in, money out, and what was kept. ` +
    `December 2025 to August 2026 come from the old spreadsheet; September to November 2026 ` +
    `are worked out from the ledger itself.</p></div></div>` +

    `<section class="card"><h2><span class="rule">&#9670;</span> A year of income and spending</h2>` +
    `${monthlyChart(months)}` +
    `<p class="legend"><span><span class="swatch" style="background:#1e4d3b"></span>Income</span>` +
    `<span><span class="swatch" style="background:#c98a2e"></span>Spending</span>` +
    `<span><span class="swatch" style="background:#b4552d"></span>Saved (line)</span></p>` +
    `<p class="chart-note">Best saving month: <strong>${esc(best.label)}</strong> ` +
    `(${money(best.income - best.spending)} kept). Tightest: <strong>${esc(worst.label)}</strong> ` +
    `(${money(worst.income - worst.spending)} kept). Average kept per month: <strong>${money(avgSave)}</strong>.</p></section>` +

    `<div class="grid-2">` +
    `<section class="card"><h2><span class="rule">&#9670;</span> Where ${esc(MONTH_LABELS[S.month])}&rsquo;s money went</h2>` +
    `${cat.map((c) => hbar(c.cat, c.spent, maxCat)).join('')}` +
    `<p class="chart-note">Housing is the mortgage: the single largest line every month, ` +
    `about 43% of ${esc(MONTH_LABELS[S.month])}&rsquo;s spending.</p></section>` +
    `<section class="card"><h2><span class="rule">&#9670;</span> Month by month</h2>` +
    `<table><thead><tr><th>Month</th><th class="num">In</th><th class="num">Out</th><th class="num">Kept</th></tr></thead><tbody>` +
    months.map((m) => `<tr><td>${esc(m.label)}</td><td class="num pos">${money(m.income)}</td>` +
      `<td class="num neg">${money(m.spending)}</td><td class="num"><strong>${money(m.income - m.spending)}</strong></td></tr>`).join('') +
    `</tbody></table></section>` +
    `</div>`;
}

export function goalsPage(S) {
  const goals = S.goals();
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const cards = goals.map((g) => {
    const pct = Math.min(100, (g.saved / g.target) * 100);
    const remaining = g.target - g.saved;
    return `<section class="card goal-card"><h3>${esc(g.name)}</h3>` +
      `<p class="muted">${esc(g.note)}</p>` +
      `<div class="goal-meta"><span><strong class="money">${money(g.saved)}</strong> saved</span>` +
      `<span>of <strong class="money">${money(g.target)}</strong></span></div>` +
      `<div class="meter"><span style="width:${pct.toFixed(1)}%"></span></div>` +
      `<div class="goal-meta"><span class="muted">${pct.toFixed(0)}% there</span>` +
      `<span class="muted">${remaining > 0 ? money(remaining) + ' to go' : 'Reached!'}</span></div>` +
      `<div class="goal-add"><input type="number" min="1" step="1" placeholder="Amount $" ` +
      `aria-label="Amount to add to ${esc(g.name)}" data-goal-input="${g.id}">` +
      `<button data-action="add-funds" data-goal="${g.id}">Add funds</button></div>` +
      `<p class="small muted" data-goal-note="${g.id}" style="margin:0.5rem 0 0"></p></section>`;
  }).join('');

  return `<div class="page-head"><div><h1>Savings goals</h1>` +
    `<p class="muted">Three pots, three reasons. Money added here comes out of the ` +
    `month&rsquo;s &ldquo;set aside&rdquo; &mdash; it is already counted on the dashboard.</p></div></div>` +
    `<div class="kpis"><div class="kpi"><div class="kpi-label">Saved across all goals</div>` +
    `<div class="kpi-value">${money(totalSaved)}</div><div class="kpi-sub">of ${money(totalTarget)} aimed for</div></div>` +
    `<div class="kpi amber"><div class="kpi-label">Closest to done</div>` +
    `<div class="kpi-value">${(Math.max(...goals.map((g) => g.saved / g.target)) * 100).toFixed(0)}%</div>` +
    `<div class="kpi-sub">Emergency fund — the one that matters most</div></div>` +
    `<div class="kpi"><div class="kpi-label">Still to save</div>` +
    `<div class="kpi-value">${money(totalTarget - totalSaved)}</div>` +
    `<div class="kpi-sub">Across the three goals</div></div>` +
    `<div class="kpi terra"><div class="kpi-label">This month&rsquo;s saving</div>` +
    `<div class="kpi-value">${money(S.monthSummary(S.month).saved)}</div>` +
    `<div class="kpi-sub">Kept from ${esc(MONTH_LABELS[S.month])}&rsquo;s income</div></div></div>` +
    `<div class="grid-2">${cards}</div>`;
}

export function billsPage(S) {
  const bills = S.bills().slice().sort((a, b) => a.dueDay - b.dueDay);
  const paid = bills.filter((b) => b.paid);
  const unpaid = bills.filter((b) => !b.paid);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const dueTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const rows = bills.map((b) => {
    const overdue = !b.paid && b.dueDay < 29;
    return `<li class="bill-row"><span class="bill-name"><strong>${esc(b.name)}</strong>` +
      `<span class="bill-due">Due ${b.dueDay} ${esc(MONTH_LABELS[S.month].split(' ')[0])} &middot; ` +
      `${b.paid ? 'paid' : overdue ? 'due now' : 'coming up'}</span></span>` +
      `<span class="bill-amount">${money(b.amount)}</span>` +
      `<span class="pill ${b.paid ? 'paid' : overdue ? 'overdue' : 'due'}">${b.paid ? 'Paid' : overdue ? 'Due now' : 'Due'}</span>` +
      `<button class="small-btn ${b.paid ? 'secondary' : ''}" data-action="toggle-bill" data-bill="${b.id}">` +
      `${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></li>`;
  }).join('');

  return `<div class="page-head"><div><h1>Bills</h1>` +
    `<p class="muted">The household&rsquo;s recurring bills for ${esc(MONTH_LABELS[S.month])}. ` +
    `Mark each one paid as the money goes out &mdash; the dashboard&rsquo;s &ldquo;bills still due&rdquo; follows at once.</p></div></div>` +
    `<div class="kpis"><div class="kpi"><div class="kpi-label">Bills this month</div>` +
    `<div class="kpi-value">${bills.length}</div><div class="kpi-sub">Recurring, every month</div></div>` +
    `<div class="kpi"><div class="kpi-label">Paid</div><div class="kpi-value">${paid.length} of ${bills.length}</div>` +
    `<div class="kpi-sub">${money(paidTotal)} already gone out</div></div>` +
    `<div class="kpi amber"><div class="kpi-label">Still to pay</div><div class="kpi-value">${money(dueTotal)}</div>` +
    `<div class="kpi-sub">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} left in ${esc(MONTH_LABELS[S.month])}</div></div>` +
    `<div class="kpi terra"><div class="kpi-label">Monthly total</div><div class="kpi-value">${money(paidTotal + dueTotal)}</div>` +
    `<div class="kpi-sub">The mortgage is most of it</div></div></div>` +
    `<section class="card"><h2><span class="rule">&#9670;</span> ${esc(MONTH_LABELS[S.month])} bills</h2>` +
    `<ul style="list-style:none;margin:0;padding:0">${rows}</ul></section>`;
}

export function notFound() {
  return `<div class="page-head"><div><h1>That page isn&rsquo;t in the ledger</h1>` +
    `<p class="muted">There is no page at this address.</p></div></div>` +
    `<p><a href="#/">&larr; Back to the dashboard</a></p>`;
}
