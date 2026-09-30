// Technical audit sweep for the hub (local or live): overflow, touch targets, images, a11y (axe-core), keyboard shuffle,
// reduced-motion, no-JS, print, payload by viewport/DPR. Prints JSON per check.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:8123/';
const AXE = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
const out = {};
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });

  // 1. responsive sweep
  out.responsive = {};
  for (const w of [320, 390, 768, 1024, 1366, 1920]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [], bad = [];
    page.on('pageerror', e => errors.push(String(e.message || e).slice(0, 120)));
    page.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 500) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(60); }
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const vis = el => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const small = [...document.querySelectorAll('a[href],button,[role=button],input,select')].filter(vis).map(el => { const b = el.getBoundingClientRect(); return { t: (el.getAttribute('aria-label') || el.innerText || el.className).trim().replace(/\s+/g, ' ').slice(0, 40), w: Math.round(b.width), h: Math.round(b.height) }; }).filter(x => x.w < 44 || x.h < 44);
      const imgs = [...document.querySelectorAll('img')].filter(vis);
      const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc.split('/').pop());
      const noAlt = [...document.querySelectorAll('img:not([alt])')].length;
      return { scrollW: document.documentElement.scrollWidth, innerW: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth, scrollH: document.documentElement.scrollHeight, smallTargets: small, brokenImgs: broken, imgCount: imgs.length, noAlt };
    });
    out.responsive[w] = { ...r, pageErrors: errors, badResponses: bad };
    await ctx.close();
  }

  // 2. axe-core a11y at 1366 and 390
  out.axe = {};
  for (const w of [1366, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 500) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(40); }
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1200);
    try {
      await page.addScriptTag({ url: AXE });
      const res = await page.evaluate(async () => { const r = await axe.run(document, { resultTypes: ['violations', 'incomplete'] }); return { violations: r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, nodes: v.nodes.slice(0, 6).map(n => ({ target: n.target.join(' '), msg: (n.failureSummary || '').split('\n').slice(0, 3).join(' ').slice(0, 220) })) })), incomplete: r.incomplete.map(v => ({ id: v.id, n: v.nodes.length })) }; });
      out.axe[w] = res;
    } catch (e) { out.axe[w] = { error: String(e.message).slice(0, 200) }; }
    await ctx.close();
  }

  // 3. keyboard shuffle + heading outline + landmarks + focus visibility (1366)
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    out.structure = await page.evaluate(() => ({
      headings: [...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ': ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 50)),
      landmarks: [...document.querySelectorAll('header,main,nav,footer,[role]')].map(e => e.tagName.toLowerCase() + (e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : '')).slice(0, 30),
      lang: document.documentElement.lang, title: document.title, skip: !!document.querySelector('a[href="#main"],.skip'),
    }));
    // shuffle: focus stack, Enter x3, read the booking ids
    await page.evaluate(() => document.getElementById('printer').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(2600);
    const ids = [];
    ids.push(await page.$eval('#paper-bkg', e => e.textContent));
    await page.focus('#stack');
    const focusRing = await page.$eval('#stack', e => { const cs = getComputedStyle(e); return { outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, matchesFV: e.matches(':focus-visible') }; });
    for (let i = 0; i < 3; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(2400); ids.push(await page.$eval('#paper-bkg', e => e.textContent)); }
    const topAfter = await page.$$eval('.polaroid', ps => ps.map(p => p.dataset.i + ':' + p.querySelector('b').textContent));
    const paperHref = await page.$eval('#paper', a => a.href);
    const status = await page.$eval('#desk-status', e => e.textContent);
    out.shuffle = { ids, cyclesBack: ids[0] === ids[3], topAfter, paperHref, status, focusRing };
    // tab order: first 12 focusable stops
    await page.evaluate(() => scrollTo(0, 0));
    await page.keyboard.press('Tab');
    const stops = [];
    for (let i = 0; i < 14; i++) { stops.push(await page.evaluate(() => { const e = document.activeElement; if (!e) return null; const cs = getComputedStyle(e); return (e.tagName + (e.className ? '.' + String(e.className).split(' ')[0] : '') + ' "' + (e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ').slice(0, 30) + '"' + (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? ' [ring]' : ' [NO RING]')); })); await page.keyboard.press('Tab'); }
    out.tabStops = stops;
    await ctx.close();
  }

  // 4. reduced motion + print + no-JS
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('printer').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(800);
    out.reducedMotion = await page.evaluate(() => { const cs = getComputedStyle(document.getElementById('paper')); const anims = document.getAnimations ? document.getAnimations().length : -1; return { paperTransform: cs.transform, paperAnim: cs.animationName, runningAnimations: anims, canvas: !!document.querySelector('.tv canvas'), htmlClass: document.documentElement.className }; });
    await page.emulateMedia({ media: 'print' });
    out.print = await page.evaluate(() => { const v = s => { const e = document.querySelector(s); if (!e) return 'missing'; const cs = getComputedStyle(e); return cs.display === 'none' ? 'hidden' : 'shown'; }; return { paper: v('#paper'), printer: v('.printer'), polaroid: v('.polaroid'), pitch: v('.grime__pitch'), doors: v('.log__doors'), guide: v('.guide'), tv: v('.tv') }; });
    await ctx.close();
    const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const p2 = await ctx2.newPage();
    await p2.goto(URL, { waitUntil: 'load' });
    await p2.evaluate(() => document.getElementById('printer').scrollIntoView({ block: 'center' }));
    await p2.waitForTimeout(600);
    out.noJS = await p2.evaluate(() => { const paper = document.getElementById('paper'); const b = paper.getBoundingClientRect(); const cs = getComputedStyle(paper); return { paperTransform: cs.transform, paperVisibleHeight: Math.round(b.height), paperText: paper.innerText.slice(0, 80).replace(/\n/g, ' | '), stackIsButton: document.getElementById('stack').tagName, keys: [...document.querySelectorAll('.tvkey')].filter(k => getComputedStyle(k).visibility !== 'hidden').length, resumeLinks: [...document.querySelectorAll('a[href*="resume.patpadgett.com"]')].length }; });
    await ctx2.close();
  }

  // 5. payload by viewport/DPR (first view after full scroll, lazy images included)
  out.payload = {};
  for (const [w, dpr] of [[390, 2], [390, 3], [1366, 1], [1440, 2]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 }, deviceScaleFactor: dpr });
    const page = await ctx.newPage();
    const byType = {}; let total = 0, n = 0; const urls = new Set(); const dup = [];
    page.on('response', async r => { try { const u = r.url(); if (urls.has(u)) dup.push(u.split('/').pop()); urls.add(u); const h = r.headers(); let len = +h['content-length'] || 0; if (!len) { try { len = (await r.body()).length; } catch (e) { } } const t = (h['content-type'] || '').split(';')[0].split('/')[0] || 'other'; byType[t] = (byType[t] || 0) + len; total += len; n++; } catch (e) { } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const th = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < th; y += 500) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(80); }
    await page.waitForTimeout(2500);
    const plateReqs = [...urls].filter(u => /printer/.test(u)).map(u => u.split('/').pop());
    out.payload[`${w}@${dpr}x`] = { totalKB: Math.round(total / 1024), requests: n, byTypeKB: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)])), printerFiles: plateReqs, duplicateRequests: dup.slice(0, 5) };
    await ctx.close();
  }
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
})();
