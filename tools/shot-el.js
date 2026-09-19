const { chromium } = require('playwright');
(async () => {
  const [sel, out, w] = [process.argv[2], process.argv[3], +(process.argv[4] || 1366)];
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:8091/', { waitUntil: 'networkidle' });
  await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
  await p.locator(sel).first().screenshot({ path: out });
  console.log('ok', out);
  await b.close();
})();
