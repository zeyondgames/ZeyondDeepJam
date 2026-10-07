// Tür skalası kaydıraçları, onlardan çizilen tür haritası ve onlardan
// üretilen ana tür başlığı.
// Değer CSS'e --v ile geçer; çizginin dolu kısmını ve tutamağın yerini
// style.css oradan hesaplar, böylece JS'in konum matematiğiyle işi olmaz.
//
// Tür haritası (#turRadar) bir örümcek ağı grafiğidir: her kaydıraç bir
// köşe, değer arttıkça o köşe merkezden dışarı uzar. Köşeler haritanın
// üzerinde de sürüklenebilir; değer kaydıraca geri yazılır. Köşe sayısı ve
// adları kaydıraçlardan okunur; kaydıraç eklenir ya da adı değişirse
// harita kendiliğinden uyar.

window.GDD = window.GDD || {};

(function (GDD) {

  const SVG = "http://www.w3.org/2000/svg";
  // Çizim birimleri; svg kutuya göre ölçeklenir
  const YARICAP = 100;
  const AD_UZAKLIK = 14;
  const SATIR = 10.5;
  // Tutamaklar merkeze bundan fazla yaklaşmaz; yoksa düşük değerlerde hepsi
  // üst üste biner ve tutulamaz
  const TUTAMAK_IC = 14;

  // radarKur() doldurur; o çalışmadan önce radarYenile() bir şey yapmaz
  let radar = null;
  // Haritada sürüklenen köşenin sırası; sürükleme yokken -1
  let suruklenen = -1;

  function oge(ad, ozellikler) {
    const e = document.createElementNS(SVG, ad);
    Object.keys(ozellikler || {}).forEach(function (k) { e.setAttribute(k, ozellikler[k]); });
    return e;
  }

  // i. köşenin yönü: ilk köşe tam üstte, sonrakiler saat yönünde
  function yon(i, adet) {
    const aci = (i / adet) * 2 * Math.PI - Math.PI / 2;
    return { x: Math.cos(aci), y: Math.sin(aci) };
  }

  function kose(i, adet, uzaklik) {
    const y = yon(i, adet);
    return (y.x * uzaklik).toFixed(1) + "," + (y.y * uzaklik).toFixed(1);
  }

  function cokgen(adet, uzaklik) {
    const noktalar = [];
    for (let i = 0; i < adet; i++) noktalar.push(kose(i, adet, uzaklik));
    return noktalar.join(" ");
  }

  // Uzun adlar iki satıra bölünür: "/" varsa ondan sonra, yoksa ortaya
  // en yakın boşluktan
  function satirlar(ad) {
    if (ad.length <= 12) return [ad];

    const bolu = ad.indexOf(" / ");
    if (bolu !== -1) return [ad.slice(0, bolu + 2), ad.slice(bolu + 3)];

    let yer = -1;
    for (let i = 0; i < ad.length; i++) {
      if (ad[i] === " " && Math.abs(i - ad.length / 2) < Math.abs(yer - ad.length / 2)) yer = i;
    }
    return yer === -1 ? [ad] : [ad.slice(0, yer), ad.slice(yer + 1)];
  }

  function adiYaz(metin, kaynak) {
    const ad = kaynak.textContent.trim();
    const parcalar = satirlar(ad);
    const x = metin.getAttribute("x");

    metin.textContent = "";
    // Ad İngilizceyse büyük harfe çevrilirken "i" → "İ" olmasın
    if (kaynak.lang) metin.setAttribute("lang", kaynak.lang);

    parcalar.forEach(function (parca, n) {
      const satir = oge("tspan", { x: x, dy: n === 0 ? -((parcalar.length - 1) * SATIR) / 2 : SATIR });
      satir.textContent = parca;
      metin.appendChild(satir);
    });
  }

  GDD.radarYenile = function () {
    if (!radar) return;

    const adet = radar.skalalar.length;
    const noktalar = [];

    radar.skalalar.forEach(function (s, i) {
      const uzaklik = (Number(s.value) / 100) * YARICAP;
      const y = yon(i, adet);
      noktalar.push(kose(i, adet, uzaklik));
      radar.noktalar[i].setAttribute("cx", (y.x * uzaklik).toFixed(1));
      radar.noktalar[i].setAttribute("cy", (y.y * uzaklik).toFixed(1));

      const tut = Math.max(uzaklik, TUTAMAK_IC);
      radar.tutamaklar[i].setAttribute("cx", (y.x * tut).toFixed(1));
      radar.tutamaklar[i].setAttribute("cy", (y.y * tut).toFixed(1));
    });

    radar.alan.setAttribute("points", noktalar.join(" "));

    // Başlığa giren türlerin adları ve köşeleri renklenir; en yükseği en belirgin olur
    const secili = turSecimi().secili;
    radar.adlar.forEach(function (metin, i) {
      metin.classList.toggle("secili", secili.indexOf(i) !== -1);
      metin.classList.toggle("birinci", secili[0] === i);
      radar.noktalar[i].classList.toggle("secili", secili.indexOf(i) !== -1);
      radar.noktalar[i].classList.toggle("birinci", secili[0] === i);
    });
  };

  GDD.radarKur = function () {
    const kap = document.getElementById("turRadar");
    const skalalar = Array.from(GDD.skalalar);
    if (!kap || skalalar.length < 3) return;

    const adet = skalalar.length;
    const svg = oge("svg", { viewBox: "-190 -132 380 272" });

    // Ağ: iç içe dört halka ve merkezden köşelere uzanan çizgiler
    const ag = oge("g", { "class": "radar-ag" });
    [.25, .5, .75, 1].forEach(function (oran) {
      ag.appendChild(oge("polygon", { points: cokgen(adet, YARICAP * oran) }));
    });
    for (let i = 0; i < adet; i++) {
      const uc = kose(i, adet, YARICAP).split(",");
      ag.appendChild(oge("line", { x1: 0, y1: 0, x2: uc[0], y2: uc[1] }));
    }
    svg.appendChild(ag);

    const alan = oge("polygon", { "class": "radar-alan" });
    svg.appendChild(alan);

    const noktaKap = oge("g", { "class": "radar-noktalar" });
    const adKap = oge("g", { "class": "radar-adlar" });
    const tutamakKap = oge("g", { "class": "radar-tutamaklar" });
    const noktalar = [];
    const adlar = [];
    const tutamaklar = [];
    const vurgular = [];

    skalalar.forEach(function (s, i) {
      const nokta = oge("circle", { r: 2.6 });
      noktaKap.appendChild(nokta);
      noktalar.push(nokta);

      // Görünmez, noktadan iri tutma alanı: köşe buradan sürüklenir
      const tutamak = oge("circle", { r: 8 });
      tutamakKap.appendChild(tutamak);
      tutamaklar.push(tutamak);

      // Ad köşenin dışında durur; yana düşenler köşeden uzağa doğru yazılır
      const y = yon(i, adet);
      const metin = oge("text", {
        x: (y.x * (YARICAP + AD_UZAKLIK)).toFixed(1),
        y: (y.y * (YARICAP + AD_UZAKLIK) + 3 + y.y * 5).toFixed(1),
        "text-anchor": y.x > .3 ? "start" : (y.x < -.3 ? "end" : "middle")
      });
      adKap.appendChild(metin);
      adlar.push(metin);

      // Üzerinde durulan ya da sürüklenen köşe ve adı haritada parlar
      function vurgula(acik) {
        metin.classList.toggle("etkin", acik);
        nokta.classList.toggle("etkin", acik);
      }
      vurgular.push(vurgula);
      tutamak.addEventListener("pointerenter", function () { vurgula(true); });
      tutamak.addEventListener("pointerleave", function () { if (suruklenen !== i) vurgula(false); });

      const satir = s.closest(".skala-satir");
      const ad = satir && satir.querySelector(".skala-ad");
      if (!ad) return;

      adiYaz(metin, ad);
      ad.addEventListener("input", function () {
        adiYaz(metin, ad);
        GDD.turAdiYenile();
      });

      satir.addEventListener("pointerenter", function () { vurgula(true); });
      satir.addEventListener("pointerleave", function () { vurgula(false); });
      satir.addEventListener("focusin", function () { vurgula(true); });
      satir.addEventListener("focusout", function () { vurgula(false); });
    });

    svg.appendChild(noktaKap);
    svg.appendChild(adKap);
    svg.appendChild(tutamakKap);
    kap.appendChild(svg);

    // ---------- Köşeleri sürükleme ----------
    // Bir köşe tutulup kendi ekseni boyunca çekilir; değer kaydıraca yazılır
    // ve kaydıracın "input" olayı tetiklenir. Böylece çizgi, sayı, başlık ve
    // kayıt, kaydıraç elle sürüklenmiş gibi aynı yoldan yenilenir.

    // İşaretçinin çizim birimlerindeki yeri
    function yer(e) {
      return new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
    }

    function cek(e) {
      const s = skalalar[suruklenen];
      const p = yer(e);
      const y = yon(suruklenen, adet);
      const adim = Number(s.step) || 1;

      // İşaretçinin eksen üzerindeki izdüşümü, kaydıracın adımına yuvarlanır
      let deger = Math.round(((p.x * y.x + p.y * y.y) / YARICAP) * 100 / adim) * adim;
      deger = Math.min(Number(s.max), Math.max(Number(s.min), deger));
      if (Number(s.value) === deger) return;

      s.value = deger;
      s.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function birak() {
      if (suruklenen === -1) return;
      vurgular[suruklenen](false);
      suruklenen = -1;
      kap.classList.remove("suruklenir");
    }

    tutamakKap.addEventListener("pointerdown", function (e) {
      // Sunum modunda kaydıraçlar kilitlidir; harita da öyle
      if (skalalar[0].disabled) return;

      // Merkeze yakın tutamaklar üst üste biner: tıklanan öğe değil,
      // işaretçiye en yakın olan seçilir
      const p = yer(e);
      let enAz = Infinity;
      tutamaklar.forEach(function (t, i) {
        const uzaklik = Math.hypot(p.x - t.cx.baseVal.value, p.y - t.cy.baseVal.value);
        if (uzaklik < enAz) { enAz = uzaklik; suruklenen = i; }
      });

      // Yakalama: işaretçi haritanın dışına çıksa da sürükleme sürer
      try { tutamakKap.setPointerCapture(e.pointerId); } catch (hata) {}
      kap.classList.add("suruklenir");
      vurgular[suruklenen](true);
      e.preventDefault();
    });
    tutamakKap.addEventListener("pointermove", function (e) {
      if (suruklenen !== -1) cek(e);
    });
    tutamakKap.addEventListener("pointerup", birak);
    tutamakKap.addEventListener("pointercancel", birak);

    radar = { skalalar: skalalar, alan: alan, noktalar: noktalar, adlar: adlar, tutamaklar: tutamaklar };
    GDD.radarYenile();
  };

  // ---------- Ana tür başlığı ----------
  // Başlık (#turAdi) elle yazılmaz, en yüksek kaydıraçlardan üretilir:
  //   "Strateji-Aksiyon · Bulmaca destekli"
  // En yüksek tür başa gelir. İkincisi ona yakınsa tireyle eklenir;
  // sıradaki tür de belirginse "destekli" olarak anılır.

  const BELIRGIN = 50; // bu değerin altındaki tür başlığa girmez
  const YAKIN = 20;    // ikinci tür birinciye en çok bu kadar uzaksa ortak olur

  // "Bulmaca / Mantık" → "Bulmaca", "Rol Yapma Oyunu (RYO)" → "Rol Yapma Oyunu"
  function kisaAd(s) {
    const satir = s.closest(".skala-satir");
    const ad = satir && satir.querySelector(".skala-ad");
    return (ad ? ad.textContent : "").split(/ \/ | \(/)[0].trim();
  }

  // Başlık metni ve başlığa giren türlerin kaydıraç sırası (ilki en yüksek)
  function turSecimi() {
    // Eşit değerlerde kılavuzdaki sıra korunur
    const sirali = Array.from(GDD.skalalar)
      .map(function (s, i) { return { ad: kisaAd(s), deger: Number(s.value), sira: i }; })
      .filter(function (t) { return t.ad; })
      .sort(function (a, b) { return b.deger - a.deger || a.sira - b.sira; });

    if (!sirali.length || sirali[0].deger === 0) return { metin: "Tür belirlenmedi", secili: [] };

    let metin = sirali[0].ad;
    let sonraki = 1;
    const secili = [sirali[0].sira];

    const ikinci = sirali[1];
    if (ikinci && ikinci.deger >= BELIRGIN && sirali[0].deger - ikinci.deger <= YAKIN) {
      metin += "-" + ikinci.ad;
      secili.push(ikinci.sira);
      sonraki = 2;
    }

    const destek = sirali[sonraki];
    if (destek && destek.deger >= BELIRGIN) {
      metin += " · " + destek.ad + " destekli";
      secili.push(destek.sira);
    }

    return { metin: metin, secili: secili };
  }

  GDD.turAdiYenile = function () {
    const baslik = document.getElementById("turAdi");
    if (!baslik) return;

    const metin = turSecimi().metin;
    if (baslik.textContent === metin) return;
    baslik.textContent = metin;

    // Başlık değişince kısa bir parlama oynar (style.css). Sınıfı çıkarıp
    // yerleşimi okutmak, art arda değişimlerde hareketi baştan başlatır.
    baslik.classList.remove("degisti");
    void baslik.offsetWidth;
    baslik.classList.add("degisti");
  };

  // depo.js uygula() içinden de çağrılır: JSON yüklendikten sonra çizginin,
  // sayının, haritanın ve başlığın yeni değere göre yenilenmesi gerekir.
  GDD.skalaYenile = function (s) {
    s.style.setProperty("--v", s.value);
    const okunak = s.parentElement.querySelector(".skala-deger");
    if (okunak) okunak.textContent = s.value;
    GDD.radarYenile();
    GDD.turAdiYenile();
  };

  GDD.skalalariKur = function () {
    GDD.skalalar.forEach(function (s) {
      GDD.skalaYenile(s);

      s.addEventListener("input", function () {
        GDD.skalaYenile(s);
        GDD.kaydet();
      });
    });

    GDD.radarKur();
  };

})(window.GDD);
