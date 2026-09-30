// Local inspection: desk geometry + section captures at 1366 and 390 (plus 320), page errors, overflow.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:8123/';
const OUT = '/data/pat/.hermes/cache/scratch/pp/';
const TAG = process.argv[3] || 'local';
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  for (const vp of [{ width: 1366, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 568 }]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(String(e.message || e)));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(vp.height * 0.6)) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(100); }
    await page.evaluate(() => document.getElementById('printer').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(2600);
    const g = await page.evaluate(() => {
      const q = s => document.querySelector(s);
      const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width), h: Math.round(b.height) }; };
      const plate = q('.printer__plate'), slot = q('.printer__slot'), paper = q('#paper'), stack = q('#stack'), top = q('.polaroid[data-i="0"]'), hint = q('.stack__hint');
      const pb = r(plate), sb = r(slot), stb = r(stack), tb = r(top), hb = r(hint);
      const imgs = [...document.querySelectorAll('.polaroid__img,.printer__plate,.printer__bail img,.printer__head img')].map(i => ({ src: (i.currentSrc || i.src).split('/').pop(), ok: i.complete && i.naturalWidth > 0 }));
      // where does the slot's bottom edge land on the plate (as % of plate height)?
      const slotBottomPct = ((sb.bottom - pb.top) / pb.h * 100).toFixed(1);
      const slotLeftPct = ((sb.left - pb.left) / pb.w * 100).toFixed(1), slotRightPct = ((sb.right - pb.left) / pb.w * 100).toFixed(1);
      // pin columns: paper::before/after centre in plate %
      const pcs = getComputedStyle(paper, '::before'), pca = getComputedStyle(paper, '::after');
      const pinL = (paper.getBoundingClientRect().left + parseFloat(pcs.left) + parseFloat(pcs.marginLeft) + parseFloat(pcs.width) / 2 - pb.left) / pb.w * 100;
      const pinR = (paper.getBoundingClientRect().left + parseFloat(pca.left) + parseFloat(pca.marginLeft) + parseFloat(pca.width) / 2 - pb.left) / pb.w * 100;
      const sec = q('#grime95');
      return {
        fed: sec.classList.contains('is-fed'), sec: r(sec), desk: r(q('#desk')), pitch: r(q('.grime__pitch')), stack: stb, topCard: tb, hint: hb, hintOverPhoto: hb && tb ? (hb.bottom > r(q('.polaroid[data-i="0"] .polaroid__frame')).top) : null,
        slot: sb, paper: r(paper), paperTransform: getComputedStyle(paper).transform, plate: pb, slotBottomPct, slotLeftPct, slotRightPct, pinL: pinL.toFixed(1), pinR: pinR.toFixed(1),
        tag: r(q('.printer__tag')), status: q('#desk-status').innerText, imgs, docW: document.documentElement.scrollWidth, vw: innerWidth, scrollH: document.documentElement.scrollHeight,
        stackBottomVsPlateBottom: stb && pb ? stb.bottom - pb.bottom : null,
        akaHidden: q('#p-aka').hidden, narrVisible: [...q('#p-narr').children].filter(p => getComputedStyle(p).display !== 'none').length,
        hd: q('.paper__hd').innerText.replace(/\n/g, ' | '),
        doors: [...document.querySelectorAll('.log__doors a')].map(a => { const b = a.getBoundingClientRect(); return { t: a.innerText.trim(), h: Math.round(b.height), w: Math.round(b.width), href: a.href }; }),
      };
    });
    console.log('=== ' + vp.width + ' ===');
    console.log(JSON.stringify(g, null, 1));
    console.log('pageerrors:', errors, 'failed:', failed);
    const s = g.sec;
    await page.screenshot({ path: `${OUT}${TAG}-sec-${vp.width}.png`, fullPage: true, clip: { x: 0, y: s.top, width: vp.width, height: Math.min(s.h + 20, 5000) } });
    // desk close-up
    const d = g.desk;
    await page.screenshot({ path: `${OUT}${TAG}-desk-${vp.width}.png`, fullPage: true, clip: { x: Math.max(0, d.left - 20), y: d.top - 30, width: Math.min(vp.width, d.w + 40), height: Math.min(d.h + 60, 4000) } });
    // looking row
    const li = await page.$('.log li:last-child');
    if (li) { await li.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); const bb = await li.boundingBox(); await page.screenshot({ path: `${OUT}${TAG}-looking-${vp.width}.png`, clip: { x: Math.max(0, bb.x - 10), y: Math.max(0, bb.y - 10), width: Math.min(vp.width, bb.width + 20), height: bb.height + 20 } }); }
    await ctx.close();
  }
  await browser.close();
})();
