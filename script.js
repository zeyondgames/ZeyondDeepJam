const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const links = document.querySelectorAll(".menu a");

// 1) Mobilde menüyü aç/kapat
hamburger.addEventListener("click", function () {
  menu.classList.toggle("open");
});

// 2) Bir linke tıklanınca mobil menüyü kapat
links.forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("open");
  });
});

// 3) Kaydırırken ekrandaki bölümün menü linkini vurgula
const sections = document.querySelectorAll("header[id], section[id]");

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" } // bölüm ekranın ortasına gelince tetikle
);

sections.forEach(function (section) {
  observer.observe(section);
});
