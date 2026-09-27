/* crt.js — the tube, and the room it lights.

   1. THE TUBE. A WebGL picture of what the DOM already says. The title card and the channel bumper are measured
      off the DOM — every character's box, font, colour and shadow — and painted into a texture, then shown through
      a curved, persistence-lit, aperture-grille tube drawn over the glass. The DOM copy stays underneath for
      readers, focus and clicks. Every state is read from the classes set.js already sets (is-dying / is-off /
      is-warming / offscreen, the bumper's hidden+class), so nothing here changes what the set does — only how the
      glass shows it. No WebGL, or reduced motion: the CSS picture stays, untouched.

   2. THE ROOM. The set is the only lamp: phosphor in the tuned channel's colour falls on the wood and the guide's
      paper, breathes with the mains flicker, goes grey with the snow and dies with the power. You are the other
      lamp: the glass reflection and the guide's shadow follow the pointer — or the phone's tilt where that needs
      no prompt.

   Progressive: everything works without this file. */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('js') || root.classList.contains('static')) return;
  var tv = document.querySelector('.tv'), glass = document.getElementById('glass'), bumper = document.getElementById('bumper');
  var title = glass && glass.querySelector('.title'), set = document.querySelector('.set');
  if (!tv || !glass || !bumper || !title) return;

  /* ============================== 1. the tube ============================== */
  (function tube() {
    var canvas = document.createElement('canvas');
    canvas.className = 'tv__crt'; canvas.setAttribute('aria-hidden', 'true');
    var gl = null;
    try { gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false }); } catch (e) { }
    if (!gl) return;

    /* ---- the picture: the DOM, painted ---- */
    var pic = document.createElement('canvas'), p2 = pic.getContext('2d');
    var dpr = 1, W = 1, H = 1, gr = null;
    var BARS = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
    function shadows(s) { /* computed "rgb() x y blur, …" → list; CSS paints the first on top */
      var out = [], m, re = /(rgba?\([^)]*\)|#[0-9a-f]+|[a-z]+)\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?/gi;
      if (!s || s === 'none') return out;
      while ((m = re.exec(s))) out.push({ c: m[1], x: +m[2], y: +m[3], b: +(m[4] || 0) });
      return out;
    }
    function paintBg(c) {
      var cw = gr.width, chh = gr.height;
      if (c === title) { /* styles.css .title: radial-gradient(ellipse at 50% 60%, #1c0f3c, #0a0618 60%, #000) — farthest-corner */
        var a = .901 * cw, b = .721 * chh;
        p2.save(); p2.translate(cw * .5, chh * .6); p2.scale(1, b / a);
        var g = p2.createRadialGradient(0, 0, 0, 0, 0, a);
        g.addColorStop(0, '#1c0f3c'); g.addColorStop(.6, '#0a0618'); g.addColorStop(1, '#000');
        p2.fillStyle = g; p2.fillRect(-cw * 2, -cw * 2, cw * 4, cw * 4); p2.restore();
      } else { p2.fillStyle = getComputedStyle(c).backgroundColor; p2.fillRect(0, 0, cw, chh); }
    }
    function paintText(c) {
      /* measure every character with element transforms switched off, then paint at those boxes under the same transforms */
      var walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT), node, r = document.createRange(), undo = [], jobs = [], i, u;
      var els = c.querySelectorAll('*');
      for (i = 0; i < els.length; i++) { var cs = getComputedStyle(els[i]); if (cs.transform !== 'none') { undo.push({ el: els[i], was: els[i].style.transform, m: cs.transform, o: cs.transformOrigin }); els[i].style.transform = 'none'; } }
      while ((node = walker.nextNode())) {
        var txt = node.nodeValue; if (!txt.trim()) continue;
        var el = node.parentElement, s2 = getComputedStyle(el), alpha = 1, chain = [], a = el;
        while (a && a !== c) { alpha *= parseFloat(getComputedStyle(a).opacity); for (u = 0; u < undo.length; u++) if (undo[u].el === a) chain.unshift(undo[u]); a = a.parentElement; }
        var chars = [];
        for (i = 0; i < txt.length; i++) {
          if (/\s/.test(txt[i])) continue;
          r.setStart(node, i); r.setEnd(node, i + 1);
          var b = r.getBoundingClientRect(); if (!b.width) continue;
          chars.push({ ch: txt[i], x: b.left - gr.left, y: b.top - gr.top });
        }
        jobs.push({ chars: chars, font: s2.fontStyle + ' ' + s2.fontWeight + ' ' + s2.fontSize + ' ' + s2.fontFamily, size: parseFloat(s2.fontSize), color: s2.color, alpha: alpha, sh: shadows(s2.textShadow), chain: chain });
      }
      for (u = 0; u < undo.length; u++) { var eb = undo[u].el.getBoundingClientRect(); undo[u].x = eb.left - gr.left; undo[u].y = eb.top - gr.top; }
      for (u = 0; u < undo.length; u++) undo[u].el.style.transform = undo[u].was;
      jobs.forEach(function (j) {
        p2.save();
        j.chain.forEach(function (tr) { /* translate(origin) · matrix · translate(−origin), as CSS does */
          var m = /matrix\(([^)]*)\)/.exec(tr.m); if (!m) return;
          var v = m[1].split(',').map(parseFloat), o = tr.o.split(' ').map(parseFloat), ox = tr.x + o[0], oy = tr.y + o[1];
          p2.translate(ox, oy); p2.transform(v[0], v[1], v[2], v[3], v[4], v[5]); p2.translate(-ox, -oy);
        });
        p2.font = j.font; p2.textBaseline = 'alphabetic'; p2.globalAlpha = j.alpha;
        var asc = p2.measureText('Hg').fontBoundingBoxAscent; if (!(asc > 0)) asc = j.size * .8;
        j.sh.slice().reverse().forEach(function (s) {
          p2.fillStyle = s.c; if (s.b) { p2.shadowColor = s.c; p2.shadowBlur = s.b * dpr; }
          j.chars.forEach(function (ch) { p2.fillText(ch.ch, ch.x + s.x, ch.y + asc + s.y); });
          p2.shadowBlur = 0; p2.shadowColor = 'transparent';
        });
        p2.fillStyle = j.color;
        j.chars.forEach(function (ch) { p2.fillText(ch.ch, ch.x, ch.y + asc); });
        p2.restore();
      });
    }
    function drawPicture(kind) {
      gr = glass.getBoundingClientRect();
      p2.setTransform(1, 0, 0, 1, 0, 0); p2.clearRect(0, 0, W, H); p2.setTransform(dpr, 0, 0, dpr, 0, 0); p2.globalAlpha = 1;
      if (kind === 'bars') { for (var i = 0; i < 7; i++) { p2.fillStyle = BARS[i]; p2.fillRect(i * gr.width / 7, 0, gr.width / 7 + 1, gr.height); } }
      else { var c = kind === 'bumper' ? bumper : title; paintBg(c); paintText(c); }
      gl.bindTexture(gl.TEXTURE_2D, picTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pic);
    }

    /* ---- GL plumbing ---- */
    var VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
    var PRE = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v;';
    /* the signal: roll, tear, squeeze, retrace lift — then phosphor persistence against the previous frame (picture only) */
    var FS_SIGNAL = PRE + 'uniform sampler2D uPic,uPrev;uniform vec2 uRes,uSq;uniform float uTime,uDecay,uBright,uRoll,uTear,uBeam,uBeamY,uWobA,uWobP,uLine;' +
      'float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}' +
      'void main(){vec2 uv=v;float row=floor(v.y*uRes.y/uLine);' +
      'uv.x+=uWobA*sin(uWobP+row*.41);' +
      'uv.x+=uTear*(hash(vec2(row*.013,fract(uTime*7.3)))-.5);' +
      'float y=fract(uv.y+uRoll);float blank=1.-step(.92,y)*step(.001,uRoll);' +
      'vec2 p=(vec2(uv.x,y)-.5)/uSq+.5;float inside=step(0.,p.x)*step(p.x,1.)*step(0.,p.y)*step(p.y,1.);' +
      'vec3 pic=texture2D(uPic,p).rgb*inside*blank*uBright;' +
      'float bm=exp(-pow((v.y-uBeamY)*12.,2.));pic=pic*(1.+uBeam*bm)+vec3(.05,.05,.075)*uBeam*bm;' +
      'vec3 prev=texture2D(uPrev,v).rgb*uDecay;gl_FragColor=vec4(max(pic,prev),1.);}';
    /* bloom: threshold + 9-tap separable blur into a quarter-size buffer */
    var FS_BLUR = PRE + 'uniform sampler2D uT;uniform vec2 uDir;uniform float uThr;' +
      'vec3 tap(vec2 o){return max(texture2D(uT,v+o).rgb-uThr,0.);}' +
      'void main(){vec3 c=tap(vec2(0.))*.227;c+=(tap(uDir)+tap(-uDir))*.1945;c+=(tap(uDir*2.)+tap(-uDir*2.))*.1216;c+=(tap(uDir*3.)+tap(-uDir*3.))*.054;c+=(tap(uDir*4.)+tap(-uDir*4.))*.016;gl_FragColor=vec4(c,1.);}';
    /* the tube face: barrel curvature, aperture grille, scanlines, vignette, mains flicker; snow and the dying dot land here, after persistence, so they never pile up */
    var FS_FACE = PRE + 'uniform sampler2D uP,uB;uniform vec2 uRes;uniform float uK,uFlick,uPitch,uG,uSnow,uDot,uTime;' +
      'float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}' +
      'void main(){vec2 p=v*2.-1.;float r2=dot(p,p);vec2 q=p*(1.+uK*r2)/(1.+uK);vec2 uv=q*.5+.5;' +
      'float inside=step(abs(q.x),1.)*step(abs(q.y),1.);' +
      'vec3 col=texture2D(uP,uv).rgb,bloom=texture2D(uB,uv).rgb;' +
      'float n=hash(gl_FragCoord.xy*.013+fract(uTime*.37)*7.1);col=mix(col,vec3(n*n*1.15),uSnow);bloom*=1.-uSnow;' +
      'vec2 d=q*vec2(uRes.x/uRes.y,1.);col+=uDot*vec3(.87,.92,1.)*exp(-dot(d,d)*1600.);' +
      'float sx=mod(gl_FragCoord.x,3.);vec3 mask=vec3(step(sx,1.),step(1.,sx)*step(sx,2.),step(2.,sx));' +
      'vec3 grille=vec3(1.)+(mask-vec3(.333))*uG;' +
      'float line=.8+.2*cos(uv.y*uRes.y/uPitch*6.2832);' +
      'float vig=clamp(1.-.22*r2-.09*r2*r2,0.,1.);' +
      'vec3 o=(col*grille*line+bloom*.55)*vig*uFlick;vec3 dark=vec3(.02,.016,.035);' +
      'gl_FragColor=vec4(mix(dark,o+dark*.5,inside),1.);}';
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    function prog(fs, names) {
      var p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      var u = {}; names.forEach(function (n) { u[n] = gl.getUniformLocation(p, n); }); return { p: p, u: u, a: gl.getAttribLocation(p, 'a') };
    }
    function tex(w, h) { var t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); if (w) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null); return t; }
    function target(w, h) { var t = tex(w, h), fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('fbo'); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); return { t: t, fb: fb, w: w, h: h }; }
    var SIG_U = ['uPic', 'uPrev', 'uRes', 'uSq', 'uTime', 'uDecay', 'uBright', 'uRoll', 'uTear', 'uBeam', 'uBeamY', 'uWobA', 'uWobP', 'uLine'];
    var BLUR_U = ['uT', 'uDir', 'uThr'], FACE_U = ['uP', 'uB', 'uRes', 'uK', 'uFlick', 'uPitch', 'uG', 'uSnow', 'uDot', 'uTime'];
    var sig, blur, face, picTex, P = [], B = [], pi = 0, quad;
    function build() {
      sig = prog(FS_SIGNAL, SIG_U); blur = prog(FS_BLUR, BLUR_U); face = prog(FS_FACE, FACE_U);
      quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); picTex = tex(); P.length = 0; B.length = 0; W = H = 0;
    }
    try { build(); } catch (e) { return; }
    function alloc() {
      [P, B].forEach(function (arr) { arr.forEach(function (t) { gl.deleteTexture(t.t); gl.deleteFramebuffer(t.fb); }); arr.length = 0; });
      P.push(target(W, H), target(W, H)); var bw = Math.max(1, Math.ceil(W / 4)), bh = Math.max(1, Math.ceil(H / 4)); B.push(target(bw, bh), target(bw, bh)); pi = 0;
    }
    var needFit = true, picDirty = true;
    function fit() {
      needFit = false;
      var r = glass.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      if (w === W && h === H && P.length) return;
      W = w; H = h; canvas.width = W; canvas.height = H; pic.width = W; pic.height = H; alloc(); picDirty = true;
    }
    function pass(pr, fb, w, h) { gl.bindFramebuffer(gl.FRAMEBUFFER, fb); gl.viewport(0, 0, w, h); gl.useProgram(pr.p); gl.bindBuffer(gl.ARRAY_BUFFER, quad); gl.enableVertexAttribArray(pr.a); gl.vertexAttribPointer(pr.a, 2, gl.FLOAT, false, 0, 0); }
    function bindTex(unit, t, loc) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(loc, unit); }
    function render(U, dt) {
      var rd = P[pi], wr = P[1 - pi];
      pass(sig, wr.fb, W, H);
      bindTex(0, picTex, sig.u.uPic); bindTex(1, rd.t, sig.u.uPrev);
      gl.uniform2f(sig.u.uRes, W, H); gl.uniform2f(sig.u.uSq, U.sx, U.sy); gl.uniform1f(sig.u.uTime, t); gl.uniform1f(sig.u.uDecay, Math.exp(-dt / U.tau));
      gl.uniform1f(sig.u.uBright, U.br); gl.uniform1f(sig.u.uRoll, U.roll); gl.uniform1f(sig.u.uTear, U.tear);
      gl.uniform1f(sig.u.uBeam, U.beam); gl.uniform1f(sig.u.uBeamY, U.beamY); gl.uniform1f(sig.u.uWobA, U.wobA); gl.uniform1f(sig.u.uWobP, U.wobP); gl.uniform1f(sig.u.uLine, 4 * dpr);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      pass(blur, B[0].fb, B[0].w, B[0].h); bindTex(0, wr.t, blur.u.uT); gl.uniform2f(blur.u.uDir, 1 / B[0].w, 0); gl.uniform1f(blur.u.uThr, .35); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      pass(blur, B[1].fb, B[1].w, B[1].h); bindTex(0, B[0].t, blur.u.uT); gl.uniform2f(blur.u.uDir, 0, 1 / B[1].h); gl.uniform1f(blur.u.uThr, 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      pass(face, null, W, H); bindTex(0, wr.t, face.u.uP); bindTex(1, B[1].t, face.u.uB);
      gl.uniform2f(face.u.uRes, W, H); gl.uniform1f(face.u.uK, .045); gl.uniform1f(face.u.uFlick, U.flick); gl.uniform1f(face.u.uPitch, 4 * dpr); gl.uniform1f(face.u.uG, dpr >= 2 ? .38 : .3);
      gl.uniform1f(face.u.uSnow, U.snow); gl.uniform1f(face.u.uDot, U.dot); gl.uniform1f(face.u.uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      pi = 1 - pi;
    }

    /* ---- the choreography: set.js's classes, made physical ---- */
    var t = 0, last = 0, raf = 0, inFrame = false, running = true, paused = false, dirty = false, kick = false, curPic = null, cur = 'title', ph = 'boot', p0 = 0;
    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    function mix(a, b, k) { return a + (b - a) * k; }
    function phase(n) { ph = n; p0 = t; running = true; }
    function powerOn(k) { /* the CSS poweron keyframes: a bright line opens into the picture, overshoots, settles */
      return { sy: k < .4 ? mix(.02, .06, k / .4) : k < .7 ? mix(.06, 1.02, (k - .4) / .3) : mix(1.02, 1, (k - .7) / .3),
        sx: k < .4 ? 1 : k < .7 ? mix(1, .9, (k - .4) / .3) : mix(.9, 1, (k - .7) / .3), br: 1 + 2.2 * Math.pow(1 - k, 2) };
    }
    function pose() {
      var e = t - p0, U = { pic: 'title', sx: 1, sy: 1, br: 1, roll: 0, tear: 0, snow: 0, dot: 0, beam: 0, beamY: 2, wobA: 0, wobP: 0, tau: .045, flick: 1 };
      var beat = (t % 4) / 4; U.flick = beat > .92 && beat < .94 ? .93 : beat > .95 && beat < .96 ? .97 : 1; /* the .title flicker keyframes */
      function sweep() { U.beam = .16; U.beamY = 1.12 - 1.3 * ((t % 7) / 7); } /* the retrace bar: one pass per 7 s, like .tv__roll */
      switch (ph) {
        case 'boot': case 'warm': {
          var bars = ph === 'boot' ? .5 : .9, gap = ph === 'boot' ? .06 : 0;
          var onto = (!bumper.hidden && bumper.classList.contains('on')) ? 'bumper' : 'title';
          if (e < bars) U.pic = 'bars';
          else if (e < bars + gap) { U.pic = 'none'; U.br = 0; }
          else { U.pic = onto; var k = clamp01((e - bars - gap) / .4), o = powerOn(k); U.sx = o.sx; U.sy = o.sy; U.br = o.br; if (k >= 1) { ph = onto === 'bumper' ? 'tuned' : 'steady'; p0 = t; } }
          U.tau = .02; break; }
        case 'steady': sweep(); break;
        case 'tune': {
          U.pic = e < .16 ? 'title' : 'bumper';
          if (e < .32) { var p = 1 - Math.pow(1 - e / .32, 2); U.roll = p % 1; U.tear = .06 * (1 - p); U.snow = e < .08 ? .55 * e / .08 : .55 * clamp01(1 - (e - .08) / .3); U.tau = .03; }
          else { var w = e - .32; U.wobA = .045 * Math.exp(-w * 7); U.wobP = w * 55; U.br = 1 + .45 * Math.exp(-w * 9); U.tau = .06; if (w > .9) { ph = 'tuned'; p0 = t; } }
          break; }
        case 'tuned': U.pic = 'bumper'; sweep(); break;
        case 'untune': {
          if (e < .08) { U.pic = 'none'; U.snow = .7; U.br = 0; }
          else { U.br = 1 + .6 * Math.exp(-(e - .08) * 12); if (e > .4) { ph = 'steady'; p0 = t; } }
          U.tau = .06; break; }
        case 'dying': { /* the CSS collapse keyframes: squeeze to a bright line, the line to a dot, the dot to dark — with a short phosphor trail */
          U.tau = .06;
          if (e < .22) { var k1 = 1 - Math.pow(1 - clamp01(e / .22), 3); U.sy = mix(1, .012, k1); U.sx = mix(1, 1.06, k1); U.br = 1 + 1.8 * k1; }
          else if (e < .34) { var k2 = clamp01((e - .22) / .12); U.sy = .012; U.sx = mix(1.06, .012, k2); U.br = 3.6; }
          else { var k3 = clamp01((e - .34) / .14); U.sx = U.sy = .004; U.br = 4 * (1 - k3); U.dot = k3; }
          break; }
        case 'off': { /* dead air: snow, then the resting tube with one fading dot */
          U.pic = 'none'; U.br = 0; U.tau = .05;
          U.snow = e < 1.5 ? .85 : .85 * clamp01(1 - (e - 1.5) / .6);
          U.dot = e < 1.5 ? 0 : e < 2.1 ? (e - 1.5) / .6 : Math.max(.08, 1 - (e - 2.1) / 4 * .92);
          if (e > 7) running = false; /* the last frame holds */
          break; }
      }
      return U;
    }
    function readState() {
      var cl = tv.classList;
      var want = cl.contains('is-dying') ? 'dying' : cl.contains('is-off') ? 'off' : cl.contains('is-warming') ? 'warm' : (!bumper.hidden && bumper.classList.contains('on')) ? 'bumper' : 'title';
      var booting = ph === 'boot' || ph === 'warm';
      if (want !== cur) {
        if (want === 'dying') phase('dying');
        else if (want === 'off') phase('off');
        else if (want === 'warm') phase('warm');
        else if (want === 'bumper') { if (!booting) phase('tune'); } /* a boot lands on whatever is showing */
        else if (ph === 'tune' || ph === 'tuned') phase('untune');
        else if (cur === 'off') phase('warm');
        cur = want;
      } else if (kick && want === 'bumper' && !booting) phase('tune'); /* another channel pressed mid-tune */
      kick = false;
    }
    function wake() { running = true; if (!raf && !paused && !inFrame) { last = 0; raf = requestAnimationFrame(frame); } }
    function sync() { paused = tv.classList.contains('offscreen'); dirty = true; wake(); }
    var lastDraw = 0;
    function frame(now) {
      raf = 0; inFrame = true;
      if ((ph === 'steady' || ph === 'tuned') && !dirty && !picDirty && !needFit && now - lastDraw < 31) { inFrame = false; raf = requestAnimationFrame(frame); return; }
      var dt = last ? Math.min(.1, Math.max(0, (now - last) / 1000)) : .016; last = now; lastDraw = now; t += dt;
      if (dirty) { dirty = false; readState(); }
      if (needFit) fit();
      var U = pose();
      if (U.pic !== curPic || picDirty) { curPic = U.pic; picDirty = false; if (U.pic !== 'none') drawPicture(U.pic); }
      render(U, dt);
      inFrame = false;
      if (running && !paused) raf = requestAnimationFrame(frame);
    }

    /* ---- wire up ---- */
    try { fit(); } catch (e) { return; }
    glass.appendChild(canvas);
    tv.classList.add('crt');
    if (tv.classList.contains('is-off')) { cur = 'off'; ph = 'off'; p0 = -8; }
    new MutationObserver(function (recs) { for (var i = 0; i < recs.length; i++) if (recs[i].type === 'childList') { kick = true; picDirty = true; } sync(); })
      .observe(bumper, { attributes: true, attributeFilter: ['class', 'hidden'], childList: true });
    new MutationObserver(sync).observe(tv, { attributes: true, attributeFilter: ['class'] });
    tv.addEventListener('tv:leave', function () { /* the numeral is leaving the tube (set.js view transition): show it gone before the snapshot */
      phase('untune'); cur = 'title'; var U = pose(); if (U.pic !== curPic) { curPic = U.pic; if (U.pic !== 'none') drawPicture(U.pic); } render(U, 1 / 60);
    });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { needFit = true; picDirty = true; wake(); }, 120); });
    if ('ResizeObserver' in window) new ResizeObserver(function () { needFit = true; picDirty = true; wake(); }).observe(glass);
    if (document.fonts) { document.fonts.ready.then(function () { picDirty = true; wake(); }); document.fonts.addEventListener('loadingdone', function () { picDirty = true; wake(); }); }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); tv.classList.remove('crt'); running = false; });
    canvas.addEventListener('webglcontextrestored', function () { try { build(); fit(); tv.classList.add('crt'); wake(); } catch (e) { } });
    wake();
  })();

  /* ============================== 2. the room ============================== */
  (function room() {
    if (!set) return;
    var light = document.createElement('span'); light.className = 'set__light'; light.setAttribute('aria-hidden', 'true');
    var glow = document.createElement('span'); glow.className = 'set__glow'; glow.setAttribute('aria-hidden', 'true');
    var room = set.closest('.room') || set.parentNode; room.parentNode.insertBefore(light, room); room.parentNode.insertBefore(glow, room);
    var lamps = [light, glow];
    /* what each picture throws on the wood: the title card's lavender, the bumper colours, snow's grey */
    var PHOS = { title: '182,174,242', 3: '57,255,20', 4: '255,90,70', 5: '34,211,238', 6: '255,177,107', 7: '110,110,255', snow: '200,200,215' };
    function place() { /* a full-width sheet down to the bottom of the set; the glow is painted at the glass centre in page coordinates */
      var s = set.getBoundingClientRect(), g = glass.getBoundingClientRect(), r = tv.getBoundingClientRect(), sy = window.pageYOffset || 0;
      lamps.forEach(function (l) {
        l.style.height = Math.round(s.bottom + sy + r.width * .3) + 'px';
        l.style.setProperty('--lw', Math.round(r.width / 2 + Math.min(110, r.width * .14)) + 'px'); l.style.setProperty('--lh', Math.round(r.height / 2 + Math.min(60, r.height * .11)) + 'px');
        l.style.setProperty('--lcx', Math.round(r.left + r.width / 2) + 'px'); l.style.setProperty('--lcy', Math.round(r.top + r.height / 2 + sy) + 'px');
      });
    }
    function colour() {
      var m = !bumper.hidden && bumper.classList.contains('on') && /bumper--(\d)/.exec(bumper.className);
      var off = tv.classList.contains('is-off') || tv.classList.contains('is-dying');
      var ph = PHOS[off ? 'snow' : m ? m[1] : 'title'];
      var lk = off ? .35 : m ? .2 : 1; /* a bumper is one glyph on black glass */ /* a bumper is mostly black glass; snow is grey */
      set.style.setProperty('--phos', ph); lamps.forEach(function (l) { l.style.setProperty('--phos', ph); l.style.setProperty('--lk', lk); });
      set.classList.toggle('dark', off); lamps.forEach(function (l) { l.classList.toggle('dark', tv.classList.contains('is-off')); });
    }
    place(); colour();
    addEventListener('resize', place);
    if ('ResizeObserver' in window) new ResizeObserver(place).observe(tv);
    new MutationObserver(colour).observe(bumper, { attributes: true, attributeFilter: ['class', 'hidden'] });
    new MutationObserver(colour).observe(tv, { attributes: true, attributeFilter: ['class'] });

    /* you are the other lamp */
    var lx = 0, ly = 0, raf = 0;
    function apply() { raf = 0; root.style.setProperty('--lx', lx.toFixed(2)); root.style.setProperty('--ly', ly.toFixed(2)); }
    function aim(x, y) {
      x = Math.max(-1, Math.min(1, x)); y = Math.max(-1, Math.min(1, y));
      if (Math.abs(x - lx) < .01 && Math.abs(y - ly) < .01) return;
      lx = x; ly = y; if (!raf) raf = requestAnimationFrame(apply);
    }
    if (matchMedia('(hover:hover) and (pointer:fine)').matches)
      addEventListener('pointermove', function (e) { aim((e.clientX / innerWidth - .5) * 2, (e.clientY / innerHeight - .5) * 2); }, { passive: true });
    else if (matchMedia('(pointer:coarse)').matches && 'ontouchstart' in window && 'DeviceOrientationEvent' in window && typeof DeviceOrientationEvent.requestPermission !== 'function') /* Android: no prompt; iOS asks, so it keeps the still light */
      addEventListener('deviceorientation', function (e) { if (e.gamma == null || e.beta == null) return; aim(e.gamma / 30, (e.beta - 45) / 30); }, { passive: true });
  })();
})();
