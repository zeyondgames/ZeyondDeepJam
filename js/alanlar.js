// Metin alanları. Site salt okunurdur: alanlar düzenlenmez, kaydıraçlar
// grafik olarak durur. Boş alanlar .empty ile işaretlenir (CSS gizler).

window.GDD = window.GDD || {};

(function (GDD) {

  GDD.bosMu = function (f) {
    f.classList.toggle("empty", f.textContent.trim() === "");
  };

  GDD.alanlariKur = function () {
    GDD.alanlar.forEach(GDD.bosMu);
    GDD.skalalar.forEach(function (s) { s.disabled = true; });
  };

})(window.GDD);
