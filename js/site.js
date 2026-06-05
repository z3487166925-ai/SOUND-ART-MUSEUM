(function () {
  "use strict";

  if (typeof SITE_DATA === "undefined") return;

  const d = SITE_DATA;

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function renderExhibitions() {
    const root = document.getElementById("exhibitions-grid");
    if (!root) return;
    root.innerHTML = "";
    d.exhibitions.forEach((ex) => {
      const card = el("a", "exhibition-card float-reveal");
      card.href = "exhibitions/" + ex.id + ".html";
      card.style.setProperty("--reveal-i", String(root.children.length));
      const bg = ex.imageFallback || "#111";
      card.innerHTML = `
        <div class="exhibition-card__img" style="background:${bg};background-size:cover;background-position:center"></div>
        <div class="exhibition-card__body">
          <span class="exhibition-card__badge">${ex.status}</span>
          <h3 class="exhibition-card__title">${ex.titleZh}</h3>
          <p class="exhibition-card__en">${ex.titleEn}</p>
          <p class="exhibition-card__meta">${ex.dates} · ${ex.venue}</p>
          <p class="exhibition-card__desc">${ex.desc}</p>
          <p class="exhibition-card__artist">${ex.artist} · ${ex.medium}</p>
          <span class="exhibition-card__more">\u9605\u8bfb\u8be6\u60c5 \u2192</span>
        </div>`;
      root.appendChild(card);
      const imgEl = card.querySelector(".exhibition-card__img");
      if (imgEl && ex.image) {
        const probe = new Image();
        probe.onload = function () {
          imgEl.style.backgroundImage = "url('" + ex.image + "')";
        };
        probe.src = ex.image;
      }
    });
  }

  function renderArtists() {
    const root = document.getElementById("artists-grid");
    if (!root) return;
    root.textContent = "";
    d.artists.forEach((a) => {
      const card = document.createElement("article");
      card.className = "artist-card float-reveal";
      card.style.setProperty("--reveal-i", String(root.children.length));
      const name = document.createElement("h3");
      name.className = "artist-card__name";
      name.textContent = a.name;
      const en = document.createElement("p");
      en.className = "artist-card__en";
      en.textContent = a.nameEn;
      const meta = document.createElement("p");
      meta.className = "artist-card__meta";
      meta.textContent = a.country + " \u00b7 " + a.focus;
      const work = document.createElement("p");
      work.className = "artist-card__work";
      work.textContent = a.work + "\uff08" + a.year + "\uff09";
      card.appendChild(name);
      card.appendChild(en);
      card.appendChild(meta);
      card.appendChild(work);
      root.appendChild(card);
    });
  }

  function bindEventsScrollProgress() {
    const track = document.getElementById("events-track");
    const fill = document.querySelector(".events-scroll-progress__fill");
    if (!track || !fill) return;

    function update() {
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      fill.style.width = pct + "%";
    }

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function renderEvents() {
    const track = document.getElementById("events-track");
    if (!track) return;
    track.innerHTML = "";
    d.events.forEach((ev) => {
      const item = el("article", "event-card float-reveal");
      item.style.setProperty("--reveal-i", String(track.children.length));
      item.innerHTML = `
        <time class="event-card__date">${ev.date}</time>
        <span class="event-card__type">${ev.type}</span>
        <h3 class="event-card__title">${ev.title}</h3>
        <p class="event-card__hall">${ev.hall}</p>`;
      track.appendChild(item);
    });
    bindEventsScrollProgress();
  }

  function renderNews() {
    const root = document.getElementById("news-list");
    if (!root) return;
    root.innerHTML = "";
    d.news.forEach((n) => {
      const row = el("article", "news-item float-reveal");
      row.style.setProperty("--reveal-i", String(root.children.length));
      row.innerHTML = `
        <time class="news-item__date">${n.date}</time>
        <span class="news-item__tag">${n.tag}</span>
        <h3 class="news-item__title">${n.title}</h3>`;
      root.appendChild(row);
    });
  }

  function renderVisit() {
    const root = document.getElementById("visit-grid");
    if (!root) return;
    root.innerHTML = "";
    d.visit.forEach((v) => {
      const col = el("div", "visit-col float-reveal");
      col.style.setProperty("--reveal-i", String(root.children.length));
      col.innerHTML = `<h3 class="visit-col__title">${v.title}</h3><ul class="visit-col__list">${v.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
      root.appendChild(col);
    });
  }

  function renderAboutStats() {
    const root = document.getElementById("about-stats");
    if (!root) return;
    root.innerHTML = "";
    d.museum.stats.forEach((s) => {
      const item = el("div", "about-stat float-reveal");
      item.style.setProperty("--reveal-i", String(root.children.length));
      item.innerHTML = `<span class="about-stat__val">${s.value}</span><span class="about-stat__label">${s.label}</span>`;
      root.appendChild(item);
    });
  }

  function renderArchivePreview() {
    const root = document.getElementById("archive-preview");
    if (!root) return;
    const halls = ["human", "nature", "animal", "silent"];
    root.innerHTML = "";
    halls.forEach((id) => {
      const hall = d.halls[id];
      const first = hall.tracks && hall.tracks[0];
      const row = el("a", "archive-row float-reveal");
      row.style.setProperty("--reveal-i", String(root.children.length));
      row.href = `galleries/${id}.html`;
      row.style.setProperty("--accent", hall.accent);
      if (first) {
        row.innerHTML = `
        <button type="button" class="archive-row__play" aria-label="试听"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
        <div class="archive-row__info">
          <h3 class="archive-row__title">${hall.titleZh}</h3>
          <p class="archive-row__sub">${first.titleZh}</p>
          <p class="archive-row__desc">${first.desc}</p>
        </div>
        <canvas class="archive-row__wave" width="120" height="32" aria-hidden="true"></canvas>
        <div class="archive-row__meta">
          <span class="archive-row__num">${first.num}</span>
          <span class="archive-row__dur">${first.duration}</span>
        </div>`;
      } else {
        row.innerHTML = `
        <div class="archive-row__info">
          <h3 class="archive-row__title">${hall.titleZh}</h3>
          <p class="archive-row__sub">视觉展厅</p>
          <p class="archive-row__desc">${hall.intro}</p>
        </div>
        <div class="archive-row__meta"><span class="archive-row__num">—</span></div>`;
      }
      root.appendChild(row);
    });
  }

  window.SiteBoot = function () {
    renderExhibitions();
    renderArtists();
    renderEvents();
    renderNews();
    renderVisit();
    renderAboutStats();
    renderArchivePreview();
    if (window.FloatReveal) window.FloatReveal.observe();
  };

  if (document.body.classList.contains("page-home")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", window.SiteBoot);
    } else {
      window.SiteBoot();
    }
  }
})();
