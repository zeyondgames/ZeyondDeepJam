/* Deep Jam başvuru sunumu — render + gezinme. İçerik assets/content.js içinde. */
(function () {
  "use strict";

  var DECK = window.DECK;
  var deckEl = document.getElementById("deck");
  var dotsEl = document.getElementById("dots");
  var counterEl = document.getElementById("counter");
  var progressEl = document.getElementById("progress");
  var phChip = document.getElementById("phchip");
  var LS_CHECKS = "deepjam_deck_checks_v1";

  /* ---------- metin ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // ⟨...⟩ = doldurulacak alan, **...** = kalın
  function fmt(s) {
    return esc(s)
      .replace(/⟨[^⟩]*⟩/g, function (m) { return '<span class="ph">' + m + "</span>"; })
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  }

  /* ---------- blok render ---------- */
  var renderers = {
    lead: function (b) { return '<p class="lead">' + fmt(b.text) + "</p>"; },
    p: function (b) { return '<p class="body">' + fmt(b.text) + "</p>"; },
    tip: function (b) { return '<div class="tip">' + fmt(b.text) + "</div>"; },
    kv: function (b) {
      return '<div class="kv">' + b.items.map(function (i) {
        return '<div class="row"><div class="k">' + fmt(i.k) + '</div><div class="v">' + fmt(i.v) + "</div></div>";
      }).join("") + "</div>";
    },
    cards: function (b) {
      return '<div class="cards">' + b.items.map(function (i) {
        return '<div class="card"><h3>' + fmt(i.h) + "</h3><p>" + fmt(i.text) + "</p></div>";
      }).join("") + "</div>";
    },
    bullets: function (b) {
      return '<ul class="bul">' + b.items.map(function (i) { return "<li>" + fmt(i) + "</li>"; }).join("") + "</ul>";
    },
    chips: function (b) {
      return '<div class="chips">' + b.items.map(function (i) { return "<span>" + fmt(i) + "</span>"; }).join("") + "</div>";
    },
    steps: function (b) {
      return '<div class="steps">' + b.items.map(function (i) {
        return '<div class="step"><div class="n">' + fmt(i.n) + "</div><h3>" + fmt(i.h) + "</h3><p>" + fmt(i.text) + "</p></div>";
      }).join("") + "</div>";
    },
    stat: function (b) {
      return '<div class="stats">' + b.items.map(function (i) {
        return '<div class="stat"><div class="v">' + fmt(i.v) + '</div><div class="l">' + fmt(i.l) + "</div></div>";
      }).join("") + "</div>";
    },
    timeline: function (b) {
      return '<div class="timeline">' + b.items.map(function (i) {
        return '<div class="tl"><div class="w">' + fmt(i.w) + "</div><h3>" + fmt(i.h) + "</h3><p>" + fmt(i.text) + "</p></div>";
      }).join("") + "</div>";
    },
    check: function (b) {
      var group = b.id || "grup";
      return '<div class="checks">' + b.items.map(function (i, n) {
        var key = group + ":" + n;
        return '<label><input type="checkbox" data-key="' + esc(key) + '"><span>' + fmt(i) + "</span></label>";
      }).join("") + "</div>";
    }
  };

  function renderBlocks(blocks) {
    return (blocks || []).map(function (b) {
      var fn = renderers[b.t];
      return fn ? fn(b) : "";
    }).join("");
  }

  /* ---------- slaytlar ---------- */
  var slides = DECK.slides;

  function build() {
    deckEl.innerHTML = slides.map(function (s, i) {
      var cover = s.type === "cover";
      var head = "";
      if (s.kicker) head += '<div class="kicker">' + fmt(s.kicker) + "</div>";
      if (cover) head += '<div class="meta">' + fmt(DECK.meta.event) + " · " + fmt(DECK.meta.doc) + "</div>";
      head += '<h2 class="stitle">' + fmt(s.title) + "</h2>";
      head += '<div class="rule"></div>';
      return '<section class="slide' + (cover ? " cover" : "") + '" id="s' + i + '" aria-label="' +
        esc(s.title) + '"><div class="inner">' + head + renderBlocks(s.blocks) + "</div></section>";
    }).join("");

    dotsEl.innerHTML = slides.map(function (s, i) {
      return '<button type="button" data-i="' + i + '" title="' + esc(s.title) + '" aria-label="' + esc(s.title) + '"></button>';
    }).join("");

    restoreChecks();
    countPlaceholders();
  }

  /* ---------- gezinme ---------- */
  var cur = 0;

  function show(i, push) {
    if (i < 0) i = 0;
    if (i > slides.length - 1) i = slides.length - 1;
    cur = i;
    var all = deckEl.querySelectorAll(".slide");
    for (var n = 0; n < all.length; n++) all[n].classList.toggle("on", n === i);
    var dots = dotsEl.querySelectorAll("button");
    for (var d = 0; d < dots.length; d++) dots[d].classList.toggle("on", d === i);
    counterEl.textContent = (i + 1) + " / " + slides.length;
    progressEl.style.width = ((i + 1) / slides.length * 100) + "%";
    var on = all[i];
    if (on) on.scrollTop = 0;
    if (push !== false) {
      try { history.replaceState(null, "", "#" + slides[i].id); } catch (e) {}
    }
  }

  function fromHash() {
    var h = (location.hash || "").replace(/^#/, "");
    if (!h) return 0;
    for (var i = 0; i < slides.length; i++) if (slides[i].id === h) return i;
    var n = parseInt(h, 10);
    return isNaN(n) ? 0 : n - 1;
  }

  dotsEl.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-i]");
    if (b) show(parseInt(b.dataset.i, 10));
  });
  document.getElementById("prev").addEventListener("click", function () { show(cur - 1); });
  document.getElementById("next").addEventListener("click", function () { show(cur + 1); });
  document.getElementById("print").addEventListener("click", function () { window.print(); });

  document.addEventListener("keydown", function (e) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); show(cur + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); show(cur - 1); }
    else if (e.key === "Home") { e.preventDefault(); show(0); }
    else if (e.key === "End") { e.preventDefault(); show(slides.length - 1); }
  });

  // dokunmatik kaydırma
  var tx = 0, ty = 0;
  deckEl.addEventListener("touchstart", function (e) {
    tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
  }, { passive: true });
  deckEl.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener("hashchange", function () { show(fromHash(), false); });

  /* ---------- kontrol kutuları (tarayıcıda saklanır) ---------- */
  function readChecks() {
    try { return JSON.parse(localStorage.getItem(LS_CHECKS) || "{}") || {}; } catch (e) { return {}; }
  }
  function restoreChecks() {
    var saved = readChecks();
    var boxes = deckEl.querySelectorAll('input[type="checkbox"][data-key]');
    for (var i = 0; i < boxes.length; i++) boxes[i].checked = !!saved[boxes[i].dataset.key];
  }
  deckEl.addEventListener("change", function (e) {
    var box = e.target;
    if (!box.matches || !box.matches('input[type="checkbox"][data-key]')) return;
    var saved = readChecks();
    saved[box.dataset.key] = box.checked;
    try { localStorage.setItem(LS_CHECKS, JSON.stringify(saved)); } catch (err) {}
  });

  /* ---------- doldurulacak alan sayacı ---------- */
  var phList = [];
  function countPlaceholders() {
    phList = Array.prototype.slice.call(deckEl.querySelectorAll(".ph"));
    if (phList.length) {
      phChip.className = "chip";
      phChip.textContent = "⟨⟩ " + phList.length + " alan doldurulacak";
    } else {
      phChip.className = "chip done";
      phChip.textContent = "✓ tüm alanlar dolu";
    }
  }
  var phAt = -1;
  phChip.addEventListener("click", function () {
    if (!phList.length) return;
    phAt = (phAt + 1) % phList.length;
    var el = phList[phAt];
    var slide = el.closest(".slide");
    var idx = Array.prototype.indexOf.call(deckEl.querySelectorAll(".slide"), slide);
    if (idx > -1 && idx !== cur) show(idx);
    setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "center" }); }, 60);
  });

  /* ---------- başlat ---------- */
  document.getElementById("brandteam").textContent = DECK.meta.team;
  document.getElementById("brandev").textContent = DECK.meta.event;
  document.title = DECK.meta.doc + " · " + DECK.meta.team;
  build();
  show(fromHash(), false);
})();
