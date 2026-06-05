(function () {
  "use strict";

  if (document.body.classList.contains("page-gallery")) return;

  var navLinks = document.querySelectorAll(".main-nav__link");
  var sections = [];

  navLinks.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href === "index.html" || href === "./" || href === "/" || href.endsWith("/index.html")) {
      var hero = document.querySelector(".hero");
      if (hero) sections.push({ link: link, el: hero, id: "top" });
      return;
    }
    if (href.charAt(0) === "#") {
      var el = document.getElementById(href.slice(1));
      if (el) sections.push({ link: link, el: el, id: href.slice(1) });
    }
  });

  if (!sections.length) return;

  function setActive(link) {
    navLinks.forEach(function (a) {
      a.classList.remove("is-active");
    });
    if (link) link.classList.add("is-active");
  }

  function onScroll() {
    var y = window.scrollY + window.innerHeight * 0.32;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop <= y) current = sections[i];
    }
    setActive(current.link);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
