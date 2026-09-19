// Görünüm anahtarları: tema ve sunum modu.

window.GDD = window.GDD || {};

(function (GDD) {

  const TEMA_KEY = "zeyond-tema";

  GDD.temayiKur = function () {
    const dugme = document.getElementById("themeBtn");

    // Açılışta tema zaten <head>'deki satırla uygulandı; burada sadece
    // düğme yazısı güncellenir ve tıklamada tercih kaydedilir.
    function uygula(tema, kaydetsinMi) {
      document.documentElement.dataset.theme = tema;
      dugme.textContent = tema === "light" ? "Karanlık tema" : "Aydınlık tema";
      if (kaydetsinMi) {
        try { localStorage.setItem(TEMA_KEY, tema); } catch (e) {}
      }
    }

    // false: kullanıcı henüz seçim yapmadıysa sistem tercihi kaydedilmesin,
    // böylece işletim sistemi temasını değiştirdiğinde site de takip eder.
    uygula(document.documentElement.dataset.theme || "dark", false);

    dugme.addEventListener("click", function () {
      uygula(document.documentElement.dataset.theme === "light" ? "dark" : "light", true);
    });
  };

  GDD.sunumuKur = function () {
    const dugme = document.getElementById("modeBtn");

    dugme.addEventListener("click", function () {
      const sunum = document.body.classList.toggle("sunum");
      GDD.alanlar.forEach(function (f) { GDD.duzenlenebilir(f, !sunum); });
      dugme.textContent = sunum ? "Düzenleme modu" : "Sunum modu";
    });
  };

})(window.GDD);
