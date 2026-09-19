/* Deep Jam başvuru sunumu — tüm metin burada.
   Başlık yapısı claude.ai/artifact/Q2BJQY792f1fC7aqDHNRjt başvuru taslağıyla birebir eşleşir.
   ⟨...⟩ ile yazılan her şey doldurulacak alandır; sunum bunları turuncu vurgular ve sayar. */

window.DECK = {
  meta: {
    event: "GameDev.ist · Deep Jam Hızlandırma Programı",
    doc: "Başvuru Sunumu",
    team: "⟨Takım Adı⟩",
    game: "⟨Oyun Adı⟩",
    tagline: "Sız ya da harca. Her karşılaşma bir karar."
  },

  slides: [
    /* ---------- kapak ---------- */
    {
      id: "kapak",
      type: "cover",
      title: "⟨Oyun Adı⟩",
      blocks: [
        { t: "lead", text: "İzometrik, hex-grid tabanlı taktiksel gizlilik-aksiyon · Mobil" },
        { t: "chips", items: ["Sız ya da Harca", "60 saniyelik turlar", "Meta-ilerleme yok", "Saf beceri"] }
      ]
    },

    /* ---------- ajanda ---------- */
    {
      id: "ajanda",
      kicker: "Sunum Akışı",
      title: "İçindekiler",
      blocks: [
        { t: "cards", items: [
          { h: "1.0 Takım Bilgileri", text: "Kim olduğumuz, roller ve iletişim." },
          { h: "2.0 Oyun Konsepti", text: "Ad, tür, hook, çekirdek döngü, aşama, stil, USP." },
          { h: "3.0 Teknik & Portfolyo", text: "Motor, WorldBuilder editörümüz, prototip ve referanslar." },
          { h: "4.0 İş Modeli ve Finans", text: "Gelir modeli, pazara giriş, 8 haftalık yol haritası, bütçe." },
          { h: "5.0 Taahhüt & Uygunluk", text: "Neden Deep Jam, telif beyanı, KVKK onayı." },
          { h: "Kontrol Listesi", text: "Göndermeden önce tamamlanacaklar." }
        ]}
      ]
    },

    /* ---------- 1.0 ---------- */
    {
      id: "takim",
      kicker: "1.0 Takım Bilgileri",
      title: "Takım ve İletişim",
      blocks: [
        { t: "kv", items: [
          { k: "Oyun Stüdyosu / Takım Adı", v: "⟨takımının / stüdyonun ticari adı — bir marka gibi düşün⟩" },
          { k: "Proje Yöneticisi Adı", v: "⟨ad soyad — birincil iletişim kişisi⟩" },
          { k: "E-posta Adresi", v: "⟨aktif olarak kontrol ettiğin adres⟩" },
          { k: "Telefon Numarası", v: "⟨+90 5XX XXX XX XX⟩" },
          { k: "Takım Büyüklüğü", v: "⟨örn. 1–2 kişi (solo / çekirdek ekip)⟩" }
        ]}
      ]
    },
    {
      id: "roller",
      kicker: "1.0 Takım Bilgileri",
      title: "Takım Üyeleri ve Rolleri",
      blocks: [
        { t: "cards", items: [
          { h: "⟨Ad Soyad⟩", text: "**Oyun Programcısı / Sistem Tasarımcısı** — çekirdek döngü, hex sistemi, WorldBuilder." },
          { h: "⟨Ad Soyad⟩", text: "**Teknik Sanat / UI-UX** — izometrik varlıklar, okunabilirlik, arayüz." },
          { h: "⟨gerekiyorsa⟩", text: "**Ses / Müzik veya ek destek** — program süresince dış destek." }
        ]},
        { t: "tip", text: "Küçük ekip bir zayıflık değil, bir kanıt: çalışan çekirdek döngü + kendi seviye editörümüz, projeyi tek başımıza bitirebildiğimizi gösteriyor." }
      ]
    },

    /* ---------- 2.0 ---------- */
    {
      id: "oyun-ad-tur",
      kicker: "2.0 Oyun Konsepti",
      title: "Oyunun Adı ve Türü",
      blocks: [
        { t: "kv", items: [
          { k: "Ad", v: "⟨kesinleştirilecek⟩" },
          { k: "Ad önerileri", v: "GRID · Hexfall · Sızıntı (Leak) · Sessiz Devre (Silent Circuit)" },
          { k: "Ana tür", v: "Taktiksel Gizlilik-Aksiyon — izometrik, hex-grid tabanlı, seviye bazlı, mobil" },
          { k: "Denge", v: "Gizlilik-öncelikli: fark edilmeden geçmek varsayılan yol; çatışma bilinçli bir kaynak-harcama tercihi" }
        ]},
        { t: "tip", text: "Ad kesinleşmeden önce ticari marka benzersizliği ve alan adı uygunluğu kontrol edilecek." }
      ]
    },
    {
      id: "hook",
      kicker: "2.0 Oyun Konsepti",
      title: "Özet ve Hikâye (Hook)",
      blocks: [
        { t: "lead", text: "Tek başına görev yapan bir robot birimisin. Her seviye, düşman botların devriye gezdiği kompakt bir hex arena — arenayı oku ve çıkış asansörüne ulaş." },
        { t: "p", text: "Otları kullanarak görüş hattını kır ve fark edilmeden sız; ya da kıt cephaneni, enerjini ve dayanıklılığını harcayıp yol aç. Oyunun kalbi her karşılaşmada verilen **“sız mı, harca mı”** kararıdır: 60 saniyelik keskin turlarda tekrar tekrar oynanan taktiksel bir gerilim." },
        { t: "chips", items: ["Temel Oynanış", "Sız-ya-da-Harca Kararı", "Kaynak Yönetimi", "Kısa Seans"] }
      ]
    },
    {
      id: "dongu",
      kicker: "2.0 Oyun Konsepti",
      title: "Çekirdek Döngü · ~60 saniye",
      blocks: [
        { t: "steps", items: [
          { n: "1", h: "Arenayı oku", text: "Bot devriyeleri, ot örtüsü ve yükselti tek bakışta okunur." },
          { n: "2", h: "Görüş hattını kır", text: "Ot ve yükselti arkasından hareket et; fark edilme riskini yönet." },
          { n: "3", h: "Sız ya da harca", text: "Şarjör / Enerji / Dayanıklılık — üç kaynaktan birini gözden çıkar." },
          { n: "4", h: "Asansöre ulaş", text: "Tur biter, skor ve yıldız; bir sonraki arena daha karmaşık." }
        ]},
        { t: "stat", items: [
          { v: "3", l: "Kaynak (Şarjör / Enerji / Dayanıklılık)" },
          { v: "0", l: "Meta-ilerleme, loot, pay-to-win" },
          { v: "~60sn", l: "Ortalama tur süresi" }
        ]}
      ]
    },
    {
      id: "asama-stil",
      kicker: "2.0 Oyun Konsepti",
      title: "Mevcut Aşama ve Grafik Stili",
      blocks: [
        { t: "kv", items: [
          { k: "Aşama", v: "Prototip / Vertical Slice — ⟨gerçek aşamanı onayla, abartma⟩" },
          { k: "Aşamayı destekleyen", v: "Çalışan çekirdek döngü + seviyeleri hızla üreten kendi WorldBuilder editörümüz" }
        ]},
        { t: "p", text: "**Grafik stili:** İzometrik, stilize / düşük-poli sci-fi robot estetiği. Birincil öncelik okunabilirlik: ot örtüsü, yükselti (dağ / uçurum) ve bot görüş hatları anında ayırt edilebilir olmalı — bunlar dekor değil, doğrudan oynanış bilgisi." },
        { t: "tip", text: "Sade stil, küçük ekip için sanat bütçesini gerçekçi tutarken gizlilik mekaniğinin netliğini artırıyor: vizyon ile teknik / bütçe sınırları örtüşüyor." }
      ]
    },
    {
      id: "usp",
      kicker: "2.0 Oyun Konsepti",
      title: "Benzersiz Satış Teklifi (USP)",
      blocks: [
        { t: "cards", items: [
          { h: "Kısa seansa sığmış saf taktik", text: "Her karşılaşma bir kaynak-harcama kararı: Şarjör / Enerji / Dayanıklılık." },
          { h: "Kazandıran tek şey: karar", text: "Meta-ilerleme, loot ya da pay-to-win yok." },
          { h: "Mobilde nadir bir kombinasyon", text: "El yapımı hex arenalarda ot temelli görüş-hattı gizliliği." },
          { h: "Genişlik değil, derinlik", text: "Zorluk; düzen karmaşıklığı, bot davranışı ve kaynak kıtlığıyla artıyor." }
        ]}
      ]
    },

    /* ---------- 3.0 ---------- */
    {
      id: "teknik",
      kicker: "3.0 Teknik & Portfolyo",
      title: "Oyun Motoru ve Ana Teknolojiler",
      blocks: [
        { t: "kv", items: [
          { k: "Motor", v: "⟨motorunu onayla — öneri: Unity⟩" },
          { k: "Gerekçe", v: "Mobil dağıtım, izometrik / 2.5D render ve hex-grid için olgun araç ve topluluk desteği; küçük ekipte hızlı iterasyon" }
        ]},
        { t: "p", text: "**Öne çıkan teknik güç — WorldBuilder:** Kendi seviye editörümüz. Başlangıç, çıkış asansörü, botlar, ot ve yükselti yerleşimini el yapımı ve hızlı üretmemizi sağlıyor. Hem teknik yetkinlik hem “bitirebiliriz” kanıtı." },
        { t: "tip", text: "8 haftada 20+ seviye hedefini mümkün kılan şey bu editör: içerik üretimi bizde darboğaz değil." }
      ]
    },
    {
      id: "portfolyo",
      kicker: "3.0 Teknik & Portfolyo",
      title: "Prototip, Video ve Portfolyo",
      blocks: [
        { t: "kv", items: [
          { k: "Oynanabilir prototip", v: "⟨herkese açık WebGL / itch.io linki⟩" },
          { k: "Video pitch", v: "⟨en fazla 3 dk, YouTube / Vimeo — çekirdek döngüyü ve ekibi yansıtsın⟩" },
          { k: "Geçmiş projeler", v: "⟨GitHub / ArtStation / itch.io⟩" }
        ]},
        { t: "tip", text: "Çalışan prototip, jüri için konsept riskini kaldırmanın en etkili yolu — somut kanıt sunmayan başvuruların önüne geçirir." }
      ]
    },

    /* ---------- 4.0 ---------- */
    {
      id: "gelir",
      kicker: "4.0 İş Modeli ve Finans",
      title: "Ana Gelir Modeli",
      blocks: [
        { t: "lead", text: "Hibrit: F2P + Ödüllü Reklam + Tek Seferlik Premium Kilit — ⟨nihai kararı ver⟩" },
        { t: "cards", items: [
          { h: "Serbest giriş", text: "İlk seviyeler ücretsiz; kurulum hunisini genişletir." },
          { h: "Ödüllü reklam", text: "Yalnızca opsiyonel (örn. tekrar denerken ekstra hak). Asla zorunlu değil, adaleti bozmaz." },
          { h: "Tek seferlik IAP", text: "“Reklamsız + Tüm Seviye Paketleri”. İçerik satıyoruz, güç değil." }
        ]},
        { t: "p", text: "**Gerekçe:** Meta-ekonomi ve loot olmadığı için abonelik / gacha uygun değil; bu hibrit hem erişilebilirlik hem sürdürülebilir gelir sağlar, “saf beceri” kimliğiyle çelişmez. **Alternatif:** Saf premium — daha temiz ama kurulum edinimi zor; PC / Steam için daha uygun." }
      ]
    },
    {
      id: "pazar",
      kicker: "4.0 İş Modeli ve Finans",
      title: "Pazara Giriş Stratejisi",
      blocks: [
        { t: "kv", items: [
          { k: "Platform", v: "Mobil öncelikli (iOS + Android); orta vadede opsiyonel PC / Steam" },
          { k: "12 ay", v: "Soft launch → metrik optimizasyonu (D1 / D7 retention, seans) → global launch → düzenli içerik (yeni seviye paketleri)" },
          { k: "Coğrafya", v: "Önce düşük CPI test pazarları (örn. TR ve benzeri), doğrulanınca Tier-1'e ölçekleme" }
        ]}
      ]
    },
    {
      id: "yolharitasi",
      kicker: "4.0 İş Modeli ve Finans",
      title: "8 Haftalık Yol Haritası",
      blocks: [
        { t: "timeline", items: [
          { w: "Hafta 1–2", h: "Vertical Slice", text: "Çekirdek döngü (hareket, auto-aim, ot ile görüş-hattı, üç kaynak) tam sağlam; en az 3 oynanabilir seviye." },
          { w: "Hafta 3–4", h: "Derinlik", text: "Bot davranışı (devriye / nöbet / alarm); WorldBuilder ile 10–12 seviye ve zorluk eğrisi." },
          { w: "Hafta 5–6", h: "His & Test", text: "“Juice” (geri bildirim, ses, kamera, UI), yıldız / skor; ilk kapalı playtest ve metrik." },
          { w: "Hafta 7", h: "Para Kazanma & Mağaza", text: "Reklam + IAP testi; App Store / Google Play ve ASO hazırlığı; 20+ seviye." },
          { w: "Hafta 8", h: "Soft Launch", text: "1–2 ülkede yayın; analytics (retention / seans / huni); 3 dk pitch videosu ve basın kiti." }
        ]}
      ]
    },
    {
      id: "finansman",
      kicker: "4.0 İş Modeli ve Finans",
      title: "Program Sonrası Finansman ve Yayıncılık",
      blocks: [
        { t: "kv", items: [
          { k: "Toplam tahmini bütçe", v: "⟨miktar + para birimi⟩" },
          { k: "Kullanıcı edinme (UA) / pazarlama", v: "⟨%⟩" },
          { k: "Sanat & içerik üretimi", v: "⟨%⟩" },
          { k: "Ses / müzik", v: "⟨%⟩" },
          { k: "QA & canlı operasyon", v: "⟨%⟩" },
          { k: "Beklenmedik giderler", v: "⟨%⟩" }
        ]},
        { t: "p", text: "**Yayıncılık:** Başlangıçta self-publishing (düşük bariyer, tam kontrol); doğru şartlarda mobil odaklı yayıncı / UA ortağına açığız. Aranan profil: mobil UA + ASO uzmanlığı ve performans pazarlaması bütçesi." },
        { t: "kv", items: [
          { k: "UA / pazarlama planı", v: "⟨kısa özet ekle⟩" }
        ]}
      ]
    },

    /* ---------- 5.0 ---------- */
    {
      id: "neden",
      kicker: "5.0 Taahhüt & Uygunluk",
      title: "Neden Deep Jam?",
      blocks: [
        { t: "p", text: "Deep Jam'e, programın kaynaklarının projemizdeki boşlukları tam olarak tamamladığı için başvuruyoruz. **En güçlü yanımız üretim ve sistem tasarımı:** çalışan çekirdek döngü, kendi WorldBuilder editörümüz ve hızlı içerik üretme kapasitemiz — yani “bitirme” becerisi." },
        { t: "cards", items: [
          { h: "Boşluk 1 · Monetizasyon & UA", text: "Mobil para kazanma ve kullanıcı edinme deneyimi → Hafta 7 mentorluğuna bağlanacak." },
          { h: "Boşluk 2 · Pazara giriş ağı", text: "Yayıncı / UA ortağı bağlantıları → Hafta 8 soft launch desteğine bağlanacak." },
          { h: "Boşluk 3 · Üretim disiplini", text: "8 haftalık yoğun sprintte dış takip ve mentorluk." }
        ]},
        { t: "p", text: "Bu fırsatı finansal bir işlemden çok **stratejik bir ortaklık** olarak görüyoruz. Amacımız, program sonunda yayına hazır ve ölçülebilir metriklere sahip bir soft-launch sürümüyle çıkmak." },
        { t: "tip", text: "Kişiselleştir: ⟨ekibin kendi hikâyesi ve motivasyonu — 1–2 cümle⟩. Jüri “neden bu ekip” sorusunun cevabını burada arıyor." }
      ]
    },
    {
      id: "taahhut",
      kicker: "5.0 Taahhüt & Uygunluk",
      title: "Telif Hakkı ve KVKK Beyanları",
      blocks: [
        { t: "p", text: "**Telif Hakkı ve Özgünlük:** Bu başvurudaki tüm fikri mülkiyetin, oyun içeriğinin, görsel varlıkların ve kodun ya tamamen ekibimizin özgün yaratımı olduğunu ya da kullanımı için gerekli tüm lisans ve izinlere sahip olduğumuzu beyan ederiz." },
        { t: "p", text: "**KVKK / GDPR:** Sağladığımız kişisel verilerin (Ad, Soyad, E-posta, Telefon) KVKK'ya uygun olarak yalnızca başvuru değerlendirmesi, program yönetimi ve yasal yükümlülükler için işleneceğini okuduk; koşulları anladık ve veri işlenmesine açık rıza gösteriyoruz." },
        { t: "check", id: "beyan", items: [
          "Telif hakkı ve özgünlük beyanını onaylıyorum.",
          "KVKK / GDPR kapsamında veri işlenmesine açık rıza gösteriyorum."
        ]},
        { t: "tip", text: "Motor, eklentiler, fontlar, ses / müzik ve üçüncü taraf varlıkların lisanslarının ticari kullanıma uygun olduğundan emin ol — yanlış beyan diskalifiye sebebi." }
      ]
    },

    /* ---------- kontrol listesi ---------- */
    {
      id: "kontrol",
      kicker: "Kontrol Listesi",
      title: "Göndermeden Önce",
      blocks: [
        { t: "check", id: "gonderim", items: [
          "Takım bilgileri: ad, e-posta, telefon, üyeler ve roller",
          "Oyun adı + marka / alan adı kontrolü",
          "Gerçek geliştirme aşamasının onayı",
          "Motor onayı ve gerekçesi",
          "Para kazanma modelinin nihai kararı",
          "Oynanabilir prototip linki",
          "En fazla 3 dk pitch videosu",
          "Portfolyo linkleri",
          "Toplam bütçe + para birimi ve dağılımı",
          "Motivasyon mektubunun kişiselleştirilmesi"
        ]}
      ]
    },

    /* ---------- kapanış ---------- */
    {
      id: "kapanis",
      type: "cover",
      kicker: "Teşekkürler",
      title: "Sız ya da harca.",
      blocks: [
        { t: "lead", text: "⟨Takım Adı⟩ · ⟨Oyun Adı⟩ — Deep Jam başvurusu" },
        { t: "kv", items: [
          { k: "İletişim", v: "⟨e-posta⟩ · ⟨telefon⟩" },
          { k: "Prototip", v: "⟨link⟩" },
          { k: "Video pitch", v: "⟨link⟩" }
        ]}
      ]
    }
  ]
};
