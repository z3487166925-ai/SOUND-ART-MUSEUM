(function () {
  "use strict";

  if (document.body.dataset.hall !== "silent" || typeof SITE_DATA === "undefined") return;

  const hall = SITE_DATA.halls.silent;
  const ex = hall.silentExhibit;
  if (!ex) return;

  document.body.classList.add("page-gallery--silent", "gallery-enter");
  document.documentElement.style.setProperty("--hall-accent", hall.accent);
  document.title = hall.titleZh + " | " + SITE_DATA.museum.nameZh;

  const labelEl = document.getElementById("gallery-label");
  const heroEn = document.getElementById("gallery-hero-en");
  const titleZh = document.getElementById("gallery-title-zh");
  const tagEl = document.getElementById("gallery-tag");
  const intro = document.getElementById("gallery-intro");

  if (labelEl) labelEl.textContent = "\u7b2c " + hall.num + " \u5c55\u5385";
  if (heroEn) heroEn.textContent = hall.titleEn || "Silence";
  if (titleZh) titleZh.textContent = hall.titleZh;
  if (tagEl) tagEl.textContent = hall.tag || "";
  if (intro) intro.textContent = hall.intro;

  var back = document.getElementById("gallery-back");
  if (back) back.textContent = "\u8fd4\u56de";

  const root = document.getElementById("silent-exhibit");
  if (!root) return;

  root.innerHTML =
    '<header class="silent-intro float-reveal">' +
    '<h2 class="silent-intro__title"></h2>' +
    '<p class="silent-intro__body"></p>' +
    "</header>" +
    '<section class="silent-section float-reveal" data-section="sign">' +
    '<p class="silent-section__label">\u624b\u8bed</p>' +
    '<h3 class="silent-section__title">\u624b\u8bed\u89c6\u89c9\u533a</h3>' +
    '<div class="sign-grid" id="sign-grid"></div>' +
    "</section>" +
    '<section class="silent-section float-reveal" data-section="braille">' +
    '<p class="silent-section__label">\u76f2\u6587</p>' +
    '<h3 class="silent-section__title">\u76f2\u6587\u89c6\u89c9\u533a</h3>' +
    '<div class="braille-grid" id="braille-grid"></div>' +
    "</section>";

  root.querySelector(".silent-intro__title").textContent = ex.introTitle;
  root.querySelector(".silent-intro__body").textContent = ex.introBody;

  const signGrid = root.querySelector("#sign-grid");
  ex.signLanguage.forEach(function (item, i) {
    const card = document.createElement("article");
    card.className = "sign-card float-reveal";
    card.style.setProperty("--reveal-i", String(i));
    card.innerHTML =
      '<div class="sign-card__visual">' +
      '<img class="sign-card__art" src="../' +
      item.image +
      '" alt="' +
      item.word +
      " 手语粒子艺术" +
      '" loading="lazy" decoding="async" />' +
      "</div>" +
      '<div class="sign-card__cap">' +
      '<p class="sign-card__word"></p>' +
      (item.hint ? '<p class="sign-card__hint"></p>' : "") +
      '<span class="sign-card__divider" aria-hidden="true"></span>' +
      '<p class="sign-card__en"></p></div>';
    card.querySelector(".sign-card__word").textContent = item.word;
    card.querySelector(".sign-card__en").textContent = item.en;
    if (item.hint) {
      var hintEl = card.querySelector(".sign-card__hint");
      if (hintEl) hintEl.textContent = item.hint;
    }
    signGrid.appendChild(card);
  });

  const brailleGrid = root.querySelector("#braille-grid");
  ex.braille.forEach(function (item, i) {
    const block = document.createElement("div");
    block.className = "braille-block float-reveal";
    block.style.setProperty("--reveal-i", String(i));
    block.innerHTML =
      '<p class="braille-block__zh"></p>' +
      '<p class="braille-block__word" aria-hidden="true"></p>' +
      '<p class="braille-block__unicode"></p>';
    block.querySelector(".braille-block__zh").textContent = item.zh || item.word;
    block.querySelector(".braille-block__word").textContent = item.word;

    const unicodeEl = block.querySelector(".braille-block__unicode");

    if (item.rows && item.rows.length) {
      unicodeEl.classList.add("braille-block__unicode--rows");
      var charIndex = 0;
      item.rows.forEach(function (rowChars) {
        var rowEl = document.createElement("p");
        rowEl.className = "braille-row";
        rowChars.forEach(function (ch) {
          var span = document.createElement("span");
          span.className = "braille-char";
          span.textContent = ch;
          span.style.setProperty("--ci", String(charIndex));
          charIndex += 1;
          rowEl.appendChild(span);
        });
        unicodeEl.appendChild(rowEl);
      });

      block.addEventListener("mouseenter", function () {
        block.classList.add("is-lit");
        block.querySelectorAll(".braille-char").forEach(function (span, ci) {
          setTimeout(function () {
            span.classList.add("is-on");
          }, ci * 70);
        });
      });
      block.addEventListener("mouseleave", function () {
        block.classList.remove("is-lit");
        block.querySelectorAll(".braille-char").forEach(function (s) {
          s.classList.remove("is-on");
        });
      });
    } else {
      const chars = Array.from(item.unicode);
      chars.forEach(function (ch, ci) {
        const span = document.createElement("span");
        span.className = "braille-char";
        span.textContent = ch;
        span.style.setProperty("--ci", String(ci));
        span.setAttribute("aria-label", ch === "\u2800" ? "\u7a7a" : ch);
        unicodeEl.appendChild(span);
      });

      block.addEventListener("mouseenter", function () {
        block.classList.add("is-lit");
        chars.forEach(function (_, ci) {
          setTimeout(function () {
            block.querySelectorAll(".braille-char")[ci]?.classList.add("is-on");
          }, ci * 70);
        });
      });
      block.addEventListener("mouseleave", function () {
        block.classList.remove("is-lit");
        block.querySelectorAll(".braille-char").forEach(function (s) {
          s.classList.remove("is-on");
        });
      });
    }
    brailleGrid.appendChild(block);
  });

  requestAnimationFrame(function () {
    document.body.classList.add("gallery-enter--active");
    document.querySelector(".gallery-hero")?.classList.add("is-revealed");
    document.querySelectorAll(".gallery-hero__overlay > *").forEach(function (el, i) {
      el.classList.add("float-reveal");
      el.style.setProperty("--reveal-i", String(i));
    });
    setTimeout(function () {
      root.classList.add("is-revealed");
      if (window.FloatReveal) window.FloatReveal.observe(root);
      if (window.FloatReveal) window.FloatReveal.observe(document);
      if (window.renderHallSwitcher) window.renderHallSwitcher("silent", root);
    }, 280);
  });

  var bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.removeAttribute("src");
  }
})();
