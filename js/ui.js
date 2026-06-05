(function () {
  "use strict";

  var prefix = document.body.classList.contains("page-gallery") ? "../" : "";

  function closeAll() {
    ["search-overlay", "menu-overlay"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove("is-open");
    });
    document.body.classList.remove("ui-lock");
  }

  function ensurePanels() {
    if (!document.getElementById("search-overlay")) {
      var search = document.createElement("div");
      search.id = "search-overlay";
      search.className = "ui-overlay ui-overlay--search";
      search.innerHTML =
        '<div class="ui-panel ui-panel--search" role="dialog" aria-label="search">' +
        '<button type="button" class="ui-panel__close" data-close="search-overlay" aria-label="close">&times;</button>' +
        '<h2 class="ui-panel__title">\u641c\u7d22</h2>' +
        '<input type="search" class="ui-panel__input" placeholder="\u58f0\u97f3\u3001\u5c55\u89c8\u3001\u827a\u672f\u5bb6\u2026" />' +
        '<p class="ui-panel__hint">\u8f93\u5165\u5173\u952e\u8bcd\u67e5\u627e\u58f0\u97f3\u6863\u6848\u4e0e\u5c55\u89c8\u4fe1\u606f</p>' +
        "</div>";
      search.addEventListener("click", function (e) {
        if (e.target === search) closeAll();
      });
      document.body.appendChild(search);
    }

    if (!document.getElementById("menu-overlay")) {
      var menu = document.createElement("div");
      menu.id = "menu-overlay";
      menu.className = "ui-overlay ui-overlay--drawer";
      menu.innerHTML =
        '<div class="ui-panel ui-panel--drawer" role="dialog" aria-label="menu">' +
        '<button type="button" class="ui-panel__close" data-close="menu-overlay" aria-label="close">&times;</button>' +
        '<nav class="ui-panel__nav">' +
        '<a href="' + prefix + 'index.html">\u9996\u9875</a>' +
        '<a href="' + prefix + 'index.html#exhibitions">\u5c55\u89c8</a>' +
        '<a href="' + prefix + 'index.html#collection">\u5178\u85cf</a>' +
        '<a href="' + prefix + 'index.html#about">\u5173\u4e8e</a>' +
        '<a href="' + prefix + 'index.html#visit">\u53c2\u89c2</a>' +
        '<a href="' + prefix + 'index.html#news">\u8d44\u8baf</a>' +
        '<hr />' +
        '<a href="' + prefix + 'galleries/human.html">\u4eba\u58f0\u9986</a>' +
        '<a href="' + prefix + 'galleries/nature.html">\u81ea\u7136\u58f0\u97f3\u9986</a>' +
        '<a href="' + prefix + 'galleries/animal.html">\u52a8\u7269\u58f0\u97f3\u9986</a>' +
        '<a href="' + prefix + 'galleries/silent.html">\u65e0\u58f0\u9986</a>' +
        "</nav></div>";
      menu.addEventListener("click", function (e) {
        if (e.target === menu) closeAll();
      });
      document.body.appendChild(menu);
    }
  }

  ensurePanels();

  function openPanel(id) {
    closeAll();
    var el = document.getElementById(id);
    if (el) {
      el.classList.add("is-open");
      document.body.classList.add("ui-lock");
      var input = el.querySelector("input");
      if (input) setTimeout(function () {
        input.focus();
      }, 150);
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("#btn-search")) {
      e.preventDefault();
      openPanel("search-overlay");
      return;
    }
    if (e.target.closest("#btn-menu")) {
      e.preventDefault();
      openPanel("menu-overlay");
      return;
    }
    if (e.target.closest("[data-close]")) closeAll();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAll();
  });

  var bgMusic = document.getElementById("bg-music");
  var homeMusicToggle = document.getElementById("home-music-toggle");
  var musicToggle = document.getElementById("music-toggle");

  function setHomeMusicBtnPlaying(playing) {
    if (!homeMusicToggle) return;
    homeMusicToggle.classList.toggle("is-playing", playing);
    homeMusicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
    homeMusicToggle.setAttribute(
      "aria-label",
      playing ? "\u6682\u505c\u80cc\u666f\u97f3\u4e50" : "\u64ad\u653e\u80cc\u666f\u97f3\u4e50"
    );
  }

  function setGalleryMusicBtnPlaying(playing) {
    if (!musicToggle || !document.body.classList.contains("page-gallery")) return;
    musicToggle.classList.toggle("is-playing", playing);
    musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
    musicToggle.setAttribute(
      "aria-label",
      playing ? "\u6682\u505c\u80cc\u666f\u97f3\u4e50" : "\u64ad\u653e\u80cc\u666f\u97f3\u4e50"
    );
  }

  function isUserPaused() {
    if (window.isBgMusicUserPaused) return window.isBgMusicUserPaused();
    if (!bgMusic) return false;
    return bgMusic.dataset.userPaused === "true";
  }

  function syncMusicBtns() {
    if (!bgMusic) return;
    var playing = !isUserPaused();
    setHomeMusicBtnPlaying(playing);
    setGalleryMusicBtnPlaying(playing);
  }

  window.syncBgMusicUi = syncMusicBtns;

  function toggleBgMusic() {
    if (!bgMusic) return;
    if (isUserPaused()) {
      if (window.clearBgMusicUserPaused) window.clearBgMusicUserPaused();
      if (window.playBgMusic) window.playBgMusic();
      else bgMusic.play().catch(function () {});
    } else {
      if (window.markBgMusicUserPaused) window.markBgMusicUserPaused();
      else bgMusic.pause();
    }
    syncMusicBtns();
  }

  var isGallery = document.body.classList.contains("page-gallery");
  var isSilentHall = document.body.dataset.hall === "silent";

  if (bgMusic && (!isGallery || (isGallery && !isSilentHall))) {
    syncMusicBtns();
    if (!isUserPaused() && window.playBgMusic) window.playBgMusic();

    if (homeMusicToggle) homeMusicToggle.addEventListener("click", toggleBgMusic);
    if (musicToggle) musicToggle.addEventListener("click", toggleBgMusic);

    bgMusic.addEventListener("play", syncMusicBtns);
  }

})();
