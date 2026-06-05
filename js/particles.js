window.Particles = (function () {
  "use strict";

  var canvas = null;
  var ctx = null;
  var iframe = null;
  var hero = null;
  var w = 0;
  var h = 0;
  var particles = [];
  var mouse = { x: -9999, y: -9999, active: false, tx: -9999, ty: -9999 };
  var loopRaf = 0;
  var onScroll = null;
  var onResize = null;
  var onMouseMove = null;
  var onMouseLeave = null;
  var running = false;

  function grayRgb() {
    var v = 195 + Math.floor(Math.random() * 60);
    return [v, v, v + Math.floor(Math.random() * 6)];
  }

  function initScatter(isGallery) {
    var n = Math.floor(720 * Math.sqrt((w * h) / (1920 * 1080)));
    particles = [];
    for (var i = 0; i < n; i++) {
      var d = Math.random();
      var spreadX = isGallery ? Math.random() : Math.pow(Math.random(), 0.82);
      particles.push({
        x: spreadX * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 0.3 + d * 0.75,
        rgb: grayRgb(),
        a: 0.1 + d * 0.22,
        ph: Math.random() * Math.PI * 2,
      });
    }
  }

  function resize() {
    if (!canvas || !ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initScatter(document.body.classList.contains("page-gallery"));
  }

  function updateMode() {
    if (!canvas) return;
    var isGallery = document.body.classList.contains("page-gallery");
    if (isGallery) {
      if (iframe) iframe.style.opacity = "0";
      canvas.style.opacity = "1";
      return;
    }
    hero = document.querySelector(".hero");
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    var inHero = rect.bottom > window.innerHeight * 0.12;
    if (iframe) iframe.style.opacity = inHero ? "1" : "0";
    canvas.style.opacity = inHero ? "0.78" : "1";
  }

  function drawScatter() {
    if (!running || !ctx) return;
    mouse.x += (mouse.tx - mouse.x) * 0.14;
    mouse.y += (mouse.ty - mouse.y) * 0.14;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.ph += 0.006;
      p.x += p.vx + Math.sin(p.ph) * 0.05;
      p.y += p.vy + Math.cos(p.ph * 0.85) * 0.05;

      if (mouse.active) {
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.hypot(dx, dy);
        var repelR = 260;
        if (dist < repelR && dist > 1) {
          var f = Math.pow(1 - dist / repelR, 1.5) * 4.2;
          p.x += (dx / dist) * f * 18;
          p.y += (dy / dist) * f * 18;
        }
      }

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      var rgb = p.rgb;
      ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + p.a + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!running) return;
    drawScatter();
    loopRaf = requestAnimationFrame(loop);
  }

  function destroy() {
    running = false;
    cancelAnimationFrame(loopRaf);
    loopRaf = 0;
    if (onScroll) window.removeEventListener("scroll", onScroll);
    if (onResize) window.removeEventListener("resize", onResize);
    if (onMouseMove) document.removeEventListener("mousemove", onMouseMove);
    if (onMouseLeave) document.removeEventListener("mouseleave", onMouseLeave);
    onScroll = onResize = onMouseMove = onMouseLeave = null;
    particles = [];
  }

  function boot() {
    destroy();
    canvas = document.getElementById("bg-particles");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    iframe = document.getElementById("infinity-bg-frame");
    hero = document.querySelector(".hero");
    running = true;

    onMouseMove = function (e) {
      mouse.active = true;
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    onMouseLeave = function () {
      mouse.active = false;
    };
    onScroll = function () {
      updateMode();
    };
    onResize = function () {
      resize();
      updateMode();
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    resize();
    updateMode();
    loop();
  }

  return { boot: boot, destroy: destroy };
})();

window.Particles.boot();
