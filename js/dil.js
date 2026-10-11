// TR / EN dil anahtarı.
// Sayfanın Türkçe metni HTML'de durur. İngilizce sürüm burada:
//   EN_ALAN  → data-field / data-metin yoluna göre (JSON'daki yolun aynısı)
//   EN_METIN → alan dışındaki sabit metinler ve öznitelikler (Türkçe metne göre)
// Dil değişince metinler yerinde değiştirilir; Türkçe asılları saklanır.
// Seçim kaydedilir ve adrese ?lang=en olarak yazılır (bağlantı paylaşılabilir).

window.GDD = window.GDD || {};

(function (GDD) {

  const DIL_KEY = "zeyond-dil";
  const BASLIK = { tr: "Deep Jam Başvurusu · Zeyond Games", en: "Deep Jam Application · Zeyond Games" };

  GDD.dil = "tr";
  GDD.t = function (tr, en) { return GDD.dil === "en" ? en : tr; };

  const EN_ALAN = {
    "00_Slide_On_Kapagi.etkinlik": "GameDev.ist · Deep Jam Application",
    "01_1_0_Takim_Bilgileri.altBaslik": "Company and contact information",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.baslik": "Company & Contact Information",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.basliklar.oyunStudyosu": "Game Studio / Team Name",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.basliklar.takimUyeleri": "Team Members and Roles",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.basliklar.takimBuyuklugu": "Team Size",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.takimBuyuklugu": "2 people",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.takimUyeleri.0.gorev": "Project Manager",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.basliklar.projeYoneticisi": "Project Manager",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.projeYoneticisiGorevi": "Primary contact responsible for official correspondence, process tracking and communication throughout the program. This email and phone go directly to this person.",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.basliklar.eposta": "Email",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.basliklar.telefon": "Phone",
    "02_1_1_Girisim_ve_Iletisim_Bilgileri.not": "A small team is not a weakness but proof: a working core loop and our own level editor show that we can finish this project on our own.",
    "03_2_0_Oyun_Konsepti.altBaslik": "Title, genre, story and project scope",
    "04_2_1_Oyunun_Adi.basliklar.alternatifler_0": "Alternative 1",
    "04_2_1_Oyunun_Adi.basliklar.alternatifler_1": "Alternative 2",
    "04_2_1_Oyunun_Adi.not": "Trademark uniqueness and domain availability will be checked before the title is finalized.",
    "05_2_2_Oyunun_Turu.baslik": "Game Genre",
    "05_2_2_Oyunun_Turu.turSkalasiBaslik": "Genre Scale",
    "05_2_2_Oyunun_Turu.turSkalasiNotu": "Genre list from the application guide: each bar shows how strongly the game leans toward that genre.",
    "05_2_2_Oyunun_Turu.turSkalasi.0.tur": "Action",
    "05_2_2_Oyunun_Turu.turSkalasi.1.tur": "Adventure",
    "05_2_2_Oyunun_Turu.turSkalasi.3.tur": "Strategy",
    "05_2_2_Oyunun_Turu.turSkalasi.4.tur": "Simulation",
    "05_2_2_Oyunun_Turu.turSkalasi.5.tur": "Puzzle / Logic",
    "05_2_2_Oyunun_Turu.turSkalasi.6.tur": "Platformer",
    "05_2_2_Oyunun_Turu.turSkalasi.7.tur": "Sports / Racing",
    "05_2_2_Oyunun_Turu.basliklar.altTurler": "Subgenres",
    "05_2_2_Oyunun_Turu.basliklar.perspektif": "Perspective",
    "05_2_2_Oyunun_Turu.perspektif": "3D, fixed-angle, top-down oblique camera; hex-grid based",
    "05_2_2_Oyunun_Turu.platform": "Mobile (iOS + Android), then Steam",
    "05_2_2_Oyunun_Turu.denge": "Action and RPG at the core: real-time combat and robot classes. Exploration, stealth and resource management turn every arena into a tactical decision.",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.baslik": "Game Summary and Story",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.ozet": "Hexafield is a tactical combat and exploration roguelite set in a procedurally generated, multi-layered hex-grid arena. To complete your mission, you spot enemies behind the fog of war (FOW), hide in the grass, loot lootboxes and move between layers by elevator as you search for the exit elevator.\n\nWhile managing your robot's Durability, Battery, Stamina and Mag resources, you develop different tactics on every run using the unique traits and weapons of the Assault, Assassin, Recon, Tank and Support classes. With an arena layout that changes on every entry and a robot that keeps evolving, your goal is to complete the mission, survive and escape the simulation.",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.hikaye": "“In the world of the future, combat robots are being trained inside a secret technology company that builds advanced machines. The player controls one of these robots through grueling simulations and deadly missions. But as the training goes on, the robot's true purpose and the secrets behind the system that controls it begin to surface. Now it's no longer just about fighting; it's about discovering who you're fighting for.”",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.anahtarKelimeBaslik": "Keywords",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.basliklar.temelOynanis": "Core Gameplay",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.anahtarKelimeler.temelOynanis": "Enter the arena, complete the mission, exit the arena",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.basliklar.anaMekanikler": "Main Mechanics",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.anahtarKelimeler.anaMekanikler": "Auto-Aim, Auto Fire, procedural hex-grid, FOW, hiding in grass, elevators between floors, lootbox",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.basliklar.oyuncuDeneyimi": "Player Experience",
    "06_2_3_Oyunun_Ozeti_ve_Hikayesi.anahtarKelimeler.oyuncuDeneyimi": "Survival through resource management, tactics that change by class, strategy shaped by the procedural arena.",
    "07_2_4_Proje_Kapsami.baslik": "Project Scope",
    "07_2_4_Proje_Kapsami.uspBaslik": "Unique Selling Proposition (USP)",
    "07_2_4_Proje_Kapsami.uspOzet": "A real-time Action RPG in a procedural hex-grid arena, and a robotic shooter experience with a 3D, fixed-angle, top-down oblique camera.",
    "07_2_4_Proje_Kapsami.usp.0.not": "A layered hex-grid arena regenerated on every run",
    "07_2_4_Proje_Kapsami.usp.1.ad": "Real-Time Action RPG",
    "07_2_4_Proje_Kapsami.usp.1.not": "Five robot classes, each with its own attributes, stats and weapon type",
    "07_2_4_Proje_Kapsami.usp.2.ad": "Top-Down Robotic Shooter",
    "07_2_4_Proje_Kapsami.usp.2.not": "Combat with modular robots under a 3D, fixed-angle, top-down oblique camera",
    "07_2_4_Proje_Kapsami.cekirdekDongu.baslik": "Core Loop",
    "07_2_4_Proje_Kapsami.cekirdekDongu.adimlar.0": "1. Enter the arena",
    "07_2_4_Proje_Kapsami.cekirdekDongu.adimlar.1": "2. Explore tiles and spot enemies behind the FOW",
    "07_2_4_Proje_Kapsami.cekirdekDongu.adimlar.2": "3. Hide in the grass or fight with your class's tactics",
    "07_2_4_Proje_Kapsami.cekirdekDongu.adimlar.3": "4. Move between floors by elevator and loot the lootboxes",
    "07_2_4_Proje_Kapsami.cekirdekDongu.adimlar.4": "5. Manage Durability / Battery / Stamina / Mag",
    "07_2_4_Proje_Kapsami.cekirdekDongu.adimlar.5": "6. Complete the mission, find the exit elevator and leave the arena",
    "07_2_4_Proje_Kapsami.kaynaklarBaslik": "Resources",
    "07_2_4_Proje_Kapsami.kaynaklar.0.not": "Durability: the robot's damage buffer",
    "07_2_4_Proje_Kapsami.kaynaklar.1.not": "Battery: the robot's energy",
    "07_2_4_Proje_Kapsami.kaynaklar.2.not": "Stamina: movement and effort",
    "07_2_4_Proje_Kapsami.kaynaklar.3.not": "Mag: ammunition",
    "07_2_4_Proje_Kapsami.hedefKapsam.baslik": "Target Scope",
    "07_2_4_Proje_Kapsami.basliklar.hedefKapsam_seviyeSayisi": "Number of Levels",
    "07_2_4_Proje_Kapsami.hedefKapsam.seviyeSayisi": "Procedurally generated, layered arenas",
    "07_2_4_Proje_Kapsami.basliklar.hedefKapsam_seansSuresi": "Session Length",
    "07_2_4_Proje_Kapsami.hedefKapsam.seansSuresi": "~60 seconds per level",
    "07_2_4_Proje_Kapsami.basliklar.hedefKapsam_ekonomi": "Economy",
    "07_2_4_Proje_Kapsami.hedefKapsam.ekonomi": "In-arena lootboxes; free base game, paid content (IAP)",
    "09_3_1_Proof_of_Concept.basliklar.gelistirmeAsamasi": "Current Development Stage",
    "09_3_1_Proof_of_Concept.gelistirmeAsamasi": "Prototype",
    "09_3_1_Proof_of_Concept.grafikStili.baslik": "Art Style",
    "09_3_1_Proof_of_Concept.grafikStili.stil": "Robotic and stylized: a mechanical robot theme that fits the genre. Thanks to a modular character structure, robot parts are mixed to create a variety of robot types.",
    "09_3_1_Proof_of_Concept.grafikStili.oncelik": "The inorganic, part-based structure eliminates sculpting and weight-painting costs and enables clean rigging and animation. The fixed top-down oblique camera reduces the need for detailed textures and models; stylized art is optimized for mobile and ages well.",
    "09_3_1_Proof_of_Concept.basliklar.motor_ad": "Engine",
    "09_3_1_Proof_of_Concept.basliklar.motor_gerekce": "Why This Engine",
    "09_3_1_Proof_of_Concept.motor.gerekce": "Unity: the most widely used engine for mobile; optimized, well-resourced and easy to understand.\nC#: Unity's language; a large library, easy to learn and intuitive.\nVisual Scripting: designer-friendly state machines and node-based flow. We use both in a hybrid way: classes are written in C#, while algorithms and state machines are built in Visual Scripting.",
    "09_3_1_Proof_of_Concept.worldBuilder.ad": "WorldBuilder — our own level editor",
    "09_3_1_Proof_of_Concept.worldBuilder.icerik": "Placement of the start point, exit elevator, bots, grass cover and elevation",
    "09_3_1_Proof_of_Concept.worldBuilder.not": "This editor is what lets us produce arena content quickly: content production is not our bottleneck.",
    "09_3_1_Proof_of_Concept.linkler.baslik": "Links",
    "09_3_1_Proof_of_Concept.basliklar.linkler_prototip": "Playable Prototype",
    "09_3_1_Proof_of_Concept.basliklar.linkler_portfolyo": "Portfolio",
    "09_3_1_Proof_of_Concept.not": "Our game is in closed testing on Google Play. To try it, email info@zeyondgames.com with the address you'd like added as a tester, and we'll add you right away.",
    "10_4_0_Is_Modeli_ve_Finans.altBaslik": "Revenue model and go-to-market",
    "11_4_1_Ana_Gelir_Modeli.baslik": "Primary Revenue Model",
    "11_4_1_Ana_Gelir_Modeli.model": "Free-to-Play (F2P) + In-App Purchases (IAP)",
    "11_4_1_Ana_Gelir_Modeli.bilesenler.0.ad": "Free Base Game",
    "11_4_1_Ana_Gelir_Modeli.bilesenler.0.not": "The base game is free; it builds awareness for a new title",
    "11_4_1_Ana_Gelir_Modeli.bilesenler.1.ad": "Paid Content (IAP)",
    "11_4_1_Ana_Gelir_Modeli.bilesenler.1.not": "Content is offered through in-app purchases",
    "11_4_1_Ana_Gelir_Modeli.bilesenler.2.ad": "Premium on Steam",
    "11_4_1_Ana_Gelir_Modeli.bilesenler.2.not": "Premium sales on a second platform in months 6–12",
    "11_4_1_Ana_Gelir_Modeli.gerekce": "For a new title, awareness comes first: that's why we chose to offer the base game for free and charge for content.",
    "11_4_1_Ana_Gelir_Modeli.metrikler.baslik": "Target Metrics",
    "11_4_1_Ana_Gelir_Modeli.metrikler.d1": "30% · players who return the day after installing",
    "11_4_1_Ana_Gelir_Modeli.metrikler.d7": "10% · still playing on day 7",
    "11_4_1_Ana_Gelir_Modeli.metrikler.d30": "5% · still playing on day 30",
    "11_4_1_Ana_Gelir_Modeli.metrikler.donusum": "2% · players who pay at least once",
    "12_4_2_Pazara_Giris_Stratejisi.baslik": "Go-to-Market Strategy",
    "12_4_2_Pazara_Giris_Stratejisi.isPlaniBaslik": "Business Plan Summary",
    "12_4_2_Pazara_Giris_Stratejisi.basliklar.platform": "Channels",
    "12_4_2_Pazara_Giris_Stratejisi.platform": "Google Play and App Store (F2P); then Steam (Premium)",
    "12_4_2_Pazara_Giris_Stratejisi.basliklar.cografya": "Geography",
    "12_4_2_Pazara_Giris_Stratejisi.basliklar.plan12Ay": "12-Month Post-Launch Growth",
    "12_4_2_Pazara_Giris_Stratejisi.plan12Ay": "Months 0–3, launch: F2P release on Google Play and App Store; first target D1 retention 30%.\nMonths 3–6, growth: D7 retention 10% through updates.\nMonths 6–12, scaling: premium sales on Steam as a second platform.",
    "12_4_2_Pazara_Giris_Stratejisi.yolHaritasi.baslik": "8-Week Roadmap (Milestones)",
    "12_4_2_Pazara_Giris_Stratejisi.yolHaritasi.haftalar.0.icerik": "A layered procedural hex arena regenerated on every run; tile exploration and FOW; robot movement and fixed oblique camera. Criterion: the exit elevator can be reached from the start through exploration.",
    "12_4_2_Pazara_Giris_Stratejisi.yolHaritasi.haftalar.1.icerik": "Weapon mechanics: multishot, headshot, piercing, knockback. Enemy AI: patrol and trace. Stealth in grass. Criterion: the player can choose to fight or sneak past.",
    "12_4_2_Pazara_Giris_Stratejisi.yolHaritasi.haftalar.2.icerik": "Consumption and regeneration of Durability, Battery, Stamina and Mag; lootbox rewards; elevator travel between floors; mission goal and exit. Criterion: the enter, finish the mission, exit loop plays end to end.",
    "12_4_2_Pazara_Giris_Stratejisi.yolHaritasi.haftalar.3.icerik": "Weapon, robot and ambient sounds; VFX and hit feedback; basic HUD; playtesting and ~60-second session balance. Criterion: a polished, playable build with a complete core loop.",
    "12_4_2_Pazara_Giris_Stratejisi.finansman.baslik": "Post-Program Funding Requirements",
    "12_4_2_Pazara_Giris_Stratejisi.finansman.miktar": "1,400,000 TRY · 12 months",
    "12_4_2_Pazara_Giris_Stratejisi.basliklar.finansman_kullanim": "Use of Funds",
    "12_4_2_Pazara_Giris_Stratejisi.finansman.kullanim": "Team: 2 people × 40,000 TRY × 12 months · 960,000 TRY\nSoftware: 4 subscriptions × 1,000 TRY × 12 months · 48,000 TRY\nMac mini (for iOS builds) · 45,000 TRY\niPhone (test device) · 40,000 TRY\nAccounting and store accounts · 42,000 TRY\nReady-made asset packs (sound, particles) · 30,000 TRY\nContingency 20% · 233,000 TRY",
    "12_4_2_Pazara_Giris_Stratejisi.basliklar.finansman_etki": "Impact on Growth",
    "12_4_2_Pazara_Giris_Stratejisi.finansman.etki": "69% of the fund covers the team's living costs: two people develop only this game for 12 months without other jobs. UA, marketing and publishing costs are covered by the publisher.\nMonths 1–4, production: content, economy and IAP; beta release.\nMonths 5–7, soft launch: release in test markets with the publisher; target D1 30%, D7 10%.\nMonth 8, global launch: Google Play and App Store.\nMonths 9–12, LiveOps: updates and Steam preparation.",
    "12_4_2_Pazara_Giris_Stratejisi.basliklar.yayincilik": "Post-Program Publishing Requirements",
    "12_4_2_Pazara_Giris_Stratejisi.yayincilik": "Working with a publisher on all platforms, including mobile (Google Play, App Store) and Steam.\nFrom soft launch to global launch, we publish together with the publisher. In F2P, growth is driven by UA budget; the publisher brings that capital and expertise. We focus on production and live content updates.",
    "12_4_2_Pazara_Giris_Stratejisi.basliklar.yayincilikOrtak": "Partner We're Looking For",
    "12_4_2_Pazara_Giris_Stratejisi.yayincilikOrtak": "A global publisher with a mobile F2P midcore / action portfolio that can also publish on PC (Steam).\nOur expectations: covering the UA budget for soft launch and global launch; LiveOps, monetization and A/B testing support; analytics infrastructure, store featuring and publishing the Steam version.\nModel: revenue share; the IP stays with the studio.",
    "13_5_0_Taahhut_ve_Uygunluk.altBaslik": "Motivation, terms and privacy",
    "14_5_1_Motivasyon_Mektubu.baslik": "Motivation Letter / Why Deep Jam",
    "14_5_1_Motivasyon_Mektubu.giris": "We develop games in Gaziantep. While Türkiye's game ecosystem is growing fast, we realized that we often watch this growth from a distance: the community, publishers and investors gather in just a few cities. We decided that the way to close this gap is not to wait but to build, and we started developing Hexafield.\n\nMost mobile games coming out of Türkiye are casual and puzzle titles; we see few examples in midcore action RPG. With Hexafield we want to show that this genre can come from here too, and bring a fresh breath to the market.\n\nWe're applying to Deep Jam not only to learn, but to become part of this ecosystem and give back what we learn. We need to learn from people experienced in monetization, user acquisition and publishing; in return, here is what we can bring to the table.",
    "14_5_1_Motivasyon_Mektubu.gucluYanimiz": "We have a working core loop, our own level editor WorldBuilder, and a production pipeline that lets two people create content fast. In short, we're a team that finishes what it starts.",
    "14_5_1_Motivasyon_Mektubu.bosluklarBaslik": "What Can We Bring to This Ecosystem?",
    "14_5_1_Motivasyon_Mektubu.bosluklar.0.ad": "Community and Content Creators",
    "14_5_1_Motivasyon_Mektubu.bosluklar.0.not": "We openly share our development process through devlogs and are ready to share what we've learned about WorldBuilder and procedural generation with other developers. Arenas regenerated on every run and ~60-second rounds give streamers and short-video creators different, shareable moments every time.",
    "14_5_1_Motivasyon_Mektubu.bosluklar.1.ad": "Publishers",
    "14_5_1_Motivasyon_Mektubu.bosluklar.1.not": "Fast, low-cost content production: with modular robot parts and WorldBuilder, new content is added quickly, sustainably feeding the LiveOps calendar and IAP content. We make decisions with retention and conversion metrics and are preparing for market tests with CPI-test-ready creatives.",
    "14_5_1_Motivasyon_Mektubu.bosluklar.2.ad": "Investors",
    "14_5_1_Motivasyon_Mektubu.bosluklar.2.not": "Capital efficiency: a two-person team, low monthly cost and a 12-month plan tied to measurable milestones. WorldBuilder and the modular production pipeline aren't tied to a single game; they're a reusable asset for the studio's future projects.",
    "14_5_1_Motivasyon_Mektubu.kapanis": "We see Deep Jam less as an accelerator and more as the door to the ecosystem we want to be part of. We commit to arriving at demo day with a playable build with a complete core loop; then we want to move on to a soft launch and global launch with a publisher. We'll give the support we receive back to the ecosystem through Hexafield's success and the community we grow.",
    "15_5_2_Sartlar_ve_Gizlilik_Politikasi.baslik": "Terms and Privacy Policy",
    "15_5_2_Sartlar_ve_Gizlilik_Politikasi.telifHakki": "Copyright and Originality: We declare that all intellectual property, game content, visual assets and code in this application are either entirely our team's original work, or that we hold all the licenses and permissions required to use them.",
    "15_5_2_Sartlar_ve_Gizlilik_Politikasi.kvkk": "KVKK / GDPR: We have read that the personal data we provide (name, surname, email, phone) will be processed in accordance with KVKK solely for application evaluation, program management and legal obligations; we understand the terms and give explicit consent to the processing of our data.",
    "15_5_2_Sartlar_ve_Gizlilik_Politikasi.onaylar.0": "I confirm the copyright and originality statement.",
    "15_5_2_Sartlar_ve_Gizlilik_Politikasi.onaylar.1": "I give explicit consent to data processing under KVKK / GDPR.",
    "15_5_2_Sartlar_ve_Gizlilik_Politikasi.not": "Make sure the licenses of the engine, plugins, fonts, sound / music and third-party assets allow commercial use.",
    "16_Slide_Arka_Kapagi.baslik": "Deep Jam Application",
    "16_Slide_Arka_Kapagi.mesaj": "Get in touch"
  };

  // Alan dışındaki sabit metinler ve öznitelikler (Türkçe metin → İngilizce)
  const EN_METIN = {
    "Biz Kimiz": "Who We Are",
    "Oyunumuz": "Our Game",
    "Teknik ve Portfolyo": "Tech & Portfolio",
    "İş Modeli ve Finans": "Business & Finance",
    "Taahhüt ve Uygunluğumuz": "Commitment & Eligibility",
    "Aşağı kaydır": "Scroll down",
    "Takım Bilgileri": "Team Information",
    "Oyun Konsepti": "Game Concept",
    "Taahhüt & Uygunluk": "Commitment & Eligibility",
    "1.1 · TAKIM BİLGİLERİ": "1.1 · TEAM INFORMATION",
    "2.1 · OYUNUN ADI": "2.1 · GAME TITLE",
    "2.2 · OYUN KONSEPTİ": "2.2 · GAME CONCEPT",
    "2.3 · OYUN KONSEPTİ": "2.3 · GAME CONCEPT",
    "2.4 · OYUN KONSEPTİ": "2.4 · GAME CONCEPT",
    "3.1 · TEKNİK VE PORTFOLYO": "3.1 · TECH & PORTFOLIO",
    "4.1 · İŞ MODELİ VE FİNANS": "4.1 · BUSINESS MODEL & FINANCE",
    "4.2 · İŞ MODELİ VE FİNANS": "4.2 · BUSINESS MODEL & FINANCE",
    "5.1 · TAAHHÜT & UYGUNLUK": "5.1 · COMMITMENT & ELIGIBILITY",
    "5.2 · TAAHHÜT & UYGUNLUK": "5.2 · COMMITMENT & ELIGIBILITY",
    "Hakkında": "About",
    "Zemin": "Floor",
    "Çimen": "Grass",
    "Engel": "Obstacle",
    "Asansör": "Elevator",
    "Çıkış": "Exit",
    "Oyun görseli · 01": "Game visual · 01",
    "Oyun görseli · 02": "Game visual · 02",
    "Oyun görseli · 03": "Game visual · 03",
    "Oyun görseli · 04": "Game visual · 04",
    "Unity Visual Scripting: oyuncu karakterinin state machine grafiği": "Unity Visual Scripting: the player character's state machine graph",
    // öznitelikler
    "Bölümler": "Sections",
    "Zeyond Games · Sayfanın başına dön": "Zeyond Games · Back to top",
    "Slayt gezinme": "Slide navigation",
    "E-posta gönder": "Send email",
    "Telefonla ara": "Call",
    "Kapat": "Close",
    "Procedural üretilen hex-grid arena: her katta yeni bir arena hücre hücre oluşuyor": "Procedurally generated hex-grid arena: a new arena forms cell by cell on every floor",
    "00 · Kapak": "00 · Cover",
    "1.1 Girişim ve İletişim": "1.1 Company & Contact",
    "2.1 Oyunun Adı": "2.1 Game Title",
    "2.2 Oyunun Türü": "2.2 Game Genre",
    "2.3 Özet ve Hikaye": "2.3 Summary & Story",
    "2.4 Proje Kapsamı": "2.4 Project Scope",
    "4.1 Ana Gelir Modeli": "4.1 Revenue Model",
    "4.2 Pazara Giriş": "4.2 Go-to-Market",
    "5.1 Motivasyon Mektubu": "5.1 Motivation Letter",
    "5.2 Şartlar ve Gizlilik": "5.2 Terms & Privacy",
    "16 · Arka Kapak": "16 · Back Cover",
    "Tema değiştir": "Toggle theme",
    "Dil: Türkçe / English": "Language: Türkçe / English"
  };
  const OZNITELIKLER = ["aria-label", "title", "data-title", "alt"];

  let alanlar = [];   // { el, tr, en }
  let metinler = [];  // { node, tr, en }
  let oznitelikler = []; // { el, ad, tr, en }

  function topla() {
    document.querySelectorAll("[data-field], [data-metin]").forEach(function (el) {
      const yol = el.dataset.field || el.dataset.metin;
      if (el.id === "turAdi") return; // kaydıraçlardan üretilir
      if (EN_ALAN[yol] !== undefined) alanlar.push({ el: el, tr: el.textContent, en: EN_ALAN[yol] });
    });

    const yuru = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let dugum;
    while ((dugum = yuru.nextNode())) {
      const ata = dugum.parentElement;
      if (!ata || ata.closest("[data-field], [data-metin], script, style, #dots, .baglantilar, .toolbar")) continue;
      const ham = dugum.nodeValue, tr = ham.trim();
      if (tr && EN_METIN[tr]) metinler.push({ node: dugum, tr: ham, en: ham.replace(tr, EN_METIN[tr]) });
    }

    document.querySelectorAll(OZNITELIKLER.map(function (a) { return "[" + a + "]"; }).join(",")).forEach(function (el) {
      OZNITELIKLER.forEach(function (ad) {
        const v = el.getAttribute(ad);
        if (v && EN_METIN[v]) oznitelikler.push({ el: el, ad: ad, tr: v, en: EN_METIN[v] });
      });
    });
  }

  function uygula(dil, kaydetsinMi) {
    GDD.dil = dil;
    const en = dil === "en";
    document.documentElement.lang = dil;
    document.title = BASLIK[dil];

    alanlar.forEach(function (a) { a.el.textContent = en ? a.en : a.tr; GDD.bosMu(a.el); });
    metinler.forEach(function (m) { m.node.nodeValue = en ? m.en : m.tr; });
    oznitelikler.forEach(function (o) { o.el.setAttribute(o.ad, en ? o.en : o.tr); });

    // Metinden üretilen parçalar: radar adları + tür başlığı, link düğmeleri
    document.querySelectorAll(".skala-ad, [data-baglanti]").forEach(function (el) {
      el.dispatchEvent(new Event("input"));
    });
    // Nokta gezinmesi slayt başlıklarını açılışta kopyalamıştı
    const slaytlar = document.querySelectorAll(".slide:not([hidden])");
    document.querySelectorAll("#dots .dot").forEach(function (n, i) {
      if (!slaytlar[i]) return;
      n.title = slaytlar[i].dataset.title;
      n.setAttribute("aria-label", slaytlar[i].dataset.title);
    });
    document.querySelectorAll(".kisi-ac").forEach(function (b) {
      const ad = b.closest(".kisi").querySelector(".kisi-ad");
      b.setAttribute("aria-label", (ad ? ad.textContent : "") + " · " + GDD.t("ayrıntıları aç", "open details"));
    });

    const dugme = document.getElementById("langBtn");
    if (dugme) dugme.setAttribute("aria-pressed", en ? "true" : "false");

    if (!kaydetsinMi) return;
    try { localStorage.setItem(DIL_KEY, dil); } catch (e) {}
    const adres = new URL(location.href);
    if (en) adres.searchParams.set("lang", "en");
    else adres.searchParams.delete("lang");
    history.replaceState(null, "", adres);
  }

  GDD.diliKur = function () {
    topla();

    let ilk = "tr";
    const param = new URLSearchParams(location.search).get("lang");
    if (param === "en" || param === "tr") ilk = param;
    else { try { if (localStorage.getItem(DIL_KEY) === "en") ilk = "en"; } catch (e) {} }
    if (ilk === "en") uygula("en", false);

    const dugme = document.getElementById("langBtn");
    if (dugme) dugme.addEventListener("click", function () {
      uygula(GDD.dil === "en" ? "tr" : "en", true);
    });
  };

})(window.GDD);
