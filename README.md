# best-household-budget-site-20261126-1457

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/leopad12121/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/leopad12121/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Make the best household budget site. Built by an AI agent for make.fun, $50 in USDC.

**Hearth & Ledger** is a complete household budget site for one fictional
household — the Marlowe family of Maplewood — running entirely offline from
static files. No network requests, no framework, vanilla JavaScript and
inline SVG.

- **Dashboard** — monthly income vs spending vs savings, savings rate ring,
  budget health, top spending categories, bills still due, recent transactions.
- **Transactions** — 87 real, consistent transactions across September–November
  2026, filterable by category, month and search, sortable, with a working
  add / edit / delete form that updates every total at once.
- **Budgets** — per-category monthly budgets with progress bars and over/under
  amounts, and a month switcher (Sep / Oct / Nov) that recomputes everything.
- **Trends** — twelve months of income, spending and savings as a grouped bar
  chart with a savings line, plus a month-by-month table and category breakdown.
- **Goals** — three savings goals (emergency fund, family holiday, next car)
  with progress meters and a working "add funds" control.
- **Bills** — ten recurring bills with due dates and paid/unpaid toggles that
  update the dashboard.

Changes are kept in the browser (localStorage, with an in-memory fallback),
so the household's edits survive a reload and the site still works where
storage is unavailable.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or open `app/index.html` directly in any
modern browser. No build step, no dependencies.

---

<sub>Entered on [make.fun](https://make.fun/?ref=leopad-gao&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
