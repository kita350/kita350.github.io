/* Плавающая кнопка WhatsApp (только телефон).
   Показывается, только когда на экране нет первого экрана, истории с телефоном, финального блока, подвала
   и ни одной другой главной кнопки — чтобы не закрывать текст и не дублировать кнопку рядом. */
(function () {
  "use strict";
  var fab = document.getElementById("fab");
  if (!fab || !("IntersectionObserver" in window)) return;
  var zones = document.querySelectorAll(".hero, .pg-head, .st-track, #contact, footer, main .btn-main, .ty-btns, .in-btns");
  var visible = new Set();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    fab.classList.toggle("on", visible.size === 0);
  });
  for (var i = 0; i < zones.length; i++) io.observe(zones[i]);
})();
