/* octavitin.js — the library book on the carpet. Progressive: without JS the book and both buttons link to the chapter on octavitin.patpadgett.com. */
(function () {
  var book = document.getElementById('book'), reader = document.getElementById('reader');
  if (!book || !reader || typeof reader.showModal !== 'function') return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var close = reader.querySelector('.reader__close'), page = document.getElementById('reader-page');
  var spread = reader.querySelector('.reader__spread'), agains = [].slice.call(reader.querySelectorAll('.page__again'));
  var resume = reader.querySelector('.reader__resume'), KEY = 'octavitin-chapter-one';
  var paras = [].slice.call(page.querySelectorAll('.chapter-text > p'));
  var prevOverflow = '', opening = null, opener = book, restoring = false, resumedAt = 0;

  /* whichever container actually scrolls at this width */
  function scroller() { return getComputedStyle(spread).overflowY === 'auto' ? spread : page; }
  /* bookmark = index of the first paragraph whose top is at/below the scrollport top; survives reflow */
  function currentPara() {
    var s = scroller(), top = s.getBoundingClientRect().top + 8;
    for (var i = 0; i < paras.length; i++) if (paras[i].getBoundingClientRect().bottom > top) return i;
    return paras.length - 1;
  }
  function savePos() { if (!reader.open || restoring) return; try { localStorage.setItem(KEY, String(currentPara())); } catch (e) {} }
  function loadPos() { try { return +localStorage.getItem(KEY) || 0; } catch (e) { return 0; } }
  function scrollToPara(i) {
    var s = scroller(), p = paras[i]; if (!p) return;
    s.scrollTop += p.getBoundingClientRect().top - s.getBoundingClientRect().top - 4;
  }
  function toTop() { spread.scrollTop = 0; page.scrollTop = 0; if (resume) resume.hidden = true; try { localStorage.setItem(KEY, '0'); } catch (e) {} }
  /* the focusable, keyboard-scrollable region is whichever one scrolls */
  function syncTab() { var s = scroller(); page.tabIndex = s === page ? 0 : -1; spread.tabIndex = s === spread ? 0 : -1; if (s === spread) spread.setAttribute('aria-label', page.getAttribute('aria-label')); else spread.removeAttribute('aria-label'); }
  addEventListener('resize', syncTab);

  function open(animate, from) {
    if (reader.open) return;
    opener = from || book;
    prevOverflow = document.body.style.overflow;
    reader.classList.toggle('is-opening', animate);
    reader.showModal();
    syncTab();
    /* reading position persists on this device by paragraph; Start from the top resets it */
    var i = loadPos();
    restoring = true;
    if (i > 0) { scrollToPara(i); if (resume) resume.hidden = false; resumedAt = scroller().scrollTop; }
    else if (resume) resume.hidden = true;
    setTimeout(function () { restoring = false; }, 50);
    document.body.style.overflow = 'hidden';
    close.focus({ preventScroll: true });
  }
  book.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; /* let the link behave */
    e.preventDefault();
    if (reader.open || opening) return;
    if (reduce || e.detail === 0) { open(false, book); return; } /* keyboard / reduced motion: straight in */
    book.classList.add('is-opening'); /* the cover swings first… */
    opening = setTimeout(function () { opening = null; open(true, book); book.classList.remove('is-opening'); }, 560);
  });
  [].slice.call(document.querySelectorAll('[data-open-reader]')).forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      e.preventDefault(); open(!reduce && e.detail > 0, btn);
    });
  });
  agains.forEach(function (a) { a.addEventListener('click', function () { toTop(); scroller().focus({ preventScroll: true }); }); });
  function onScroll() {
    if (restoring) return;
    /* the resume note steps aside once the reader has moved on deliberately */
    if (resume && !resume.hidden && Math.abs(scroller().scrollTop - resumedAt) > 40) resume.hidden = true;
    savePos();
  }
  spread.addEventListener('scroll', onScroll); page.addEventListener('scroll', onScroll);
  close.addEventListener('click', function () { reader.close(); });
  reader.addEventListener('click', function (e) { /* click the dark room to put the book down */
    var r = spread.getBoundingClientRect();
    if (e.target === reader && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) reader.close();
  });
  /* arrow / page keys scroll the chapter while the close button has focus */
  reader.addEventListener('keydown', function (e) {
    if (e.target !== close) return;
    var s = scroller(), step = { ArrowDown: 60, ArrowUp: -60, PageDown: s.clientHeight * .85, PageUp: -s.clientHeight * .85 }[e.key];
    if (step == null) return;
    e.preventDefault(); s.scrollBy({ top: step, behavior: reduce ? 'auto' : 'smooth' });
  });
  reader.addEventListener('close', function () {
    reader.classList.remove('is-opening');
    document.body.style.overflow = prevOverflow;
    (opener || book).focus({ preventScroll: true });
  });
})();
