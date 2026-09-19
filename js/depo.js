// Durum ve kalıcılık.
// Alanların ve etiketlerin tek kaynağı burasıdır; diğer modüller
// veriyi buradan okur, buraya yazar.

window.GDD = window.GDD || {};

(function (GDD) {

  // Belge GDD'den başvuru sunumuna dönüştüğünde anahtar da yenilendi:
  // eski kayıttaki boş alanlar yeni hazır metinlerin üzerine yazılmasın.
  const KEY = "zeyond-basvuru";

  // main.js depoKur() çağırınca doldurulur
  GDD.alanlar = [];
  GDD.cipler = [];

  GDD.depoKur = function () {
    GDD.alanlar = document.querySelectorAll(".field");
    GDD.cipler = document.querySelectorAll(".chip");

    try {
      const kayit = localStorage.getItem(KEY);
      if (kayit) GDD.uygula(JSON.parse(kayit));
    } catch (e) {}
  };

  // Tüm alanları ve aktif etiketleri tek nesnede toplar.
  // Hem localStorage hem JSON dışa aktarma aynı nesneyi kullanır.
  GDD.topla = function () {
    const alanlar = {};
    GDD.alanlar.forEach(function (f) { alanlar[f.dataset.field] = f.textContent; });

    const etiketler = [];
    GDD.cipler.forEach(function (c) {
      if (c.classList.contains("on")) etiketler.push(c.dataset.tag);
    });

    return { alanlar: alanlar, etiketler: etiketler };
  };

  GDD.kaydet = function () {
    try { localStorage.setItem(KEY, JSON.stringify(GDD.topla())); } catch (e) {}
  };

  GDD.uygula = function (veri) {
    if (!veri) return;

    if (veri.alanlar) {
      GDD.alanlar.forEach(function (f) {
        const deger = veri.alanlar[f.dataset.field];
        if (typeof deger === "string") f.textContent = deger;
      });
    }
    if (Array.isArray(veri.etiketler)) {
      GDD.cipler.forEach(function (c) {
        c.classList.toggle("on", veri.etiketler.indexOf(c.dataset.tag) !== -1);
      });
    }
    GDD.alanlar.forEach(GDD.bosMu);
  };

})(window.GDD);
