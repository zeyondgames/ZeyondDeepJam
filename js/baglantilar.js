// Bağlantı alanları.
// Alanlar düzenlenebilir düz metin olduğu için içlerindeki adres tıklanmaz.
// data-baglanti taşıyan alanın metni okunur, açılabilir bağlantıya dönüşür:
//   "url"    → alanın altına her adres için siteye göre ikonlu bir düğme
//   "eposta" → aynı kaptaki .ekip-ikon düğmesinin mailto: adresi
//   "tel"    → aynı kaptaki .ekip-ikon düğmesinin tel: adresi
// Metin her değiştiğinde (yazma, kayıttan yükleme, JSON içe aktarma) yenilenir.

window.GDD = window.GDD || {};

(function (GDD) {

  const IKONLAR = {
    // Resmî ArtStation işareti (dolgulu, marka renginde)
    artstation: '<path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z"/>',
    itch: '<path d="M4 9h16v8.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"/><path d="M3 9 5 4h14l2 5"/><path d="M9.5 13.5h5"/><path d="M12 11v5"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="m10 9 5 3-5 3z"/>',
    vimeo: '<path d="M3 8.5c2-1.6 3.4-2.6 4.3-2.6 1.4 0 1.8 2.3 2.3 5.4.5 3 1 5 1.8 5 1.3 0 4.5-4.4 5.4-7.6.6-2.3-.5-3.6-3-2.6"/>',
    github: '<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m13.5 5-3 14"/>',
    genel: '<path d="M10 14a4 4 0 0 0 5.7 0l3.5-3.5a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3.5 3.5a4 4 0 0 0 5.7 5.7l1-1"/>'
  };

  const SITELER = [
    { desen: /artstation\.com$/, ikon: "artstation", ad: "ArtStation" },
    { desen: /itch\.io$/,        ikon: "itch",       ad: "itch.io" },
    { desen: /(youtube\.com|youtu\.be)$/, ikon: "youtube", ad: "YouTube" },
    { desen: /vimeo\.com$/,      ikon: "vimeo",      ad: "Vimeo" },
    { desen: /github\.(com|io)$/, ikon: "github",    ad: "GitHub" }
  ];

  function site(adres) {
    const ana = adres.hostname.replace(/^www\./, "");
    for (let i = 0; i < SITELER.length; i++) {
      if (SITELER[i].desen.test(ana)) return SITELER[i];
    }
    return { ikon: "genel", ad: ana };
  }

  // Metindeki adresler; "www." ya da şemasız "site.com/..." yazılsa da tanınır
  function adresler(metin) {
    const bulunan = [];
    metin.split(/[\s,;]+/).forEach(function (parca) {
      if (!parca) return;
      const tam = /^https?:\/\//i.test(parca) ? parca : "https://" + parca;
      try {
        const adres = new URL(tam);
        if (adres.hostname.indexOf(".") !== -1) bulunan.push(adres);
      } catch (e) {}
    });
    return bulunan;
  }

  // Düğmede adresin akılda kalan kısmı: kullanıcı adı ya da son yol parçası.
  // Sitenin kendi ikonu varsa site adı tekrar yazılmaz; tanınmayan sitede
  // ikon genel olduğu için adres adıyla birlikte gösterilir.
  function etiket(adres, bilgi) {
    const yol = adres.pathname.split("/").filter(Boolean);
    let son = yol.length ? decodeURIComponent(yol[yol.length - 1]) : "";
    if (!son && adres.hostname.endsWith("itch.io") && adres.hostname.split(".").length > 2) {
      son = adres.hostname.split(".")[0];
    }
    if (bilgi.ikon === "genel") return son ? bilgi.ad + " · " + son : bilgi.ad;
    return son || bilgi.ad;
  }

  function urlYenile(f, kap) {
    kap.textContent = "";
    adresler(f.textContent).forEach(function (adres) {
      const bilgi = site(adres);
      const a = document.createElement("a");
      a.className = "baglanti";
      a.href = adres.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.title = adres.href;
      a.innerHTML = '<span class="ekip-ikon ikon-' + bilgi.ikon + '" aria-hidden="true"><svg viewBox="0 0 24 24">' +
                    IKONLAR[bilgi.ikon] + '</svg></span><span class="baglanti-ad"></span>';
      a.querySelector(".baglanti-ad").textContent = etiket(adres, bilgi);
      kap.appendChild(a);
    });

    // Düğmeler adresi zaten gösterdiği için ham metin yalnızca düzenlenirken
    // görünür. Kalem düğmesi metni açar; alandan çıkınca yeniden gizlenir.
    const varMi = !!kap.firstChild;
    if (varMi) kap.appendChild(f._baglantiDuzenle);
    kap.hidden = !varMi;
    f.classList.toggle("baglanti-gizli", varMi && document.activeElement !== f);
  }

  function duzenleDugmesi(f) {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "baglanti-duzenle";
    d.title = "Linkleri düzenle";
    d.setAttribute("aria-label", "Linkleri düzenle");
    d.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>';
    d.addEventListener("click", function () {
      f.classList.remove("baglanti-gizli");
      f.focus();
      // İmleç metnin sonuna
      const secim = window.getSelection();
      secim.selectAllChildren(f);
      secim.collapseToEnd();
    });
    return d;
  }

  function telefon(metin) {
    let rakam = metin.replace(/[^\d+]/g, "");
    if (/^0\d{10}$/.test(rakam)) rakam = "+90" + rakam.slice(1);
    return rakam;
  }

  function yenile(f) {
    const tur = f.dataset.baglanti;
    const metin = f.textContent.trim();
    if (tur === "url") { urlYenile(f, f._baglantiKap); return; }

    const dugme = f.parentElement.querySelector("a.ekip-ikon");
    if (!dugme) return;
    if (tur === "eposta") dugme.href = "mailto:" + metin;
    if (tur === "tel") dugme.href = "tel:" + telefon(metin);
    dugme.hidden = metin === "";
  }

  GDD.baglantilariKur = function () {
    const alanlar = document.querySelectorAll("[data-baglanti]");

    alanlar.forEach(function (f) {
      if (f.dataset.baglanti === "url") {
        const kap = document.createElement("div");
        kap.className = "baglantilar";
        f.after(kap);
        f._baglantiKap = kap;
        f._baglantiDuzenle = duzenleDugmesi(f);
        f.addEventListener("blur", function () { yenile(f); });
      }
      f.addEventListener("input", function () { yenile(f); });
      yenile(f);
    });

    // JSON içe aktarılınca alanların metni input olayı olmadan değişir
    const eskiUygula = GDD.uygula;
    GDD.uygula = function (veri) {
      eskiUygula(veri);
      alanlar.forEach(yenile);
    };
  };

})(window.GDD);
