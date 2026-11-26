// Hearth & Ledger — the Marlowe household's own records.
// Every figure on the site comes from this file: three months of
// transactions (September–November 2026), monthly budgets, savings goals,
// recurring bills, and nine earlier months of income and spending totals
// for the trends page. Amounts are US dollars. Nothing is fetched.

export const HOUSEHOLD = {
  name: 'The Marlowe household',
  members: 'Maya Marlowe (teacher) and Tom Marlowe (electrician), with Leo, 9, and Mia, 6',
  home: 'A three-bedroom house in Maplewood, bought in 2021',
  currency: 'USD',
  months: ['2026-09', '2026-10', '2026-11'],
};

export const MONTH_LABELS = {
  '2026-09': 'September 2026',
  '2026-10': 'October 2026',
  '2026-11': 'November 2026',
};

// Spending categories, in the order they appear on the Budgets page.
export const CATEGORIES = [
  'Groceries', 'Dining Out', 'Transport', 'Housing', 'Utilities',
  'Entertainment', 'Health', 'Clothing', 'Kids', 'Home & Garden', 'Misc',
];

// Monthly budget per category. The Marlowes review these together on the
// first Sunday of each month and rarely change them.
export const BUDGETS = {
  '2026-09': {
    Groceries: 680, 'Dining Out': 220, Transport: 700, Housing: 1850,
    Utilities: 520, Entertainment: 120, Health: 180, Clothing: 220,
    Kids: 320, 'Home & Garden': 100, Misc: 150,
  },
  '2026-10': {
    Groceries: 650, 'Dining Out': 220, Transport: 700, Housing: 1850,
    Utilities: 520, Entertainment: 120, Health: 180, Clothing: 120,
    Kids: 300, 'Home & Garden': 100, Misc: 150,
  },
  '2026-11': {
    Groceries: 650, 'Dining Out': 220, Transport: 700, Housing: 1850,
    Utilities: 520, Entertainment: 150, Health: 180, Clothing: 120,
    Kids: 260, 'Home & Garden': 100, Misc: 150,
  },
};

// Savings goals. "Saved" is the balance on 30 November 2026.
export const GOALS = [
  {
    id: 'emergency',
    name: 'Emergency fund',
    note: 'Six months of essential spending, kept in a separate savings account.',
    target: 12000,
    saved: 8450,
  },
  {
    id: 'holiday',
    name: 'Family holiday — Cornwall, summer 2027',
    note: 'Two weeks by the sea: cottage, train fares and food money.',
    target: 3500,
    saved: 1920,
  },
  {
    id: 'car',
    name: 'Next car fund',
    note: 'The estate is twelve years old. A newer used car, bought outright.',
    target: 18000,
    saved: 6300,
  },
];

// Recurring bills. "paid" is the November 2026 status; the Bills page
// lets the household mark each one paid as the money goes out.
export const BILLS = [
  { id: 'mortgage', name: 'Mortgage — First County Bank', amount: 1850.0, dueDay: 1, paid: true },
  { id: 'gym', name: 'Gym — Riverside Fitness', amount: 45.0, dueDay: 3, paid: true },
  { id: 'internet', name: 'Internet — NorthLink', amount: 79.0, dueDay: 8, paid: true },
  { id: 'carloan', name: 'Car loan — First County Bank', amount: 215.0, dueDay: 10, paid: true },
  { id: 'electric', name: 'Electric — City Power', amount: 142.1, dueDay: 12, paid: true },
  { id: 'water', name: 'Water — ClearWater', amount: 68.4, dueDay: 15, paid: false },
  { id: 'insurance-home', name: 'Home insurance — Shield Mutual', amount: 58.0, dueDay: 18, paid: false },
  { id: 'mobile', name: 'Mobile — two lines, NorthLink', amount: 96.0, dueDay: 20, paid: false },
  { id: 'streaming', name: 'Streaming — StreamPlus', amount: 17.99, dueDay: 22, paid: false },
  { id: 'carinsurance', name: 'Car insurance — Shield Mutual', amount: 134.0, dueDay: 27, paid: false },
];

// Monthly totals for December 2025 to August 2026, from the Marlowes'
// old spreadsheet. September to November 2026 are worked out from the
// transactions below, so the chart and the ledger always agree.
export const TRENDS = [
  { month: '2025-12', label: 'Dec 25', income: 7150, spending: 5280 },
  { month: '2026-01', label: 'Jan 26', income: 6640, spending: 4710 },
  { month: '2026-02', label: 'Feb 26', income: 6590, spending: 4590 },
  { month: '2026-03', label: 'Mar 26', income: 6720, spending: 4860 },
  { month: '2026-04', label: 'Apr 26', income: 6680, spending: 4920 },
  { month: '2026-05', label: 'May 26', income: 6810, spending: 4780 },
  { month: '2026-06', label: 'Jun 26', income: 6740, spending: 5120 },
  { month: '2026-07', label: 'Jul 26', income: 6920, spending: 5340 },
  { month: '2026-08', label: 'Aug 26', income: 6790, spending: 5190 },
];

// Transactions. type "in" is money coming in, "out" is money going out.
// id is stable so an edited or deleted row can be found again.
export const TRANSACTIONS = [
  // ---- September 2026 ----
  { id: 't001', date: '2026-09-01', desc: 'Salary — Maya Marlowe, teaching', cat: 'Income', amount: 3400.0, type: 'in' },
  { id: 't002', date: '2026-09-01', desc: 'Mortgage — First County Bank', cat: 'Housing', amount: 1850.0, type: 'out' },
  { id: 't003', date: '2026-09-02', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 161.3, type: 'out' },
  { id: 't004', date: '2026-09-03', desc: 'Salary — Tom Marlowe, electrical work', cat: 'Income', amount: 2950.0, type: 'in' },
  { id: 't005', date: '2026-09-03', desc: 'School uniforms — Leo and Mia', cat: 'Clothing', amount: 148.0, type: 'out' },
  { id: 't006', date: '2026-09-04', desc: 'Fuel — Shell, Maplewood Road', cat: 'Transport', amount: 51.2, type: 'out' },
  { id: 't007', date: '2026-09-05', desc: 'Electric — City Power', cat: 'Utilities', amount: 104.6, type: 'out' },
  { id: 't008', date: '2026-09-06', desc: 'School shoes — Mia', cat: 'Clothing', amount: 47.5, type: 'out' },
  { id: 't009', date: '2026-09-07', desc: 'Swimming lessons — Leo and Mia', cat: 'Kids', amount: 85.0, type: 'out' },
  { id: 't010', date: '2026-09-08', desc: 'Internet — NorthLink', cat: 'Utilities', amount: 79.0, type: 'out' },
  { id: 't011', date: '2026-09-09', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 158.75, type: 'out' },
  { id: 't012', date: '2026-09-10', desc: 'Car loan — First County Bank', cat: 'Transport', amount: 215.0, type: 'out' },
  { id: 't013', date: '2026-09-11', desc: 'School supplies — stationery and pens', cat: 'Kids', amount: 42.3, type: 'out' },
  { id: 't014', date: '2026-09-12', desc: 'Lunch — The Copper Kettle', cat: 'Dining Out', amount: 28.9, type: 'out' },
  { id: 't015', date: '2026-09-14', desc: 'Back-to-school haircuts — Leo and Mia', cat: 'Misc', amount: 36.0, type: 'out' },
  { id: 't016', date: '2026-09-15', desc: 'Water — ClearWater', cat: 'Utilities', amount: 61.8, type: 'out' },
  { id: 't017', date: '2026-09-16', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 144.6, type: 'out' },
  { id: 't018', date: '2026-09-18', desc: 'Dentist check-up — Leo', cat: 'Health', amount: 58.0, type: 'out' },
  { id: 't019', date: '2026-09-20', desc: 'Mobile — two lines, NorthLink', cat: 'Utilities', amount: 96.0, type: 'out' },
  { id: 't020', date: '2026-09-20', desc: 'Weekend wiring job — Tom', cat: 'Income', amount: 240.0, type: 'in' },
  { id: 't021', date: '2026-09-21', desc: 'Takeaway Thai — Siam Garden', cat: 'Dining Out', amount: 32.4, type: 'out' },
  { id: 't022', date: '2026-09-23', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 152.1, type: 'out' },
  { id: 't023', date: '2026-09-25', desc: 'Car insurance — Shield Mutual', cat: 'Transport', amount: 134.0, type: 'out' },
  { id: 't024', date: '2026-09-26', desc: 'Cinema — family film, Saturday', cat: 'Entertainment', amount: 38.0, type: 'out' },
  { id: 't025', date: '2026-09-28', desc: 'New backpack — Leo', cat: 'Kids', amount: 29.99, type: 'out' },
  { id: 't026', date: '2026-09-28', desc: 'Interest — savings account', cat: 'Income', amount: 12.0, type: 'in' },
  { id: 't027', date: '2026-09-30', desc: 'GreenMart top-up shop', cat: 'Groceries', amount: 64.2, type: 'out' },
  // ---- October 2026 ----
  { id: 't028', date: '2026-10-01', desc: 'Salary — Maya Marlowe, teaching', cat: 'Income', amount: 3400.0, type: 'in' },
  { id: 't029', date: '2026-10-01', desc: 'Mortgage — First County Bank', cat: 'Housing', amount: 1850.0, type: 'out' },
  { id: 't030', date: '2026-10-01', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 154.6, type: 'out' },
  { id: 't031', date: '2026-10-02', desc: 'Fuel — Shell, Maplewood Road', cat: 'Transport', amount: 47.8, type: 'out' },
  { id: 't032', date: '2026-10-03', desc: 'Salary — Tom Marlowe, electrical work', cat: 'Income', amount: 2950.0, type: 'in' },
  { id: 't033', date: '2026-10-03', desc: 'Gym — Riverside Fitness', cat: 'Health', amount: 45.0, type: 'out' },
  { id: 't034', date: '2026-10-05', desc: 'Electric — City Power', cat: 'Utilities', amount: 118.25, type: 'out' },
  { id: 't035', date: '2026-10-06', desc: 'Swimming lessons — Leo and Mia', cat: 'Kids', amount: 85.0, type: 'out' },
  { id: 't036', date: '2026-10-08', desc: 'Internet — NorthLink', cat: 'Utilities', amount: 79.0, type: 'out' },
  { id: 't037', date: '2026-10-08', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 148.9, type: 'out' },
  { id: 't038', date: '2026-10-10', desc: 'Car loan — First County Bank', cat: 'Transport', amount: 215.0, type: 'out' },
  { id: 't039', date: '2026-10-11', desc: 'Lunch — The Copper Kettle', cat: 'Dining Out', amount: 33.75, type: 'out' },
  { id: 't040', date: '2026-10-12', desc: 'Pharmacy — cough syrup and plasters', cat: 'Health', amount: 18.4, type: 'out' },
  { id: 't041', date: '2026-10-14', desc: 'School photos — Leo and Mia', cat: 'Kids', amount: 35.0, type: 'out' },
  { id: 't042', date: '2026-10-15', desc: 'Water — ClearWater', cat: 'Utilities', amount: 64.1, type: 'out' },
  { id: 't043', date: '2026-10-15', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 171.45, type: 'out' },
  { id: 't044', date: '2026-10-17', desc: 'Halloween costumes — Leo and Mia', cat: 'Kids', amount: 62.5, type: 'out' },
  { id: 't045', date: '2026-10-18', desc: 'Cinema — family film, Saturday', cat: 'Entertainment', amount: 36.0, type: 'out' },
  { id: 't046', date: '2026-10-18', desc: 'Weekend wiring job — Tom', cat: 'Income', amount: 190.0, type: 'in' },
  { id: 't047', date: '2026-10-20', desc: 'Mobile — two lines, NorthLink', cat: 'Utilities', amount: 96.0, type: 'out' },
  { id: 't048', date: '2026-10-22', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 139.2, type: 'out' },
  { id: 't049', date: '2026-10-24', desc: 'Takeaway pizza — Luigi’s', cat: 'Dining Out', amount: 29.8, type: 'out' },
  { id: 't050', date: '2026-10-26', desc: 'Winter tyres fitting', cat: 'Transport', amount: 120.0, type: 'out' },
  { id: 't051', date: '2026-10-27', desc: 'Car insurance — Shield Mutual', cat: 'Transport', amount: 134.0, type: 'out' },
  { id: 't052', date: '2026-10-28', desc: 'Books — Mia’s reading list', cat: 'Misc', amount: 26.4, type: 'out' },
  { id: 't053', date: '2026-10-28', desc: 'Interest — savings account', cat: 'Income', amount: 13.0, type: 'in' },
  { id: 't054', date: '2026-10-30', desc: 'Heating oil top-up', cat: 'Utilities', amount: 96.0, type: 'out' },
  // ---- November 2026 ----
  { id: 't055', date: '2026-11-01', desc: 'Salary — Maya Marlowe, teaching', cat: 'Income', amount: 3400.0, type: 'in' },
  { id: 't056', date: '2026-11-01', desc: 'Mortgage — First County Bank', cat: 'Housing', amount: 1850.0, type: 'out' },
  { id: 't057', date: '2026-11-02', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 148.2, type: 'out' },
  { id: 't058', date: '2026-11-03', desc: 'Salary — Tom Marlowe, electrical work', cat: 'Income', amount: 2950.0, type: 'in' },
  { id: 't059', date: '2026-11-03', desc: 'Fuel — Shell, Maplewood Road', cat: 'Transport', amount: 52.4, type: 'out' },
  { id: 't060', date: '2026-11-04', desc: 'Electric — City Power', cat: 'Utilities', amount: 142.1, type: 'out' },
  { id: 't061', date: '2026-11-05', desc: 'Swimming lessons — Leo and Mia', cat: 'Kids', amount: 85.0, type: 'out' },
  { id: 't062', date: '2026-11-06', desc: 'Pizza night — Luigi’s', cat: 'Dining Out', amount: 38.5, type: 'out' },
  { id: 't063', date: '2026-11-07', desc: 'Pharmacy — cold medicine', cat: 'Health', amount: 24.6, type: 'out' },
  { id: 't064', date: '2026-11-08', desc: 'Internet — NorthLink', cat: 'Utilities', amount: 79.0, type: 'out' },
  { id: 't065', date: '2026-11-09', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 162.75, type: 'out' },
  { id: 't066', date: '2026-11-10', desc: 'Bus passes — Maya and Tom', cat: 'Transport', amount: 96.0, type: 'out' },
  { id: 't067', date: '2026-11-10', desc: 'Car loan — First County Bank', cat: 'Transport', amount: 215.0, type: 'out' },
  { id: 't068', date: '2026-11-11', desc: 'Cinema — family film, Saturday', cat: 'Entertainment', amount: 42.0, type: 'out' },
  { id: 't069', date: '2026-11-12', desc: 'School shoes — Leo', cat: 'Clothing', amount: 54.99, type: 'out' },
  { id: 't070', date: '2026-11-14', desc: 'Takeaway Thai — Siam Garden', cat: 'Dining Out', amount: 31.2, type: 'out' },
  { id: 't071', date: '2026-11-15', desc: 'Water — ClearWater', cat: 'Utilities', amount: 68.4, type: 'out' },
  { id: 't072', date: '2026-11-15', desc: 'Weekend wiring job — Tom', cat: 'Income', amount: 280.0, type: 'in' },
  { id: 't073', date: '2026-11-16', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 139.85, type: 'out' },
  { id: 't074', date: '2026-11-17', desc: 'Car service — oil and filters', cat: 'Transport', amount: 189.0, type: 'out' },
  { id: 't075', date: '2026-11-18', desc: 'Dentist check-up — Maya', cat: 'Health', amount: 65.0, type: 'out' },
  { id: 't076', date: '2026-11-19', desc: 'Bookshop — birthday gift for Gran', cat: 'Misc', amount: 22.95, type: 'out' },
  { id: 't077', date: '2026-11-20', desc: 'Mobile — two lines, NorthLink', cat: 'Utilities', amount: 96.0, type: 'out' },
  { id: 't078', date: '2026-11-21', desc: 'GreenMart weekly shop', cat: 'Groceries', amount: 171.3, type: 'out' },
  { id: 't079', date: '2026-11-22', desc: 'Streaming — StreamPlus', cat: 'Entertainment', amount: 17.99, type: 'out' },
  { id: 't080', date: '2026-11-23', desc: 'School trip — science museum, Leo', cat: 'Kids', amount: 48.0, type: 'out' },
  { id: 't081', date: '2026-11-24', desc: 'Lunch out — Tom and colleagues', cat: 'Dining Out', amount: 27.4, type: 'out' },
  { id: 't082', date: '2026-11-25', desc: 'Hardware store — tap washers', cat: 'Home & Garden', amount: 34.6, type: 'out' },
  { id: 't083', date: '2026-11-26', desc: 'Winter coats — Mia', cat: 'Clothing', amount: 89.0, type: 'out' },
  { id: 't084', date: '2026-11-27', desc: 'Car insurance — Shield Mutual', cat: 'Transport', amount: 134.0, type: 'out' },
  { id: 't085', date: '2026-11-28', desc: 'GreenMart top-up shop', cat: 'Groceries', amount: 58.4, type: 'out' },
  { id: 't086', date: '2026-11-28', desc: 'Interest — savings account', cat: 'Income', amount: 14.0, type: 'in' },
  { id: 't087', date: '2026-11-29', desc: 'Heating oil top-up', cat: 'Utilities', amount: 128.0, type: 'out' },
];
