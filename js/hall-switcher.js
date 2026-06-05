(function () {
  "use strict";

  if (typeof SITE_DATA === "undefined") return;

  var HALL_ORDER = ["human", "nature", "animal", "silent"];

  function renderHallSwitcher(currentId, mount) {
    if (!mount) return;
    var nav = document.getElementById("hall-switcher");
    if (!nav) {
      nav = document.createElement("nav");
      nav.id = "hall-switcher";
      nav.className = "hall-switcher float-reveal";
      nav.setAttribute("aria-label", "\u5207\u6362\u5c55\u9986");
      mount.appendChild(nav);
    }

    var html =
      '<p class="hall-switcher__label">\u5176\u4ed6\u5c55\u9986</p>' +
      '<div class="hall-switcher__grid">';

    HALL_ORDER.forEach(function (id, i) {
      var hall = SITE_DATA.halls[id];
      if (!hall) return;
      var active = id === currentId;
      html +=
        '<a href="' +
        id +
        '.html" class="hall-switcher__link' +
        (active ? " is-current" : "") +
        '" style="--hall-accent:' +
        hall.accent +
        '" aria-current="' +
        (active ? "page" : "false") +
        '">' +
        '<span class="hall-switcher__num">' +
        hall.num +
        "</span>" +
        '<span class="hall-switcher__name">' +
        hall.titleZh +
        "</span>" +
        '<span class="hall-switcher__en">' +
        (hall.titleEn || "") +
        "</span></a>";
    });

    html += "</div>";
    nav.innerHTML = html;
    nav.style.setProperty("--reveal-i", "0");
    if (window.FloatReveal) window.FloatReveal.observe(mount);
  }

  window.renderHallSwitcher = renderHallSwitcher;
})();
