// Başlatma. Tüm modüller yüklendikten sonra sırayla çalıştırılır.
// depoKur() ilk olmalı: diğerleri GDD.alanlar, GDD.cipler ve GDD.skalalar
// listelerini kullanır.
// Geri kalanların sırası önemli değil.

(function (GDD) {

  GDD.depoKur();
  GDD.alanlariKur();
  GDD.skalalariKur();
  GDD.etiketleriKur();
  GDD.aktarimiKur();
  GDD.temayiKur();
  GDD.sunumuKur();
  GDD.gezinmeyiKur();
  GDD.kaydirmayiKur();

})(window.GDD);
