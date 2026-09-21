/* set.js — the console TV, the Color Classic, the tape deck. Progressive: every link works without JS. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('static');
  /* motion follows the OS preference only (prefers-reduced-motion) */

  /* ---------- TV: channel pushbuttons ---------- */
  var CH = {
    3: { name: 'WORK',  href: 'https://work.patpadgett.com',  line: 'work.patpadgett.com' },
    4: { name: 'MUSIC', href: 'https://music.patpadgett.com', line: 'music.patpadgett.com' },
    5: { name: 'BLOG',  href: 'https://blog.patpadgett.com',  line: 'blog.patpadgett.com' },
    6: { name: 'BEDTIME BOOK', href: '#octavitin', line: 'Octavitin · the opening pages · fiction' },
    7: { name: 'GRIME95', href: '#grime95', line: 'Ponder County · one mugshot a day · fiction' }
  };
  var bumper = document.getElementById('bumper');
  var rows = [].slice.call(document.querySelectorAll('.guide__row[data-ch]'));
  var cur = null, committed = null, tuneTimer = null;
  var ctx = null, soundOn = false;
  function click() {
    if (!soundOn) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(50, t + .03);
      g.gain.setValueAtTime(.2, t); g.gain.exponentialRampToValueAtTime(.001, t + .06);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .07);
    } catch (e) {}
  }
  function setCh(n) { cur = n; rows.forEach(function (r) { r.classList.toggle('on', n != null && r.dataset.ch == n); }); }
  function hideBumper() { clearTimeout(tuneTimer); bumper.className = 'bumper'; bumper.hidden = true; setCh(committed); }
  function tune(n, delay) {
    bumper.hidden = false; bumper.className = 'bumper on bumper--' + n;
    bumper.setAttribute('aria-label', 'Tuning to channel ' + n + ', ' + CH[n].name + '. Press to cancel.');
    bumper.innerHTML = '<b><i>' + n + '</i></b><span>' + CH[n].name + '</span><small>' + CH[n].line + ' · tap or Esc to cancel</small>';
    clearTimeout(tuneTimer);
    tuneTimer = setTimeout(function () {
      committed = n;
      if (CH[n].href.charAt(0) === '#') { bumper.className = 'bumper'; bumper.hidden = true; var t = document.querySelector(CH[n].href); if (t) { var sb = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; t.scrollIntoView({ block: 'start' }); root.style.scrollBehavior = sb; if (location.hash !== CH[n].href) history.pushState(null, '', CH[n].href); } if (t) t.focus({ preventScroll: true }); return; }
      location.href = CH[n].href;
    }, reduce ? 0 : (delay == null ? 700 : delay));
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && bumper.classList.contains('on')) { hideBumper(); } });
  bumper.addEventListener('click', function () { hideBumper(); });
  rows.forEach(function (r) { r.addEventListener('click', function () { committed = +r.dataset.ch; setCh(committed); }); });

  /* ---------- Mac Color Classic: scroll-driven screens ---------- */
  var mac = document.getElementById('mac-screen');
  if (mac && 'IntersectionObserver' in window) {
    var screens = [].slice.call(mac.querySelectorAll('.scr'));
    var idx = 0, macTimer = null, running = false, manual = false;
    function show(i) {
      screens.forEach(function (s, k) { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); if (k === i && s.classList.contains('scr--acid')) { var r = s.querySelector('.acid__art'); if (r) { r.style.animation = 'none'; void r.offsetWidth; r.style.animation = ''; } } });
      mac.dataset.scr = screens[i].dataset.name;
      var tabs = document.querySelectorAll('.mac__tabs button');
      tabs.forEach(function (b, k) { b.setAttribute('aria-pressed', String(k === i)); });
    }
    function cycle() {
      if (reduce) return;
      clearTimeout(macTimer);
      macTimer = setTimeout(function () { idx = (idx + 1) % screens.length; show(idx); cycle(); }, idx === 0 ? 2600 : idx === 1 ? 9000 : 4200);
    }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; show(idx); if (!manual) cycle(); }
        else if (!e.isIntersecting && running) { running = false; clearTimeout(macTimer); }
      });
    }, { threshold: .45 }).observe(mac);
    document.querySelectorAll('.mac__tabs button').forEach(function (b, k) {
      b.addEventListener('click', function () { idx = k; show(k); clearTimeout(macTimer); manual = true; });
    });
    show(0);
  }

  /* ---------- Coffee table: pick up a magazine ---------- */
  var table = document.getElementById('coffee-table');
  if (table) {
    var mags = [].slice.call(table.querySelectorAll('.mag')), hint = table.querySelector('.table__hint');
    function putDown() {
      mags.forEach(function (m) { m.classList.remove('up'); m.querySelector('button').setAttribute('aria-pressed', 'false'); });
      table.classList.remove('has-up'); hint.textContent = 'Tap a cover to pick it up · tap again to put it down';
    }
    mags.forEach(function (m) {
      m.querySelector('button').addEventListener('click', function () {
        var wasUp = m.classList.contains('up');
        putDown();
        if (!wasUp) { m.classList.add('up'); this.setAttribute('aria-pressed', 'true'); table.classList.add('has-up'); hint.textContent = (this.querySelector('.mag__cap b') || {}).textContent + ' · tap again or Esc to put it down'; m.querySelector('.mag__cap').setAttribute('data-more', ' · tap again to put down'); }
      });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && table.classList.contains('has-up')) putDown(); });
    table.addEventListener('click', function (e) { if (e.target === table || e.target.classList.contains('table__top')) putDown(); });
  }

  /* ---------- TV buttons: channels, mute, power ---------- */
  var tv = document.querySelector('.tv'), audio = document.getElementById('bgm');
  var power = document.getElementById('power'), mute = document.getElementById('mute'), rstate = document.getElementById('remote-state');
  var isOn = true, warm = null;
  function press(b) { b.classList.add('is-pressed'); setTimeout(function () { b.classList.remove('is-pressed'); }, 140); click(); }
  [].slice.call(document.querySelectorAll('.tvkey[data-ch]')).forEach(function (b) {
    b.addEventListener('click', function () {
      press(b);
      if (!isOn) setPower(true);
      var n = +b.dataset.ch; setCh(n); tune(n, 700);
    });
  });
  function say(t) { if (rstate) rstate.textContent = t; }
  function paintMute() {
    if (!mute) return;
    var muted = !audio || audio.paused;
    mute.setAttribute('aria-pressed', String(muted));
    mute.setAttribute('aria-label', muted ? 'Sound. Muted. Press to play the soundtrack.' : 'Sound. Playing Bedroom 1988. Press to mute.');
    say(muted ? 'MUTED · press MUTE for the soundtrack' : 'PLAYING · "Bedroom 1988" · synthwave loop');
  }
  if (mute && audio) {
    mute.addEventListener('click', function () {
      press(mute);
      if (!isOn) setPower(true);
      if (audio.paused) { audio.volume = .55; audio.play().then(paintMute, function () { paintMute(); say('THE SET WON’T PLAY YET · press MUTE once more'); }); } else { audio.pause(); paintMute(); }
    });
    audio.addEventListener('pause', paintMute); audio.addEventListener('play', paintMute); audio.addEventListener('ended', paintMute);
    paintMute();
  }
  var dying;
  function setPower(on) {
    isOn = on;
    clearTimeout(warm);
    clearTimeout(dying);
    tv.classList.remove('is-dying');
    if (!on && !reduce && !tv.classList.contains('is-off')) {
      tv.classList.add('is-dying');
      dying = setTimeout(function () { tv.classList.remove('is-dying'); tv.classList.add('is-off'); }, 480);
    } else tv.classList.toggle('is-off', !on);
    if (power) { power.setAttribute('aria-pressed', String(on)); power.setAttribute('aria-label', on ? 'Power. The set is on.' : 'Power. The set is off.'); }
    if (on && !reduce) { tv.classList.remove('was-on'); tv.classList.add('is-warming'); warm = setTimeout(function () { tv.classList.remove('is-warming'); tv.classList.add('was-on'); }, 1600); }
    else if (on) tv.classList.add('was-on');
    if (!on) { hideBumper(); }
    if (!on && audio && !audio.paused) { audio.pause(); }
  }
  /* in-page guide rows that aren't channels (CONTACT): jump, then hand focus to the destination */
  [].forEach.call(document.querySelectorAll('.guide__row[data-jump]'), function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      var t = document.querySelector(a.getAttribute('href')); if (!t) return;
      e.preventDefault();
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
      t.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      if (location.hash !== a.getAttribute('href')) history.pushState(null, '', a.getAttribute('href'));
      t.focus({ preventScroll: true });
    });
  });
  if (power) power.addEventListener('click', function () { press(power); setPower(!isOn); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { tv.classList.toggle('offscreen', !es[0].isIntersecting); }).observe(tv);
})();
