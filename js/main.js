// Başlatma. Tüm modüller yüklendikten sonra sırayla çalıştırılır.
// depoKur() ilk olmalı: diğerleri GDD.alanlar, GDD.cipler, GDD.skalalar ve
// GDD.fotolar listelerini kullanır.
// Geri kalanların sırası önemli değil.

(function (GDD) {

  GDD.depoKur();
  GDD.alanlariKur();
  GDD.skalalariKur();
  GDD.fotolariKur();
  GDD.pencereleriKur();
  GDD.etiketleriKur();
  GDD.aktarimiKur();
  GDD.temayiKur();
  GDD.sunumuKur();
  GDD.gezinmeyiKur();
  GDD.belirmeyiKur();
  GDD.kaydirmayiKur();
  GDD.hexalaniKur();
  GDD.baglantilariKur();

})(window.GDD);
