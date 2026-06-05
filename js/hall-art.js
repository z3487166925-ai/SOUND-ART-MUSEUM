/** 展馆卡片 / 馆页主题视觉 */
window.HallArt = (function () {
  "use strict";

  function parseRgb(accent) {
    if (!accent) return [255, 255, 255];
    accent = accent.trim();
    if (accent.startsWith("#")) {
      const h = accent.slice(1);
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    return [255, 255, 255];
  }

  function mouseOffset(mx, my, w, h) {
    if (mx == null || mx < 0 || !w || !h) return { ox: 0, oy: 0 };
    return {
      ox: (mx - w * 0.5) * 0.12,
      oy: (my - h * 0.5) * 0.12,
    };
  }

  function drawRippleRings(ctx, w, h, rgb, intensity, t, cx, cy, rings, timeOffset, hero) {
    const maxR = hero ? Math.min(w, h) * 0.58 : Math.min(w, h) * 0.42;
    for (let i = 0; i < rings; i++) {
      const phase = (t * 0.35 + i * 0.11 + (timeOffset || 0)) % 1;
      const radius = phase * maxR * intensity;
      const fade = Math.pow(1 - phase, 1.7);
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.9 + i * 0.7);
      const alpha = fade * breathe * (hero ? 0.62 : 0.42) * intensity;
      if (alpha < 0.03) continue;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.12, radius * 0.44, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + rgb.join(",") + "," + alpha + ")";
      ctx.lineWidth = hero ? 1.35 : 0.8;
      ctx.stroke();
    }
  }

  /** 人声馆：不规则声波，幅度差异大 */
  function drawHuman(ctx, w, h, rgb, intensity, t, mx, my, opts) {
    if (intensity < 0.05) return;
    const hero = opts && opts.surface === "hero";
    const ampMul = hero ? 2.1 : 1;
    const speedMul = hero ? 1.35 : 1;
    const { ox, oy } = hero ? { ox: 0, oy: 0 } : mouseOffset(mx, my, w, h);
    const cy = h * (hero ? 0.5 : 0.38) + oy;
    const lines = 4;
    const lineStyles = [
      { lw: 2.2, amp: 28, freq: 0.022, ph: 0, harm: 2.3 },
      { lw: 1.4, amp: 14, freq: 0.038, ph: 1.8, harm: 1.1 },
      { lw: 1.8, amp: 36, freq: 0.015, ph: 0.6, harm: 3.1 },
      { lw: 1, amp: 18, freq: 0.048, ph: 2.4, harm: 1.7 },
    ];
    for (let L = 0; L < lines; L++) {
      const st = lineStyles[L];
      ctx.beginPath();
      for (let x = w * 0.06; x <= w * 0.94; x += 2) {
        const nx = x + ox;
        const env = 0.55 + 0.45 * Math.sin(nx * 0.008 + st.ph);
        const y =
          cy +
          (Math.sin(nx * st.freq + t * 2.2 * speedMul + st.ph) * st.amp * ampMul +
            Math.sin(nx * st.freq * st.harm + t * 1.4 * speedMul) * (st.amp * 0.35 * ampMul)) *
            env *
            intensity;
        if (x === w * 0.06) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const a = (0.35 + L * 0.1) * intensity * (hero ? 1.15 : 1);
      ctx.strokeStyle = "rgba(" + rgb.join(",") + "," + a + ")";
      ctx.lineWidth = st.lw * (hero ? 1.2 : 1);
      ctx.shadowBlur = (hero ? 26 : 18) * intensity;
      ctx.shadowColor = "rgba(" + rgb.join(",") + ",0.7)";
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  /** 自然馆：涟漪；馆页右侧额外水波纹；卡片悬停涟漪加大 */
  function drawNature(ctx, w, h, rgb, intensity, t, mx, my, opts) {
    if (intensity < 0.04) return;
    const hero = opts && opts.surface === "hero";
    const card = opts && opts.surface === "card";

    if (hero) {
      const anchors = [
        [w * 0.18, h * 0.42, 0],
        [w * 0.38, h * 0.58, 0.35],
        [w * 0.58, h * 0.46, 0.7],
        [w * 0.78, h * 0.62, 1.05],
        [w * 0.5, h * 0.72, 1.35],
      ];
      anchors.forEach(function (a) {
        drawRippleRings(ctx, w, h, rgb, intensity * 1.08, t, a[0], a[1], 10, a[2], true);
      });
      return;
    }

    const cx = mx != null && mx >= 0 ? mx : w * 0.5;
    const cy = my != null && my >= 0 ? my : h * 0.42;

    if (card) {
      drawRippleRings(ctx, w, h, rgb, intensity * 1.2, t, cx, cy, 11, 0, true);
      return;
    }

    drawRippleRings(ctx, w, h, rgb, intensity, t, cx, cy, 8, 0, false);
  }

  /** 动物馆卡片：光点升起，跟随鼠标 */
  function drawAnimal(ctx, w, h, rgb, intensity, t, mx, my) {
    if (intensity < 0.05) return;
    const { ox, oy } = mouseOffset(mx, my, w, h);
    const cx = mx >= 0 ? mx : w * 0.5;
    const cy = my >= 0 ? my : h * 0.5;
    const count = Math.floor(30 + intensity * 30);
    const marginX = w * 0.06;
    const spanX = w - marginX * 2;

    for (let i = 0; i < count; i++) {
      const seed = i * 31.7 + 0.5;
      const baseX = marginX + ((seed * 13.37) % 1) * spanX;
      const speed = 0.035 + (seed % 1) * 0.07;
      const phase = (seed * 7.3) % 1;
      const cycle = (t * speed + phase) % 1;
      const riseY = h * (1.08 - cycle * 1.16);
      const pull = 0.12 + (seed % 1) * 0.22;
      const x = baseX + ox * pull + (cx - baseX) * pull * 0.55;
      const y = riseY + oy * pull * 0.35 + (cy - riseY) * pull * 0.18;
      const radius = 0.7 + (seed % 1) * 3.4;
      const fadeIn = Math.min(1, cycle * 5) * Math.min(1, (1 - cycle) * 4);
      const alpha = fadeIn * (0.18 + intensity * 0.62);
      if (alpha < 0.03) continue;
      ctx.fillStyle = "rgba(" + rgb.join(",") + "," + alpha + ")";
      ctx.shadowBlur = radius * 2.8 * intensity;
      ctx.shadowColor = "rgba(" + rgb.join(",") + ",0.45)";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  /** 动物馆页：萤火虫光点向上飞 */
  function drawAnimalFireflies(ctx, w, h, rgb, intensity, t) {
    if (intensity < 0.05) return;
    const count = 96;
    for (let i = 0; i < count; i++) {
      const seed = i * 23.1 + 1.2;
      const baseX = w * 0.04 + ((seed * 19.7) % 1) * w * 0.92;
      const speed = 0.045 + (seed % 1) * 0.08;
      const phase = (seed * 5.7) % 1;
      const cycle = (t * speed + phase) % 1;
      const y = h * (1.06 - cycle * 1.22);
      const wobble = Math.sin(t * 1.1 + seed) * 28 + Math.cos(t * 0.7 + seed * 1.4) * 16;
      const x = baseX + wobble;
      const flicker = 0.4 + 0.6 * Math.pow(0.5 + 0.5 * Math.sin(t * 3.8 + seed * 2), 2);
      const radius = 1.8 + (seed % 1) * 4.8;
      const fade = Math.min(1, cycle * 4) * Math.min(1, (1 - cycle) * 3.5);
      const alpha = fade * flicker * (0.32 + intensity * 0.78);
      if (alpha < 0.04) continue;
      ctx.fillStyle = "rgba(" + rgb.join(",") + "," + alpha + ")";
      ctx.shadowBlur = radius * 6.5;
      ctx.shadowColor = "rgba(" + rgb.join(",") + ",0.72)";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (cycle > 0.08) {
        ctx.fillStyle = "rgba(" + rgb.join(",") + "," + alpha * 0.32 + ")";
        ctx.beginPath();
        ctx.ellipse(x, y + radius * 2.8, radius * 0.75, radius * 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }
  }

  /** 无声馆卡片：白色圆点交错排列，跟随鼠标 */
  function drawSilentCard(ctx, w, h, rgb, intensity, t, mx, my) {
    if (intensity < 0.05) return;
    const { ox, oy } = mouseOffset(mx, my, w, h);
    const cols = 5;
    const rows = 4;
    const total = 20;
    const areaW = w * 0.72;
    const areaH = h * 0.64;
    const colGap = areaW / (cols - 0.5);
    const rowGap = areaH / (rows - 0.5);
    const originX = w * 0.5 + ox * 1.8;
    const originY = h * 0.5 + oy * 1.4;

    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = (row % 2) * (colGap * 0.5);
      const x = originX - areaW * 0.5 + col * colGap + offsetX;
      const y = originY - areaH * 0.5 + row * rowGap;
      const seed = i * 19.3;
      const breathe = 0.2 + 0.8 * Math.pow(0.5 + 0.5 * Math.sin(t * 0.55 + seed), 2);
      const alpha = breathe * (0.1 + intensity * 0.58);
      if (alpha < 0.04) continue;
      const r = 1.8 + (seed % 3) * 0.55;
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSilent(ctx, w, h, rgb, intensity, t, mx, my, opts) {
    if (opts && opts.surface === "hero") return;
    drawSilentCard(ctx, w, h, rgb, intensity, t, mx, my);
  }

  function draw(ctx, w, h, type, accent, intensity, time, opts) {
    if (!ctx || !w || !h) return;
    const rgb = parseRgb(accent);
    const t = time != null ? time : performance.now() * 0.001;
    const boost = Math.max(0, Math.min(1, intensity));
    const mx = opts && opts.mx != null ? opts.mx : -1;
    const my = opts && opts.my != null ? opts.my : -1;
    ctx.clearRect(0, 0, w, h);

    if (type === "human") drawHuman(ctx, w, h, rgb, boost, t, mx, my, opts);
    else if (type === "nature") drawNature(ctx, w, h, rgb, boost, t, mx, my, opts);
    else if (type === "animal") {
      if (opts && opts.surface === "hero") drawAnimalFireflies(ctx, w, h, rgb, boost, t);
      else drawAnimal(ctx, w, h, rgb, boost, t, mx, my);
    } else if (type === "silent") drawSilent(ctx, w, h, rgb, boost, t, mx, my, opts);
  }

  return { draw, parseRgb };
})();
