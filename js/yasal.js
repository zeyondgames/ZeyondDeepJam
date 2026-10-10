// Yasal dayanaklar sayfası: dil anahtarı.
// Türkçe ve İngilizce metin sayfada hazır durur; anahtar yalnızca <html>
// lang değerini değiştirir, yasal.css hangi metnin görüneceğini buradan
// seçer. Seçim kaydedilir ve adrese ?lang=en olarak yazılır, böylece
// İngilizce bağlantı doğrudan paylaşılabilir.

(function () {

  const DIL_KEY = "zeyond-yasal-dil";
  const BASLIK = {
    tr: "Yasal Dayanaklar · Zeyond Games",
    en: "Legal Basis · Zeyond Games"
  };
  const dugmeler = document.querySelectorAll(".dil button");

  function uygula(dil, kaydetsinMi) {
    document.documentElement.lang = dil;
    document.title = BASLIK[dil];
    dugmeler.forEach(function (d) {
      d.setAttribute("aria-pressed", d.dataset.dil === dil ? "true" : "false");
    });

    if (!kaydetsinMi) return;
    try { localStorage.setItem(DIL_KEY, dil); } catch (e) {}
    const adres = new URL(location.href);
    if (dil === "en") adres.searchParams.set("lang", "en");
    else adres.searchParams.delete("lang");
    history.replaceState(null, "", adres);
  }

  uygula(document.documentElement.lang === "en" ? "en" : "tr", false);

  dugmeler.forEach(function (d) {
    d.addEventListener("click", function () { uygula(d.dataset.dil, true); });
  });

})();
