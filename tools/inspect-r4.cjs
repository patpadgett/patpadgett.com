// Round-4 checks: title line count, tag within the deck band, hint clear of the photo, link target height, at 1366/390/320.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:8123/';
const TAG = process.argv[3] || 'r5';
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  for (const w of [1366, 390, 320]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await p.evaluate(() => document.getElementById('printer').scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(2600);
    const r = await p.evaluate(() => {
      const q = s => document.querySelector(s);
      const rect = el => el.getBoundingClientRect();
      const title = q('.grime__title'); const tr = rect(title); const lh = parseFloat(getComputedStyle(title).lineHeight);
      const range = document.createRange(); range.selectNodeContents(title.firstChild); const lines = range.getClientRects().length;
      const plate = rect(q('.printer__plate')), tag = rect(q('.printer__tag'));
      const frame = rect(q('.polaroid[data-i="0"] .polaroid__frame')), hint = rect(q('.stack__hint'));
      const link = rect(q('.grime__line a'));
      const sub = q('.grime__title span');
      return {
        titleLines: lines, titleText: title.firstChild.textContent, subLine: sub.innerText, subFont: getComputedStyle(sub).font.slice(0, 40),
        tagTopPct: ((tag.top - plate.top) / plate.height * 100).toFixed(1), tagBottomPct: ((tag.bottom - plate.top) / plate.height * 100).toFixed(1),
        hintBottomVsFrameTop: Math.round(hint.bottom - frame.top), linkH: Math.round(link.height),
        docW: document.documentElement.scrollWidth,
      };
    });
    console.log(w, JSON.stringify(r));
    const d = await p.$('#desk'); const bb = await d.boundingBox();
    await p.screenshot({ path: `/data/pat/.hermes/cache/scratch/pp/${TAG}-desk-${w}.png`, clip: { x: Math.max(0, bb.x - 20), y: Math.max(0, bb.y - 30), width: Math.min(w, bb.width + 40), height: Math.min(900, bb.height + 60) } });
    const pitch = await p.$('.grime__pitch'); await pitch.scrollIntoViewIfNeeded(); await p.waitForTimeout(200); const pb = await pitch.boundingBox();
    await p.screenshot({ path: `/data/pat/.hermes/cache/scratch/pp/${TAG}-pitch-${w}.png`, clip: { x: Math.max(0, pb.x - 10), y: Math.max(0, pb.y - 10), width: Math.min(w, pb.width + 20), height: Math.min(900, pb.height + 20) } });
    await p.close();
  }
  await b.close();
})();
