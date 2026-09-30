#!/usr/bin/env python3
"""Seed the hub's grime95 desk (Polaroid stack + printout) from grime95.com so the no-JS state ships the real latest bookings.

Writes the block between <!-- grime-seed:start --> and <!-- grime-seed:end --> in index.html. grime.js refreshes the same
markup live from ledger.json, so this only needs re-running when the shipped fallback should catch up with the roll:

    python3 tools/grime_seed.py            # rewrite index.html in place
    python3 tools/grime_seed.py --check    # exit 1 if the shipped block is behind the ledger
"""
import html, json, re, struct, sys, urllib.request
from pathlib import Path

BASE = 'https://grime95.com'
ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / 'index.html'
START, END = '<!-- grime-seed:start', '<!-- grime-seed:end -->'
PLATE = ('src="assets/plates/printer-s.webp" srcset="assets/plates/printer-s.webp 768w, assets/plates/printer-m.webp 1200w, '
         'assets/plates/printer.webp 1536w" sizes="(max-width:960px) 92vw, 46vw" width="1536" height="1024" alt="" loading="lazy"')


def get(url, binary=False):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'patpadgett.com grime_seed'}), timeout=30) as r:
        data = r.read()
    return data if binary else data.decode('utf-8', 'replace')


def jpeg_size(data):
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1; continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack('>HH', data[i + 5:i + 9]); return w, h
        i += 2 + struct.unpack('>H', data[i + 2:i + 4])[0]
    return None


def esc(s):
    return html.escape(str(s), quote=True)


def fmt_date(iso):
    m = re.match(r'^(\d{4})-(\d{2})-(\d{2})$', iso or '')
    return f'{m[2]}-{m[3]}-{m[1]}' if m else (iso or '12-02-1995')


def newest(n=3):
    d = json.loads(get(BASE + '/ledger.json'))
    rows = [(a['booking'], c, a) for c in d['characters'] for a in c.get('arrests', [])]
    rows.sort(key=lambda r: r[0], reverse=True)
    return d, rows[:n], len(rows)


def story(booking):
    page = get(f'{BASE}/rec/{booking}/')
    m = re.search(r'<script type="application/json" id="record-data">([\s\S]*?)</script>', page)
    if not m:
        return []
    d = json.loads(m.group(1))
    a = next((x for x in d.get('arrests', []) if x.get('booking') == booking), (d.get('arrests') or [{}])[0])
    return a.get('story') or []


def mug(a):
    m = a.get('mugshot') or ''
    return m if m.startswith('http') else BASE + ('' if m.startswith('/') else '/') + m


def render(d, rows, count):
    total = d.get('total', 313)
    figs = []
    for i, (b, c, a) in enumerate(rows):
        url = mug(a)
        size = jpeg_size(get(url, binary=True)) or (600, 750)
        figs.append(
            f'    <figure class="polaroid" data-i="{i}">\n'
            f'      <span class="polaroid__frame"><img class="polaroid__img" src="{esc(url)}" width="{size[0]}" height="{size[1]}" '
            f'alt="Booking photograph: {esc(c["name"])}. Fiction." loading="lazy" decoding="async"></span>\n'
            f'      <figcaption class="polaroid__cap"><b>{esc(b)}</b><span>{esc((c.get("last", "") + ", " + c.get("first", "")).upper())}</span></figcaption>\n'
            f'    </figure>')
    b, c, a = rows[0]
    paras = story(b)[:1] or ['The full report is on file at grime95.com.']
    alias = c.get('alias')
    hid = '' if alias else ' hidden'
    aka = f'<span class="aka">&ldquo;{esc(alias)}&rdquo;</span>' if alias else '&mdash;'
    n = int(str(b)[-4:])
    return f'''{START} — written by tools/grime_seed.py from grime95.com/ledger.json; grime.js refreshes it live -->
<div class="desk" id="desk">
  <button class="stack" id="stack" type="button" aria-label="Booking photographs, three most recent. Press to shuffle: the next photo comes to the top and the printer prints its report." aria-describedby="desk-status">
{chr(10).join(figs)}
    <span class="stack__hint" aria-hidden="true">TAP TO SHUFFLE</span>
  </button>
  <div class="printer" id="printer">
    <div class="printer__slot">
      <a class="paper" id="paper" href="{BASE}/rec/{esc(b)}/" aria-label="Booking {esc(b)}, {esc(c['name'])}. Read the full report on grime95.com">
        <p class="paper__hd"><span class="paper__dept">Ponder Co. Sheriff’s Dept.</span><span class="paper__form">Incident Report</span><small><span>Fictional record</span><span><span class="paper__term">Term&nbsp;03 · </span><i id="paper-bkg">Bkg&nbsp;{esc(b)}</i></span></small></p>
        <dl class="paper__grid" id="paper-grid">
          <dt>Subject</dt><dd id="p-subject">{esc(c['name'].upper())}</dd>
          <dt id="p-aka-dt"{hid}>AKA</dt><dd id="p-aka"{hid}>{aka}</dd>
          <dt>Charge</dt><dd id="p-charge">{esc(a.get('charge') or '—')}</dd>
          <dt>Location</dt><dd id="p-location">{esc(a.get('location') or '—')}</dd>
          <dt class="f-officer">Officer</dt><dd class="f-officer" id="p-officer">{esc(a.get('officer') or '—')}</dd>
          <dt class="f-date">Date</dt><dd class="f-date" id="p-date">{esc(fmt_date(a.get('date')))}</dd>
        </dl>
        <h3>Narrative</h3>
        <div class="paper__narr" id="p-narr">{''.join(f'<p>{esc(p)}</p>' for p in paras)}</div>
        <p class="paper__more"><span>Continued on grime95.com<span class="ico-wrap"> <svg class="ico" aria-hidden="true"><use href="#i-right"/></svg></span></span></p>
      </a>
    </div>
    <div class="printer__body">
      <img class="printer__plate" {PLATE}>
      <span class="printer__bail" aria-hidden="true"><img {PLATE}></span>
      <p class="printer__tag" aria-hidden="true">PROPERTY OF PONDER CO.<span class="printer__tag-term"> · TERM 03</span></p>
    </div>
  </div>
  <p class="desk__status" id="desk-status" role="status">Latest on file: <b>booking {n} of {total}</b>. Next one prints at noon Eastern.</p>
</div>
{END}'''


def main():
    check = '--check' in sys.argv
    src = INDEX.read_text(encoding='utf-8')
    s, e = src.find(START), src.find(END)
    if s < 0 or e < 0:
        sys.exit('markers not found in index.html')
    d, rows, count = newest()
    shipped = re.search(r'<figcaption class="polaroid__cap"><b>([^<]+)</b>', src[s:e])
    if check:
        ok = shipped and shipped.group(1) == rows[0][0]
        print(('current' if ok else 'BEHIND') + f': shipped {shipped.group(1) if shipped else "?"} vs ledger {rows[0][0]}')
        sys.exit(0 if ok else 1)
    block = render(d, rows, count)
    out = src[:s] + block + src[e + len(END):]
    INDEX.write_text(out, encoding='utf-8')
    print(f'seeded {rows[0][0]} ({rows[0][1]["name"]}); {count} on file of {d.get("total")}')


if __name__ == '__main__':
    main()
