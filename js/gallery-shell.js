(function () {
  "use strict";

  function renderHeader() {
    var header = document.getElementById("site-header");
    if (!header || typeof SITE_DATA === "undefined") return;

    header.className = "site-header site-header--inner";
    header.innerHTML =
      '<a href="../index.html" class="brand brand--text-only" aria-label="' +
      SITE_DATA.museum.nameZh +
      '">' +
      '<span class="brand__text">' +
      SITE_DATA.museum.nameZh +
      "</span></a>" +
      '<nav class="main-nav" aria-label="main">' +
      '<a href="../index.html" class="main-nav__link">\u9996\u9875</a>' +
      '<a href="../index.html#exhibitions" class="main-nav__link is-active">\u5c55\u89c8</a>' +
      '<a href="../index.html#collection" class="main-nav__link">\u5178\u85cf</a>' +
      '<a href="../index.html#about" class="main-nav__link">\u5173\u4e8e</a>' +
      '<a href="../index.html#visit" class="main-nav__link">\u53c2\u89c2</a>' +
      '<a href="../index.html#news" class="main-nav__link">\u8d44\u8baf</a>' +
      "</nav>" +
      '<div class="header-actions">' +
      '<button type="button" class="icon-btn btn-glow" id="btn-search" aria-label="\u641c\u7d22">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg></button>' +
      '<button type="button" class="icon-btn btn-glow" id="btn-menu" aria-label="\u83dc\u5355">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>';

    var back = document.getElementById("gallery-back");
    if (back) back.textContent = "BACK";

    var archiveTitle = document.getElementById("page-archive-title");
    if (archiveTitle) archiveTitle.textContent = "\u58f0\u97f3\u6863\u6848\u5e93";

    var archiveSub = document.getElementById("page-archive-sub");
    if (archiveSub)
      archiveSub.textContent = "\u672c\u9986\u7cbe\u9009\u58f0\u97f3 \u00b7 \u70b9\u51fb\u64ad\u653e\u8046\u542c";

    var musicBtn = document.getElementById("music-toggle");
    if (musicBtn) musicBtn.setAttribute("aria-label", "\u5f00\u5173\u80cc\u666f\u97f3\u4e50");
  }

  window.renderGalleryHeader = renderHeader;

  if (document.body.classList.contains("page-gallery")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderHeader);
    } else {
      renderHeader();
    }
  }
})();
