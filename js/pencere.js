// Kişi pencereleri: "Biz Kimiz" bölümündeki bir karta tıklanınca o kişinin
// pop-up'ı açılır. Pencere sayfadaki bir <dialog>'dur; kart onu
// data-pencere ile gösterir. Fotoğraf, numara, ad ve rol her açılışta
// karttan kopyalanır, yani kartta yapılan düzenleme pencereye de yansır.
// Kapatma: çarpı düğmesi, pencerenin dışına tıklama ya da Esc.

window.GDD = window.GDD || {};

(function (GDD) {

  GDD.pencereleriKur = function () {
    document.querySelectorAll(".kisi[data-pencere]").forEach(function (kart, sira) {
      const pencere = document.getElementById(kart.dataset.pencere);
      // Eski tarayıcıda <dialog> yoksa kartlar eskisi gibi kalır
      if (!pencere || !pencere.showModal) return;

      const ad = kart.querySelector(".kisi-ad");
      const rol = kart.querySelector(".kisi-rol");
      const gorev = kart.querySelector(".kisi-gorev");

      function doldur() {
        const kutu = pencere.querySelector(".pencere-foto");
        // Fotoğraf yoksa kartın silueti kopyalanır
        const gorsel = kart.querySelector(".kisi-foto img") || kart.querySelector(".kisi-foto svg");
        kutu.textContent = "";
        if (gorsel) kutu.appendChild(gorsel.cloneNode(true));

        pencere.querySelector(".pencere-no").textContent = "ID · " + String(sira + 1).padStart(2, "0");
        pencere.querySelector(".pencere-ad").textContent = ad ? ad.textContent : "";
        // Görev rozeti varsa (örn. Proje Yöneticisi) rolün önüne eklenir
        const roller = [gorev, rol].map(function (e) { return e ? e.textContent.trim() : ""; });
        pencere.querySelector(".pencere-rol").textContent = roller.filter(Boolean).join(" · ");
      }

      function ac() {
        doldur();
        pencere.showModal();
        // Odak pencerenin kendisinde başlar: ilk alana atlayıp telefonda
        // klavyeyi açmasın
        pencere.focus();
      }

      // Kartın köşesindeki artı: klavyeyle de açılabilsin
      const dugme = document.createElement("button");
      dugme.type = "button";
      dugme.className = "kisi-ac";
      dugme.textContent = "+";
      dugme.setAttribute("aria-label", (ad ? ad.textContent : "Kişi") + " · ayrıntıları aç");
      kart.appendChild(dugme);

      kart.addEventListener("click", function (e) {
        // Fotoğraf düğmeleri ve düzenlenen ad / rol kendi işini yapar
        if (e.target.closest(".kisi-araclar") || e.target.isContentEditable) return;
        ac();
      });

      pencere.querySelector(".pencere-kapat").addEventListener("click", function () { pencere.close(); });

      // İçerik pencereyi tümüyle kapladığı için tıklamanın hedefi ancak
      // dışarıdaki karartmaya basıldığında pencerenin kendisi olur
      pencere.addEventListener("click", function (e) {
        if (e.target === pencere) pencere.close();
      });
    });
  };

})(window.GDD);
