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
    text: ["hero", "niche", "story", "gor", "bento", "try", "ind", "calc", "pk", "end"],
    css: ["tokens", "site", "home", "story", "bento", "try", "demo-fonts", "ind", "calc", "pk", "end", "v3", "v4", "v5"],
    js: ["site", "story", "try", "ind", "calc", "pk", "fab", "live", "niche", "reveal"],
  },
];
if (fs.existsSync(path.join(ROOT, "src/packages.html"))) PAGES.push({
  src: "src/packages.html", out: "packages.html", og: "og",
  text: ["hero", "pk", "end", "pkpage"],
  css: ["tokens", "site", "pk", "end", "pkpage", "v3", "v4", "v5"],
  js: ["site", "pk", "fab", "reveal"],
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
  const name = P.out.replace(/\.html$/, "");
  // штамп Hallmark (первые строки tokens.css) переносим в начало собранного CSS: min() убирает комментарии
  const stamp = (r("assets/tokens.css").match(/^\/\* Hallmark[^\n]*\*\/$/gm) || []).join("\n");
  w(`assets/${name}.css`, (stamp ? stamp + "\n" : "") + P.css.map((c) => `/* ${c} */\n` + min(r(`assets/${c}.css`))).join("\n") + "\n");
  w(`assets/${name}.js`, "/* собрано tools/build.mjs — не править руками */\nwindow.T=" + JSON.stringify(T) + ";\n" + P.js.map((j) => r(`assets/${j}.js`)).join("\n;\n"));

  for (const L of LANGS) {
    const d = T[L], pre = DIR[L] ? "../" : "";
    const t = (k) => (d[k] != null ? d[k] : T.ru[k] != null ? T.ru[k] : "");
    const url = SITE + "/" + DIR[L] + (P.out === "index.html" ? "" : P.out);
    let h = r(P.src);

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
    const title = esc(t(P.out === "index.html" ? "_title" : "_titlePk") || t("_title"));
    const desc = escA(t(P.out === "index.html" ? "_desc" : "_descPk") || t("_desc"));
    const head = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${alt}
<meta property="og:type" content="website">
<meta property="og:site_name" content="SKIYAR">
<meta property="og:title" content="${escA(t(P.out === "index.html" ? "_title" : "_titlePk") || t("_title"))}">
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Noto+Sans+Armenian:wght@400;700;800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Noto+Sans+Armenian:wght@400;700;800&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Noto+Sans+Armenian:wght@400;700;800&display=swap"></noscript>
<link rel="stylesheet" href="${pre}assets/${name}.css">
<script>window.PAGE_LANG="${L}"</script>
<script src="${pre}assets/${name}.js" defer></script>`;
    // старые подключения скриптов из исходника — до вставки нового head
    h = h.replace(/\n<script src="[^"]*"><\/script>/g, "").replace(/\n<script>[\s\S]*?<\/script>/g, "");
    h = h.replace(/<head>[\s\S]*?<\/head>/, `<head>\n${head}\n</head>`);
    h = h.replace(/<html lang="\w+">/, `<html lang="${L}">`).replace(/<body data-lang="\w+">/, `<body data-lang="${L}">`);
    w(DIR[L] + P.out, h);
    const left = (h.match(/data-t="\w+"><\//g) || []).length;
    console.log(`${DIR[L] + P.out}: ${(h.length / 1024).toFixed(0)} KB, пустых data-t: ${left}`);
  }
}
