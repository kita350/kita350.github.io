import crypto from "crypto";
// Сборка сайта SKIYAR: src/*.html + src/text/*.js → index.html, ru/index.html, en/index.html (и другие страницы).
// Тексты вписываются в HTML заранее (видны без JS и поисковикам), стили и скрипты — одним файлом.
// Запуск: node tools/build.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const SITE = "https://kita350.github.io";
const LANGS = ["hy", "ru", "en"];
const DIR = { hy: "", ru: "ru/", en: "en/" };
const LOCALE = { hy: "hy_AM", ru: "ru_RU", en: "en_US" };
const r = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };

// Страницы: исходник → имя файла, тексты, стили, скрипты
const PAGES = [
  {
    src: "src/home.html", out: "index.html", og: "og",
    text: ["hero", "niche", "biz", "story", "gor", "bento", "try", "ind", "calc", "pk", "end"],
    css: ["fonts", "tokens", "site", "home", "story", "bento", "try", "demo-fonts", "ind", "calc", "pk", "end", "v3", "v4", "v5"],
    js: ["site", "story", "try", "ind", "calc", "pk", "fab", "live", "niche", "phone3d", "phone3d-ind", "phone3d-story", "chars", "reveal"],
  },
];
if (fs.existsSync(path.join(ROOT, "src/packages.html"))) PAGES.push({
  src: "src/packages.html", out: "packages.html", og: "og",
  text: ["hero", "pk", "end", "pkpage"],
  css: ["fonts", "tokens", "site", "pk", "end", "pkpage", "v3", "v4", "v5"],
  js: ["site", "pk", "fab", "reveal", "pgcards"],
});

// Страницы ниш (ТЗ ч.7): один шаблон src/niche.html, тексты src/text/nz-<ниша>.js (ключи <nk>_*), адрес /<out без .html>
const NICHES = [
  { out: "hotel.html", nk: "gh", niche: 2, demo: "hotel/", shot: "hotel", text: "nz-gh" },
  { out: "restaurant.html", nk: "rs", niche: 1, demo: "restaurant/", shot: "rest", text: "nz-rs" },
  { out: "autoservice.html", nk: "au", niche: 3, demo: "auto/", shot: "auto", text: "nz-au" },
  { out: "clinic.html", nk: "cl", niche: 4, demo: "clinic/", shot: "clinic", text: "nz-cl" },
  { out: "courses.html", nk: "cs", niche: 5, demo: "courses/", shot: "courses", text: "nz-cs" },
  { out: "realty.html", nk: "re", niche: 6, demo: "realty/", shot: "realty", text: "nz-re" },
  { out: "repair.html", nk: "rp", niche: 7, demo: "repair/", shot: "repair", text: "nz-rp" },
  { out: "salon.html", nk: "sl", niche: 0, demo: "salon/", shot: "salon", text: "nz-sl" },
];
for (const N of NICHES) if (fs.existsSync(path.join(ROOT, `src/text/${N.text}.js`))) PAGES.push({
  src: "src/niche.html", out: N.out, og: "og", nz: N, tk: "_titleNz", dk: "_descNz",
  text: ["hero", "niche", "end", N.text],
  css: ["fonts", "tokens", "site", "home", "ind", "end", "v3", "v4", "v5"],
  js: ["site", "fab", "live", "niche", "phone3d", "phone3d-ind", "chars", "reveal"],
});

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escA = (s) => esc(s).replace(/"/g, "&quot;");
const wa = (t) => "https://wa.me/37498337187?text=" + encodeURIComponent(t);
const min = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*/g, "\n").replace(/\n+/g, "\n").trim();

for (const P of PAGES) {
  // тексты
  const ctx = { window: {} };
  vm.createContext(ctx);
  const owner = {};
  for (const t of P.text) {
    const before = new Set(Object.keys((ctx.window.T || {}).ru || {}));
    const probe = { window: { T: { hy: {}, ru: {}, en: {} } } };
    vm.createContext(probe); vm.runInContext(r(`src/text/${t}.js`), probe);
    for (const k of Object.keys(probe.window.T.ru)) {
      if (owner[k] && owner[k] !== t) throw new Error(`Ключ «${k}» есть и в ${owner[k]}.js, и в ${t}.js — переименуйте один`);
      owner[k] = t;
    }
    vm.runInContext(r(`src/text/${t}.js`), ctx);
  }
  const T = ctx.window.T;
  // типографика: неразрывный пробел после коротких слов (нет висячих предлогов), неразрывный дефис в «WhatsApp-ով», «гель-лак».
  // Тексты сообщений для WhatsApp не трогаем.
  const NOTYPO = /^(caWa|pWa|pkWaAi|pkWaOn|pkWaStart|pkWaLite|pkWaLarge|waHello|inAskMsg|tyWaMsg|bzWa\d|[a-z]{2}_wa|[a-z]{2}_waPk)$/;
  const SHORT = { ru: "в|во|и|а|но|на|до|без|с|со|к|ко|о|об|у|по|за|от|из|не|ни|для|что|как|или|все|при|под|над", en: "a|an|the|to|in|of|on|at|by|for|and|or|is|it|no|your|our|we", hy: "և|ու" };
  const typo = (v, L) => {
    if (typeof v !== "string") return Array.isArray(v) ? v.map((x) => typo(x, L)) : v;
    let s = v.replace(/([A-Za-z])-(ով|ում|ից|ի|ը|ն|ու)(?![\p{L}])/gu, "$1‑$2").replace(/գել-լաք/gi, (m) => m.replace("-", "‑")).replace(/ИИ-/g, "ИИ‑").replace(/гель-лак/gi, (m) => m.replace("-", "‑"));
    if (SHORT[L]) { const re = new RegExp(`(^|[\\s >(«"—])(${SHORT[L]}) (?=[^\\s<])`, "giu"); s = s.replace(re, (m, a, w) => a + w + " ").replace(re, (m, a, w) => a + w + " "); } // дважды: «и в Instagram»
    s = s.replace(/(\d) (?=\d{3}(?!\d))/g, "$1 ").replace(/ ֏/g, " ֏"); // «35 000 ֏» не рвётся
    s = s.replace(/ — /g, " — ");
    s = s.replace(/(^|[\s(«])(\d{1,3}) (?=[\p{L}])/gu, "$1$2 ").replace(/QR /g, "QR ").replace(/онлайн-(?=запис)/g, "онлайн‑"); // «30 дней», «QR code», «онлайн-запись» не рвутся
    return s;
  };
  for (const L of Object.keys(T)) for (const k of Object.keys(T[L])) if (!NOTYPO.test(k)) T[L][k] = typo(T[L][k], L);
  const name = P.out.replace(/\.html$/, "");
  // штамп Hallmark (первые строки tokens.css) переносим в начало собранного CSS: min() убирает комментарии
  const stamp = (r("assets/tokens.css").match(/^\/\* Hallmark[^\n]*\*\/$/gm) || []).join("\n");
  w(`assets/${name}.css`, (stamp ? stamp + "\n" : "") + P.css.map((c) => `/* ${c} */\n` + min(r(`assets/${c}.css`))).join("\n") + "\n");
  w(`assets/${name}.js`, "/* собрано tools/build.mjs — не править руками */\nwindow.T=" + JSON.stringify(T) + ";\n" + P.js.map((j) => r(`assets/${j}.js`)).join("\n;\n"));
  // метка версии в адресе: после выкладки браузер не показывает старые стили и скрипты из кэша
  const ver = crypto.createHash("md5").update(r(`assets/${name}.css`) + r(`assets/${name}.js`)).digest("hex").slice(0, 8);

  for (const L of LANGS) {
    const d = T[L], pre = DIR[L] ? "../" : "";
    const t = (k) => (d[k] != null ? d[k] : T.ru[k] != null ? T.ru[k] : "");
    const url = SITE + "/" + DIR[L] + (P.out === "index.html" ? "" : P.out);
    let h = r(P.src);
    if (P.nz && P.nz.mock) { // ниша без демо: вместо скриншота — макет экрана записи, кнопки — к примеру и в WhatsApp
      h = h.replace(/<img data-shot="NZSHOT"[^>]*>/, '<div class="mk"><span class="mk-tag" data-t="n_mkTag"></span><h4 data-t="n_mkH"></h4>'
        + [1, 2, 3].map((i) => `<div class="mk-f"><b data-t="n_mk${i}"></b><small data-t="n_mk${i}p"></small></div>`).join("")
        + '<div class="mk-tm"><small data-t="n_mkT"></small><p><span>09:00</span><span class="on">10:30</span><span>14:00</span></p></div><p class="mk-note" data-t="n_mkN"></p><div class="mk-btn" data-t="n_mkBtn"></div></div>')
        .replace(/<a class="btn btn-line" data-demo="NZDEMO" target="_blank" rel="noopener"/, '<a class="btn btn-line" href="#example"')
        .replace(/<a class="btn btn-main" data-demo="NZDEMO"/, '<a class="btn btn-main" data-wa="n_wa"');
    }
    if (P.nz) { // шаблон ниши: ключи n_* → <nk>_*, номер ниши в телефоне, демо и скриншот на языке страницы
      h = h.replace(/data-(t|t-html|wa)="n_/g, `data-$1="${P.nz.nk}_`).replace(/NZNICHE/g, String(P.nz.niche)).replace(/NZDEMO/g, P.nz.demo)
        .replace(/shot-NZSHOT-hy\.webp/g, `shot-${P.nz.shot}-${L}.webp`).replace(/NZSHOT/g, P.nz.shot);
    }

    // пути
    h = h.replace(/\.\.\/assets\//g, pre + "assets/").replace(/\.\.\/demo\//g, pre + "demo/").replace(/\.\.\/privacy\.html/g, pre + "privacy.html");
    h = h.replace(/href="index\.html"/g, `href="./"`).replace(/href="\.\.\/src\/home\.html#/g, `href="./#`);
    h = h.replace(/data-img-base="[^"]*"/g, "").replace(/<section class="ind" id="demos"/, `<section class="ind" id="demos" data-img-base="${pre}assets/img/"`);

    // ссылки на демо — сразу с языком страницы (работают и без JS)
    h = h.replace(/(<a\b[^>]*?)\sdata-demo="([^"]+)"/g, (m, a, d) => `${a} data-demo="${d}" href="${pre}demo/${d}?lang=${L}"`);
    h = h.replace(/href="((?:\.\.\/)?demo\/[a-z]+\/)"/g, (m, u) => `href="${u}?lang=${L}"`);

    // тексты: пустые элементы с data-t / data-t-html
    h = h.replace(/(<(\w+)\b[^>]*?\sdata-t="(\w+)"[^>]*>)(<\/\2>)/g, (m, open, tag, k, close) => open + esc(t(k)) + close);
    h = h.replace(/(<(\w+)\b[^>]*?\sdata-t-html="(\w+)"[^>]*>)(<\/\2>)/g, (m, open, tag, k, close) => open + t(k) + close);
    h = h.replace(/\sdata-t-ph="(\w+)"/g, (m, k) => `${m} placeholder="${escA(t(k))}"`);
    h = h.replace(/\sdata-t-aria="(\w+)"/g, (m, k) => `${m} aria-label="${escA(t(k))}"`);
    h = h.replace(/(<a\b[^>]*?)\sdata-wa="(\w+)"/g, (m, a, k) => `${a} data-wa="${k}" href="${escA(wa(t(k)))}"`);
    // кнопки языка → ссылки на страницы языков
    h = h.replace(/<button type="button" data-lang-btn="(\w+)">([^<]*)<\/button>/g, (m, l, label) =>
      `<a href="${(pre + DIR[l] + (P.out === "index.html" ? "" : P.out)) || "./"}" hreflang="${l}" data-lang-btn="${l}"${l === L ? ' aria-current="page"' : ""}>${label}</a>`);

    // head
    const alt = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${DIR[l]}${P.out === "index.html" ? "" : P.out}">`).join("\n")
      + `\n<link rel="alternate" hreflang="x-default" href="${SITE}/${P.out === "index.html" ? "" : P.out}">`;
    const title = esc(t(P.tk || (P.out === "index.html" ? "_title" : "_titlePk")) || t("_title"));
    const desc = escA(t(P.dk || (P.out === "index.html" ? "_desc" : "_descPk")) || t("_desc"));
    const head = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${alt}
<meta property="og:type" content="website">
<meta property="og:site_name" content="SKIYAR">
<meta property="og:title" content="${escA(t(P.tk || (P.out === "index.html" ? "_title" : "_titlePk")) || t("_title"))}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${LOCALE[L]}">
<meta property="og:image" content="${SITE}/assets/img/${P.og}-${L}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#02030A">
<link rel="icon" href="${pre}assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${pre}favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="${pre}assets/img/apple-touch-icon.png">
<link rel="preload" as="font" type="font/woff2" crossorigin href="${pre}assets/img/fonts/manrope-latin-800.woff2"><link rel="preload" as="font" type="font/woff2" crossorigin href="${pre}assets/img/fonts/manrope-latin-400.woff2">
${L === "ru" ? `<link rel="preload" as="font" type="font/woff2" crossorigin href="${pre}assets/img/fonts/manrope-cyrillic-800.woff2"><link rel="preload" as="font" type="font/woff2" crossorigin href="${pre}assets/img/fonts/manrope-cyrillic-400.woff2">` : L === "hy" ? `<link rel="preload" as="font" type="font/woff2" crossorigin href="${pre}assets/img/fonts/noto-arm-armenian-800.woff2"><link rel="preload" as="font" type="font/woff2" crossorigin href="${pre}assets/img/fonts/noto-arm-armenian-400.woff2">` : ""}
<link rel="stylesheet" href="${pre}assets/${name}.css?v=${ver}">
<script>window.PAGE_LANG="${L}";document.documentElement.classList.add("ph3d")</script>
<script src="${pre}assets/${name}.js?v=${ver}" defer></script>`;
    // старые подключения скриптов из исходника — до вставки нового head
    h = h.replace(/\n<script src="[^"]*"><\/script>/g, "").replace(/\n<script>[\s\S]*?<\/script>/g, "");
    h = h.replace(/<head>[\s\S]*?<\/head>/, `<head>\n${head}\n</head>`);
    h = h.replace(/<html lang="\w+">/, `<html lang="${L}">`).replace(/<body data-lang="\w+">/, `<body data-lang="${L}">`);
    w(DIR[L] + P.out, h);
    const left = (h.match(/data-t="\w+"><\//g) || []).length;
    console.log(`${DIR[L] + P.out}: ${(h.length / 1024).toFixed(0)} KB, пустых data-t: ${left}`);
  }
}
