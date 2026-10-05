// Kaydırmaya bağlı hareket: "Biz Kimiz" bölümündeki kişi kartları.
// Kartlar farklı hızlarda kayar: bölüm ekrana girerken biri yukarıda biri
// aşağıdadır, ekranın ortasında aynı hizaya gelir, kaydırmaya devam
// edince ters yönde yeniden ayrışırlar. Buradaki kod yalnızca
// ilerlemeyi ölçer ve --kayma (1 → 0 → -1) olarak yazar; kartların ne kadar
// kayacağına style.css karar verir.

window.GDD = window.GDD || {};

(function (GDD) {

  GDD.kaydirmayiKur = function () {
    const kap = document.querySelector(".kisiler");
    if (!kap) return;

    // Hareketi azalt tercihi açıksa kartlar hep hizalı kalır (--kayma: 0)
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let bekliyor = false;

    function olc() {
      bekliyor = false;
      const kutu = kap.getBoundingClientRect();
      const yari = innerHeight / 2;
      // Kartların ortası ekranın altındayken 1, ortasındayken 0, üstündeyken
      // -1: hareket bölüm boyunca kesintisiz sürer.
      const uzaklik = (kutu.top + kutu.height / 2 - yari) / yari;
      const kayma = Math.min(1, Math.max(-1, uzaklik));
      kap.style.setProperty("--kayma", kayma.toFixed(3));
    }

    function iste() {
      if (bekliyor) return;
      bekliyor = true;
      requestAnimationFrame(olc);
    }

    addEventListener("scroll", iste, { passive: true });
    addEventListener("resize", iste);
    olc();
  };

})(window.GDD);
