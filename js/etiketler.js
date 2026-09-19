// Kapak slaytındaki etiket çipleri.

window.GDD = window.GDD || {};

(function (GDD) {

  GDD.etiketleriKur = function () {
    GDD.cipler.forEach(function (c) {
      c.addEventListener("click", function () {
        if (document.body.classList.contains("sunum")) return;
        c.classList.toggle("on");
        GDD.kaydet();
      });
    });
  };

})(window.GDD);
