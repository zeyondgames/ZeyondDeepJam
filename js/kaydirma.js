// Kaydırınca oynayan hareket: "Biz Kimiz" bölümündeki kişi kartları.
// Kartlar bölüm ekrana gelene kadar ortada üst üste ve küçük bekler;
// bölüm görününce tek noktadan dışarı açılıp yerlerine oturur, ardından
// etiketleri belirir. Buradaki kod yalnızca her kartın ortaya olan uzaklığını
// (--dx, --dy) ölçer ve .acik sınıfını açıp kapatır; hareketin kendisi
// style.css'tedir.

window.GDD = window.GDD || {};

(function (GDD) {

  GDD.kaydirmayiKur = function () {
    const kap = document.querySelector(".kisiler");
    if (!kap || !("IntersectionObserver" in window)) return;

    // Hareketi azalt tercihi açıksa kartlar hep yerinde durur
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const kartlar = Array.from(kap.querySelectorAll(".kisi"));

    // offset* değerleri transform'dan etkilenmez: kartlar toplanmışken de
    // asıl yerlerini verir. Kap konumlandırılmış olmadığından kartlarla
    // aynı atadan ölçülür.
    function olc() {
      const ortaX = kap.offsetLeft + kap.offsetWidth / 2;
      const ortaY = kap.offsetTop + kap.offsetHeight / 2;
      kartlar.forEach(function (kart) {
        const dx = ortaX - (kart.offsetLeft + kart.offsetWidth / 2);
        const dy = ortaY - (kart.offsetTop + kart.offsetHeight / 2);
        kart.style.setProperty("--dx", dx.toFixed(1) + "px");
        kart.style.setProperty("--dy", dy.toFixed(1) + "px");
      });
    }

    olc();
    addEventListener("resize", olc);
    kap.classList.add("patlama");

    // Dörtte biri görününce açılır; tamamen ekrandan çıkınca yeniden
    // toplanır, böylece bölüme her dönüşte bir daha oynar.
    new IntersectionObserver(function (kayitlar) {
      kayitlar.forEach(function (kayit) {
        if (!kayit.isIntersecting) kap.classList.remove("acik");
        else if (kayit.intersectionRatio >= .25) kap.classList.add("acik");
      });
    }, { threshold: [0, .25] }).observe(kap);
  };

})(window.GDD);
