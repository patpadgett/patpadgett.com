/* Overdrive: the name is the material.
   Real <h1> text stays in the DOM for SEO/a11y. A WebGL canvas sits underneath,
   painting a stirred vat of acid ink inside espresso letterforms. The canvas is
   masked to the glyphs with an SVG text mask that uses the same font/metrics.
   Fallback: no WebGL / reduced-motion / no mask support -> plain ink text. */
(() => {
  const h1 = document.querySelector('h1');
  if (!h1) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  if (!CSS.supports('mask-image', 'url(#x)') && !CSS.supports('-webkit-mask-image', 'url(#x)')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'vat';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
  if (!gl) return;

  h1.classList.add('vat-on');
  h1.insertBefore(canvas, h1.firstChild);

  // --- shader: curl-noise advected ink, two colours, cursor stirs -----------
  const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs = `precision highp float;
  uniform vec2 R;uniform float T;uniform vec2 M;uniform float S;
  vec2 h(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
    return mix(mix(dot(h(i),f),dot(h(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(h(i+vec2(0,1)),f-vec2(0,1)),dot(h(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
  void main(){
    vec2 uv=gl_FragCoord.xy/R; vec2 q=uv*vec2(R.x/R.y,1.);
    float t=T*.06;
    vec2 d=q-M*vec2(R.x/R.y,1.);
    float r=length(d); float sw=S*exp(-r*r*6.)*1.5;
    vec2 rot=vec2(-d.y,d.x)*sw;
    vec2 p=q*2.2+rot;
    // ink is the body; yellow is combed THROUGH it everywhere as thin threads
    vec2 w=vec2(fbm(p*.9+vec2(0.,t)),fbm(p*.9+vec2(4.1,2.7)-t*.7));
    vec2 w2=vec2(fbm(p*1.7+2.0*w+t*.3),fbm(p*1.7+2.0*w+vec2(3.3,7.1)));
    float comb=p.y*9.0 + 3.0*w.x + 1.4*w2.y + .6*sin(p.x*2.6+t*2.);
    float line=abs(fract(comb)-.5);
    float th=.035+.03*(fbm(p*3.+w2)+.5);           // finer, evener threads
    float aa=1.5/R.y*9.0;                          // ~1.5px anti-alias in comb units
    float thread=1.-smoothstep(th,th+aa+.02,line);
    // occasional wide pools of yellow where the comb pulled hard (the "stirred" look)
    float pool=smoothstep(.40,.52,fbm(p*.7+1.6*w2+t*.1));
    float yellow=clamp(thread*.9+pool*.7+.35*sw,0.,1.);
    yellow=min(yellow,.70);                        // never pure yellow: the glyph keeps an ink scrim
    vec3 acid=vec3(0.88,0.87,0.23);
    vec3 ink =vec3(0.125,0.137,0.110);
    vec3 c=mix(ink,acid,yellow);
    gl_FragColor=vec4(c,1.);
  }`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); h1.classList.remove('vat-on'); return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(prog, 'R'), uT = gl.getUniformLocation(prog, 'T'), uM = gl.getUniformLocation(prog, 'M'), uS = gl.getUniformLocation(prog, 'S');

  // --- mask: Canvas2D text with the page's loaded font, exported as PNG -----
  const mc = document.createElement('canvas');
  function buildMask() {
    const cs = getComputedStyle(h1);
    const r = h1.getBoundingClientRect();
    const cs0 = getComputedStyle(h1); const ext = Math.ceil(parseFloat(cs0.fontSize) * 0.28);
    const w = Math.ceil(r.width), hh = Math.ceil(r.height) + ext;
    canvas.style.width = w + 'px'; canvas.style.height = hh + 'px'; canvas.style.top = '0'; canvas.style.left = '0';
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(hh * dpr);
    // lines mirror the h1's text nodes / <br>; the blue period stays DOM-painted
    const lines = []; let cur = '';
    h1.childNodes.forEach(nd => {
      if (nd.nodeType === 3) cur += nd.textContent;
      else if (nd.tagName === 'BR') { lines.push(cur); cur = ''; }
      else if (nd.classList && nd.classList.contains('period')) {}
      else cur += nd.textContent;
    });
    if (cur) lines.push(cur);
    const fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight);
    const md = Math.min(devicePixelRatio || 1, 2);
    mc.width = w * md; mc.height = hh * md;
    const x = mc.getContext('2d');
    x.scale(md, md); x.clearRect(0, 0, w, hh);
    x.fillStyle = '#000'; x.textBaseline = 'alphabetic';
    x.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
    if ('letterSpacing' in x) x.letterSpacing = cs.letterSpacing;
    // baseline: ascent from font metrics so canvas glyphs land exactly on the DOM glyphs
    const m = x.measureText('Hg'); const asc = m.fontBoundingBoxAscent || fs * 0.93;
    const half = (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent || fs * 1.2)) / 2;
    lines.forEach((t, i) => x.fillText(t, 0, lh * i + half + asc));
    const url = `url(${mc.toDataURL('image/png')})`;
    canvas.style.webkitMaskImage = url; canvas.style.maskImage = url;
  }

  // --- interaction + loop -----------------------------------------------------
  // One scheduler. `stir` decays on wall-clock time, and when it is settled the
  // loop stops: the pour is a gesture with an end, not a process.
  let mx = 0.62, my = 0.45, stir = 1.35, tgt = 0, raf = 0, last = 0, t0 = performance.now(), visible = true, alive = true;
  const SETTLED = 0.012;
  function schedule() { if (alive && visible && !raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    stir += (tgt - stir) * (1 - Math.exp(-dt * 2.2));     // ~1s time constant, device independent
    tgt *= Math.exp(-dt * 3.0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, (now - t0) / 1000);
    gl.uniform2f(uM, mx, my);
    gl.uniform1f(uS, stir);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (stir > SETTLED || tgt > SETTLED) schedule();      // else: frozen until the next stir
    else last = 0;
  }
  const onMove = e => {
    const r = canvas.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width, ny = 1 - (e.clientY - r.top) / r.height;
    if (nx < -0.1 || nx > 1.1 || ny < -0.1 || ny > 1.1) return;
    const dx = nx - mx, dy = ny - my; mx = nx; my = ny;
    tgt = Math.min(1, tgt + Math.hypot(dx, dy) * 6);
    schedule();
  };
  h1.addEventListener('pointermove', onMove, { passive: true });
  h1.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) onMove({ clientX: t.clientX, clientY: t.clientY }); }, { passive: true });

  new IntersectionObserver(([e]) => { visible = e.isIntersecting && document.visibilityState === 'visible'; if (visible) schedule(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } }).observe(canvas);
  addEventListener('visibilitychange', () => { visible = document.visibilityState === 'visible'; if (visible) schedule(); });

  // Degradation after init: drop back to solid ink instantly; rebuild if the context returns.
  function teardown() { alive = false; if (raf) cancelAnimationFrame(raf); raf = 0; canvas.style.display = 'none'; h1.classList.remove('vat-on'); }
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); teardown(); });
  canvas.addEventListener('webglcontextrestored', () => { alive = true; canvas.style.display = ''; h1.classList.add('vat-on'); buildMask(); stir = 0.6; schedule(); });

  // Geometry change: never show a stale mask. Solid ink during the rebuild, one frame later re-enable.
  let rebuildRaf = 0;
  new ResizeObserver(() => {
    if (!alive) return;
    h1.classList.remove('vat-on');
    if (rebuildRaf) cancelAnimationFrame(rebuildRaf);
    rebuildRaf = requestAnimationFrame(() => { rebuildRaf = 0; buildMask(); h1.classList.add('vat-on'); tgt = Math.max(tgt, 0.25); schedule(); });
  }).observe(h1);

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { buildMask(); schedule(); });
})();
