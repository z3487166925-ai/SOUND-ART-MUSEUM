window.HomePage = (function () {
  "use strict";

  var hallRaf = 0;
  var hallArts = [];
  var onResize = null;
  var currentCard = null;
  var previewEnded = null;

  function destroy() {
    cancelAnimationFrame(hallRaf);
    hallRaf = 0;
    hallArts = [];
    if (onResize) {
      window.removeEventListener("resize", onResize);
      onResize = null;
    }
    var galleryPreview = document.getElementById("gallery-preview");
    if (galleryPreview) {
      galleryPreview.pause();
      galleryPreview.removeAttribute("src");
      if (previewEnded) galleryPreview.removeEventListener("ended", previewEnded);
    }
    previewEnded = null;
    currentCard = null;
  }

  function boot() {
    if (!document.body.classList.contains("page-home")) return;
    destroy();

    var hallCanvases = document.querySelectorAll(".hall-card__art");
    var galleryPreview = document.getElementById("gallery-preview");
    var hallCards = document.querySelectorAll(".hall-card");

    function setupHallCanvas(canvas) {
      var type = canvas.dataset.type;
      var card = canvas.closest(".hall-card");
      var accent = getComputedStyle(card).getPropertyValue("--accent").trim() || "#fff";

      function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas._w = rect.width;
        canvas._h = rect.height;
        canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      resize();
      canvas._type = type;
      canvas._accent = accent;
      canvas._resize = resize;
      canvas._hover = 0;
      canvas._mx = -1;
      canvas._my = -1;

      if (card) {
        card.addEventListener("mousemove", function (e) {
          var rect = canvas.getBoundingClientRect();
          canvas._mx = e.clientX - rect.left;
          canvas._my = e.clientY - rect.top;
        });
        card.addEventListener("mouseenter", function () {
          canvas._hover = 1;
        });
        card.addEventListener("mouseleave", function () {
          canvas._hover = 0;
          canvas._mx = -1;
          canvas._my = -1;
        });
        card.addEventListener("focus", function () {
          canvas._hover = 1;
        });
        card.addEventListener("blur", function () {
          canvas._hover = 0;
        });
      }
      return canvas;
    }

    hallArts = Array.from(hallCanvases).map(setupHallCanvas);

    function drawHallArts() {
      var t = performance.now() * 0.001;
      for (var i = 0; i < hallArts.length; i++) {
        var canvas = hallArts[i];
        if (!canvas._w || !window.HallArt) continue;
        var intensity = canvas._hover || 0;
        window.HallArt.draw(
          canvas.getContext("2d"),
          canvas._w,
          canvas._h,
          canvas._type,
          canvas._accent,
          intensity,
          t,
          { mx: canvas._mx, my: canvas._my, surface: "card" }
        );
      }
      hallRaf = requestAnimationFrame(drawHallArts);
    }

    onResize = function () {
      hallArts.forEach(function (c) {
        if (c._resize) c._resize();
      });
    };
    window.addEventListener("resize", onResize);
    drawHallArts();

    document.body.classList.add("is-loaded");

    if (galleryPreview && hallCards.length) {
      var bgMusic = document.getElementById("bg-music");
      var bgDucked = false;
      var savedBgVolume = 0.28;

      function duckBg() {
        if (!bgMusic || bgMusic.paused || bgDucked) return;
        savedBgVolume = bgMusic.volume;
        bgMusic.volume = 0.06;
        bgDucked = true;
      }

      function unduckBg() {
        if (!bgMusic || !bgDucked) return;
        bgMusic.volume = savedBgVolume;
        bgDucked = false;
      }

      function stopPreview() {
        galleryPreview.pause();
        galleryPreview.removeAttribute("src");
        currentCard = null;
        unduckBg();
      }

      function playPreview(card) {
        var src = card.dataset.sound;
        if (!src || currentCard === card) return;
        currentCard = card;
        galleryPreview.src = src;
        galleryPreview.volume = 0.7;
        galleryPreview.currentTime = 0;
        duckBg();
        galleryPreview.play().catch(function () {});
      }

      previewEnded = stopPreview;
      galleryPreview.addEventListener("ended", previewEnded);
      hallCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
          playPreview(card);
        });
        card.addEventListener("mouseleave", function () {
          if (currentCard === card) stopPreview();
        });
        card.addEventListener("click", function () {
          stopPreview();
          if (window.playBgMusic) window.playBgMusic();
        });
      });
    }

    var explore = document.getElementById("explore-cta");
    if (explore) {
      explore.addEventListener("click", function () {
        if (window.playBgMusic) window.playBgMusic();
      });
    }

    if (window.initSoundCards) window.initSoundCards();
  }

  return { boot: boot, destroy: destroy };
})();

if (document.body.classList.contains("page-home")) {
  window.HomePage.boot();
}
