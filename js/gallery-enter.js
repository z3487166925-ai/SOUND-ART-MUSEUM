(function () {
  "use strict";

  if (!document.body.classList.contains("page-gallery")) return;
  if (document.body.dataset.hall === "silent") return;

  document.body.classList.add("gallery-enter");

  function run() {
    document.body.classList.add("gallery-enter--active");
    var hero = document.querySelector(".gallery-hero");
    var archive = document.querySelector(".gallery-archive");
    if (hero) hero.classList.add("is-revealed");
    document.querySelectorAll(".gallery-hero__overlay > *").forEach(function (el, i) {
      el.classList.add("float-reveal");
      el.style.setProperty("--reveal-i", String(i));
    });
    setTimeout(function () {
      if (archive) archive.classList.add("is-revealed");
      if (window.FloatReveal) window.FloatReveal.observe();
    }, 260);
  }

  window.runGalleryEnter = run;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    requestAnimationFrame(run);
  }
})();
