// Durum ve kalıcılık.
// Alanların ve etiketlerin tek kaynağı burasıdır; diğer modüller
// veriyi buradan okur, buraya yazar.

window.GDD = window.GDD || {};

(function (GDD) {

  // Tarayıcıdaki kayıt sayfadaki metinlerin önüne geçer. Sayfanın kendi
  // metinleri değiştiğinde (kapak, bölüm 2, özet sayfası, form yanıtları)
  // anahtar yenilenir: eski kayıt yeni metinlerin üzerine yazılmasın. Eski
  // kayıt silinmez, yalnızca okunmaz.
  const KEY = "zeyond-basvuru-slayt-6";

  // main.js depoKur() çağırınca doldurulur
  GDD.alanlar = [];
  GDD.cipler = [];
  GDD.skalalar = [];
  GDD.fotolar = [];

  GDD.depoKur = function () {
    GDD.alanlar = document.querySelectorAll(".field");
    GDD.cipler = document.querySelectorAll(".chip");
    GDD.skalalar = document.querySelectorAll(".skala");
    GDD.fotolar = document.querySelectorAll("[data-foto]");

    try {
      const kayit = localStorage.getItem(KEY);
      if (kayit) GDD.uygula(JSON.parse(kayit));
    } catch (e) {}
  };

  // ---------- Nokta ayraçlı yol yardımcıları ----------
  // data-field="07_2_4_Proje_Kapsami.kaynaklar.0.ad" gibi bir yol,
  // JSON ağacındaki konumun aynısıdır.

  function oku(kok, yol) {
    return yol.split(".").reduce(function (dal, parca) {
      return (dal === null || dal === undefined) ? undefined : dal[parca];
    }, kok);
  }

  function yaz(kok, yol, deger) {
    const parcalar = yol.split(".");
    let dal = kok;

    for (let i = 0; i < parcalar.length - 1; i++) {
      const parca = parcalar[i];
      // Sonraki parça sayıysa dizi, değilse nesne aç
      if (dal[parca] === null || typeof dal[parca] !== "object") {
        dal[parca] = /^\d+$/.test(parcalar[i + 1]) ? [] : {};
      }
      dal = dal[parca];
    }

    dal[parcalar[parcalar.length - 1]] = deger;
  }

  // ---------- Toplama ve uygulama ----------

  // Tüm slaytları JSON ağacı olarak kurar.
  // Hem localStorage hem JSON dışa aktarma aynı nesneyi kullanır.
  GDD.topla = function () {
    const veri = {};

    // Önce slayt iskeleti: tip / numara / baslik resmi başlıklardır,
    // düzenlenmez ama dışa aktarılan dosyada yer alır.
    document.querySelectorAll("[data-slide]").forEach(function (s) {
      const slayt = {};
      if (s.dataset.tip) slayt.tip = s.dataset.tip;
      if (s.dataset.numara) slayt.numara = s.dataset.numara;
      if (s.dataset.baslik) slayt.baslik = s.dataset.baslik;
      veri[s.dataset.slide] = slayt;
    });

    // Düzenlenmeyen ama dosyada yer alması gereken metinler (onay beyanları)
    document.querySelectorAll("[data-metin]").forEach(function (e) {
      yaz(veri, e.dataset.metin, e.textContent);
    });

    // Sonra düzenlenebilir alanlar, yollarına göre ağaca yerleşir
    GDD.alanlar.forEach(function (f) { yaz(veri, f.dataset.field, f.textContent); });

    // Kaydıraçlar metin değil sayı yazar: JSON'da 0–100 arası bir değer durur
    GDD.skalalar.forEach(function (s) { yaz(veri, s.dataset.field, Number(s.value)); });

    // Fotoğraflar görselin adresini yazar: seçilmiş dosyada veri adresi,
    // elle konmuş görselde "img/..." yolu, yoksa boş metin
    GDD.fotolar.forEach(function (k) { yaz(veri, k.dataset.foto, GDD.fotoOku(k)); });

    const etiketler = [];
    GDD.cipler.forEach(function (c) {
      if (c.classList.contains("on")) etiketler.push(c.dataset.tag);
    });
    veri.etiketler = etiketler;

    return veri;
  };

  GDD.kaydet = function () {
    try { localStorage.setItem(KEY, JSON.stringify(GDD.topla())); } catch (e) {}
  };

  GDD.uygula = function (veri) {
    if (!veri) return;

    GDD.alanlar.forEach(function (f) {
      const deger = oku(veri, f.dataset.field);
      if (typeof deger === "string") f.textContent = deger;
    });

    // Elle düzenlenmiş dosyada değer metin de olabilir; input kendisi
    // sayıya çevirir ve aralık dışını kırpar.
    GDD.skalalar.forEach(function (s) {
      const deger = oku(veri, s.dataset.field);
      if (deger !== undefined && deger !== null && deger !== "") s.value = deger;
    });

    // Kayıtta alan yoksa (eski kayıt) ya da boşsa karttaki görsele
    // dokunulmaz: HTML'e konmuş sabit fotoğraf yerinde kalır
    GDD.fotolar.forEach(function (k) {
      const deger = oku(veri, k.dataset.foto);
      if (typeof deger === "string" && deger) GDD.fotoYaz(k, deger);
    });

    if (Array.isArray(veri.etiketler)) {
      GDD.cipler.forEach(function (c) {
        c.classList.toggle("on", veri.etiketler.indexOf(c.dataset.tag) !== -1);
      });
    }

    GDD.alanlar.forEach(GDD.bosMu);
    GDD.skalalar.forEach(GDD.skalaYenile);
  };

})(window.GDD);
