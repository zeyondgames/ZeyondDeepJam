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
    // Dolgulu oyun kolu (itch.io'nun kendi işareti yerine)
    itch: '<path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3zm4.5 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>',
    youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
    vimeo: '<path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>',
    github: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
    genel: '<path d="M3.9 12A3.1 3.1 0 0 1 7 8.9h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z"/>'
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

  // E-posta / telefon metninin kendisi de link: tek tıklama yandaki ikonun
  // adresini açar, çift tıklama alanı düzenlemeye açar. Tek tıklama biraz
  // bekletilir ki çift tıklamanın ilk vuruşu linki açmasın.
  function metniLinkYap(f) {
    let bekleyen = null;
    f.classList.add("baglanti-metin");
    f.title = "Açmak için tıkla · düzenlemek için çift tıkla";

    f.addEventListener("mousedown", function (e) {
      // Düzenlenirken imleç normal çalışsın; ilk tıklama odak almasın
      if (document.activeElement !== f && e.detail === 1) e.preventDefault();
    });
    f.addEventListener("click", function (e) {
      if (document.activeElement === f || e.detail !== 1) return;
      const dugme = f.parentElement.querySelector("a.ekip-ikon");
      if (!dugme || dugme.hidden) return;
      bekleyen = setTimeout(function () { bekleyen = null; dugme.click(); }, 250);
    });
    f.addEventListener("dblclick", function () {
      clearTimeout(bekleyen);
      bekleyen = null;
      if (document.body.classList.contains("sunum")) return;
      f.focus();
      const secim = window.getSelection();
      secim.selectAllChildren(f);
      secim.collapseToEnd();
    });
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
      } else {
        metniLinkYap(f);
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
