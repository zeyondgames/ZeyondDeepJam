// "Oyunun Adı" slaytındaki procedural hex arena animasyonu.
// Her turda yeni bir tohumla (seed) bir arena üretilir: merkezdeki başlangıç
// hücresinden rastgele büyüyen organik bir hex-grid, üstüne çimen öbekleri,
// engeller, asansörler ve en uzak hücrede çıkış. Hücreler üretim sırasıyla
// belirir; kısa bir bekleyişten sonra harita söner ve bir sonraki kat gelir.
// Bölüm ekranda değilken döngü bekler. Hareket azaltma tercihinde tek bir
// harita durağan çizilir.

window.GDD = window.GDD || {};

(function (GDD) {

  const NS = "http://www.w3.org/2000/svg";

  // Sivri tepeli altıgen: R köşe yarıçapı, hücreler arasında küçük bir boşluk
  const R = 18;
  const YARICAP = 5;          // merkezden en fazla kaç hücre uzağa büyür
  const ADIM_MS = 38;         // hücreler arası belirme gecikmesi
  const BEKLE_MS = 3600;      // harita tamamlandıktan sonra bekleme
  const SONME_MS = 650;       // style.css'teki .hx-harita geçişiyle aynı

  const YONLER = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

  function altigen(r) {
    const noktalar = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 90);
      noktalar.push((r * Math.cos(a)).toFixed(2) + "," + (r * Math.sin(a)).toFixed(2));
    }
    return noktalar.join(" ");
  }
  const HUCRE = altigen(R * .93);
  const ISARET = altigen(R * .42);

  // Tohumlu, tekrarlanabilir rastgele sayı üreteci (mulberry32)
  function rastgele(tohum) {
    return function () {
      tohum |= 0; tohum = tohum + 0x6D2B79F5 | 0;
      let t = Math.imul(tohum ^ tohum >>> 15, 1 | tohum);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const anahtar = function (q, r) { return q + "," + r; };
  const uzaklik = function (q, r) { return (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2; };

  function uret(tohum) {
    const rnd = rastgele(tohum);
    const hedef = 46 + Math.floor(rnd() * 16);
    const harita = new Map();
    const sira = [];
    const sinir = [[0, 0]];

    // Sınırdan rastgele hücre seçerek büyüme: her tohumda başka bir şekil
    while (sira.length < hedef && sinir.length) {
      const [q, r] = sinir.splice(Math.floor(rnd() * sinir.length), 1)[0];
      const k = anahtar(q, r);
      if (harita.has(k) || uzaklik(q, r) > YARICAP) continue;
      const hucre = { q: q, r: r, tip: "zemin" };
      harita.set(k, hucre);
      sira.push(hucre);
      YONLER.forEach(function (y) {
        if (!harita.has(anahtar(q + y[0], r + y[1]))) sinir.push([q + y[0], r + y[1]]);
      });
    }

    const baslangic = sira[0];
    baslangic.tip = "oyuncu";
    const bos = function (h) { return h.tip === "zemin"; };

    // Çimen öbekleri: birkaç tohum hücre ve komşuları
    for (let i = 0; i < 3; i++) {
      const merkez = sira[1 + Math.floor(rnd() * (sira.length - 1))];
      [[0, 0]].concat(YONLER).forEach(function (y) {
        const h = harita.get(anahtar(merkez.q + y[0], merkez.r + y[1]));
        if (h && bos(h) && rnd() < .65) h.tip = "cimen";
      });
    }

    // Çıkış en uzak hücrede, asansörler orta mesafede
    const uzaktan = sira.slice(1).sort(function (a, b) {
      return uzaklik(b.q - baslangic.q, b.r - baslangic.r) - uzaklik(a.q - baslangic.q, a.r - baslangic.r);
    });
    uzaktan[0].tip = "cikis";
    const asansorSayisi = 1 + Math.floor(rnd() * 2);
    let konan = 0;
    for (let i = 3; i < uzaktan.length && konan < asansorSayisi; i += 5 + Math.floor(rnd() * 6)) {
      if (bos(uzaktan[i])) { uzaktan[i].tip = "asansor"; konan++; }
    }

    // Engeller: kalan zeminin onda biri
    sira.forEach(function (h) { if (bos(h) && rnd() < .11) h.tip = "engel"; });

    return sira;
  }

  function ciz(grup, hucreler) {
    grup.textContent = "";
    const W = Math.sqrt(3) * R;

    hucreler.forEach(function (h, i) {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("transform", "translate(" + (W * (h.q + h.r / 2)).toFixed(1) + " " + (1.5 * R * h.r).toFixed(1) + ")");

      const p = document.createElementNS(NS, "polygon");
      p.setAttribute("points", HUCRE);
      p.setAttribute("class", "hx hx-" + h.tip);
      p.style.transitionDelay = (i * ADIM_MS) + "ms";
      g.appendChild(p);

      // Asansör, çıkış ve başlangıçta hücrenin ortasında bir işaret
      let isaret = null;
      if (h.tip === "asansor" || h.tip === "cikis") {
        isaret = document.createElementNS(NS, "polygon");
        isaret.setAttribute("points", ISARET);
      } else if (h.tip === "oyuncu") {
        isaret = document.createElementNS(NS, "circle");
        isaret.setAttribute("r", (R * .3).toFixed(1));
      }
      if (isaret) {
        isaret.setAttribute("class", "hx hx-i-" + h.tip);
        isaret.style.transitionDelay = (i * ADIM_MS + 160) + "ms";
        g.appendChild(isaret);
      }

      grup.appendChild(g);
    });
  }

  GDD.hexalaniKur = function () {
    const kap = document.getElementById("hexalan");
    if (!kap) return;

    const grup = kap.querySelector(".hx-harita");
    const yazi = kap.querySelector(".hexalan-seed");
    const durgun = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tohum = 0x7f3a;
    let kat = 1;
    let gorunur = false;
    let bekleyen = null;

    function etiket() {
      yazi.textContent = "PROCEDURAL HEX-GRID · SEED " +
        (tohum & 0xffff).toString(16).toUpperCase().padStart(4, "0") + " · KAT " + kat;
    }

    function tur() {
      const hucreler = uret(tohum);
      etiket();
      grup.classList.remove("acik", "soluyor");
      ciz(grup, hucreler);

      // Çizim bir kare otursun, sonra belirme geçişleri başlasın
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { grup.classList.add("acik"); });
      });
      if (durgun) return;

      setTimeout(function () {
        grup.classList.add("soluyor");
        setTimeout(function () {
          tohum = Math.floor(Math.random() * 0xffff);
          kat = kat % 3 + 1;
          if (gorunur) tur(); else bekleyen = tur;
        }, SONME_MS);
      }, hucreler.length * ADIM_MS + 500 + BEKLE_MS);
    }

    if (!("IntersectionObserver" in window)) { tur(); return; }

    // Yalnızca ekrandayken çalış; ilk tur bölüm görününce başlar
    let basladi = false;
    new IntersectionObserver(function (girdiler) {
      gorunur = girdiler[0].isIntersecting;
      if (!gorunur) return;
      if (!basladi) { basladi = true; tur(); }
      else if (bekleyen) { const f = bekleyen; bekleyen = null; f(); }
    }, { threshold: .25 }).observe(kap);
  };

})(window.GDD);
