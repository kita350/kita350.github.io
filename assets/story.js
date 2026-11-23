/* История одной записи: шаг выбирается по прокрутке липкого блока.
   Только классы и opacity/transform; без JS виден первый шаг. */
(function () {
  "use strict";
  var track = document.querySelector(".st-track");
  if (!track) return;
  var N = +getComputedStyle(track).getPropertyValue("--n") || 6;
  var SB = ["23:47", "23:47", "23:48", "09:12", "18:00", "11:02"];
  var stage = track.querySelector(".st-stage");
  var box = track.querySelector(".st-ph-box");
  var cur = 0;

  function each(sel, fn) { var l = track.querySelectorAll(sel); for (var i = 0; i < l.length; i++) fn(l[i]); }
  function has(el, s) { return (" " + el.getAttribute("data-steps") + " ").indexOf(" " + s + " ") >= 0; }

  function show(s) {
    if (s === cur) return;
    cur = s;
    each("[data-steps]", function (el) { el.classList.toggle("on", has(el, s)); });
    each("[data-from]", function (el) { el.classList.toggle("on", s >= +el.getAttribute("data-from")); });
    each(".cap", function (el) { el.classList.toggle("on", +el.getAttribute("data-step") === s); });
    each(".st-rail button", function (el) {
      var n = +el.getAttribute("data-go");
      if (n === s) el.setAttribute("aria-current", "step"); else el.removeAttribute("aria-current");
      el.classList.toggle("done", n < s);
    });
    var t = track.querySelector(".sb b"); if (t) t.textContent = SB[s - 1];
  }

  function fit() {
    // масштаб телефона под свободную высоту
    var ph = track.querySelector(".st-phone");
    var h = ph.clientHeight, w = track.querySelector(".st-grid").clientWidth - (innerWidth >= 900 ? 600 : 130);
    var k = Math.min(innerWidth >= 900 ? 1.2 : 1.1, h / 546, w / 264);
    box.style.setProperty("--k", Math.max(0.5, k).toFixed(3));
  }

  function onScroll() {
    var r = track.getBoundingClientRect();
    var total = track.offsetHeight - stage.offsetHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    show(Math.min(N, Math.floor(p * N) + 1));
  }

  each(".st-rail button", function (b) {
    b.addEventListener("click", function () {
      var n = +b.getAttribute("data-go");
      var total = track.offsetHeight - stage.offsetHeight;
      var y = track.getBoundingClientRect().top + window.scrollY + total * ((n - 0.5) / N);
      window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { fit(); onScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit();
  show(1);
  onScroll();
})();
