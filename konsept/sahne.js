// Hexafield konsept sahnesi: oyun içinden çekilmiş gibi görünen 1080×1920
// bir kare. 3D, sabit açılı, yukarıdan eğik kameradan hex-grid arena, katlar, çimen, kaya,
// asansör, lootbox, çıkış, düşmanlar ve görüş konileri, savaş sisi (FOW)
// ve HUD. Renkler ve yazı tipleri sitenin style.css'iyle aynı.
//
// HexafieldSahne(kap, { numaralar: true }) kabın içine kareyi kurar;
// numaralar açıksa panodaki mekanik açıklamalarına bağlanan numaralı
// işaretler de çizilir.

(function () {

  const NS = "http://www.w3.org/2000/svg";

  // Site paleti
  const RENK = {
    bg: "#05070a", kati: "#0b0f14", text: "#e9eef3", muted: "#8d98a6",
    accent: "#ff7a1a", accent2: "#38e8d6", isi1: "#ff2a00", isi2: "#ffb700",
    dusman: "#e5322d"
  };

  // Izgara: sivri olmayan (düz tepeli) altıgen, eğik kamera için dikeyde K
  // oranında basık. Ekran merkezi OX, OY; oyuncu (0, 1) hücresinde.
  const R = 44, K = .62, OX = 540, OY = 980;
  const CS = 1.5 * R, RS = Math.sqrt(3) * R * K;

  const el = function (ad, oz, ust) {
    const e = document.createElementNS(NS, ad);
    for (const k in oz) e.setAttribute(k, oz[k]);
    if (ust) ust.appendChild(e);
    return e;
  };
  const hash = function (a, b) {
    const h = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return h - Math.floor(h);
  };
  const merkez = function (c, j) { return { x: OX + CS * c, y: OY + RS * (j + (c & 1) * .5) }; };
  const kose = function (x, y, h, i, r) {
    const a = Math.PI / 3 * i;
    return [x + r * Math.cos(a), y + r * Math.sin(a) * K - h];
  };
  const nokta = function (dizi) { return dizi.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); };

  // ---------- Arazi ----------
  const kume = function (liste) { const s = new Set(); liste.forEach(function (p) { s.add(p[0] + "," + p[1]); }); return s; };
  const KAYA = kume([[2, -3], [3, -3], [2, -4], [-2, 4], [-3, 4], [-3, 5], [-2, 5], [6, 3], [6, 4], [5, 4], [-6, 8], [-5, 9]]);
  const CIMEN = kume([[0, 0], [0, 1], [1, 0], [1, 1], [-1, 1], [0, 2], [-5, 1], [-6, 1], [-6, 2], [-5, 2],
                      [-4, -8], [-5, -8], [-4, -9], [5, 7], [6, 7], [5, 8], [4, 8], [3, 11], [2, 11]]);

  function arazi(c, j) {
    if (c <= -8 || c >= 8) return { h: 130, tip: "kaya" };
    if (c === -7 && hash(c, j) > .35) return { h: 96, tip: "kaya" };
    if (c === 7 && hash(c, j) > .5) return { h: 96, tip: "kaya" };
    // Üst kat (plato): solda asansörün yanına kadar iner
    const sinir = (c <= -2 ? -6 : -10) + (hash(c, 99) > .55 ? 1 : 0);
    if (j <= sinir) return { h: 70, tip: "plato" };
    if (KAYA.has(c + "," + j)) return { h: 36, tip: "kaya" };
    return { h: 0, tip: "zemin" };
  }

  const UST = { zemin: ["#1b2530", "#1f2a36"], plato: ["#2a3848", "#2e3d4f"], kaya: ["#3f4a5b", "#465264"] };
  const YAN = ["#151b23", "#1d2530", "#28313d"];

  // ---------- Çizim parçaları ----------
  function hucreCiz(g, x, y, a) {
    if (a.h > 0) {
      for (let i = 0; i < 3; i++) {
        el("polygon", {
          points: nokta([kose(x, y, a.h, i, R), kose(x, y, a.h, i + 1, R), kose(x, y, 0, i + 1, R), kose(x, y, 0, i, R)]),
          fill: YAN[i], stroke: "#141a22", "stroke-width": 1
        }, g);
      }
    }
    const ust = UST[a.tip][hash(x, y) > .5 ? 1 : 0];
    const noktalar = [];
    for (let i = 0; i < 6; i++) noktalar.push(kose(x, y, a.h, i, R));
    el("polygon", { points: nokta(noktalar), fill: ust, stroke: "#0c1117", "stroke-width": 2 }, g);
    // Üst kenarda ince bir ışık
    el("polyline", { points: nokta([noktalar[3], noktalar[4], noktalar[5], noktalar[0]]), fill: "none",
      stroke: "rgba(255,255,255,.05)", "stroke-width": 1.5 }, g);
  }

  function cimenCiz(g, x, y, h, tohum) {
    const parca = 7;
    const yapraklar = [];
    for (let i = 0; i < parca; i++) {
      yapraklar.push({
        bx: x + (hash(tohum, i) - .5) * 52,
        by: y - h + (hash(i, tohum) - .5) * 22,
        boy: 34 + hash(tohum + i, 3) * 26,
        egim: (hash(i * 3, tohum) - .5) * 30
      });
    }
    yapraklar.sort(function (a, b) { return a.by - b.by; });
    yapraklar.forEach(function (p) {
      for (let k = -1; k <= 1; k++) {
        const e = p.egim + k * 12, b = p.boy * (1 - Math.abs(k) * .18);
        el("path", {
          d: "M" + (p.bx - 5 + k * 4) + "," + p.by +
             " Q" + (p.bx + e * .4 - 7) + "," + (p.by - b * .55) + " " + (p.bx + e) + "," + (p.by - b) +
             " Q" + (p.bx + e * .4 + 5) + "," + (p.by - b * .5) + " " + (p.bx + 5 + k * 4) + "," + p.by + " Z",
          fill: "url(#cimen)", stroke: "#a84600", "stroke-width": .8
        }, g);
      }
    });
  }

  function robotCiz(g, x, y, dusman, olcek) {
    const s = olcek || 1;
    const r = el("g", { transform: "translate(" + x + " " + y + ") scale(" + s + ")" }, g);
    el("ellipse", { cx: 0, cy: 0, rx: 28, ry: 10, fill: "rgba(0,0,0,.5)" }, r);
    const bacak = dusman ? "#7d1a1a" : "#b97f00";
    const govde = dusman ? RENK.dusman : RENK.isi2;
    const bas = dusman ? "#1f262f" : RENK.text;
    el("rect", { x: -13, y: -32, width: 9, height: 32, rx: 2, fill: bacak }, r);
    el("rect", { x: 4, y: -32, width: 9, height: 32, rx: 2, fill: bacak }, r);
    el("rect", { x: -19, y: -64, width: 38, height: 36, rx: 5, fill: govde }, r);
    el("rect", { x: -19, y: -64, width: 38, height: 8, rx: 3, fill: "rgba(0,0,0,.18)" }, r);
    el("rect", { x: -21, y: -104, width: 42, height: 40, rx: 7, fill: bas }, r);
    el("rect", { x: -21, y: -104, width: 42, height: 10, rx: 5, fill: "rgba(255,255,255,.12)" }, r);
    el("rect", { x: -15, y: -92, width: 30, height: 15, rx: 3, fill: RENK.kati }, r);
    el("circle", { cx: 5, cy: -84.5, r: 4.2, fill: dusman ? "#ff3b30" : RENK.accent }, r);
    // Silah
    el("rect", { x: 12, y: -58, width: 34, height: 10, rx: 2, fill: "#9aa5b3" }, r);
    el("rect", { x: 40, y: -56, width: 14, height: 5, fill: "#6b7684" }, r);
    if (!dusman) el("rect", { x: -3, y: -116, width: 3, height: 12, fill: RENK.muted }, r);
    return r;
  }

  function barCiz(g, x, y, deger, renk, ikinci) {
    const w = 112;
    el("rect", { x: x - w / 2 - 2, y: y - 2, width: w + 4, height: ikinci ? 20 : 15, fill: "rgba(5,7,10,.85)" }, g);
    el("rect", { x: x - w / 2, y: y, width: w * deger / 100, height: 11, fill: renk }, g);
    if (ikinci) el("rect", { x: x - w / 2, y: y + 13, width: w * ikinci / 100, height: 4, fill: RENK.accent2 }, g);
    el("text", { x: x, y: y - 7, "text-anchor": "middle", class: "sv-sayi" }, g).textContent = deger;
  }

  function koniCiz(g, defs, x, y, aci, yay, boy, renk, id) {
    const grad = el("radialGradient", { id: id, gradientUnits: "userSpaceOnUse", cx: x, cy: y, r: boy }, defs);
    el("stop", { offset: "0", "stop-color": renk, "stop-opacity": ".55" }, grad);
    el("stop", { offset: "1", "stop-color": renk, "stop-opacity": "0" }, grad);
    const p = [[x, y]];
    for (let i = 0; i <= 16; i++) {
      const t = (aci - yay / 2 + yay * i / 16) * Math.PI / 180;
      p.push([x + boy * Math.cos(t), y + boy * Math.sin(t) * K]);
    }
    el("polygon", { points: nokta(p), fill: "url(#" + id + ")" }, g);
    el("polyline", { points: nokta(p.slice(1)), fill: "none", stroke: renk, "stroke-opacity": ".5", "stroke-width": 1.5, "stroke-dasharray": "4 6" }, g);
  }

  function etiketCiz(g, x, y, metin, renk, koyu) {
    const w = metin.length * 10.6 + 26;
    const t = el("g", { transform: "translate(" + x + " " + y + ")" }, g);
    el("polygon", { points: nokta([[-w / 2 + 8, -17], [w / 2, -17], [w / 2, 9], [w / 2 - 8, 17], [-w / 2, 17], [-w / 2, -9]]),
      fill: koyu ? renk : "rgba(5,7,10,.88)", stroke: renk, "stroke-width": 1.5 }, t);
    el("text", { x: 0, y: 6, "text-anchor": "middle", class: "sv-etiket", fill: koyu ? RENK.bg : renk }, t).textContent = metin;
  }

  function isinCiz(g, x, y, boy, renk, gen) {
    el("rect", { x: x - gen / 2, y: y - boy, width: gen, height: boy, fill: "url(#isin-" + renk.replace("#", "") + ")" }, g);
  }

  function yuvaCiz(g, x, y, h, renk, ic) {
    const dis = [], ici = [];
    for (let i = 0; i < 6; i++) { dis.push(kose(x, y, h, i, R * .9)); ici.push(kose(x, y, h, i, R * .5)); }
    el("polygon", { points: nokta(dis), fill: renk, "fill-opacity": ".22", stroke: renk, "stroke-width": 3.5 }, g);
    el("polygon", { points: nokta(ici), fill: "none", stroke: ic, "stroke-width": 2 }, g);
    for (let k = 0; k < 2; k++) {
      const yy = y - h - 4 - k * 9;
      el("polyline", { points: nokta([[x - 9, yy + 4], [x, yy - 3], [x + 9, yy + 4]]), fill: "none", stroke: ic, "stroke-width": 2.5,
        "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    }
  }

  function sandikCiz(g, x, y) {
    el("ellipse", { cx: x, cy: y + 2, rx: 46, ry: 18, fill: "url(#loot-isik)" }, g);
    const w = 26, d = 15, hh = 34;
    // eğik kameradan görülen kutu: sol ön, sağ ön, üst
    el("polygon", { points: nokta([[x - w, y - d * .4], [x, y + d * .4], [x, y + d * .4 - hh], [x - w, y - d * .4 - hh]]), fill: "#1e2732", stroke: "#0c1117" }, g);
    el("polygon", { points: nokta([[x, y + d * .4], [x + w, y - d * .4], [x + w, y - d * .4 - hh], [x, y + d * .4 - hh]]), fill: "#161d26", stroke: "#0c1117" }, g);
    el("polygon", { points: nokta([[x - w, y - d * .4 - hh], [x, y + d * .4 - hh], [x + w, y - d * .4 - hh], [x, y - d * 1.2 - hh]]), fill: "#2c3846", stroke: "#0c1117" }, g);
    el("polyline", { points: nokta([[x - w, y - d * .4 - hh * .5], [x, y + d * .4 - hh * .5], [x + w, y - d * .4 - hh * .5]]), fill: "none", stroke: RENK.accent2, "stroke-width": 3 }, g);
    el("polygon", { points: nokta([[x - 6, y - hh - 4], [x, y - hh - 8], [x + 6, y - hh - 4], [x, y - hh]]), fill: RENK.accent2 }, g);
  }

  function numaraCiz(g, x, y, n) {
    const t = el("g", { transform: "translate(" + x + " " + y + ")" }, g);
    const p = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i - Math.PI / 2; p.push([25 * Math.cos(a), 25 * Math.sin(a)]); }
    el("polygon", { points: nokta(p), fill: "url(#isi)", stroke: RENK.bg, "stroke-width": 3 }, t);
    el("text", { x: 0, y: 8, "text-anchor": "middle", class: "sv-numara" }, t).textContent = n;
  }

  // ---------- Sahne ----------
  function sahneKur(svg, numaralar) {
    const defs = el("defs", {}, svg);
    const lg = function (id, x2, y2, durak) {
      const g = el("linearGradient", { id: id, x1: 0, y1: 0, x2: x2, y2: y2 }, defs);
      durak.forEach(function (d) { el("stop", { offset: d[0], "stop-color": d[1], "stop-opacity": d[2] === undefined ? 1 : d[2] }, g); });
    };
    lg("cimen", 0, 1, [[0, RENK.isi2], [.55, RENK.accent], [1, "#a84600"]]);
    lg("isi", 1, 1, [[0, RENK.isi1], [1, RENK.isi2]]);
    lg("isin-ffb700", 0, 1, [[0, RENK.isi2, 0], [1, RENK.isi2, .55]]);
    lg("isin-ff7a1a", 0, 1, [[0, RENK.accent, 0], [1, RENK.accent, .5]]);
    lg("mermi", 1, 0, [[0, RENK.isi2, 0], [1, RENK.isi2, 1]]);
    const rg = el("radialGradient", { id: "loot-isik" }, defs);
    el("stop", { offset: 0, "stop-color": RENK.accent2, "stop-opacity": .55 }, rg);
    el("stop", { offset: 1, "stop-color": RENK.accent2, "stop-opacity": 0 }, rg);
    const ig = el("radialGradient", { id: "oyuncu-isik", gradientUnits: "userSpaceOnUse", cx: 540, cy: 1027, r: 560, gradientTransform: "translate(0 390) scale(1 .62)" }, defs);
    el("stop", { offset: 0, "stop-color": RENK.accent2, "stop-opacity": .1 }, ig);
    el("stop", { offset: 1, "stop-color": RENK.accent2, "stop-opacity": 0 }, ig);

    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: RENK.bg }, svg);

    // Üç geçiş: önce hücreler (önden arkaya sıralı), sonra zemine çizilen
    // işaretler (koniler, yollar, asansör yuvaları), en son nesneler
    // (çimen, robot, sandık; yine sıralı). İşaretler hücrelerin arasında
    // kalsaydı öndeki sıralar onları kırpardı.
    const hucreler = [], zeminler = [], cizim = [];
    for (let c = -9; c <= 9; c++) {
      for (let j = -24; j <= 22; j++) {
        const m = merkez(c, j);
        if (m.y < -120 || m.y > 2080) continue;
        const a = arazi(c, j);
        hucreler.push({ y: m.y, f: function (g) { hucreCiz(g, m.x, m.y, a); } });
        if (CIMEN.has(c + "," + j) && a.tip !== "kaya") {
          cizim.push({ y: m.y + 6, s: 2, f: function (g) { cimenCiz(g, m.x, m.y, a.h, c * 31 + j * 7); } });
        }
      }
    }
    hucreler.sort(function (a, b) { return a.y - b.y; });
    const zeminEkle = function (f) { zeminler.push({ f: f }); };

    const P = merkez(0, 1);                       // oyuncu
    const E1 = merkez(-5, -2), E2 = merkez(4, 5), E3 = merkez(6, -12);
    const ASN = merkez(-3, -5), LOOT = merkez(3, -1), CIK = merkez(3, -11);

    // Zemine çizilenler (hücrelerden hemen sonra, nesnelerden önce)
    zeminEkle(function (g) { yuvaCiz(g, ASN.x, ASN.y, 0, RENK.accent, RENK.isi2); });
    zeminEkle(function (g) { yuvaCiz(g, CIK.x, CIK.y, 70, RENK.isi2, RENK.isi2); });
    zeminEkle(function (g) {
      el("polyline", { points: nokta([[E1.x, E1.y], [150, 770], [330, 712], [ASN.x - 30, ASN.y + 10]]), fill: "none",
        stroke: RENK.dusman, "stroke-opacity": .55, "stroke-width": 2.5, "stroke-dasharray": "3 9", "stroke-linecap": "round" }, g);
    });
    zeminEkle(function (g) { koniCiz(g, defs, E1.x, E1.y, 22, 58, 300, RENK.dusman, "koni1"); });
    zeminEkle(function (g) { koniCiz(g, defs, E2.x, E2.y, 212, 46, 250, RENK.accent, "koni2"); });

    cizim.push({ y: LOOT.y + 2, s: 3, f: function (g) { sandikCiz(g, LOOT.x, LOOT.y); } });
    cizim.push({ y: E1.y + 3, s: 3, f: function (g) { robotCiz(g, E1.x, E1.y, true, 1); } });
    cizim.push({ y: E2.y + 3, s: 3, f: function (g) { robotCiz(g, E2.x, E2.y, true, 1); } });
    cizim.push({ y: E3.y + 3, s: 3, f: function (g) { robotCiz(g, E3.x, E3.y - 70, true, .9); } });
    cizim.push({ y: P.y + 3, s: 3, f: function (g) { robotCiz(g, P.x, P.y, false, 1.08); } });

    cizim.sort(function (a, b) { return a.y - b.y || a.s - b.s; });
    const dunya = el("g", {}, svg);
    hucreler.forEach(function (d) { d.f(dunya); });
    zeminler.forEach(function (d) { d.f(dunya); });
    cizim.forEach(function (d) { d.f(dunya); });

    // Görüş alanının hafif aydınlığı
    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: "url(#oyuncu-isik)" }, svg);

    // Çatışma: oyuncudan E2'ye mermi izi, namlu alevi, hasar
    const ust = el("g", {}, svg);
    el("line", { x1: P.x + 58, y1: P.y - 60, x2: E2.x - 6, y2: E2.y - 52, stroke: "url(#mermi)", "stroke-width": 5, "stroke-linecap": "round" }, ust);
    el("circle", { cx: P.x + 62, cy: P.y - 60, r: 11, fill: RENK.isi2, opacity: .9 }, ust);
    el("circle", { cx: P.x + 62, cy: P.y - 60, r: 20, fill: RENK.accent, opacity: .35 }, ust);
    el("circle", { cx: E2.x - 4, cy: E2.y - 52, r: 16, fill: RENK.isi2, opacity: .6 }, ust);
    el("text", { x: E2.x + 38, y: E2.y - 128, class: "sv-hasar" }, ust).textContent = "-24";

    // ---------- Savaş sisi ----------
    const maske = el("mask", { id: "sis-maske", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 1080, height: 1920 }, defs);
    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: "#fff" }, maske);
    const sg = el("radialGradient", { id: "sis-delik" }, defs);
    el("stop", { offset: 0, "stop-color": "#000" }, sg);
    el("stop", { offset: .8, "stop-color": "#000" }, sg);
    el("stop", { offset: 1, "stop-color": "#fff" }, sg);
    el("ellipse", { cx: P.x, cy: P.y - 20, rx: 580, ry: 380, fill: "url(#sis-delik)" }, maske);
    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: RENK.bg, opacity: .76, mask: "url(#sis-maske)" }, svg);
    el("ellipse", { cx: P.x, cy: P.y - 20, rx: 520, ry: 340, fill: "none", stroke: RENK.accent2, "stroke-opacity": .6,
      "stroke-width": 2.5, "stroke-dasharray": "2 12", "stroke-linecap": "round" }, svg);

    // Sisin üstünde kalanlar: hedef ışınları, işaretler, can çubukları
    const hud = el("g", {}, svg);
    isinCiz(hud, ASN.x, ASN.y - 6, 150, RENK.accent, 64);
    isinCiz(hud, CIK.x, CIK.y - 76, 150, RENK.isi2, 70);
    etiketCiz(hud, ASN.x, ASN.y - 176, "▲ ASANSÖR · KAT 3", RENK.accent);
    etiketCiz(hud, CIK.x, CIK.y - 250, "ÇIKIŞ · KAT 3", RENK.isi2, true);
    etiketCiz(hud, LOOT.x, LOOT.y - 82, "+ LOOTBOX", RENK.accent2);

    // Sisin içinde tespit edilen düşman
    el("circle", { cx: E3.x, cy: E3.y - 150, r: 30, fill: "none", stroke: RENK.dusman, "stroke-width": 2, opacity: .5 }, hud);
    el("circle", { cx: E3.x, cy: E3.y - 150, r: 46, fill: "none", stroke: RENK.dusman, "stroke-width": 1.5, opacity: .25 }, hud);
    el("polygon", { points: nokta([[E3.x, E3.y - 168], [E3.x + 14, E3.y - 150], [E3.x, E3.y - 132], [E3.x - 14, E3.y - 150]]), fill: RENK.dusman }, hud);
    etiketCiz(hud, E3.x - 60, E3.y - 205, "TESPİT EDİLDİ", RENK.dusman);

    barCiz(hud, E1.x, E1.y - 134, 100, RENK.dusman);
    barCiz(hud, E2.x, E2.y - 134, 40, RENK.dusman);
    el("text", { x: E2.x - 78, y: E2.y - 120, "text-anchor": "middle", class: "sv-uyari" }, hud).textContent = "!";
    barCiz(hud, P.x, P.y - 146, 82, "url(#isi)", 64);
    etiketCiz(hud, P.x - 118, P.y - 112, "◌ GİZLİ", RENK.accent2);

    if (numaralar) {
      const N = el("g", {}, svg);
      [[1, 150, 1330], [2, 1010, 860], [3, P.x - 200, P.y - 40], [4, ASN.x - 150, ASN.y - 176], [5, LOOT.x + 110, LOOT.y - 82],
       [6, CIK.x - 120, CIK.y - 250], [7, 470, 225], [8, 312, 80], [9, E1.x + 150, E1.y + 30], [10, E2.x + 120, E2.y - 70]]
        .forEach(function (n) { numaraCiz(N, n[1], n[2], n[0]); });
    }
  }

  // ---------- HUD ----------
  const HUD = `
    <div class="hud-ust">
      <div class="hud-sinif">
        <span class="hud-altigen"><svg viewBox="0 0 24 24"><path d="M12 3l7 4v6l-7 4-7-4V7z" fill="none" stroke="#05070a" stroke-width="2.2"/><circle cx="12" cy="10" r="2.6" fill="#05070a"/></svg></span>
        <span class="hud-sinif-metin"><b>RECON</b><i>SINIF · LV 3</i></span>
      </div>
      <div class="hud-kat"><i>KAT</i><b>2</b><span>/ 3</span>
        <span class="hud-kat-pip"><u class="on"></u><u class="on"></u><u></u></span></div>
      <div class="hud-loot"><span class="hud-loot-ikon"></span><b>3</b><i>SEED 7F3A</i></div>
    </div>
    <div class="hud-kaynak">
      <div class="k"><i>DURABILITY</i><b>82</b><span class="cubuk"><u style="width:82%;background:linear-gradient(90deg,#ff2a00,#ff7a1a)"></u></span></div>
      <div class="k"><i>BATTERY</i><b>64</b><span class="cubuk"><u style="width:64%;background:#38e8d6"></u></span></div>
      <div class="k"><i>STAMINA</i><b>45</b><span class="cubuk"><u style="width:45%;background:#ffb700"></u></span></div>
      <div class="k mag"><i>MAG</i><b>19<em>/30</em></b><span class="mermiler">${"<u class='on'></u>".repeat(19)}${"<u></u>".repeat(11)}</span></div>
    </div>
    <div class="hud-alt">
      <p class="hud-marka">HEXAFIELD</p>
      <h1 class="hud-kanca"><span>Çimende saklan.</span><span class="isi">Avla. Arenadan çık.</span></h1>
      <p class="hud-alt-metin">PROCEDURAL HEX ARENA · ROBOT ACTION RPG</p>
      <div class="hud-cta"><span>ŞİMDİ OYNA</span></div>
      <p class="hud-platform">iOS · ANDROID · ZEYOND GAMES</p>
    </div>`;

  window.HexafieldSahne = function (kap, secenek) {
    kap.classList.add("kare");
    const svg = el("svg", { viewBox: "0 0 1080 1920", width: 1080, height: 1920, class: "kare-sahne" });
    kap.appendChild(svg);
    sahneKur(svg, secenek && secenek.numaralar);
    const hud = document.createElement("div");
    hud.className = "kare-hud";
    hud.innerHTML = HUD;
    kap.appendChild(hud);
  };

})();
