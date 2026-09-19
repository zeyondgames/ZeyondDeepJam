# Deep Jam Başvuru Sunumu — referans

> **Arşiv.** Bu klasör, ayrı bir geçmişte üretilip `main`'e birleştirilen alternatif
> bir sunum sürümüdür; projenin çalışan sitesi repo kökündeki `index.html`'dir.
> Buradaki dosyalar referans olarak duruyor — özellikle bölüm başlıkları ve
> [`content.js`](content.js) içindeki başvuru metni.

GameDev.ist **Deep Jam** hızlandırma programı başvurusu için hazırlanmış, tarayıcıda
çalışan slayt sunumu. Bölüm başlıkları başvuru taslağıyla birebir aynıdır.

> Bu bir GDD (Game Design Document) **değildir**. Başvuru sunumudur: ekip, oyun
> konsepti, teknik yetkinlik, iş planı ve taahhütler — jürinin başvuruda aradığı sırayla.

## Bölümler

| # | Bölüm | Slaytlar |
|---|-------|----------|
| — | Kapak | Oyun adı, tür, konumlandırma |
| — | İçindekiler | Sunum akışı |
| 1.0 | Takım Bilgileri | Takım ve iletişim · Üyeler ve roller |
| 2.0 | Oyun Konsepti | Ad ve tür · Hook · Çekirdek döngü · Aşama ve grafik stili · USP |
| 3.0 | Teknik & Portfolyo | Motor ve teknolojiler · Prototip, video, portfolyo |
| 4.0 | İş Modeli ve Finans | Gelir modeli · Pazara giriş · 8 haftalık yol haritası · Finansman ve yayıncılık |
| 5.0 | Taahhüt & Uygunluk | Neden Deep Jam · Telif ve KVKK beyanları |
| — | Kontrol Listesi | Göndermeden önce |
| — | Kapanış | İletişim ve linkler |

## Çalıştırma

Statik site — kurulum gerekmez.

```bash
# doğrudan aç (referans/ klasörü içinden)
open deck-index.html     # macOS   (Linux: xdg-open, Windows: start)

# ya da yerel sunucu
python3 -m http.server 8000   # → http://localhost:8000/referans/deck-index.html
```

## Kullanım

- **Gezinme:** `←` `→` ok tuşları, boşluk, alttaki noktalar veya mobilde kaydırma.
- **Doğrudan slayt:** adres çubuğuna `#usp`, `#yolharitasi` gibi slayt kimliği.
- **PDF:** üst sağdaki `⬇ PDF` düğmesi (yazdırma görünümü açık temada, her slayt bir sayfa).
- **⟨⟩ rozeti:** kalan doldurulacak alan sayısını gösterir; tıklayınca sırayla o alanlara gider.
- **Kontrol listesi:** işaretler tarayıcıda saklanır (yalnızca o cihazda).

## Düzenleme

Tüm metin tek dosyada: [`content.js`](content.js). HTML'e dokunmadan
slayt ekleyip çıkarabilirsin.

- `⟨...⟩` yazılan her şey **doldurulacak alan** sayılır ve turuncu vurgulanır.
- `**kalın**` işaretlemesi desteklenir.
- Blok tipleri: `lead`, `p`, `tip`, `kv`, `cards`, `bullets`, `chips`, `steps`, `stat`,
  `timeline`, `check`.

Yeni slayt örneği:

```js
{
  id: "risk",
  kicker: "4.0 İş Modeli ve Finans",
  title: "Riskler ve Önlemler",
  blocks: [
    { t: "cards", items: [
      { h: "Risk", text: "Açıklama ve **önlem**." }
    ]}
  ]
}
```

## Göndermeden önce

Sunumdaki son slayt kontrol listesidir; özellikle şunlar doldurulmalı: takım bilgileri,
kesinleşmiş oyun adı (marka/alan adı kontrolü yapılmış), motor onayı, prototip ve pitch
video linkleri, portfolyo, toplam bütçe ve dağılımı.

## Dosyalar

```
referans/deck-index.html   sayfa iskeleti
referans/content.js        tüm sunum metni  ← düzenlemeler burada
referans/deck.js           render ve gezinme
referans/deck.css          tema ve yazdırma stilleri
```
