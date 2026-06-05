(function () {
  "use strict";

  var id = document.body.dataset.exhibitionId;
  if (!id || typeof SITE_DATA === "undefined") return;

  var ex = SITE_DATA.exhibitions.find(function (e) {
    return e.id === id;
  });
  if (!ex || !ex.article) return;

  document.title = ex.titleZh + " | " + SITE_DATA.museum.nameZh;

  var root = document.getElementById("exhibition-article");
  if (!root) return;

  root.innerHTML =
    '<a href="../index.html#exhibitions-current" class="exhibition-article__back">\u8fd4\u56de\u5f53\u524d\u5c55\u89c8</a>' +
    '<span class="exhibition-article__badge"></span>' +
    '<h1 class="exhibition-article__title"></h1>' +
    '<p class="exhibition-article__en"></p>' +
    '<p class="exhibition-article__meta"></p>' +
    '<p class="exhibition-article__lead"></p>' +
    '<div class="exhibition-article__sections"></div>' +
    '<p class="exhibition-article__curator"></p>';

  root.querySelector(".exhibition-article__badge").textContent = ex.status;
  root.querySelector(".exhibition-article__title").textContent = ex.titleZh;
  root.querySelector(".exhibition-article__en").textContent = ex.titleEn;
  root.querySelector(".exhibition-article__meta").textContent =
    ex.dates + " · " + ex.venue + " · " + ex.artist + " · " + ex.medium;
  root.querySelector(".exhibition-article__lead").textContent = ex.article.lead;
  root.querySelector(".exhibition-article__curator").textContent = ex.article.curator;

  var sectionsEl = root.querySelector(".exhibition-article__sections");
  ex.article.sections.forEach(function (sec) {
    var block = document.createElement("section");
    block.className = "exhibition-article__section";
    block.innerHTML = "<h2></h2><p></p>";
    block.querySelector("h2").textContent = sec.heading;
    block.querySelector("p").textContent = sec.body;
    sectionsEl.appendChild(block);
  });

})();
