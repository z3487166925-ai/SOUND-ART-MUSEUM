(function () {
  "use strict";

  var MUSIC_HALLS = { human: 1, nature: 1, animal: 1 };

  function hallFromPath(path) {
    var m = path.match(/(?:^|\/)galleries\/(human|nature|animal)\.html/i);
    if (m) return m[1].toLowerCase();
    m = path.match(/(?:^|\/)(human|nature|animal)\.html/i);
    if (m) return m[1].toLowerCase();
    return null;
  }

  function isHomePath(path) {
    if (hallFromPath(path)) return false;
    return /\/index\.html$/i.test(path) || /\/$/.test(path) || path === "" || /index\.html$/i.test(path);
  }

  function shouldPjax(url) {
    var path = url.pathname;
    if (path.indexOf("silent") !== -1) return false;
    if (path.indexOf("/exhibitions/") !== -1) return false;
    var hall = hallFromPath(path);
    if (hall && MUSIC_HALLS[hall]) return true;
    if (isHomePath(path)) {
      return document.body.classList.contains("page-gallery") && MUSIC_HALLS[document.body.dataset.hall];
    }
    return false;
  }

  function ensureStylesheet(href) {
    if (document.querySelector('link[href="' + href + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function syncBodyFromDoc(doc) {
    document.body.className = doc.body.className;
    Array.prototype.forEach.call(doc.body.attributes, function (attr) {
      if (attr.name === "class") return;
      if (attr.name.indexOf("data-") === 0) {
        document.body.setAttribute(attr.name, attr.value);
      }
    });
    document.title = doc.title;
  }

  function normalizeMusicUrl(url) {
    if (!url) return "";
    try {
      return new URL(url, location.href).href.split("?")[0];
    } catch (e) {
      return String(url).split("?")[0];
    }
  }

  function syncBgMusicSrc() {
    var bg = document.getElementById("bg-music");
    if (!bg || !window.getBgMusicUrl) return;
    var url = window.getBgMusicUrl();
    if (normalizeMusicUrl(bg.src) === normalizeMusicUrl(url)) return;
    var time = bg.currentTime;
    var playing = !bg.paused;
    bg.src = url;
    bg.currentTime = time;
    if (playing) bg.play().catch(function () {});
  }

  function destroyPage() {
    if (window.destroySoundCards) window.destroySoundCards();
    if (window.GalleryPage && window.GalleryPage.destroy) window.GalleryPage.destroy();
    if (window.HomePage && window.HomePage.destroy) window.HomePage.destroy();
    if (window.Particles && window.Particles.destroy) window.Particles.destroy();
  }

  function bootPage() {
    syncBgMusicSrc();
    if (document.body.classList.contains("page-gallery")) {
      if (document.body.dataset.hall === "silent") return;
      var inGallery = location.pathname.indexOf("galleries") !== -1;
      ensureStylesheet(inGallery ? "../css/gallery.css" : "css/gallery.css");
      if (window.renderGalleryHeader) window.renderGalleryHeader();
      if (window.GalleryPage && window.GalleryPage.boot) window.GalleryPage.boot();
      if (window.runGalleryEnter) window.runGalleryEnter();
    } else if (document.body.classList.contains("page-home")) {
      if (window.SiteBoot) window.SiteBoot();
      if (window.HomePage && window.HomePage.boot) window.HomePage.boot();
      if (window.initSoundCards) window.initSoundCards();
    }
    if (window.Particles && window.Particles.boot) window.Particles.boot();
    if (window.FloatReveal) window.FloatReveal.observe();
    if (window.playBgMusic) window.playBgMusic();
    if (window.syncBgMusicUi) window.syncBgMusicUi();
  }

  var navigating = false;

  function navigate(url, replace) {
    if (navigating) return;
    navigating = true;
    fetch(url, { credentials: "same-origin" })
      .then(function (res) {
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var root = doc.getElementById("page-root");
        if (!root) {
          location.href = url;
          return;
        }
        destroyPage();
        var mount = document.getElementById("page-root");
        mount.innerHTML = root.innerHTML;
        syncBodyFromDoc(doc);
        bootPage();
        if (replace) history.replaceState({ pjax: url }, "", url);
        else history.pushState({ pjax: url }, "", url);
        window.scrollTo(0, 0);
      })
      .catch(function () {
        location.href = url;
      })
      .finally(function () {
        navigating = false;
      });
  }

  document.addEventListener(
    "click",
    function (e) {
      var link = e.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      if (!shouldPjax(url)) return;
      e.preventDefault();
      if (window.playBgMusic) window.playBgMusic();
      navigate(url.href, false);
    },
    true
  );

  window.addEventListener("popstate", function (e) {
    if (e.state && e.state.pjax) navigate(e.state.pjax, true);
  });

  if (!history.state || !history.state.pjax) {
    history.replaceState({ pjax: location.href }, "", location.href);
  }
})();
