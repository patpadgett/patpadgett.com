// Looking-row doors: computed styles + clip at 1366 and 390.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:8123/';
const TAG = process.argv[3] || 'r4';
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  for (const w of [1366, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(URL, { waitUntil: 'networkidle' });
    const li = await p.$('.log li:last-child'); await li.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
    const info = await li.evaluate(li => [...li.querySelectorAll('.log__doors a')].map(a => { const cs = getComputedStyle(a); const r = a.getBoundingClientRect(); return { t: a.innerText, color: cs.color, bg: cs.backgroundColor, h: Math.round(r.height), w: Math.round(r.width), pad: cs.padding, td: cs.textDecorationLine }; }));
    console.log(w, JSON.stringify(info));
    const bb = await li.boundingBox();
    await p.screenshot({ path: `/data/pat/.hermes/cache/scratch/pp/${TAG}-looking-${w}.png`, clip: { x: Math.max(0, bb.x - 10), y: Math.max(0, bb.y - 10), width: Math.min(w, bb.width + 20), height: bb.height + 20 } });
    await p.close();
  }
  await b.close();
})();
