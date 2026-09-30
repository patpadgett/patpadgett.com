// Syntax-check the hub's scripts by parsing them (no execution).
const fs = require('fs');
for (const f of ['grime.js', 'set.js', 'crt.js', 'octavitin.js']) {
  try { new Function(fs.readFileSync('/data/pat/2_PUBLISHED/patpadgett.com/' + f, 'utf8')); console.log(f, 'parses'); }
  catch (e) { console.log(f, 'SYNTAX ERROR', e.message); process.exitCode = 1; }
}
