// Resolve axe "incomplete" aria items and sample real contrast of the new/changed text on their rendered backgrounds.
const { chromium } = require('playwright');
const URL = process.argv[2] || 'https://patpadgett.com/';
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1366, height: 900 } });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });
  const res = await p.evaluate(async () => {
    const r = await axe.run(document, { runOnly: ['aria-prohibited-attr', 'aria-valid-attr-value', 'aria-allowed-attr', 'aria-required-children', 'button-name', 'link-name', 'label', 'list', 'listitem', 'heading-order', 'region'] , resultTypes: ['violations', 'incomplete'] });
    const f = v => ({ id: v.id, nodes: v.nodes.slice(0, 5).map(n => ({ target: n.target.join(' '), html: n.html.slice(0, 160), msg: (n.failureSummary || (n.any[0] && n.any[0].message) || '').slice(0, 200) })) });
    return { violations: r.violations.map(f), incomplete: r.incomplete.map(f) };
  });
  console.log(JSON.stringify(res, null, 1));
  // pixel-sample contrast for the new text: sub-line, caption, status line
  await p.evaluate(() => document.querySelector('.grime__title span').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(400);
  const samples = await p.evaluate(() => [...document.querySelectorAll('.grime__title span, .log__doors small, .desk__status, .grime__line--fine')].map(e => { const cs = getComputedStyle(e); return { sel: e.className || e.tagName, color: cs.color, size: cs.fontSize, weight: cs.fontWeight, family: cs.fontFamily.split(',')[0] }; }));
  console.log(JSON.stringify(samples));
  await b.close();
})();
