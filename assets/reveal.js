/* Появление при прокрутке: заголовки и плитки поднимаются на 12 px и проявляются один раз.
   Без замеров при загрузке (быстро на телефоне): что не видно при первом ответе наблюдателя, прячем и показываем при подходе.
   Только transform и opacity. Без JS и при prefers-reduced-motion всё видно сразу. */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var SEL = "main section:not(.hero) h2, .tile, .gr-col, .pkt, .in-panel, .ca-box, .steps-l li, .faq details, .pv, .ty-form, .pg-once article, .fin-grid > div";
  var seen = new WeakSet();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;
      if (!seen.has(el)) { // первый ответ: видимое не трогаем, остальное прячем до подхода
        seen.add(el);
        if (e.isIntersecting) { io.unobserve(el); return; }
        var i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = Math.min(i, 5) * 60 + "ms";
        el.classList.add("rv");
        return;
      }
      if (e.isIntersecting) { el.classList.add("rv-in"); io.unobserve(el); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  function start() { var els = document.querySelectorAll(SEL); for (var i = 0; i < els.length; i++) io.observe(els[i]); }
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1200 }); else setTimeout(start, 300);
})();
