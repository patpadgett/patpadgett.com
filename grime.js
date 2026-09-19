/* grime.js — the printer under the desk. Progressive: the HTML ships the booking that was latest at build time;
   with JS we fetch grime95.com/ledger.json (CORS: *) for the newest booking, then that record page's embedded JSON
   for the first two paragraphs of narrative, and feed the sheet out of the slot when the desk scrolls into view. */
(function () {
  var sec = document.getElementById('grime95'), paper = document.getElementById('paper');
  if (!sec || !paper) return;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var BASE = 'https://grime95.com';

  function fmtDate(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? m[2] + '-' + m[3] + '-' + m[1] : (iso || ''); }
  function text(id, v) { var el = $(id); if (el) el.textContent = v; }
  function surname(c) { return (c.last + ', ' + c.first).toUpperCase(); }

  function noonLine(n, total) {
    var et = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    if (n >= total) return 'The roll is complete: ' + total + ' bookings on file.';
    return 'Next one prints ' + (et.getHours() < 12 ? 'today' : 'tomorrow') + ' at noon Eastern.';
  }

  function latest(data) {
    var chars = data.characters || [], best = null;
    chars.forEach(function (c) { (c.arrests || []).forEach(function (a) { if (!best || a.booking > best.a.booking) best = { c: c, a: a }; }); });
    return best;
  }

  function fill(c, a, total, n) {
    var rec = BASE + '/rec/' + encodeURIComponent(a.booking) + '/';
    paper.href = rec;
    text('paper-bkg', 'Booking ' + a.booking);
    text('p-subject', c.name.toUpperCase());
    var aka = $('p-aka'); if (aka) aka.innerHTML = c.alias ? '<span class="aka">&ldquo;' + esc(c.alias) + '&rdquo;</span>' : '&mdash;';
    text('p-charge', a.charge); text('p-location', a.location); text('p-officer', a.officer); text('p-date', fmtDate(a.date));
    text('mug-bkg', a.booking); text('mug-name', surname(c));
    var mug = $('mug');
    if (mug && a.mugshot) {
      var src = BASE + (a.mugshot.charAt(0) === '/' ? '' : '/') + a.mugshot;
      if (mug.getAttribute('src') !== src) { mug.src = src; }
      mug.alt = 'Booking photograph: ' + c.name + ', Ponder County Sheriff’s Dept. Fiction.';
    }
    var st = $('desk-status'); if (st) st.innerHTML = 'Latest on file: <b>booking ' + n + ' of ' + total + '</b>. ' + noonLine(n, total);
    return rec;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }

  function story(rec, booking) {
    return fetch(rec, { headers: { Accept: 'text/html' } }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (html) {
      var m = /<script type="application\/json" id="record-data">([\s\S]*?)<\/script>/.exec(html);
      if (!m) throw 0;
      var d = JSON.parse(m[1]); var a = (d.arrests || []).filter(function (x) { return x.booking === booking; })[0] || d.arrests[0];
      if (!a || !a.story) throw 0;
      var narr = $('p-narr'); if (narr) narr.innerHTML = a.story.slice(0, 2).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    });
  }

  var fed = false;
  function feed() {
    if (fed) return; fed = true;
    sec.classList.add('is-fed');
  }
  /* the sheet comes out when the desk is in view; if the data arrives after that, re-feed once so the new sheet prints */
  var seen = false;
  var desk = document.getElementById('desk') || sec;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { seen = true; feed(); io.disconnect(); } }, { threshold: .05, rootMargin: '0px 0px -10% 0px' });
    io.observe(desk);
    /* belt and braces: never leave the slot empty */
    setTimeout(function () { var r = desk.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) { seen = true; feed(); } }, 1200);
  } else { seen = true; feed(); }

  fetch(BASE + '/ledger.json', { headers: { Accept: 'application/json' } }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (data) {
    var b = latest(data); if (!b) return;
    var n = (data.characters || []).reduce(function (k, c) { return k + (c.arrests || []).length; }, 0);
    var changed = $('paper-bkg') && $('paper-bkg').textContent.indexOf(b.a.booking) < 0;
    var rec = fill(b.c, b.a, data.total || 313, n);
    return story(rec, b.a.booking).catch(function () {}).then(function () {
      if (changed && sec.classList.contains('is-fed') && !root.classList.contains('static')) {
        paper.classList.remove('is-refed'); void paper.offsetWidth; paper.classList.add('is-refed');
      }
    });
  }).catch(function () { /* the shipped booking stands */ });
})();
