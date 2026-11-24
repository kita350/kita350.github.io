/* ПРОБНЫЙ САЙТ (ветка site-mock-tilt; на основной — только после «ок» основателя).
   Телефон первого экрана «как у Apple»: корпус — кадры рендера Blender (assets/img/phone3d/fNN.webp),
   при прокрутке телефон поворачивается (кадр выбирается по прокрутке первого экрана), при загрузке — плавно «встаёт» на место.
   Живой экран с перепиской (HTML, ниши и языки работают) кладётся поверх: для каждого кадра известны 4 угла экрана
   (corners.json из Blender), экран натягивается на них через matrix3d. Без JS и при «уменьшить движение» — первый кадр без анимации. */
(function () {
  "use strict";
  var box = document.getElementById("live");
  var wrap = box && box.querySelector(".lv-box"), ph = box && box.querySelector(".lv-phone"), scr = ph && ph.querySelector(".lv-screen");
  if (!scr || !window.fetch) return;
  var base = (document.querySelector('link[rel="stylesheet"][href*="assets/"]') || {}).getAttribute("href").replace(/assets\/.*$/, "") + "assets/img/phone3d/";
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SW = 300, SH = 636; // размер живого экрана в CSS-пикселях (пропорции экрана модели)

  fetch(base + "corners.json").then(function (r) { return r.json(); }).then(start).catch(function () {});

  function start(J) {
    var N = J.n, FW = J.w, FH = J.h, imgs = new Array(N), cur = -1, want = 0;
    var cv = document.createElement("img"); cv.className = "lv-3d"; cv.alt = ""; cv.setAttribute("aria-hidden", "true");
    cv.width = FW; cv.height = FH;
    ph.insertBefore(cv, scr);
    var k = 1;
    document.documentElement.classList.add("ph3d");
    // детали настоящего телефона поверх живого экрана: островок камеры, строка ввода, значки сети
    scr.insertAdjacentHTML("beforeend", '<i class="lv-island" aria-hidden="true"></i><i class="lv-input" aria-hidden="true"></i><i class="lv-send" aria-hidden="true"></i>');
    var dots = scr.querySelector(".lv-sb span[aria-hidden]");
    if (dots) dots.innerHTML = '<svg width="54" height="12" viewBox="0 0 54 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y=".5" width="3" height="11.5" rx="1"/><path d="M28 3.2a9 9 0 0 1 6.4 2.6l1.3-1.3a10.8 10.8 0 0 0-15.4 0l1.3 1.3A9 9 0 0 1 28 3.2zm0 3.4a5.6 5.6 0 0 1 4 1.6l1.3-1.3a7.4 7.4 0 0 0-10.6 0L24 8.2a5.6 5.6 0 0 1 4-1.6zm0 3.3a2 2 0 0 0-1.5.6L28 12l1.5-1.5a2 2 0 0 0-1.5-.6z"/><rect x="39.5" y="1.5" width="12" height="9" rx="2.5" fill="none" stroke="currentColor" stroke-opacity=".45"/><rect x="41" y="3" width="8" height="6" rx="1.3"/></svg>';

    function size() {
      k = ph.clientWidth / FW;
      cur = -1; paint();
    }
    // матрица, переводящая прямоугольник экрана в 4 угла кадра
    function adj(m) { return [m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4], m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5], m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]]; }
    function mm(a, b) { var c = [], i, j, s, t; for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) { s = 0; for (t = 0; t < 3; t++) s += a[3*i+t] * b[3*t+j]; c[3*i+j] = s; } return c; }
    function mv(m, v) { return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2], m[3]*v[0]+m[4]*v[1]+m[5]*v[2], m[6]*v[0]+m[7]*v[1]+m[8]*v[2]]; }
    function basis(p) { var m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1], v = mv(adj(m), [p[3][0], p[3][1], 1]); return mm(m, [v[0],0,0, 0,v[1],0, 0,0,v[2]]); }
    var SRC = basis([[0, 0], [SW, 0], [SW, SH], [0, SH]]), SRCA = adj(SRC);
    function fit(c) {
      var d = basis(c.map(function (p) { return [p[0] * k, p[1] * k]; })), t = mm(d, SRCA), i;
      for (i = 0; i < 9; i++) t[i] /= t[8];
      scr.style.transform = "matrix3d(" + [t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]].map(function (x) { return +x.toFixed(6); }).join(",") + ")";
    }
    function paint() {
      var f = want; while (f > 0 && !imgs[f]) f--; // нужный кадр ещё грузится — ближайший готовый
      if (!imgs[f] || f === cur) return;
      cur = f; cv.src = imgs[f].src; fit(J.corners[f]);
    }
    // кадр считается готовым только после распаковки (decode) — иначе браузер распаковывает его посреди прокрутки
    function load(i, cb) {
      var im = new Image(); im.decoding = "async"; im.src = base + "f" + (i < 10 ? "0" : "") + i + ".webp";
      var done = function () { imgs[i] = im; if (cb) cb(); if (Math.abs(i - want) < 2) paint(); };
      if (im.decode) im.decode().then(done, function () {}); else im.onload = done;
    }

    // прокрутка: 0 — телефон повёрнут влево, к концу первого экрана — развернулся вправо
    var hero = document.querySelector(".hero"), raf = 0, intro = 0;
    function fromScroll() {
      var r = hero.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height * 0.75)));
      return Math.round(p * (N - 1));
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; if (intro) return; want = fromScroll(); paint(); }); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { size(); }, { passive: true });

    var got = 1;
    load(0, function () {
      size();
      for (var i = 1; i < N; i++) load(i, function () { if (++got === N) startIntro(); });
    });
    function startIntro() {
      if (still) return;
      {
        // появление: телефон за 1,4 с разворачивается из середины поворота в исходное положение
        intro = 1; var t0 = 0, from = Math.round(N * 0.6);
        var go = function (t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
          want = Math.round(from * (1 - e)); paint();
          if (p < 1) requestAnimationFrame(go); else { intro = 0; onScroll(); }
        };
        if (window.scrollY > 40) { intro = 0; onScroll(); return; } // уже прокрутили — без появления
        requestAnimationFrame(go);
      }
    }
  }
})();
