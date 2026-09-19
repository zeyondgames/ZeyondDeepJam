// Sağdaki nokta gezinme ve klavye kısayolları.

window.GDD = window.GDD || {};

(function (GDD) {

  let aktif = 0;

  GDD.gezinmeyiKur = function () {
    const slaytlar = document.querySelectorAll(".slide");
    const kap = document.getElementById("dots");

    slaytlar.forEach(function (s) {
      const nokta = document.createElement("button");
      nokta.className = "dot";
      nokta.title = s.dataset.title;
      nokta.setAttribute("aria-label", s.dataset.title);
      nokta.addEventListener("click", function () { s.scrollIntoView(); });
      kap.appendChild(nokta);
    });

    const noktalar = kap.querySelectorAll(".dot");

    // Hangi slaytın ekran ortasında olduğunu izler
    const gozlemci = new IntersectionObserver(
      function (girisler) {
        girisler.forEach(function (giris) {
          if (!giris.isIntersecting) return;
          aktif = Array.prototype.indexOf.call(slaytlar, giris.target);
          noktalar.forEach(function (n, i) { n.classList.toggle("active", i === aktif); });
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    slaytlar.forEach(function (s) { gozlemci.observe(s); });

    document.addEventListener("keydown", function (e) {
      // Metin yazarken ok tuşları slayt değiştirmesin
      if (document.activeElement && document.activeElement.isContentEditable) return;

      let hedef = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") hedef = aktif + 1;
      if (e.key === "ArrowUp" || e.key === "PageUp") hedef = aktif - 1;
      if (hedef === null || hedef < 0 || hedef >= slaytlar.length) return;

      e.preventDefault();
      slaytlar[hedef].scrollIntoView();
    });
  };

})(window.GDD);
