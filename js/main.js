// Başlatma. Tüm modüller yüklendikten sonra sırayla çalıştırılır.
// depoKur() ilk olmalı: diğerleri GDD.alanlar, GDD.cipler, GDD.skalalar ve
// GDD.fotolar listelerini kullanır. diliKur() en sonda: diğer modüllerin
// ürettiği metinleri (radar, linkler, noktalar) de çevirir.

(function (GDD) {

  GDD.depoKur();
  GDD.alanlariKur();
  GDD.skalalariKur();
  GDD.fotolariKur();
  GDD.pencereleriKur();
  GDD.etiketleriKur();
  GDD.temayiKur();
  GDD.gezinmeyiKur();
  GDD.belirmeyiKur();
  GDD.kaydirmayiKur();
  GDD.hexalaniKur();
  GDD.baglantilariKur();
  GDD.diliKur();

})(window.GDD);
