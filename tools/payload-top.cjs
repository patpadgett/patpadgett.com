// Biggest responses after a full scroll at a given viewport/DPR.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:8123/';
const w = +(process.argv[3] || 390), dpr = +(process.argv[4] || 2);
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, deviceScaleFactor: dpr });
  const page = await ctx.newPage();
  const rows = [];
  page.on('response', async r => { try { const h = r.headers(); let len = +h['content-length'] || 0; if (!len) { try { len = (await r.body()).length; } catch (e) { } } rows.push({ url: r.url().replace(URL, '/'), kb: Math.round(len / 1024), type: (h['content-type'] || '').split(';')[0], enc: h['content-encoding'] || '' }); } catch (e) { } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  const firstView = rows.reduce((a, r) => a + r.kb, 0);
  await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  const th = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < th; y += 500) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(80); }
  await page.waitForTimeout(2500);
  rows.sort((a, b) => b.kb - a.kb);
  console.log(`${w}@${dpr}x first-view KB: ${firstView}; after full scroll KB: ${rows.reduce((a, r) => a + r.kb, 0)}; requests ${rows.length}`);
  for (const r of rows.slice(0, 25)) console.log(String(r.kb).padStart(5), r.type.padEnd(16), r.enc.padEnd(5), r.url.slice(0, 90));
  await browser.close();
})();
