/* Переключатель ниши в живом телефоне первого экрана: Салон / Ресторан / Гестхаус / Автосервис.
   По нажатию меняются название бизнеса, переписка, кнопка, итог, напоминание и цена пакета; сценарий
   начинается заново, Гор кивает. Тексты — src/text/niche.js (салон берётся из разметки hero). */
(function () {
  "use strict";
  var box = document.getElementById("live");
  if (!box) return;
  var wrap = box.querySelector(".niche-c"), price = box.querySelector(".niche-p"), gor = box.querySelector(".niche-gor");
  if (!wrap) return;
  var q = function (s) { return box.querySelector(s); };
  var F = { name: ".lv-hd b", av: ".lv-av", msg: "[data-t=lpMsg]", autoT: "[data-t=lpAutoT]", btn: "[data-t=lpBtn]", ok: "[data-t=lpOk]", toast: "[data-t=lpToastS]" };
  var base = {}, cur = 0;
  function t(k) { return window.SITE.t(k); }
  function grab() { for (var k in F) { var el = q(F[k]); base[k] = el ? el.textContent : ""; } }

  function apply(i) {
    var n = (t("niches") || [])[i] || base;
    for (var k in F) { var el = q(F[k]); if (el && n[k] != null) el.textContent = n[k]; }
    price.textContent = (t("nichePrice") || [])[i] || "";
  }
  function build() {
    var chips = t("nicheChips") || [];
    wrap.textContent = "";
    chips.forEach(function (c, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "niche-b"; b.textContent = c;
      b.setAttribute("aria-pressed", i === cur ? "true" : "false");
      b.addEventListener("click", function () { pick(i); });
      wrap.appendChild(b);
    });
  }
  function pick(i) {
    if (i === cur) return;
    cur = i;
    var bs = wrap.querySelectorAll(".niche-b");
    for (var j = 0; j < bs.length; j++) bs[j].setAttribute("aria-pressed", j === i ? "true" : "false");
    apply(i);
    if (box.restartLive) box.restartLive();
    if (gor) { gor.classList.remove("nod"); void gor.offsetWidth; gor.classList.add("nod"); }
  }

  grab(); build(); apply(0);
  window.SITE.onRender.push(function () { grab(); build(); apply(cur); });
})();
