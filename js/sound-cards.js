(function () {
  "use strict";

  var RANDOM_POOL = [
    { title: "雨夜窗台的滴答", mood: "安静", desc: "来自记忆深处的声音" },
    { title: "蝉鸣越过树梢", mood: "盛夏", desc: "童年午后的透明空气" },
    { title: "老唱片里的沙沙", mood: "怀旧", desc: "祖母房间里的微光" },
    { title: "地铁进站的轰鸣", mood: "城市", desc: "通勤路上短暂的失重" },
    { title: "雪落松枝的轻响", mood: "清冽", desc: "北方冬天独有的寂静" },
    { title: "茶沸时的咕嘟", mood: "温润", desc: "慢火细熬的午后时光" },
    { title: "远海灯塔的雾笛", mood: "辽阔", desc: "夜色里唯一的指引" },
    { title: "翻书页的窸窣", mood: "专注", desc: "图书馆角落的私密宇宙" },
    { title: "巷口风铃的叮当", mood: "温柔", desc: "路过时轻轻被唤起的名字" },
    { title: "黎明前第一声鸟鸣", mood: "苏醒", desc: "世界尚未完全醒来" },
  ];

  var GHOST_TEXTS = ["雨夜", "风声", "蝉鸣", "旧磁带", "海浪", "钟摆", "脚步"];
  var DECORS = ["ink", "wave", "line", "seal", "moon"];

  var GHOST_SLOTS = [
    { top: "8%", left: "-4%", r: "-18deg", o: 0.22, dur: "16s", delay: "0s" },
    { top: "18%", right: "-8%", r: "14deg", o: 0.18, dur: "18s", delay: "-4s" },
    { top: "55%", left: "-10%", r: "8deg", o: 0.14, dur: "20s", delay: "-7s" },
    { top: "62%", right: "-6%", r: "-12deg", o: 0.2, dur: "15s", delay: "-2s" },
    { top: "32%", left: "72%", r: "22deg", o: 0.12, dur: "22s", delay: "-9s" },
  ];

  var flipping = false;
  var revealed = false;
  var lastRandomIdx = -1;

  function formatToday() {
    var d = new Date();
    return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
  }

  function randomAccent() {
    var h = Math.floor(Math.random() * 360);
    var s = 30 + Math.floor(Math.random() * 32);
    var l = 46 + Math.floor(Math.random() * 14);
    return { rgb: hslToRgb(h, s, l) };
  }

  function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    var m = l - c / 2;
    var r = 0;
    var g = 0;
    var b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }

  function pickDecor() {
    return DECORS[Math.floor(Math.random() * DECORS.length)];
  }

  function pickRandomPool() {
    if (RANDOM_POOL.length <= 1) return 0;
    var idx;
    do {
      idx = Math.floor(Math.random() * RANDOM_POOL.length);
    } while (idx === lastRandomIdx);
    lastRandomIdx = idx;
    return idx;
  }

  function applyAccent(el, accent) {
    if (!el || !accent) return;
    el.style.setProperty("--card-accent", accent.rgb.join(", "));
  }

  function decorSvg(type, rgb) {
    var a1 = "rgba(" + rgb.join(",") + ",0.07)";
    var a2 = "rgba(" + rgb.join(",") + ",0.04)";
    var a3 = "rgba(" + rgb.join(",") + ",0.1)";
    var map = {
      ink:
        '<svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 80 Q40 55 80 62 T160 48 T220 70 V80H0Z" fill="' +
        a1 +
        '"/><path d="M0 80 Q60 68 120 72 T200 58 V80H0Z" fill="' +
        a2 +
        '"/></svg>',
      wave:
        '<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 Q25 28 50 40 T100 38 T150 42 T200 36 V60H0Z" fill="none" stroke="' +
        a1 +
        '" stroke-width="0.8"/><path d="M0 50 Q30 42 60 48 T120 44 T200 46 V60H0Z" fill="none" stroke="' +
        a2 +
        '" stroke-width="0.6"/></svg>',
      line:
        '<svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M20 45 Q80 20 140 50 Q160 58 190 35" fill="none" stroke="' +
        a1 +
        '" stroke-width="0.7"/></svg>',
      seal:
        '<svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true"><circle cx="168" cy="58" r="14" fill="none" stroke="' +
        a1 +
        '" stroke-width="0.8"/><text x="168" y="62" text-anchor="middle" font-size="8" fill="' +
        a3 +
        '" font-family=\'serif\'>忆</text></svg>',
      moon:
        '<svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true"><circle cx="155" cy="42" r="18" fill="' +
        a2 +
        '"/><path d="M0 80 Q50 60 100 65 T200 55 V80H0Z" fill="' +
        a1 +
        '"/></svg>',
    };
    return map[type] || map.ink;
  }

  function readForm(nameInput, descInput) {
    return {
      title: nameInput.value.trim(),
      desc: descInput.value.trim(),
      mood: "",
      date: formatToday(),
      decor: pickDecor(),
    };
  }

  function randomEntry() {
    var item = RANDOM_POOL[pickRandomPool()];
    return {
      title: item.title,
      mood: item.mood,
      desc: item.desc,
      date: formatToday(),
      decor: pickDecor(),
    };
  }

  function moodLine(data) {
    if (data.mood) return data.mood + " / " + data.desc;
    return data.desc;
  }

  function renderFace(el, data, accent) {
    if (!el || !data) return;
    applyAccent(el, accent);
    var rgb = accent.rgb;
    el.innerHTML =
      '<div class="sound-memory__paper">' +
      '<p class="sound-memory__mood">' +
      moodLine(data) +
      "</p>" +
      '<h3 class="sound-memory__title">' +
      data.title +
      "</h3>" +
      '<time class="sound-memory__date">' +
      data.date +
      "</time>" +
      '<div class="sound-memory__decor">' +
      decorSvg(data.decor, rgb) +
      '<span class="sound-memory__decor-line"></span></div></div>';
  }

  function buildGhosts(container) {
    if (!container) return;
    container.textContent = "";
    GHOST_SLOTS.forEach(function (slot, i) {
      var accent = randomAccent();
      var ghost = document.createElement("div");
      ghost.className = "sound-memory__ghost";
      ghost.style.setProperty("--ghost-r", slot.r);
      ghost.style.setProperty("--ghost-o", String(slot.o));
      ghost.style.setProperty("--ghost-dur", slot.dur);
      ghost.style.setProperty("--ghost-delay", slot.delay);
      ghost.style.setProperty("--card-accent", accent.rgb.join(", "));
      if (slot.top) ghost.style.top = slot.top;
      if (slot.left) ghost.style.left = slot.left;
      if (slot.right) ghost.style.right = slot.right;
      ghost.innerHTML =
        '<span class="sound-memory__ghost-text">' +
        GHOST_TEXTS[i % GHOST_TEXTS.length] +
        "</span>";
      container.appendChild(ghost);
    });
  }

  function resetFlip(card, inner) {
    card.classList.remove("is-flipped");
    inner.style.transition = "none";
    void inner.offsetWidth;
    inner.style.transition = "";
  }

  function showCard(flipWrap, card, front, back, data, accent) {
    var stage = flipWrap.closest(".sound-memory__stage");
    if (stage) stage.style.setProperty("--card-accent", accent.rgb.join(", "));
    renderFace(front, data, accent);
    renderFace(back, data, accent);
    flipWrap.classList.add("is-revealed");
    card.classList.add("is-active");
    revealed = true;
  }

  function presentCard(ctx, data, onDone) {
    var accent = randomAccent();

    if (!revealed) {
      flipping = true;
      showCard(ctx.flipWrap, ctx.card, ctx.front, ctx.back, data, accent);
      setTimeout(function () {
        flipping = false;
        if (onDone) onDone();
      }, 1100);
      return;
    }

    flipping = true;
    renderFace(ctx.back, data, accent);
    var stage = ctx.flipWrap.closest(".sound-memory__stage");
    if (stage) stage.style.setProperty("--card-accent", accent.rgb.join(", "));

    ctx.card.classList.add("is-flipped");

    function onEnd(ev) {
      if (ev.propertyName !== "transform") return;
      ctx.inner.removeEventListener("transitionend", onEnd);
      renderFace(ctx.front, data, accent);
      resetFlip(ctx.card, ctx.inner);
      flipping = false;
      if (onDone) onDone();
    }

    ctx.inner.addEventListener("transitionend", onEnd);
  }

  function setButtonsDisabled(ctx, disabled) {
    if (ctx.drawBtn) ctx.drawBtn.disabled = disabled;
    if (ctx.randomBtn) ctx.randomBtn.disabled = disabled;
  }

  window.destroySoundCards = function () {
    flipping = false;
    revealed = false;
    lastRandomIdx = -1;
  };

  window.initSoundCards = function () {
    if (!document.body.classList.contains("page-home")) return;

    var form = document.getElementById("sound-card-form");
    var nameInput = document.getElementById("sound-card-name");
    var descInput = document.getElementById("sound-card-desc");
    var card = document.getElementById("sound-memory-card");
    var inner = document.getElementById("sound-memory-inner");
    var front = document.getElementById("sound-memory-front");
    var back = document.getElementById("sound-memory-back");
    var ghosts = document.getElementById("sound-memory-ghosts");
    var flipWrap = document.querySelector(".sound-memory__flip");
    var drawBtn = document.getElementById("sound-memory-draw");
    var randomBtn = document.getElementById("sound-memory-random");

    if (!form || !nameInput || !descInput || !card || !inner || !front || !back || !flipWrap) return;

    buildGhosts(ghosts);

    var ctx = {
      form: form,
      nameInput: nameInput,
      descInput: descInput,
      card: card,
      inner: inner,
      front: front,
      back: back,
      flipWrap: flipWrap,
      drawBtn: drawBtn,
      randomBtn: randomBtn,
    };

    if (form.dataset.bound === "1") return;
    form.dataset.bound = "1";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (flipping) return;

      var data = readForm(nameInput, descInput);
      if (!data.title) {
        nameInput.focus();
        return;
      }
      if (!data.desc) {
        descInput.focus();
        return;
      }

      setButtonsDisabled(ctx, true);
      presentCard(ctx, data, function () {
        setButtonsDisabled(ctx, false);
        nameInput.value = "";
        descInput.value = "";
        nameInput.focus();
      });
    });

    if (randomBtn) {
      randomBtn.addEventListener("click", function () {
        if (flipping) return;
        var data = randomEntry();
        nameInput.value = data.title;
        descInput.value = data.desc;
        setButtonsDisabled(ctx, true);
        presentCard(ctx, data, function () {
          setButtonsDisabled(ctx, false);
        });
      });
    }
  };

  if (document.body.classList.contains("page-home")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", window.initSoundCards);
    } else {
      window.initSoundCards();
    }
  }
})();
