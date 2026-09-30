// DPR2 zoom of the paper/printer junction at 1366 to verify the bail strip really sits in front of the sheet.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'http://127.0.0.1:8123/';
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 2 });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await p.evaluate(() => document.getElementById('printer').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(2600);
  const g = await p.evaluate(() => {
    const plate = document.querySelector('.printer__plate').getBoundingClientRect();
    const slot = document.querySelector('.printer__slot').getBoundingClientRect();
    const bail = document.querySelector('.printer__bail');
    const cs = getComputedStyle(bail);
    // hit-test: what is on top at the bail line centre and at the paper's centre 20px above the slot bottom
    const bx = plate.left + plate.width / 2, by = plate.top + plate.height * 0.296;
    const top1 = document.elementFromPoint(bx, by);
    const top2 = document.elementFromPoint(bx, slot.bottom - 20);
    const top3 = document.elementFromPoint(bx, slot.bottom + 12);
    return { plate: { x: plate.x, y: plate.y, w: plate.width, h: plate.height }, slotBottom: slot.bottom, bailZ: cs.zIndex, bailClip: cs.clipPath, bailPE: cs.pointerEvents,
      atBail: top1 && (top1.className || top1.tagName), abovePrintLine: top2 && (top2.className || top2.tagName), belowPrintLine: top3 && (top3.className || top3.tagName) };
  });
  console.log(JSON.stringify(g));
  const pl = g.plate;
  await p.screenshot({ path: '/data/pat/.hermes/cache/scratch/pp/junction-r7.png', clip: { x: pl.x + pl.w * 0.08, y: pl.y + pl.h * 0.18, width: pl.w * 0.84, height: pl.h * 0.36 } });
  await b.close();
})();
