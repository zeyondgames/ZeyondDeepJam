// Tür skalası kaydıraçları.
// Değer CSS'e --v ile geçer; çizginin dolu kısmını ve tutamağın yerini
// style.css oradan hesaplar, böylece JS'in konum matematiğiyle işi olmaz.

window.GDD = window.GDD || {};

(function (GDD) {

  // depo.js uygula() içinden de çağrılır: JSON yüklendikten sonra
  // çizginin ve sayının yeni değere göre yenilenmesi gerekir.
  GDD.skalaYenile = function (s) {
    s.style.setProperty("--v", s.value);
    const okunak = s.parentElement.querySelector(".skala-deger");
    if (okunak) okunak.textContent = s.value;
  };

  GDD.skalalariKur = function () {
    GDD.skalalar.forEach(function (s) {
      GDD.skalaYenile(s);

      s.addEventListener("input", function () {
        GDD.skalaYenile(s);
        GDD.kaydet();
      });
    });
  };

})(window.GDD);
