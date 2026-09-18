const KEY = "zeyond-gdd";
const fields = document.querySelectorAll(".field");
const chips = document.querySelectorAll(".chip");

// ---------- 1) Kaydetme ve yükleme ----------

// Tüm alanları ve aktif etiketleri tek bir nesnede toplar.
// Hem localStorage hem JSON dışa aktarma aynı nesneyi kullanır.
function topla() {
  const alanlar = {};
  fields.forEach(function (f) { alanlar[f.dataset.field] = f.textContent; });

  const etiketler = [];
  chips.forEach(function (c) {
    if (c.classList.contains("on")) etiketler.push(c.dataset.tag);
  });

  return { alanlar: alanlar, etiketler: etiketler };
}

function kaydet() {
  try { localStorage.setItem(KEY, JSON.stringify(topla())); } catch (e) {}
}

function uygula(veri) {
  if (!veri) return;

  if (veri.alanlar) {
    fields.forEach(function (f) {
      const deger = veri.alanlar[f.dataset.field];
      if (typeof deger === "string") f.textContent = deger;
    });
  }
  if (Array.isArray(veri.etiketler)) {
    chips.forEach(function (c) {
      c.classList.toggle("on", veri.etiketler.indexOf(c.dataset.tag) !== -1);
    });
  }
  fields.forEach(bosMu);
}

// Boş alanlarda CSS'in ipucu metnini göstermesi için .empty sınıfı
function bosMu(f) { f.classList.toggle("empty", f.textContent.trim() === ""); }

// plaintext-only: Enter gerçek satır sonu üretir, metin kaybolmadan geri yüklenir.
// Eski tarayıcılarda geçersiz değer hata verir, o yüzden try/catch ile normale düşülür.
function duzenlenebilir(f, acik) {
  if (!acik) { f.contentEditable = "false"; return; }
  try { f.contentEditable = "plaintext-only"; }
  catch (e) { f.contentEditable = "true"; }
}

try {
  const kayit = localStorage.getItem(KEY);
  if (kayit) uygula(JSON.parse(kayit));
} catch (e) {}

fields.forEach(function (f) {
  duzenlenebilir(f, true);

  f.addEventListener("input", function () { bosMu(f); kaydet(); });

  // Notion'dan yapıştırırken renk ve font gelmesin, sadece düz metin
  f.addEventListener("paste", function (e) {
    e.preventDefault();
    const metin = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, metin);
  });
});

// ---------- 2) Etiket çipleri ----------

chips.forEach(function (c) {
  c.addEventListener("click", function () {
    if (document.body.classList.contains("sunum")) return;
    c.classList.toggle("on");
    kaydet();
  });
});

// ---------- 3) JSON dışa / içe aktarma ----------

document.getElementById("exportBtn").addEventListener("click", function () {
  const blob = new Blob([JSON.stringify(topla(), null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "zeyond-gdd.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById("importFile").addEventListener("change", function (e) {
  const dosya = e.target.files[0];
  if (!dosya) return;

  const okuyucu = new FileReader();
  okuyucu.onload = function () {
    try {
      uygula(JSON.parse(okuyucu.result));
      kaydet();
    } catch (err) {
      alert("Dosya okunamadı. Geçerli bir GDD JSON dosyası mı?");
    }
  };
  okuyucu.readAsText(dosya);
  e.target.value = ""; // aynı dosya tekrar seçilebilsin
});

// ---------- 4) Sunum modu ----------

const modeBtn = document.getElementById("modeBtn");

modeBtn.addEventListener("click", function () {
  const sunum = document.body.classList.toggle("sunum");
  fields.forEach(function (f) { duzenlenebilir(f, !sunum); });
  modeBtn.textContent = sunum ? "Düzenleme modu" : "Sunum modu";
});

// ---------- 5) Nokta gezinme ve klavye ----------

const slides = document.querySelectorAll(".slide");
const dots = document.getElementById("dots");
let aktif = 0;

slides.forEach(function (s) {
  const nokta = document.createElement("button");
  nokta.className = "dot";
  nokta.title = s.dataset.title;
  nokta.setAttribute("aria-label", s.dataset.title);
  nokta.addEventListener("click", function () { s.scrollIntoView(); });
  dots.appendChild(nokta);
});

const noktalar = dots.querySelectorAll(".dot");

// Hangi slaytın ekran ortasında olduğunu izler
const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      aktif = Array.prototype.indexOf.call(slides, entry.target);
      noktalar.forEach(function (n, i) { n.classList.toggle("active", i === aktif); });
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);

slides.forEach(function (s) { observer.observe(s); });

document.addEventListener("keydown", function (e) {
  // Metin yazarken ok tuşları slayt değiştirmesin
  if (document.activeElement && document.activeElement.isContentEditable) return;

  let hedef = null;
  if (e.key === "ArrowDown" || e.key === "PageDown") hedef = aktif + 1;
  if (e.key === "ArrowUp" || e.key === "PageUp") hedef = aktif - 1;
  if (hedef === null || hedef < 0 || hedef >= slides.length) return;

  e.preventDefault();
  slides[hedef].scrollIntoView();
});
