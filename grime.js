/* grime.js — the printer under the desk and the stack of Polaroids beside it.
   Progressive: the HTML ships the three bookings that were latest at build time; with JS we fetch grime95.com/ledger.json
   (CORS: *) for the newest three, pull each record page's embedded JSON for the first two narrative paragraphs, and feed the
   sheet out of the slot when the printer scrolls into view. Clicking the stack sends the top Polaroid to the back and the
   printer tears off the old sheet and prints the booking now on top. */
(function () {
  var sec = document.getElementById('grime95'), paper = document.getElementById('paper'), stack = document.getElementById('stack');
  if (!sec || !paper) return;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var BASE = 'https://grime95.com';
  var isStatic = function () { return root.classList.contains('static') || matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function fmtDate(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? m[2] + '-' + m[3] + '-' + m[1] : (iso || ''); }
  function text(id, v) { var el = $(id); if (el) el.textContent = v; }
  function surname(c) { return ((c.last || '') + ', ' + (c.first || '')).toUpperCase(); }
  function recPath(b) { return BASE + '/rec/' + encodeURIComponent(b) + '/'; }
  function mugUrl(m) { return /^https?:/.test(m) ? m : BASE + (m.charAt(0) === '/' ? '' : '/') + m; }

  function noonLine(n, total) {
    var et = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    if (n >= total) return 'The roll is complete: ' + total + ' bookings on file.';
    return 'Next one prints ' + (et.getHours() < 12 ? 'today' : 'tomorrow') + ' at noon Eastern.';
  }

  /* ---------- the bookings, newest first: {c, a, story, fig} ---------- */
  var BOOK = [], total = 313, count = 5, NEWEST = '';

  /* seed from the shipped HTML so the stack shuffles before (or without) the fetch */
  function seedFromHTML() {
    var figs = stack ? [].slice.call(stack.querySelectorAll('.polaroid')) : [];
    figs.forEach(function (f, i) {
      var b = f.querySelector('.polaroid__cap b').textContent, nm = f.querySelector('.polaroid__cap span').textContent.split(', ');
      var c = { name: ((nm[1] || '') + ' ' + nm[0]).trim(), last: nm[0], first: nm[1] || '', alias: null };
      var a = { booking: b, charge: '', location: '', officer: '', date: '', mugshot: f.querySelector('img').getAttribute('src') };
      var st = null;
      if (i === 0) {
        c.name = ($('p-subject') || { textContent: c.name }).textContent;
        a.charge = ($('p-charge') || {}).textContent || ''; a.location = ($('p-location') || {}).textContent || '';
        a.officer = ($('p-officer') || {}).textContent || ''; a.date = '';
        st = [].slice.call(document.querySelectorAll('#p-narr p')).map(function (p) { return p.textContent; });
      }
      BOOK.push({ c: c, a: a, story: st, fig: f });
    });
  }

  /* ---------- the sheet ---------- */
  function fill(b) {
    var c = b.c, a = b.a;
    paper.href = recPath(a.booking);
    text('paper-bkg', 'Booking ' + a.booking);
    text('p-subject', c.name.toUpperCase());
    var aka = $('p-aka'); if (aka) aka.innerHTML = c.alias ? '<span class="aka">&ldquo;' + esc(c.alias) + '&rdquo;</span>' : '&mdash;';
    text('p-charge', a.charge || '\u2014'); text('p-location', a.location || '\u2014'); text('p-officer', a.officer || '\u2014');
    text('p-date', a.date ? fmtDate(a.date) : '12-02-1995');
    var narr = $('p-narr');
    if (narr) narr.innerHTML = (b.story && b.story.length ? b.story.slice(0, 2) : ['The full report is on file at grime95.com.']).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    paper.setAttribute('aria-label', 'Booking ' + a.booking + ', ' + c.name + '. Read the full report on grime95.com');
  }
  function status(b) {
    var st = $('desk-status'); if (!st) return;
    var latest = !NEWEST || b.a.booking === NEWEST, n = +String(b.a.booking).slice(-4) || count;
    st.innerHTML = (latest ? 'Latest on file: ' : 'On top: ') + '<b>booking ' + n + ' of ' + total + '</b>. ' + (latest ? noonLine(count, total) : 'Tap the stack for the next one.');
  }

  function story(b) {
    if (b.story) return Promise.resolve();
    if (b._p) return b._p;
    b._p = fetch(recPath(b.a.booking), { headers: { Accept: 'text/html' } }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (html) {
      var m = /<script type="application\/json" id="record-data">([\s\S]*?)<\/script>/.exec(html);
      if (!m) throw 0;
      var d = JSON.parse(m[1]); var a = (d.arrests || []).filter(function (x) { return x.booking === b.a.booking; })[0] || d.arrests[0];
      b.story = (a && a.story) || [];
    }).catch(function () { b.story = []; });
    return b._p;
  }

  /* ---------- feed / reprint ---------- */
  var fed = false;
  function feed() { if (fed) return; fed = true; sec.classList.add('is-fed'); }
  var printer = $('printer') || $('desk') || sec;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { feed(); io.disconnect(); } }, { threshold: .05, rootMargin: '0px 0px -10% 0px' });
    io.observe(printer);
    setTimeout(function () { var r = printer.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) feed(); }, 1200);
  } else feed();

  var printing = false;
  function reprint(b) {
    if (isStatic() || !sec.classList.contains('is-fed')) { return story(b).then(function () { fill(b); status(b); }); }
    printing = true;
    paper.classList.remove('is-refed'); paper.classList.add('is-tearing');
    return Promise.all([story(b), new Promise(function (r) { setTimeout(r, 520); })]).then(function () {
      fill(b); status(b);
      paper.classList.remove('is-tearing'); void paper.offsetWidth; paper.classList.add('is-refed');
      setTimeout(function () { printing = false; }, 1600);
    });
  }

  /* ---------- the stack: click → top goes to the back, the next one prints ---------- */
  function layout() { BOOK.forEach(function (b, i) { if (b.fig) b.fig.dataset.i = i; }); }
  if (stack) {
    stack.addEventListener('click', function () {
      if (printing || BOOK.length < 2) return;
      var top = BOOK.shift(); BOOK.push(top);
      if (top.fig && !isStatic()) { top.fig.classList.add('is-lifting'); setTimeout(function () { top.fig.classList.remove('is-lifting'); layout(); }, 240); }
      else layout();
      reprint(BOOK[0]);
    });
  }

  /* ---------- live data ---------- */
  seedFromHTML(); if (BOOK[0]) NEWEST = BOOK[0].a.booking;
  fetch(BASE + '/ledger.json', { headers: { Accept: 'application/json' } }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (data) {
    var all = [];
    (data.characters || []).forEach(function (c) { (c.arrests || []).forEach(function (a) { all.push({ c: c, a: a, story: null }); }); });
    if (!all.length) return;
    all.sort(function (x, y) { return y.a.booking.localeCompare(x.a.booking); });
    total = data.total || total; count = all.length; NEWEST = all[0].a.booking;
    var top3 = all.slice(0, 3);
    var changed = !BOOK[0] || BOOK[0].a.booking !== top3[0].a.booking;
    var figs = BOOK.map(function (b) { return b.fig; });
    BOOK = top3.map(function (b, i) {
      var fig = figs[i]; b.fig = fig;
      if (fig) {
        var img = fig.querySelector('img'), cap = fig.querySelector('.polaroid__cap');
        var src = mugUrl(b.a.mugshot || '');
        if (img.getAttribute('src') !== src) { img.src = src; img.removeAttribute('width'); img.removeAttribute('height'); }
        img.alt = 'Booking photograph: ' + b.c.name + '. Fiction.';
        cap.querySelector('b').textContent = b.a.booking; cap.querySelector('span').textContent = surname(b.c);
      }
      return b;
    });
    layout();
    return story(BOOK[0]).then(function () {
      if (changed && sec.classList.contains('is-fed')) reprint(BOOK[0]); else { fill(BOOK[0]); status(BOOK[0]); }
      BOOK.slice(1).forEach(story);   // warm the other two so a shuffle prints without waiting
    });
  }).catch(function () { /* the shipped bookings stand */ });
})();
