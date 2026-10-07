// Kaydırınca oynayan hareketler. Buradaki kod yalnızca sınıf ve ölçü
// yazar; hareketlerin kendisi style.css'tedir.
//
// Belirme: her slaydın blokları, slayt ekrana ilk girdiğinde sırayla
// aşağıdan yerlerine oturur.
//
// Kişi kartları ("Biz Kimiz"): kartlar bölüm ekrana gelene kadar ortada
// üst üste ve küçük bekler; bölüm görününce tek noktadan dışarı açılıp
// yerlerine oturur, ardından etiketleri belirir. Kod her kartın ortaya
// olan uzaklığını (--dx, --dy) ölçer ve .acik sınıfını açıp kapatır.

window.GDD = window.GDD || {};

(function (GDD) {

  GDD.belirmeyiKur = function () {
    if (!("IntersectionObserver" in window)) return;

    // Hareketi azalt tercihi açıksa içerik hep yerinde durur
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gozlemci = new IntersectionObserver(function (kayitlar) {
      kayitlar.forEach(function (kayit) {
        if (!kayit.isIntersecting) return;
        kayit.target.classList.add("gorundu");
        // Bir kez oynar; geri dönüşte içerik yerinde bekler
        gozlemci.unobserve(kayit.target);
      });
    }, { rootMargin: "0px 0px -15% 0px" });

    document.querySelectorAll(".slide:not([hidden])").forEach(function (slayt) {
      // İçerik slaytlarında bloklar panelin içindedir; kapaklarda slaydın
      // doğrudan çocuklarıdır.
      const kap = slayt.querySelector(":scope > .panel") || slayt;
      let sira = 0;

      Array.from(kap.children).forEach(function (blok) {
        // Kişi kartlarının kendi açılma hareketi var; kapak sahnesi süs;
        // pencereler sayfa akışında değil
        if (blok.hidden || blok.matches(".kisiler, .hero-sahne, dialog")) return;
        blok.classList.add("belir");
        blok.style.setProperty("--sira", sira++);
      });

      gozlemci.observe(slayt);
    });
  };

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
