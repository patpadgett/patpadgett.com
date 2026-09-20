/* set.js — the console TV, the Color Classic, the tape deck. Progressive: every link works without JS. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var stored = null; try { stored = localStorage.getItem('pp-motion'); } catch (e) {}
  var reduce = stored === 'off' || (stored !== 'on' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) root.classList.add('static');
  /* the MOTION switch on the remote: stops every ambient loop, remembered on this device */
  var motion = document.getElementById('motion');
  var motionPlain = document.getElementById('motion-plain');
  function paintMotion() { var on = !root.classList.contains('static'); if (motion) { motion.setAttribute('aria-checked', String(on)); motion.setAttribute('aria-label', on ? 'Motion. On. Press to stop the ambient animation.' : 'Motion. Off. Press to let the room move again.'); } if (motionPlain) { motionPlain.setAttribute('aria-checked', String(on)); motionPlain.innerHTML = 'Motion <b>' + (on ? 'ON' : 'OFF') + '</b>'; } }
  function toggleMotion() { root.classList.toggle('static'); reduce = root.classList.contains('static'); try { localStorage.setItem('pp-motion', reduce ? 'off' : 'on'); } catch (e) {} paintMotion(); }
  paintMotion(); if (motion) motion.addEventListener('click', toggleMotion); if (motionPlain) motionPlain.addEventListener('click', toggleMotion);

  /* ---------- TV: channel knob ---------- */
  var CH = {
    3: { name: 'WORK',  href: 'https://work.patpadgett.com',  line: 'work.patpadgett.com',  rot: -104 },
    4: { name: 'MUSIC', href: 'https://music.patpadgett.com', line: 'music.patpadgett.com', rot: -52 },
    5: { name: 'BLOG',  href: 'https://blog.patpadgett.com',  line: 'blog.patpadgett.com',  rot: 0 },
    6: { name: 'BEDTIME BOOK', href: '#octavitin', line: 'Octavitin · the opening pages · fiction', rot: 52 },
    7: { name: 'GRIME95!', href: '#grime95', line: 'Ponder County booking records · fiction', rot: 104 }
  };
  var knob = document.getElementById('knob'), bumper = document.getElementById('bumper');
  var rows = [].slice.call(document.querySelectorAll('.guide__row[data-ch]'));
  var cur = 3, timer = null, tuneTimer = null;

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
  function setCh(n, announce) {
    clearTimeout(tuneTimer);
    cur = n;
    knob.style.setProperty('--rot', CH[n].rot + 'deg');
    knob.dataset.ch = n;
    knob.setAttribute('aria-label', 'Channel knob. Channel ' + n + ', ' + CH[n].name + '. Press to turn to the next channel; the set then shows a TUNE IN button. Arrow keys also turn it.');
    rows.forEach(function (r) { r.classList.toggle('on', r.dataset.ch == n); });
    click();
    if (announce) showBumper(n);
  }
  var tunein = document.getElementById('tunein');
  function showBumper(n) {
    bumper.className = 'bumper on bumper--' + n;
    bumper.innerHTML = '<b><i>' + n + '</i></b><span>' + CH[n].name + '</span><small>' + CH[n].line + '</small>';
    if (tunein) { tunein.hidden = false; tunein.textContent = 'TUNE IN'; tunein.setAttribute('aria-label', 'Tune in to channel ' + n + ', ' + CH[n].name + ': ' + CH[n].line); }
    clearTimeout(timer);
  }
  function hideBumper() { clearTimeout(tuneTimer); bumper.className = 'bumper'; if (tunein) tunein.hidden = true; }
  if (tunein) tunein.addEventListener('click', function () { tune(cur); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && bumper.classList.contains('on')) { hideBumper(); knob.focus(); } });
  function tune(n, delay) {
    bumper.className = 'bumper on bumper--' + n;
    if (tunein) tunein.hidden = true;
    bumper.innerHTML = '<span class="bumper__tune">TUNING…</span><small>' + CH[n].line + ' · Esc to cancel</small>';
    clearTimeout(tuneTimer);
    tuneTimer = setTimeout(function () {
      if (CH[n].href.charAt(0) === '#') { bumper.className = 'bumper'; var t = document.querySelector(CH[n].href); if (t) { var sb = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; t.scrollIntoView({ block: 'start' }); root.style.scrollBehavior = sb; if (location.hash !== CH[n].href) history.pushState(null, '', CH[n].href); } if (t) t.focus({ preventScroll: true }); return; }
      location.href = CH[n].href;
    }, reduce ? 0 : (delay == null ? 350 : delay));
  }
  var next = function (d) { var n = cur + d; return n > 7 ? 3 : n < 3 ? 7 : n; };
  knob.addEventListener('click', function () { setCh(next(1), true); });
  knob.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setCh(next(1), true); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setCh(next(-1), true); }
  });
  knob.addEventListener('wheel', function (e) { e.preventDefault(); setCh(next(e.deltaY > 0 ? 1 : -1), true); }, { passive: false });
  rows.forEach(function (r) {
    r.addEventListener('click', function () { cur = +r.dataset.ch; knob.style.setProperty('--rot', CH[cur].rot + 'deg'); knob.dataset.ch = cur; });
  });
  setCh(3, false);

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

  /* ---------- Remote: channels, mute, power ---------- */
  var tv = document.querySelector('.tv'), audio = document.getElementById('bgm');
  var power = document.getElementById('power'), mute = document.getElementById('mute'), rstate = document.getElementById('remote-state');
  var isOn = true, warm = null;
  function press(b) { b.classList.add('is-pressed'); setTimeout(function () { b.classList.remove('is-pressed'); }, 140); click(); }
  [].slice.call(document.querySelectorAll('.remote__key[data-ch]')).forEach(function (b) {
    b.addEventListener('click', function () {
      press(b);
      if (!isOn) setPower(true);
      var n = +b.dataset.ch; setCh(n, false); tune(n, 700);
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
    if (!on) { hideBumper(); clearTimeout(timer); }
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
  /* the knob and guide are dead while the set is off */
  knob.addEventListener('click', function (e) { if (!isOn) { e.stopImmediatePropagation(); setPower(true); } }, true);
})();
