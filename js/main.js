// Başlatma. Tüm modüller yüklendikten sonra sırayla çalıştırılır.
// depoKur() ilk olmalı: diğerleri GDD.alanlar ve GDD.cipler listelerini kullanır.
// Geri kalanların sırası önemli değil.

(function (GDD) {

  GDD.depoKur();
  GDD.alanlariKur();
  GDD.etiketleriKur();
  GDD.aktarimiKur();
  GDD.temayiKur();
  GDD.sunumuKur();
  GDD.gezinmeyiKur();

})(window.GDD);
