// Hexafield konsept sahnesi: oyun içinden çekilmiş gibi görünen 1080×1920
// bir kare. 3D, sabit açılı, yukarıdan eğik perspektif kamera: dünya
// gerçekten üç boyutlu tutulur ve her nokta kameradan perspektifle ekrana
// izdüşürülür. Uzaktaki hücreler küçülür, arena kenarları uzağa doğru
// birbirine yaklaşır, robotlar ve nesneler derinliğe göre ölçeklenir.
// Sahnede hex-grid arena, katlar, çimen, kaya, asansör, lootbox, çıkış,
// düşmanlar ve görüş konileri, savaş sisi (FOW) ve HUD var. Renkler ve
// yazı tipleri sitenin style.css'iyle aynı.
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

  // ---------- Dünya ve kamera ----------
  // Dünya: x sağa, y yukarı, z kameraya doğru. Hücreler düz tepeli altıgen
  // (R yarıçap), (c, j) ofset koordinatlı. Oyuncu (0, 1) hücresinde.
  const R = 44;
  const CS = 1.5 * R, RS = Math.sqrt(3) * R;

  // Kamera oyuncuya D uzaklıktan, yataya göre ACI derece eğik bakar
  // (LoL benzeri). F odak uzaklığı; oyuncu ekranda (OX, OY) noktasında.
  const ACI = 50 * Math.PI / 180;
  const SIN = Math.sin(ACI), COS = Math.cos(ACI);
  const D = 1600, F = D * .85;
  const OX = 540, OY = 1000;
  const HEDEF_Z = RS * 1;      // oyuncunun z'si
  const BOY = 1 / .85;         // robotlar oyuncu derinliğinde ~1 ölçekte çizilsin

  // Dünya noktası → ekran noktası ve o derinlikteki ölçek
  function izd(x, y, z) {
    const dz = z - HEDEF_Z;
    const derinlik = D - SIN * y - COS * dz;
    return { x: OX + F * x / derinlik, y: OY - F * (COS * y - SIN * dz) / derinlik, s: F / derinlik, d: derinlik };
  }
  const dunya = function (c, j) { return { x: CS * c, z: RS * (j + (c & 1) * .5) }; };
  const hucreNoktasi = function (c, j, h) { const w = dunya(c, j); return izd(w.x, h || 0, w.z); };

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
  const nokta = function (dizi) {
    return dizi.map(function (p) { return (p.x === undefined ? p[0] : p.x).toFixed(1) + "," + (p.y === undefined ? p[1] : p.y).toFixed(1); }).join(" ");
  };
  // Dünyada (x, z) merkezli, h yüksekliğinde, r yarıçaplı altıgenin i. köşesi
  const kose = function (x, z, h, i, r) {
    const a = Math.PI / 3 * i;
    return izd(x + r * Math.cos(a), h, z + r * Math.sin(a));
  };
  // Dünyada yerde bir çember (FOW halkası için)
  function cember(x, z, r, adet) {
    const p = [];
    for (let i = 0; i < adet; i++) { const a = 2 * Math.PI * i / adet; p.push(izd(x + r * Math.cos(a), 0, z + r * Math.sin(a))); }
    return p;
  }

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
  const YAN = { karanlik: "#151b23", orta: "#1d2530", acik: "#28313d" };

  // Kamera dünyada (0, D·sin, hedef + D·cos) noktasında
  const KAMERA = { x: 0, y: D * SIN, z: HEDEF_Z + D * COS };

  // ---------- Çizim parçaları ----------
  function hucreCiz(g, x, z, a) {
    if (a.h > 0) {
      // Yalnızca kameraya bakan yan yüzler çizilir; perspektifte ekranın
      // kenarlarındaki sütunların yanları da görünür
      for (let i = 0; i < 6; i++) {
        const orta = Math.PI / 3 * (i + .5);
        const nx = Math.cos(orta), nz = Math.sin(orta);
        const mx = x + R * .866 * nx, mz = z + R * .866 * nz;
        if (nx * (KAMERA.x - mx) + nz * (KAMERA.z - mz) <= 0) continue;
        const ton = nx > .3 ? YAN.karanlik : nx < -.3 ? YAN.acik : YAN.orta;
        el("polygon", {
          points: nokta([kose(x, z, a.h, i, R), kose(x, z, a.h, i + 1, R), kose(x, z, 0, i + 1, R), kose(x, z, 0, i, R)]),
          fill: ton, stroke: "#141a22", "stroke-width": 1
        }, g);
      }
    }
    const ust = UST[a.tip][hash(x, z) > .5 ? 1 : 0];
    const n = [];
    for (let i = 0; i < 6; i++) n.push(kose(x, z, a.h, i, R));
    const s = n[0].s;
    el("polygon", { points: nokta(n), fill: ust, stroke: "#0c1117", "stroke-width": (2 * s / .85).toFixed(2) }, g);
    el("polyline", { points: nokta([n[3], n[4], n[5], n[0]]), fill: "none", stroke: "rgba(255,255,255,.05)", "stroke-width": 1.5 }, g);
  }

  function cimenCiz(g, x, z, h, tohum) {
    const yapraklar = [];
    for (let i = 0; i < 7; i++) {
      const p = izd(x + (hash(tohum, i) - .5) * 52, h, z + (hash(i, tohum) - .5) * 34);
      yapraklar.push({ bx: p.x, by: p.y, s: p.s * BOY, boy: 34 + hash(tohum + i, 3) * 26, egim: (hash(i * 3, tohum) - .5) * 30 });
    }
    yapraklar.sort(function (a, b) { return a.by - b.by; });
    yapraklar.forEach(function (p) {
      for (let k = -1; k <= 1; k++) {
        const e = (p.egim + k * 12) * p.s, b = p.boy * (1 - Math.abs(k) * .18) * p.s, w = 5 * p.s, o = k * 4 * p.s;
        el("path", {
          d: "M" + (p.bx - w + o) + "," + p.by +
             " Q" + (p.bx + e * .4 - 7 * p.s) + "," + (p.by - b * .55) + " " + (p.bx + e) + "," + (p.by - b) +
             " Q" + (p.bx + e * .4 + w) + "," + (p.by - b * .5) + " " + (p.bx + w + o) + "," + p.by + " Z",
          fill: "url(#cimen)", stroke: "#a84600", "stroke-width": .8
        }, g);
      }
    });
  }

  function robotCiz(g, p, dusman, olcek) {
    const s = p.s * BOY * (olcek || 1);
    const r = el("g", { transform: "translate(" + p.x.toFixed(1) + " " + p.y.toFixed(1) + ") scale(" + s.toFixed(3) + ")" }, g);
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
    el("rect", { x: 12, y: -58, width: 34, height: 10, rx: 2, fill: "#9aa5b3" }, r);
    el("rect", { x: 40, y: -56, width: 14, height: 5, fill: "#6b7684" }, r);
    if (!dusman) el("rect", { x: -3, y: -116, width: 3, height: 12, fill: RENK.muted }, r);
    return s;
  }

  function barCiz(g, x, y, deger, renk, ikinci) {
    const w = 112;
    el("rect", { x: x - w / 2 - 2, y: y - 2, width: w + 4, height: ikinci ? 20 : 15, fill: "rgba(5,7,10,.85)" }, g);
    el("rect", { x: x - w / 2, y: y, width: w * deger / 100, height: 11, fill: renk }, g);
    if (ikinci) el("rect", { x: x - w / 2, y: y + 13, width: w * ikinci / 100, height: 4, fill: RENK.accent2 }, g);
    el("text", { x: x, y: y - 7, "text-anchor": "middle", class: "sv-sayi" }, g).textContent = deger;
  }

  // Görüş konisi: dünyada yerde bir dilim, perspektifle izdüşürülür
  function koniCiz(g, defs, w, aci, yay, boy, renk, id) {
    const m = izd(w.x, 0, w.z);
    const p = [m];
    for (let i = 0; i <= 20; i++) {
      const t = (aci - yay / 2 + yay * i / 20) * Math.PI / 180;
      p.push(izd(w.x + boy * Math.cos(t), 0, w.z + boy * Math.sin(t)));
    }
    const grad = el("radialGradient", { id: id, gradientUnits: "userSpaceOnUse", cx: m.x, cy: m.y, r: boy * m.s }, defs);
    el("stop", { offset: "0", "stop-color": renk, "stop-opacity": ".55" }, grad);
    el("stop", { offset: "1", "stop-color": renk, "stop-opacity": "0" }, grad);
    el("polygon", { points: nokta(p), fill: "url(#" + id + ")" }, g);
    el("polyline", { points: nokta(p.slice(1)), fill: "none", stroke: renk, "stroke-opacity": ".5", "stroke-width": 1.5, "stroke-dasharray": "4 6" }, g);
  }

  function etiketCiz(g, x, y, metin, renk, koyu) {
    const w = metin.length * 10.6 + 26;
    const t = el("g", { transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")" }, g);
    el("polygon", { points: nokta([[-w / 2 + 8, -17], [w / 2, -17], [w / 2, 9], [w / 2 - 8, 17], [-w / 2, 17], [-w / 2, -9]]),
      fill: koyu ? renk : "rgba(5,7,10,.88)", stroke: renk, "stroke-width": 1.5 }, t);
    el("text", { x: 0, y: 6, "text-anchor": "middle", class: "sv-etiket", fill: koyu ? RENK.bg : renk }, t).textContent = metin;
  }

  // Dikey ışık sütunu: dünyada h0'dan h1'e, ekranda o derinliğin ölçeğiyle
  function isinCiz(g, w, h0, h1, renk, gen) {
    const alt = izd(w.x, h0, w.z), ust = izd(w.x, h1, w.z);
    const g2 = gen * alt.s;
    el("rect", { x: alt.x - g2 / 2, y: ust.y, width: g2, height: alt.y - ust.y, fill: "url(#isin-" + renk.replace("#", "") + ")" }, g);
    return ust;
  }

  function yuvaCiz(g, w, h, renk, ic) {
    const dis = [], ici = [];
    for (let i = 0; i < 6; i++) { dis.push(kose(w.x, w.z, h, i, R * .9)); ici.push(kose(w.x, w.z, h, i, R * .5)); }
    el("polygon", { points: nokta(dis), fill: renk, "fill-opacity": ".22", stroke: renk, "stroke-width": 3.5 }, g);
    el("polygon", { points: nokta(ici), fill: "none", stroke: ic, "stroke-width": 2 }, g);
    const m = izd(w.x, h, w.z), s = m.s * BOY;
    for (let k = 0; k < 2; k++) {
      const yy = m.y - (4 + k * 9) * s;
      el("polyline", { points: nokta([[m.x - 9 * s, yy + 4 * s], [m.x, yy - 3 * s], [m.x + 9 * s, yy + 4 * s]]), fill: "none", stroke: ic,
        "stroke-width": 2.5, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    }
  }

  function sandikCiz(g, w) {
    const m = izd(w.x, 0, w.z);
    const sc = m.s * BOY;
    const k = el("g", { transform: "translate(" + m.x.toFixed(1) + " " + m.y.toFixed(1) + ") scale(" + sc.toFixed(3) + ")" }, g);
    const W = 26, d = 15, hh = 34;
    el("ellipse", { cx: 0, cy: 2, rx: 46, ry: 18, fill: "url(#loot-isik)" }, k);
    el("polygon", { points: nokta([[-W, -d * .4], [0, d * .4], [0, d * .4 - hh], [-W, -d * .4 - hh]]), fill: "#1e2732", stroke: "#0c1117" }, k);
    el("polygon", { points: nokta([[0, d * .4], [W, -d * .4], [W, -d * .4 - hh], [0, d * .4 - hh]]), fill: "#161d26", stroke: "#0c1117" }, k);
    el("polygon", { points: nokta([[-W, -d * .4 - hh], [0, d * .4 - hh], [W, -d * .4 - hh], [0, -d * 1.2 - hh]]), fill: "#2c3846", stroke: "#0c1117" }, k);
    el("polyline", { points: nokta([[-W, -d * .4 - hh * .5], [0, d * .4 - hh * .5], [W, -d * .4 - hh * .5]]), fill: "none", stroke: RENK.accent2, "stroke-width": 3 }, k);
    el("polygon", { points: nokta([[-6, -hh - 4], [0, -hh - 8], [6, -hh - 4], [0, -hh]]), fill: RENK.accent2 }, k);
    return m;
  }

  function numaraCiz(g, x, y, n) {
    const t = el("g", { transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ")" }, g);
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
    const bul = el("filter", { id: "yumusak", x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs);
    el("feGaussianBlur", { stdDeviation: 34 }, bul);

    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: RENK.bg }, svg);

    // Üç geçiş: önce hücreler (uzaktan yakına), sonra zemine çizilen
    // işaretler (koniler, yollar, asansör yuvaları), en son nesneler
    // (çimen, robot, sandık; yine uzaktan yakına).
    const hucreler = [], zeminler = [], nesneler = [];
    for (let c = -15; c <= 15; c++) {
      for (let j = -34; j <= 26; j++) {
        const w = dunya(c, j);
        const m = izd(w.x, 0, w.z);
        if (m.d < 300 || m.y < -260 || m.y > 2200 || m.x < -220 || m.x > 1300) continue;
        const a = arazi(c, j);
        hucreler.push({ d: m.d, f: function (g) { hucreCiz(g, w.x, w.z, a); } });
        if (CIMEN.has(c + "," + j) && a.tip !== "kaya") {
          nesneler.push({ d: m.d - 6, f: function (g) { cimenCiz(g, w.x, w.z, a.h, c * 31 + j * 7); } });
        }
      }
    }
    hucreler.sort(function (a, b) { return b.d - a.d; });

    const wP = dunya(0, 1), wE1 = dunya(-5, -2), wE2 = dunya(4, 5), wE3 = dunya(6, -12);
    const wASN = dunya(-3, -5), wLOOT = dunya(3, -1), wCIK = dunya(3, -11);
    const nesne = function (w, h, f) { const m = izd(w.x, h, w.z); nesneler.push({ d: m.d - 3, f: function (g) { f(g, m); } }); };

    zeminler.push(function (g) { yuvaCiz(g, wASN, 0, RENK.accent, RENK.isi2); });
    zeminler.push(function (g) { yuvaCiz(g, wCIK, 70, RENK.isi2, RENK.isi2); });
    zeminler.push(function (g) {
      const yol = [wE1, dunya(-6, -4), dunya(-4, -6), wASN].map(function (w) { return izd(w.x, 0, w.z); });
      el("polyline", { points: nokta(yol), fill: "none", stroke: RENK.dusman, "stroke-opacity": .55, "stroke-width": 2.5,
        "stroke-dasharray": "3 9", "stroke-linecap": "round" }, g);
    });
    zeminler.push(function (g) { koniCiz(g, defs, wE1, 22, 58, 340, RENK.dusman, "koni1"); });
    zeminler.push(function (g) { koniCiz(g, defs, wE2, 212, 46, 290, RENK.accent, "koni2"); });

    const P = {}, E1 = {}, E2 = {}, E3 = {}, LOOT = {};
    nesne(wLOOT, 0, function (g) { Object.assign(LOOT, sandikCiz(g, wLOOT)); });
    nesne(wE1, 0, function (g, m) { Object.assign(E1, m); E1.k = robotCiz(g, m, true); });
    nesne(wE2, 0, function (g, m) { Object.assign(E2, m); E2.k = robotCiz(g, m, true); });
    nesne(wE3, 70, function (g, m) { Object.assign(E3, m); E3.k = robotCiz(g, m, true, .95); });
    nesne(wP, 0, function (g, m) { Object.assign(P, m); P.k = robotCiz(g, m, false, 1.08); });

    nesneler.sort(function (a, b) { return b.d - a.d; });
    const sahne = el("g", {}, svg);
    hucreler.forEach(function (d) { d.f(sahne); });
    zeminler.forEach(function (f) { f(sahne); });
    nesneler.forEach(function (d) { d.f(sahne); });

    // Görüş alanının hafif aydınlığı
    el("polygon", { points: nokta(cember(wP.x, wP.z, 560, 72)), fill: RENK.accent2, opacity: .07, filter: "url(#yumusak)" }, svg);

    // Çatışma: oyuncudan E2'ye mermi izi, namlu alevi, hasar
    const ust = el("g", {}, svg);
    const namlu = { x: P.x + 58 * P.k, y: P.y - 60 * P.k }, hedef = { x: E2.x - 6 * E2.k, y: E2.y - 52 * E2.k };
    el("line", { x1: namlu.x, y1: namlu.y, x2: hedef.x, y2: hedef.y, stroke: "url(#mermi)", "stroke-width": 5, "stroke-linecap": "round" }, ust);
    el("circle", { cx: namlu.x + 4, cy: namlu.y, r: 11, fill: RENK.isi2, opacity: .9 }, ust);
    el("circle", { cx: namlu.x + 4, cy: namlu.y, r: 20, fill: RENK.accent, opacity: .35 }, ust);
    el("circle", { cx: hedef.x, cy: hedef.y, r: 16 * E2.k, fill: RENK.isi2, opacity: .6 }, ust);
    el("text", { x: E2.x + 40 * E2.k, y: E2.y - 128 * E2.k, class: "sv-hasar" }, ust).textContent = "-24";

    // ---------- Savaş sisi ----------
    // Görüş alanı dünyada oyuncunun çevresinde bir çember; perspektifte
    // ekranda yakın tarafı geniş, uzak tarafı dar bir şekle döner.
    const maske = el("mask", { id: "sis-maske", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 1080, height: 1920 }, defs);
    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: "#fff" }, maske);
    el("polygon", { points: nokta(cember(wP.x, wP.z, 600, 72)), fill: "#000", filter: "url(#yumusak)" }, maske);
    el("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: RENK.bg, opacity: .76, mask: "url(#sis-maske)" }, svg);
    const halka = cember(wP.x, wP.z, 560, 96);
    el("polygon", { points: nokta(halka), fill: "none", stroke: RENK.accent2, "stroke-opacity": .6,
      "stroke-width": 2.5, "stroke-dasharray": "2 12", "stroke-linecap": "round" }, svg);

    // Sisin üstünde kalanlar: hedef ışınları, işaretler, can çubukları
    const hud = el("g", {}, svg);
    const asnUst = isinCiz(hud, wASN, 0, 200, RENK.accent, 64);
    const cikUst = isinCiz(hud, wCIK, 70, 300, RENK.isi2, 70);
    etiketCiz(hud, asnUst.x, asnUst.y - 20, "▲ ASANSÖR · KAT 3", RENK.accent);
    etiketCiz(hud, cikUst.x, cikUst.y - 20, "ÇIKIŞ · KAT 3", RENK.isi2, true);
    etiketCiz(hud, LOOT.x, LOOT.y - 86 * LOOT.s * BOY, "+ LOOTBOX", RENK.accent2);

    // Sisin içinde tespit edilen düşman
    const iy = E3.y - 150 * E3.k;
    el("circle", { cx: E3.x, cy: iy, r: 30, fill: "none", stroke: RENK.dusman, "stroke-width": 2, opacity: .5 }, hud);
    el("circle", { cx: E3.x, cy: iy, r: 46, fill: "none", stroke: RENK.dusman, "stroke-width": 1.5, opacity: .25 }, hud);
    el("polygon", { points: nokta([[E3.x, iy - 18], [E3.x + 14, iy], [E3.x, iy + 18], [E3.x - 14, iy]]), fill: RENK.dusman }, hud);
    etiketCiz(hud, E3.x + 80, iy - 58, "TESPİT EDİLDİ", RENK.dusman);

    barCiz(hud, E1.x, E1.y - 134 * E1.k, 100, RENK.dusman);
    barCiz(hud, E2.x, E2.y - 134 * E2.k, 40, RENK.dusman);
    el("text", { x: E2.x - 78, y: E2.y - 120 * E2.k, "text-anchor": "middle", class: "sv-uyari" }, hud).textContent = "!";
    barCiz(hud, P.x, P.y - 146 * P.k, 82, "url(#isi)", 64);
    etiketCiz(hud, P.x - 120, P.y - 112 * P.k, "◌ GİZLİ", RENK.accent2);

    if (numaralar) {
      const N = el("g", {}, svg);
      const arena = hucreNoktasi(-6, 4);
      const sag = halka[0];
      [[1, arena.x, arena.y], [2, sag.x - 34, sag.y - 40], [3, P.x - 205, P.y - 40 * P.k], [4, asnUst.x - 155, asnUst.y - 20],
       [5, LOOT.x + 112, LOOT.y - 86 * LOOT.s * BOY], [6, cikUst.x - 120, cikUst.y - 20], [7, 470, 225], [8, 312, 80],
       [9, E1.x - 75 * E1.k, E1.y + 40], [10, E2.x + 120 * E2.k, E2.y - 70 * E2.k]]
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
