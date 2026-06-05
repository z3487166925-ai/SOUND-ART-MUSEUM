/** 无声馆 — 从生成图采样粒子，悬停动效与静态图一致 */
window.SignParticles = (function () {
  "use strict";

  var TAU = Math.PI * 2;

  var PALETTES = {
    gray: {
      bright: [228, 226, 222],
      mid: [188, 186, 182],
      deep: [148, 146, 142],
      line: "200, 198, 194",
      glow: "rgba(200, 198, 194, 0.045)",
      wisp: "rgba(180, 178, 174,",
    },
  };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function wordToType(word) {
    if (word === "你好") return "hello";
    if (word === "谢谢") return "thanks";
    if (word === "再见") return "goodbye";
    return "hello";
  }

  function defaultRegion(type) {
    if (type === "hello") return { x0: 0.02, x1: 0.98, y0: 0.02, y1: 0.72 };
    return { x0: 0.05, x1: 0.95, y0: 0.03, y1: 0.72 };
  }

  function helloRegions() {
    return [
      { x0: 0.02, x1: 0.48, y0: 0.04, y1: 0.68 },
      { x0: 0.5, x1: 0.96, y0: 0.04, y1: 0.68 },
    ];
  }

  function extractFromImage(img, region, count, seed) {
    var sw = 280;
    var sh = Math.round(sw * (img.naturalHeight / img.naturalWidth)) || 200;
    var off = document.createElement("canvas");
    off.width = sw;
    off.height = sh;
    var octx = off.getContext("2d");
    octx.drawImage(img, 0, 0, sw, sh);
    var data;
    try {
      data = octx.getImageData(0, 0, sw, sh).data;
    } catch (e) {
      return [];
    }
    var candidates = [];

    for (var y = 0; y < sh; y++) {
      for (var x = 0; x < sw; x++) {
        var nx = x / sw;
        var ny = y / sh;
        if (nx < region.x0 || nx > region.x1 || ny < region.y0 || ny > region.y1) continue;
        var i = (y * sw + x) * 4;
        var lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (lum > 28) {
          candidates.push({ x: nx, y: ny, lum: lum });
        }
      }
    }

    if (!candidates.length) return [];

    candidates.sort(function (a, b) {
      return b.lum - a.lum;
    });

    var step = Math.max(1, Math.floor(candidates.length / count));
    var out = [];
    for (var c = 0; c < candidates.length && out.length < count; c += step) {
      var p = candidates[c];
      var s = seed + out.length * 19.7;
      out.push({
        bx: p.x,
        by: p.y,
        lum: p.lum / 255,
        phase: s * 0.31,
        drift: s * 0.17,
        size: 0.45 + (p.lum / 255) * 1.1 + (s % 3) * 0.12,
        wisp: (s % 5) > 3.2,
      });
    }

    while (out.length < count && candidates.length) {
      var q = candidates[out.length % candidates.length];
      var s2 = seed + out.length * 23.1;
      out.push({
        bx: q.x,
        by: q.y,
        lum: q.lum / 255,
        phase: s2 * 0.31,
        drift: s2 * 0.17,
        size: 0.5 + (q.lum / 255) * 0.9,
        wisp: false,
      });
    }

    return out;
  }

  function buildImageCache(img, type) {
    var count = type === "hello" ? 420 : 480;
    if (type === "hello") {
      var regions = helloRegions();
      return {
        mode: "hello",
        a: extractFromImage(img, regions[0], count, 11),
        b: extractFromImage(img, regions[1], count, 29),
      };
    }
    return {
      mode: "single",
      particles: extractFromImage(img, defaultRegion(type), count, type.charCodeAt(0)),
    };
  }

  function lerpParticles(a, b, t) {
    var n = Math.min(a.length, b.length);
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push({
        bx: lerp(a[i].bx, b[i].bx, t),
        by: lerp(a[i].by, b[i].by, t),
        lum: lerp(a[i].lum, b[i].lum, t),
        phase: a[i].phase,
        drift: a[i].drift,
        size: lerp(a[i].size, b[i].size, t),
        wisp: a[i].wisp || b[i].wisp,
      });
    }
    return out;
  }

  function cacheHasParticles(cache) {
    if (!cache) return false;
    if (cache.mode === "hello") {
      return cache.a && cache.a.length > 20 && cache.b && cache.b.length > 20;
    }
    return cache.particles && cache.particles.length > 20;
  }

  function activeParticles(cache, type, time) {
    if (!cache) return [];
    if (cache.mode === "hello") {
      if (!cache.a || !cache.a.length) return [];
      var cycle = time % 4.4;
      if (cycle < 1.7) return cache.a;
      if (cycle < 2.1) return lerpParticles(cache.a, cache.b, easeInOut((cycle - 1.7) / 0.4));
      if (cycle < 3.5) return cache.b;
      if (cycle < 3.9) return lerpParticles(cache.b, cache.a, easeInOut((cycle - 3.5) / 0.4));
      return cache.a;
    }
    var pts = cache.particles || [];
    if (!pts.length) return [];
    if (type === "goodbye") {
      var wave = Math.sin(time * Math.PI * 1.15) * 0.022;
      var lift = Math.sin(time * Math.PI * 0.8) * 0.006;
      return pts.map(function (p) {
        return {
          bx: p.bx + wave,
          by: p.by + lift,
          lum: p.lum,
          phase: p.phase,
          drift: p.drift,
          size: p.size,
          wisp: p.wisp,
        };
      });
    }
    if (type === "thanks") {
      return pts.map(function (p, i) {
        if (p.by > 0.55) return p;
        var wiggle = Math.sin(time * 1.6 + i * 0.4) * 0.006;
        return { bx: p.bx, by: p.by + wiggle, lum: p.lum, phase: p.phase, drift: p.drift, size: p.size, wisp: p.wisp };
      });
    }
    return pts;
  }

  function rgbFor(bright, pal) {
    if (bright > 0.72) return pal.bright;
    if (bright > 0.38) return pal.mid;
    return pal.deep;
  }

  function drawImageParticles(ctx, w, h, particles, time, pal, img) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    if (img && img.naturalWidth) {
      ctx.save();
      ctx.filter = "grayscale(1) brightness(2.15) contrast(0.9)";
      ctx.globalAlpha = 0.88;
      var scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
      var dw = img.naturalWidth * scale;
      var dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.restore();
    }

    if (!particles || !particles.length) return;

    var glow = ctx.createRadialGradient(w * 0.5, h * 0.46, 0, w * 0.5, h * 0.46, w * 0.55);
    glow.addColorStop(0, pal.glow);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    var pts = particles.map(function (p) {
      var jx = Math.sin(time * 2.1 + p.drift) * 0.0035;
      var jy = Math.cos(time * 1.7 + p.phase) * 0.003;
      return {
        x: (p.bx + jx) * w,
        y: (p.by + jy) * h,
        bright: 0.35 + p.lum * 0.6,
        size: p.size,
        wisp: p.wisp,
        phase: p.phase,
      };
    });

    ctx.lineCap = "round";
    for (var i = 0; i < pts.length; i++) {
      var a = pts[i];
      if (a.wisp) continue;
      for (var j = i + 1; j < i + 3 && j < pts.length; j++) {
        var b = pts[j];
        if (b.wisp) continue;
        var dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > w * 0.038) continue;
        var alpha = (1 - dist / (w * 0.038)) * 0.1 * Math.min(a.bright, b.bright);
        ctx.strokeStyle = "rgba(" + pal.line + "," + alpha + ")";
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    pts.forEach(function (p) {
      var flicker = 0.78 + 0.22 * Math.sin(time * 3.2 + p.phase);
      var alpha = (p.wisp ? p.bright * 0.35 : p.bright * 0.5 + 0.2) * flicker;
      var rgb = rgbFor(p.bright, pal);
      var r = p.size * (p.bright > 0.65 ? 1 : 0.82);

      ctx.shadowBlur = r * 2.8;
      ctx.shadowColor = "rgba(" + rgb.join(",") + ",0.5)";
      ctx.fillStyle = "rgba(" + rgb.join(",") + "," + alpha + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.42, 0, TAU);
      ctx.fill();

      if (p.bright > 0.7 && !p.wisp) {
        ctx.fillStyle = "rgba(" + pal.bright.join(",") + "," + alpha * 0.35 + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.15, 0, TAU);
        ctx.fill();
      }

      if (p.wisp) {
        var len = 10 + p.size * 3;
        var ang = p.phase + time * 0.45;
        ctx.strokeStyle = pal.wisp + alpha * 0.28 + ")";
        ctx.lineWidth = 0.35;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(
          p.x + Math.sin(ang) * len * 0.4,
          p.y - len * 0.25,
          p.x + Math.cos(ang) * len * 0.8,
          p.y + Math.sin(ang) * len * 0.3
        );
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    });
  }

  function attach(canvas, typeOrOpts, legacyOpts) {
    if (!canvas) return;
    var opts =
      typeof typeOrOpts === "object"
        ? typeOrOpts
        : { type: typeOrOpts, autostart: legacyOpts && legacyOpts.autostart !== false };

    canvas._signType = opts.type || "hello";
    canvas._signPalette = opts.palette || "gray";
    canvas._signAutostart = opts.autostart === true;
    canvas._signImg = opts.img || null;
    canvas._signCache = null;

    if (canvas._signOnResize) {
      window.removeEventListener("resize", canvas._signOnResize);
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas._w = rect.width;
      canvas._h = rect.height;
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    canvas._signOnResize = resize;
    resize();
    window.addEventListener("resize", resize);

    function loadCache(done) {
      if (canvas._signCache) {
        done();
        return;
      }
      var img = canvas._signImg;
      if (!img || !img.naturalWidth) {
        done();
        return;
      }
      canvas._signCache = buildImageCache(img, canvas._signType);
      done();
    }

    canvas._signLoadCache = loadCache;

    if (canvas._signAutostart) start(canvas);
  }

  function start(canvas) {
    if (!canvas || canvas._signRunning) return;

    function run() {
      canvas._signRunning = true;

      function loop() {
        if (!canvas._signRunning || !canvas.isConnected) {
          canvas._signRaf = 0;
          return;
        }
        if (canvas._w && canvas._signCache) {
          var pal = PALETTES[canvas._signPalette] || PALETTES.gray;
          var time = performance.now() * 0.001;
          var particles = activeParticles(canvas._signCache, canvas._signType, time);
          drawImageParticles(
            canvas.getContext("2d"),
            canvas._w,
            canvas._h,
            particles,
            time,
            pal,
            canvas._signImg
          );
        }
        canvas._signRaf = requestAnimationFrame(loop);
      }

      if (canvas._signOnResize) canvas._signOnResize();
      loop();
    }

    if (canvas._signLoadCache) {
      canvas._signLoadCache(run);
    } else {
      run();
    }
  }

  function stop(canvas) {
    if (!canvas) return;
    canvas._signRunning = false;
    if (canvas._signRaf) {
      cancelAnimationFrame(canvas._signRaf);
      canvas._signRaf = 0;
    }
  }

  return { attach, start, stop, wordToType, cacheHasParticles };
})();
