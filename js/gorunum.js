// Görünüm anahtarları: tema ve sunum modu.

window.GDD = window.GDD || {};

(function (GDD) {

  // Varsayılan beyaz görünüme geçince anahtar yenilendi: eski kayıtlı
  // karanlık tercih yeni varsayılanı gizlemesin.
  const TEMA_KEY = "zeyond-tema-2";

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

    // false: kullanıcı henüz seçim yapmadıysa varsayılan kaydedilmesin.
    uygula(document.documentElement.dataset.theme || "light", false);

    dugme.addEventListener("click", function () {
      uygula(document.documentElement.dataset.theme === "light" ? "dark" : "light", true);
    });
  };

  GDD.sunumuKur = function () {
    const dugme = document.getElementById("modeBtn");

    dugme.addEventListener("click", function () {
      const sunum = document.body.classList.toggle("sunum");
      GDD.alanlar.forEach(function (f) { GDD.duzenlenebilir(f, !sunum); });
      // Sunumda kaydıraçlar salt okunur bir grafiğe dönüşür
      GDD.skalalar.forEach(function (s) { s.disabled = sunum; });
      dugme.textContent = sunum ? "Düzenleme modu" : "Sunum modu";
    });
  };

})(window.GDD);
