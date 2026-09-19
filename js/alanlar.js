// Düzenlenebilir alanların davranışı.

window.GDD = window.GDD || {};

(function (GDD) {

  // Boş alanlarda CSS'in ipucu metnini göstermesi için .empty sınıfı
  GDD.bosMu = function (f) {
    f.classList.toggle("empty", f.textContent.trim() === "");
  };

  // plaintext-only: Enter gerçek satır sonu üretir, metin kaybolmadan geri yüklenir.
  // Eski tarayıcılarda geçersiz değer hata verir, o yüzden try/catch ile normale düşülür.
  GDD.duzenlenebilir = function (f, acik) {
    if (!acik) { f.contentEditable = "false"; return; }
    try { f.contentEditable = "plaintext-only"; }
    catch (e) { f.contentEditable = "true"; }
  };

  GDD.alanlariKur = function () {
    GDD.alanlar.forEach(function (f) {
      GDD.duzenlenebilir(f, true);

      f.addEventListener("input", function () {
        GDD.bosMu(f);
        GDD.kaydet();
      });

      // Notion'dan yapıştırırken renk ve font gelmesin, sadece düz metin
      f.addEventListener("paste", function (e) {
        e.preventDefault();
        const metin = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, metin);
      });
    });
  };

})(window.GDD);
