window.GalleryPage = (function () {
  "use strict";

  var heroRaf = 0;
  var waveRaf = 0;
  var progressRaf = 0;
  var resizeHeroArt = null;
  var audioEnded = null;
  var audioMeta = null;
  var activeId = null;
  var activeRow = null;
  var bgWasPlaying = false;
  var hall = null;
  var hallId = null;

  function destroy() {
    cancelAnimationFrame(heroRaf);
    cancelAnimationFrame(waveRaf);
    cancelAnimationFrame(progressRaf);
    heroRaf = 0;
    waveRaf = 0;
    progressRaf = 0;
    if (resizeHeroArt) {
      window.removeEventListener("resize", resizeHeroArt);
      resizeHeroArt = null;
    }
    var audio = document.getElementById("track-player");
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      if (audioEnded) audio.removeEventListener("ended", audioEnded);
      if (audioMeta) audio.removeEventListener("loadedmetadata", audioMeta);
    }
    audioEnded = null;
    audioMeta = null;
    activeId = null;
    activeRow = null;
    hall = null;
    hallId = null;
  }

  function boot() {
    destroy();

    hallId = document.body.dataset.hall;
    if (!hallId || typeof SITE_DATA === "undefined") return;
    if (hallId === "silent") return;

    hall = SITE_DATA.halls[hallId];
    if (!hall) return;

    var museumName = SITE_DATA.museum.nameZh;
    document.documentElement.style.setProperty("--hall-accent", hall.accent);
    document.title = hall.titleZh + " | " + museumName;

    var labelEl = document.getElementById("gallery-label");
    var heroEn = document.getElementById("gallery-hero-en");
    var titleZh = document.getElementById("gallery-title-zh");
    var tagEl = document.getElementById("gallery-tag");
    var intro = document.getElementById("gallery-intro");
    var trackList = document.getElementById("track-list");
    var heroArt = document.getElementById("gallery-hero-art");
    var posterEl = document.getElementById("gallery-poster");

    if (labelEl) labelEl.textContent = "\u7b2c " + hall.num + " \u5c55\u5385";
    if (heroEn) heroEn.textContent = hall.titleEn || hall.heroTitleEn;
    if (titleZh) titleZh.textContent = hall.titleZh;
    if (tagEl) tagEl.textContent = hall.tag || "";
    if (intro) intro.textContent = hall.intro;

    var pageTitle = document.getElementById("page-archive-title");
    if (pageTitle) pageTitle.textContent = "\u58f0\u97f3\u6863\u6848\u5e93";

    var sub = document.getElementById("page-archive-sub");
    if (sub) sub.textContent = "\u70b9\u51fb\u64ad\u653e\u8046\u542c \u00b7 \u672c\u9986\u7cbe\u9009\u58f0\u97f3";

    var archiveLabel = document.querySelector(".gallery-archive__label");
    if (archiveLabel) archiveLabel.textContent = "Sound Archive";

    if (posterEl && hall.poster) {
      posterEl.src = "../" + hall.poster;
      posterEl.alt = hall.titleZh;
    }

    if (heroArt && window.HallArt) {
      resizeHeroArt = function () {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var container = heroArt.closest(".gallery-hero__visual") || heroArt.parentElement;
        var rect = container.getBoundingClientRect();
        heroArt.width = rect.width * dpr;
        heroArt.height = rect.height * dpr;
        heroArt._w = rect.width;
        heroArt._h = rect.height;
        heroArt.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resizeHeroArt();
      window.addEventListener("resize", resizeHeroArt);
      (function loopHeroArt() {
        if (!hall) return;
        if (heroArt._w) {
          window.HallArt.draw(
            heroArt.getContext("2d"),
            heroArt._w,
            heroArt._h,
            hallId,
            hall.accent,
            0.72,
            performance.now() * 0.001,
            {
              surface: "hero",
              mx: -1,
              my: -1,
            }
          );
        }
        heroRaf = requestAnimationFrame(loopHeroArt);
      })();
    }

    var audio = document.getElementById("track-player");
    var bgMusic = document.getElementById("bg-music");

    function pauseBgMusic() {
      if (!bgMusic) return;
      bgWasPlaying = !bgMusic.paused;
      if (bgWasPlaying) bgMusic.pause();
    }

    function resumeBgMusic() {
      if (bgMusic && bgWasPlaying && !(window.isBgMusicUserPaused && window.isBgMusicUserPaused())) {
        bgMusic.play().catch(function () {});
      }
      bgWasPlaying = false;
    }

    function formatTime(sec) {
      if (!isFinite(sec) || sec < 0) return "0:00";
      var m = Math.floor(sec / 60);
      var s = Math.floor(sec % 60);
      return m + ":" + String(s).padStart(2, "0");
    }

    function setRingProgress(ring, pct) {
      if (!ring) return;
      var fg = ring.querySelector(".play-progress__fg");
      if (!fg) return;
      var len = 2 * Math.PI * 16;
      fg.style.strokeDasharray = String(len);
      fg.style.strokeDashoffset = String(len * (1 - Math.max(0, Math.min(1, pct))));
    }

    function updateProgressUI(row) {
      if (!row || !audio) return;
      var bar = row.querySelector(".track-row__progress-fill");
      var cur = row.querySelector(".track-row__time-cur");
      var dur = row.querySelector(".track-row__time-dur");
      var ring = row.querySelector(".play-progress");
      var pct = audio.duration ? audio.currentTime / audio.duration : 0;
      if (bar) bar.style.width = pct * 100 + "%";
      if (cur) cur.textContent = formatTime(audio.currentTime);
      if (dur && audio.duration) dur.textContent = formatTime(audio.duration);
      setRingProgress(ring, pct);
    }

    function stopProgressLoop() {
      cancelAnimationFrame(progressRaf);
      progressRaf = 0;
    }

    function startProgressLoop(row) {
      stopProgressLoop();
      function tick() {
        if (activeRow === row) {
          updateProgressUI(row);
          progressRaf = requestAnimationFrame(tick);
        }
      }
      tick();
    }

    function drawWave(canvas, playing) {
      var ctx = canvas.getContext("2d");
      var w = canvas.width;
      var h = canvas.height;
      var bars = 24;
      var t = performance.now() * 0.004;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < bars; i++) {
        var bh = playing
          ? 4 + Math.abs(Math.sin(t + i * 0.45)) * (h - 8)
          : 4 + (i % 5) * 2;
        var x = i * (w / bars) + 2;
        ctx.fillStyle = playing ? hall.accent : "rgba(255,255,255,0.2)";
        ctx.fillRect(x, (h - bh) / 2, 2, bh);
      }
    }

    function clearPlaying() {
      document.querySelectorAll(".track-row.is-playing").forEach(function (r) {
        r.classList.remove("is-playing");
        var c = r.querySelector(".track-row__wave");
        if (c) drawWave(c, false);
        setRingProgress(r.querySelector(".play-progress"), 0);
        var bar = r.querySelector(".track-row__progress-fill");
        if (bar) bar.style.width = "0%";
      });
      activeId = null;
      activeRow = null;
      stopProgressLoop();
      cancelAnimationFrame(waveRaf);
      waveRaf = 0;
    }

    function showAudioError(row, track) {
      var err = row.querySelector(".track-row__error");
      if (!err) {
        err = document.createElement("p");
        err.className = "track-row__error";
        row.querySelector(".track-row__info").appendChild(err);
      }
      err.textContent =
        "\u65e0\u6cd5\u64ad\u653e\u300c" +
        track.titleZh +
        "\u300d\u2014\u8bf7\u786e\u8ba4 assets/sounds/tracks/ \u4e0b\u5b58\u5728 " +
        track.file.split("/").pop() +
        "\uff0c\u5e76\u4f7f\u7528\u672c\u5730\u670d\u52a1\u5668\u6253\u5f00\u7f51\u7ad9\u3002";
    }

    function setActive(row, track) {
      clearPlaying();
      row.classList.add("is-playing");
      activeId = track.id;
      activeRow = row;
      pauseBgMusic();

      var url = "../" + track.file;
      audio.src = url;
      audio.load();

      audio.onerror = function () {
        showAudioError(row, track);
        clearPlaying();
        resumeBgMusic();
      };

      audio.play().then(function () {
        row.querySelector(".track-row__error")?.remove();
        updateProgressUI(row);
        startProgressLoop(row);
      }).catch(function () {
        showAudioError(row, track);
        if (hall.previewSound) {
          audio.src = "../" + hall.previewSound;
          audio.play().catch(function () {});
        }
      });

      var canvas = row.querySelector(".track-row__wave");
      if (canvas) {
        cancelAnimationFrame(waveRaf);
        function loop() {
          if (activeId === track.id) {
            drawWave(canvas, !audio.paused);
            waveRaf = requestAnimationFrame(loop);
          }
        }
        loop();
      }
    }

    function buildTracks() {
      if (!trackList) return;
      trackList.textContent = "";
      hall.tracks.forEach(function (track) {
        var row = document.createElement("article");
        row.className = "track-row float-reveal";
        row.style.setProperty("--reveal-i", String(trackList.children.length));
        row.dataset.id = track.id;
        row.innerHTML =
          '<button type="button" class="track-row__play btn-glow" aria-label="\u64ad\u653e">' +
          '<svg class="play-progress" viewBox="0 0 36 36" aria-hidden="true">' +
          '<circle class="play-progress__bg" cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>' +
          '<circle class="play-progress__fg" cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" transform="rotate(-90 18 18)"/>' +
          "</svg>" +
          '<svg class="icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
          '<svg class="icon-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>' +
          "</button>" +
          '<div class="track-row__info">' +
          '<h3 class="track-row__title"></h3>' +
          '<p class="track-row__en"></p>' +
          '<p class="track-row__desc"></p>' +
          "</div>" +
          '<div class="track-row__progress-col">' +
          '<div class="track-row__progress-track"><span class="track-row__progress-fill"></span></div>' +
          '<span class="track-row__time"><span class="track-row__time-cur">0:00</span> / <span class="track-row__time-dur"></span></span>' +
          "</div>" +
          '<canvas class="track-row__wave" width="100" height="32" aria-hidden="true"></canvas>' +
          '<div class="track-row__meta">' +
          '<span class="track-row__num"></span>' +
          "</div>";

        row.querySelector(".track-row__title").textContent = track.titleZh;
        row.querySelector(".track-row__en").textContent = track.titleEn;
        row.querySelector(".track-row__desc").textContent = track.desc;
        row.querySelector(".track-row__num").textContent = track.num;
        row.querySelector(".track-row__time-dur").textContent = track.duration;

        var canvas = row.querySelector(".track-row__wave");
        drawWave(canvas, false);

        var progressTrack = row.querySelector(".track-row__progress-track");
        progressTrack.addEventListener("click", function (e) {
          if (!audio.duration || activeRow !== row) return;
          var rect = progressTrack.getBoundingClientRect();
          var pct = (e.clientX - rect.left) / rect.width;
          audio.currentTime = pct * audio.duration;
          updateProgressUI(row);
        });

        row.querySelector(".track-row__play").addEventListener("click", function () {
          if (activeId === track.id && !audio.paused) {
            audio.pause();
            row.classList.remove("is-playing");
            activeId = null;
            activeRow = null;
            resumeBgMusic();
            drawWave(canvas, false);
            stopProgressLoop();
            cancelAnimationFrame(waveRaf);
            waveRaf = 0;
          } else {
            setActive(row, track);
          }
        });
        trackList.appendChild(row);
      });
    }

    if (audio) {
      audioEnded = function () {
        clearPlaying();
        resumeBgMusic();
      };
      audioMeta = function () {
        if (activeRow) updateProgressUI(activeRow);
      };
      audio.addEventListener("ended", audioEnded);
      audio.addEventListener("loadedmetadata", audioMeta);
    }

    buildTracks();
    if (window.renderHallSwitcher) {
      window.renderHallSwitcher(hallId, document.querySelector(".gallery-archive"));
    }
    if (window.FloatReveal) window.FloatReveal.observe();
  }

  return { boot: boot, destroy: destroy };
})();

if (document.body.classList.contains("page-gallery") && document.body.dataset.hall !== "silent") {
  window.GalleryPage.boot();
}
