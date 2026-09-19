// JSON dışa ve içe aktarma.
// disaAktar / iceAktar dışarıya açılmaz, sadece bu dosyanın içinden görünür.

window.GDD = window.GDD || {};

(function (GDD) {

  GDD.aktarimiKur = function () {
    document.getElementById("exportBtn").addEventListener("click", disaAktar);
    document.getElementById("importFile").addEventListener("change", iceAktar);
  };

  function disaAktar() {
    const blob = new Blob([JSON.stringify(GDD.topla(), null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "deep-jam-basvurusu.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function iceAktar(e) {
    const dosya = e.target.files[0];
    if (!dosya) return;

    const okuyucu = new FileReader();
    okuyucu.onload = function () {
      try {
        GDD.uygula(JSON.parse(okuyucu.result));
        GDD.kaydet();
      } catch (err) {
        alert("Dosya okunamadı. Geçerli bir başvuru JSON dosyası mı?");
      }
    };
    okuyucu.readAsText(dosya);
    e.target.value = ""; // aynı dosya tekrar seçilebilsin
  }

})(window.GDD);
