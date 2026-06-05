(function () {
  "use strict";

  var audio = document.getElementById("bg-music");
  if (!audio) return;

  function musicRelPath() {
    var path = location.pathname.replace(/\\/g, "/");
    return /\/galleries\//.test(path)
      ? "../assets/sounds/background.mp3"
      : "assets/sounds/background.mp3";
  }

  function resolveMusicUrl() {
    return new URL(musicRelPath(), location.href).href;
  }

  window.getBgMusicUrl = resolveMusicUrl;

  function normalizeUrl(url) {
    if (!url) return "";
    try {
      return new URL(url, location.href).href.split("?")[0];
    } catch (e) {
      return String(url).split("?")[0];
    }
  }

  function isUserPaused() {
    if (audio.dataset.userPaused === "true") return true;
    try {
      return sessionStorage.getItem("bgMusicUserPaused") === "1";
    } catch (e) {
      return false;
    }
  }

  function applyUserPausedState() {
    if (!isUserPaused()) return;
    audio.dataset.userPaused = "true";
    audio.pause();
  }

  function clearUserPaused() {
    delete audio.dataset.userPaused;
    try {
      sessionStorage.removeItem("bgMusicUserPaused");
    } catch (e) {}
  }

  function markUserPaused() {
    audio.dataset.userPaused = "true";
    try {
      sessionStorage.setItem("bgMusicUserPaused", "1");
    } catch (e) {}
    audio.pause();
  }

  window.isBgMusicUserPaused = isUserPaused;
  window.clearBgMusicUserPaused = clearUserPaused;
  window.markBgMusicUserPaused = markUserPaused;

  function wasUnlockedBefore() {
    try {
      return sessionStorage.getItem("bgMusicUnlocked") === "1";
    } catch (e) {
      return false;
    }
  }

  function markUnlocked() {
    try {
      sessionStorage.setItem("bgMusicUnlocked", "1");
    } catch (e) {}
  }

  function ensureSrc() {
    var target = resolveMusicUrl();
    if (normalizeUrl(audio.src) === normalizeUrl(target)) return false;
    var time = audio.currentTime || 0;
    audio.src = target;
    if (time > 0) {
      try {
        audio.currentTime = time;
      } catch (e) {}
    }
    return true;
  }

  function playBg() {
    if (isUserPaused()) return;
    ensureSrc();
    audio.volume = 0.28;

    if (!audio.paused && !audio.muted) return;

    audio.muted = false;
    var attempt = audio.play();
    if (!attempt || !attempt.then) return;

    attempt
      .then(function () {
        markUnlocked();
        if (window.syncBgMusicUi) window.syncBgMusicUi();
      })
      .catch(function () {
        audio.muted = true;
        audio
          .play()
          .then(function () {
            markUnlocked();
            if (window.syncBgMusicUi) window.syncBgMusicUi();
          })
          .catch(function () {});
      });
  }

  function unlockWithSound() {
    if (isUserPaused()) return;
    ensureSrc();
    audio.muted = false;
    audio.volume = 0.28;
    if (audio.paused) {
      playBg();
      return;
    }
    markUnlocked();
  }

  function bindGestureUnlock() {
    function once() {
      unlockWithSound();
    }
    ["pointerdown", "keydown", "touchstart"].forEach(function (evt) {
      document.addEventListener(evt, once, { once: true, capture: true });
    });
  }

  window.playBgMusic = playBg;

  applyUserPausedState();
  ensureSrc();
  bindGestureUnlock();
  if (!isUserPaused()) playBg();

  audio.addEventListener("canplay", playBg);
  audio.addEventListener("loadeddata", playBg);
  window.addEventListener("load", playBg);
  window.addEventListener("pageshow", playBg);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") playBg();
  });

  if (!isUserPaused()) {
    var delays = wasUnlockedBefore() ? [0, 80, 200, 500, 1000, 2000] : [100, 400, 1000];
    delays.forEach(function (ms) {
      setTimeout(playBg, ms);
    });
  }
})();
