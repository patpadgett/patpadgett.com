const { chromium } = require('playwright');
(async () => {
  const sel = process.argv[2] || '#remote';
  const out = process.argv[3] || '/tmp/pp-shot.png';
  const w = +(process.argv[4] || 1366);
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:8091/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  if (sel === 'full') { await p.screenshot({ path: out, fullPage: true }); }
  else {
    await p.locator(sel).first().scrollIntoViewIfNeeded();
    await p.waitForTimeout(1200);
    const r = await p.locator(sel).first().boundingBox();
    await p.screenshot({ path: out, clip: { x: Math.max(0, r.x - 20), y: Math.max(0, r.y - 20), width: Math.min(w, r.width + 160), height: r.height + 100 } });
  }
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log('shot', out, 'overflow', ov);
  await b.close();
})();
