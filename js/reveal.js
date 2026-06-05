(function () {
  "use strict";

  function observe(root) {
    var scope = root || document;
    var items = scope.querySelectorAll(".float-reveal:not(.is-revealed)");
    if (!items.length) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-revealed");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 6% 0px" }
    );

    items.forEach(function (el, i) {
      if (!el.style.getPropertyValue("--reveal-i")) {
        el.style.setProperty("--reveal-i", String(el.dataset.revealI != null ? el.dataset.revealI : i));
      }
      obs.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    observe();
  });

  window.FloatReveal = { observe: observe };
})();
