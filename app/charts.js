// Inline SVG charts for Hearth & Ledger. No libraries, no network:
// every chart is a string of SVG built from the numbers passed in.

// Format a dollar amount with commas and no cents when it is whole.
export function money(n) {
  const v = Math.round(n * 100) / 100;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Grouped bars: two series (income, spending) per month, with a savings
// line over the top. Returns an SVG string sized to its viewBox.
export function monthlyChart(months, opts = {}) {
  const width = opts.width || 960;
  const height = opts.height || 320;
  const padL = 58;
  const padR = 14;
  const padT = 18;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const maxV = Math.max(...months.map((m) => Math.max(m.income, m.spending))) * 1.08;
  const maxSave = Math.max(...months.map((m) => m.income - m.spending));
  const y = (v) => padT + plotH - (v / maxV) * plotH;
  const slot = plotW / months.length;
  const barW = Math.min(22, (slot - 14) / 2);

  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gv = maxV * f;
    const gy = y(gv);
    return `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" stroke="#e9e1cd" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#7a8577">${money(Math.round(gv))}</text>`;
  }).join('');

  const bars = months.map((m, i) => {
    const cx = padL + slot * i + slot / 2;
    const inH = (m.income / maxV) * plotH;
    const spH = (m.spending / maxV) * plotH;
    return `<rect x="${cx - barW - 2}" y="${y(m.income)}" width="${barW}" height="${inH}" rx="2" fill="#1e4d3b">` +
      `<title>${esc(m.label)} income ${money(m.income)}</title></rect>` +
      `<rect x="${cx + 2}" y="${y(m.spending)}" width="${barW}" height="${spH}" rx="2" fill="#c98a2e">` +
      `<title>${esc(m.label)} spending ${money(m.spending)}</title></rect>` +
      `<text x="${cx}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#4c5a48">${esc(m.label)}</text>`;
  }).join('');

  // Savings line: scaled to the same axis so its height is honest.
  const saveMax = Math.max(maxSave, 1);
  const linePts = months.map((m, i) => {
    const cx = padL + slot * i + slot / 2;
    const s = m.income - m.spending;
    return `${cx},${padT + plotH - (s / maxV) * plotH}`;
  }).join(' ');
  const dots = months.map((m, i) => {
    const cx = padL + slot * i + slot / 2;
    const s = m.income - m.spending;
    return `<circle cx="${cx}" cy="${padT + plotH - (s / maxV) * plotH}" r="3.5" fill="#b4552d">` +
      `<title>${esc(m.label)} saved ${money(s)}</title></circle>`;
  }).join('');
  void saveMax;

  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" ` +
    `aria-label="Monthly income, spending and savings for the last twelve months">` +
    grid +
    `<line x1="${padL}" y1="${padT + plotH}" x2="${width - padR}" y2="${padT + plotH}" stroke="#ddd2b8" stroke-width="1"/>` +
    bars +
    `<polyline points="${linePts}" fill="none" stroke="#b4552d" stroke-width="2.5" stroke-linejoin="round"/>` +
    dots +
    `</svg>`;
}

// A single horizontal bar with a label and a value, used for category
// breakdowns and top-spending lists. `max` scales the track.
export function hbar(label, value, max, cls = '') {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return `<div class="bar-row"><span class="bar-label">${esc(label)}</span>` +
    `<span class="bar-track"><span class="bar-fill ${cls}" style="display:block;width:${pct.toFixed(1)}%"></span></span>` +
    `<span class="bar-amount">${money(value)}</span></div>`;
}

// A small donut showing one share (used for the savings rate on the
// dashboard): a ring with the percentage in the middle.
export function rateRing(pct, label) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const shown = Math.max(0, Math.min(100, pct));
  const dash = (shown / 100) * circ;
  return `<svg viewBox="0 0 140 140" width="140" height="140" role="img" aria-label="${esc(label)}">` +
    `<circle cx="70" cy="70" r="${r}" fill="none" stroke="#dce8dd" stroke-width="13"/>` +
    `<circle cx="70" cy="70" r="${r}" fill="none" stroke="#1e4d3b" stroke-width="13" ` +
    `stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}" stroke-linecap="round" ` +
    `transform="rotate(-90 70 70)"/>` +
    `<text x="70" y="66" text-anchor="middle" font-size="26" font-weight="700" fill="#143527" ` +
    `font-family="Georgia, serif">${shown.toFixed(0)}%</text>` +
    `<text x="70" y="88" text-anchor="middle" font-size="11" fill="#4c5a48">${esc(label)}</text>` +
    `</svg>`;
}
