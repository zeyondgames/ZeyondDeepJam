// Kişi kartlarındaki fotoğraflar.
// Düzenleme modunda her kartta "Fotoğraf seç" ve (fotoğraf varsa) "Kaldır"
// düğmeleri durur. Seçilen görsel küçültülüp veri adresi olarak karta
// yerleşir; diğer alanlar gibi tarayıcıda saklanır ve JSON'a yazılır.
// Değer <img>'nin src'sidir: elle "img/..." yolu da yazılabilir.

window.GDD = window.GDD || {};

(function (GDD) {

  // Kart en fazla ~350px genişlikte; yoğun ekranlar için pay bırakıldı.
  // Daha büyüğü yalnızca kaydı şişirir.
  const EN_UZUN_KENAR = 900;

  GDD.fotoOku = function (kutu) {
    const img = kutu.querySelector("img");
    return img ? img.getAttribute("src") : "";
  };

  // Boş adres fotoğrafı kaldırır, siluet geri gelir
  GDD.fotoYaz = function (kutu, adres) {
    let img = kutu.querySelector("img");
    if (!adres) {
      if (img) img.remove();
    } else {
      if (!img) {
        img = document.createElement("img");
        img.alt = "";
        kutu.prepend(img);
      }
      img.src = adres;
    }
    kutu.classList.toggle("dolu", !!adres);
  };

  function kucult(dosya) {
    return new Promise(function (tamam, hata) {
      const adres = URL.createObjectURL(dosya);
      const img = new Image();

      img.onload = function () {
        URL.revokeObjectURL(adres);
        const oran = Math.min(1, EN_UZUN_KENAR / Math.max(img.naturalWidth, img.naturalHeight));
        const tuval = document.createElement("canvas");
        tuval.width = Math.round(img.naturalWidth * oran);
        tuval.height = Math.round(img.naturalHeight * oran);
        const cizim = tuval.getContext("2d");
        // JPEG saydamlık tutmaz; saydam PNG siyaha dönmesin
        cizim.fillStyle = "#ffffff";
        cizim.fillRect(0, 0, tuval.width, tuval.height);
        cizim.drawImage(img, 0, 0, tuval.width, tuval.height);
        tamam(tuval.toDataURL("image/jpeg", .85));
      };
      img.onerror = function () {
        URL.revokeObjectURL(adres);
        hata();
      };
      img.src = adres;
    });
  }

  GDD.fotolariKur = function () {
    if (!GDD.fotolar.length) return;

    // Tek bir gizli dosya seçici bütün kartlara hizmet eder
    const secici = document.createElement("input");
    secici.type = "file";
    secici.accept = "image/*";
    secici.hidden = true;
    document.body.appendChild(secici);

    let hedef = null;

    secici.addEventListener("change", function () {
      const dosya = secici.files[0];
      const kutu = hedef;
      secici.value = ""; // aynı dosya tekrar seçilebilsin
      if (!dosya || !kutu) return;

      kucult(dosya).then(function (adres) {
        GDD.fotoYaz(kutu, adres);
        GDD.kaydet();
      }, function () {
        alert("Görsel okunamadı. JPG veya PNG bir dosya mı?");
      });
    });

    function dugme(yazi, sinif) {
      const d = document.createElement("button");
      d.type = "button";
      d.className = sinif;
      d.textContent = yazi;
      return d;
    }

    GDD.fotolar.forEach(function (kutu) {
      // HTML'e elle <img> konmuş olabilir
      kutu.classList.toggle("dolu", !!kutu.querySelector("img"));

      const sec = dugme("Fotoğraf seç", "kisi-sec");
      const kaldir = dugme("Kaldır", "kisi-kaldir");

      sec.addEventListener("click", function () {
        hedef = kutu;
        secici.click();
      });
      kaldir.addEventListener("click", function () {
        GDD.fotoYaz(kutu, "");
        GDD.kaydet();
      });

      const araclar = document.createElement("div");
      araclar.className = "kisi-araclar";
      araclar.append(sec, kaldir);
      kutu.parentNode.appendChild(araclar);
    });
  };

})(window.GDD);
