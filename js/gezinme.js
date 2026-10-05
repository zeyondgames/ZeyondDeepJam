// Sağdaki nokta gezinme, üstteki bölüm menüsü (dar ekranda açılır liste)
// ve klavye kısayolları.

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
    const baglar = document.querySelectorAll("#menu a");

    // Hangi slaytın ekran ortasında olduğunu izler
    const gozlemci = new IntersectionObserver(
      function (girisler) {
        girisler.forEach(function (giris) {
          if (!giris.isIntersecting) return;
          aktif = Array.prototype.indexOf.call(slaytlar, giris.target);
          noktalar.forEach(function (n, i) { n.classList.toggle("active", i === aktif); });

          // Kapakların numarası yok: orada hiçbir bölüm işaretlenmez
          const bolum = (giris.target.dataset.numara || "").charAt(0);
          baglar.forEach(function (b) {
            const secili = b.dataset.bolum === bolum;
            b.classList.toggle("active", secili);
            if (secili) b.setAttribute("aria-current", "true");
            else b.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    slaytlar.forEach(function (s) { gozlemci.observe(s); });

    // ---------- Dar ekran bölüm menüsü ----------
    // Geniş ekranda bağlantılar zaten görünür; düğme yalnızca dar ekranda
    // (style.css) ortaya çıkar. Bir bölüme gidince, dışarı tıklayınca ya
    // da Esc'e basınca liste kapanır.
    const menu = document.getElementById("menu");
    const menuDugme = document.getElementById("menuBtn");

    function menuyuAyarla(acik) {
      menu.classList.toggle("acik", acik);
      menuDugme.setAttribute("aria-expanded", acik ? "true" : "false");
    }

    menuDugme.addEventListener("click", function () {
      menuyuAyarla(!menu.classList.contains("acik"));
    });
    baglar.forEach(function (b) {
      b.addEventListener("click", function () { menuyuAyarla(false); });
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) menuyuAyarla(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") menuyuAyarla(false);
    });

    document.addEventListener("keydown", function (e) {
      // Metin yazarken ya da kaydıraç odaktayken ok tuşları slayt değiştirmesin;
      // kaydıraçta ok tuşları değeri değiştirir.
      const odak = document.activeElement;
      if (odak && (odak.isContentEditable || odak.type === "range")) return;

      let hedef = null;
      if (e.key === "ArrowDown" || e.key === "PageDown") hedef = aktif + 1;
      if (e.key === "ArrowUp" || e.key === "PageUp") hedef = aktif - 1;
      if (hedef === null || hedef < 0 || hedef >= slaytlar.length) return;

      e.preventDefault();
      slaytlar[hedef].scrollIntoView();
    });
  };

})(window.GDD);
