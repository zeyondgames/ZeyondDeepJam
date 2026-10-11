// Tema anahtarı: köşedeki güneş / ay düğmesi aydınlık ve karanlık tema arasında geçer.
// Site her zaman sunum görünümündedir (body.sunum); düzenleme modu yoktur.

window.GDD = window.GDD || {};

(function (GDD) {

  // index.html'in başındaki satır da aynı anahtarı okur
  const TEMA_KEY = "zeyond-tema-3";

  GDD.temayiKur = function () {
    const dugme = document.getElementById("themeBtn");
    if (!dugme) return;

    // Açılışta tema zaten <head>'deki satırla uygulandı; ikon CSS'te temaya göre değişir
    dugme.addEventListener("click", function () {
      const tema = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = tema;
      try { localStorage.setItem(TEMA_KEY, tema); } catch (e) {}
    });
  };

})(window.GDD);
