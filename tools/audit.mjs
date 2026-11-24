// Полная автопроверка живого сайта: node tools/audit.mjs [база] [папка-для-скриншотов]
// Страницы × языки × ширины: ошибки консоли и сети, ссылки WhatsApp/tel/mailto, кнопки языков,
// живой телефон, меню, ДЕМО-форма, демо с ?name=, 404, мета/OG. Пишет audit.json и скриншоты.
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const BASE = process.argv[2] || "https://kita350.github.io";
const OUT = process.argv[3] || "audit-out";
mkdirSync(OUT, { recursive: true });
const port = 9600 + Math.floor(Math.random() * 300);
const ch = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "a-"))}`, "about:blank"], { stdio: "ignore" });
const sl = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 50 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} await sl(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const P = new Map(); const events = [];
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && P.has(m.id)) { P.get(m.id)(m); P.delete(m.id); } else if (m.method) events.push(m); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => { const r = await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true }); return r.result.result ? r.result.result.value : r.result; };
await send("Runtime.enable"); await send("Log.enable"); await send("Network.enable"); await send("Page.enable");
const shot = async (f) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(join(OUT, f), Buffer.from(r.result.data, "base64")); };
const issues = []; const add = (sev, where, what) => issues.push({ sev, where, what });
async function open(url, W, H = 900) {
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: W < 768 ? 2 : 1, mobile: W < 768 });
  events.length = 0;
  await send("Page.navigate", { url }); await sl(3000);
  const errs = events.filter((e) => (e.method === "Runtime.exceptionThrown") || (e.method === "Log.entryAdded" && e.params.entry.level === "error") || (e.method === "Network.loadingFailed" && !e.params.canceled) || (e.method === "Network.responseReceived" && e.params.response.status >= 400 && !/\/(nope|404)/.test(url)));
  for (const e of errs) add("сломано", url + " @" + W, "консоль/сеть: " + JSON.stringify(e.params.exceptionDetails ? e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text : e.params.entry ? e.params.entry.text : e.params.response ? e.params.response.status + " " + e.params.response.url : e.params.errorText + " " + (e.params.requestId || "")).slice(0, 200));
}
const PAGES = [["", "hy"], ["ru/", "ru"], ["en/", "en"], ["packages.html", "hy"], ["ru/packages.html", "ru"], ["en/packages.html", "en"]];
for (const W of [375, 768, 1440]) {
  for (const [p, L] of PAGES) {
    const url = BASE + "/" + p;
    await open(url, W);
    const r = await ev(`(async function(){
      var o={}, vw=document.documentElement.clientWidth;
      o.lang=document.documentElement.lang; o.title=document.title;
      o.wide=document.documentElement.scrollWidth>vw+1;
      o.og=!!document.querySelector('meta[property="og:image"]'); o.desc=(document.querySelector('meta[name=description]')||{}).content||'';
      o.hreflang=document.querySelectorAll('link[hreflang]').length;
      var links=[].slice.call(document.querySelectorAll('a[href]'));
      o.wa=links.filter(function(a){return /wa\\.me/.test(a.href)}).map(function(a){return a.href});
      o.waBad=o.wa.filter(function(h){return !/^https:\\/\\/wa\\.me\\/37498337187(\\?text=.+)?$/.test(h)});
      o.mail=links.filter(function(a){return /^mailto:/.test(a.href)}).map(function(a){return a.href});
      o.empty=links.filter(function(a){var h=a.getAttribute('href');return !h||h==='#'&&!a.classList.contains('logo')}).map(function(a){return (a.className||a.tagName)+' '+a.textContent.trim().slice(0,30)});
      o.emptyText=[].slice.call(document.querySelectorAll('[data-t]')).filter(function(e){return !e.textContent.trim()&&getComputedStyle(e).display!=='none'}).map(function(e){return e.getAttribute('data-t')}).slice(0,10);
      o.imgBroken=[].slice.call(document.images).filter(function(i){return i.complete&&i.naturalWidth===0&&i.loading!=='lazy'}).map(function(i){return i.src});
      o.langLinks=[].slice.call(document.querySelectorAll('.langs a')).map(function(a){return a.getAttribute('hreflang')+'>'+a.getAttribute('href')});
      var nb=document.querySelector('.nav-burger'); if(nb&&getComputedStyle(nb).display!=='none'){nb.click(); await new Promise(function(r){setTimeout(r,300)}); var pn=document.getElementById('navPanel'); o.menuOpens=pn&&getComputedStyle(pn).display!=='none'; nb.click();}
      var lv=document.getElementById('live'); if(lv){ var b=lv.querySelectorAll('[data-step].on').length; await new Promise(function(r){setTimeout(r,2500)}); o.liveSteps=[b, lv.querySelectorAll('[data-step].on').length, lv.classList.contains('is-live')]; }
      var inp=document.getElementById('tyName'); if(inp){ inp.value='Салон Гоар'; inp.dispatchEvent(new Event('input')); o.tyWa=document.getElementById('tyWa').href; o.tyOpen=document.getElementById('tyOpen').getAttribute('href'); o.pvName=document.querySelector('.pv-name').textContent; o.pvUrl=document.querySelector('.pv-url b').textContent; }
      var yb=document.querySelector('.bill [data-bill=y]'); if(yb){ yb.click(); await new Promise(function(r){setTimeout(r,600)}); o.yearPrice=(document.querySelector('.pl-p[data-m] .pl-x')||{}).textContent; document.querySelector('.bill [data-bill=m]').click(); }
      var cb=document.getElementById('caC'); if(cb){ cb.value=20000; cb.dispatchEvent(new Event('input')); await new Promise(function(r){setTimeout(r,500)}); o.calc=document.getElementById('caOut').textContent+' '+document.getElementById('caUnit').textContent; }
      return o; })()`);
    const where = p + " @" + W;
    if (r.lang !== L) add("сломано", where, "язык страницы " + r.lang + " вместо " + L);
    if (r.wide) add("сломано", where, "страница шире экрана");
    if (!r.og || !r.desc || r.hreflang < 4) add("мелочь", where, "мета/OG/hreflang неполные");
    if (r.waBad.length) add("сломано", where, "кривые ссылки WhatsApp: " + r.waBad.slice(0, 3).join(" "));
    if (r.mail.some((m) => !/skiyar\.technologies@gmail\.com/.test(m))) add("сломано", where, "чужая почта: " + r.mail.join(" "));
    if (r.empty.length) add("мелочь", where, "ссылки без адреса: " + r.empty.slice(0, 5).join(" | "));
    if (r.emptyText.length) add("сломано", where, "пустые тексты: " + r.emptyText.join(", "));
    if (r.imgBroken.length) add("сломано", where, "картинки не грузятся: " + r.imgBroken.join(" "));
    if (r.menuOpens === false) add("сломано", where, "меню не открывается");
    if (r.liveSteps && !(r.liveSteps[2] && r.liveSteps[1] !== r.liveSteps[0])) add("мешает", where, "живой телефон не анимируется: " + JSON.stringify(r.liveSteps));
    if (r.tyWa && !/%D0%94%D0%95%D0%9C%D0%9E|DEMO|%D4%B4%D4%B5%D5%84%D5%88/.test(r.tyWa)) add("мешает", where, "ДЕМО-сообщение без слова ДЕМО");
    if (r.tyWa && !/%D0%A1%D0%B0%D0%BB%D0%BE%D0%BD/.test(r.tyWa)) add("сломано", where, "название не попадает в сообщение ДЕМО");
    if (W === 375) await shot(`${(p || "home").replace(/\W+/g, "_")}-${L}-375.png`);
    console.log(where, JSON.stringify({ lang: r.lang, wa: r.wa.length, menu: r.menuOpens, live: r.liveSteps, tyOpen: r.tyOpen, pv: r.pvName, url: r.pvUrl, year: r.yearPrice, calc: r.calc }));
  }
}
// демо по ссылкам с ?name=
for (const d of ["salon/", "nails/", "barber/", "hotel/", "restaurant/", "restaurant/menu.html", "start/", "reminder/"]) {
  for (const L of ["hy", "ru", "en"]) {
    const url = `${BASE}/demo/${d}?name=${encodeURIComponent("Салон Гоар")}&city=Yerevan&lang=${L}`;
    await open(url, 375);
    const r = await ev(`(function(){return {lang:document.documentElement.lang, hasName:document.body.innerText.indexOf('Салон Гоар')>=0, wide:document.documentElement.scrollWidth>document.documentElement.clientWidth+1, bar:!!document.getElementById('skiyar-bar'), barHref:(document.querySelector('#skiyar-bar a')||{}).href||''}})()`);
    if (r.lang !== L) add("сломано", "demo/" + d + " " + L, "язык " + r.lang);
    if (!r.hasName) add("сломано", "demo/" + d + " " + L, "название из ?name= не подставилось");
    if (r.wide) add("сломано", "demo/" + d + " " + L, "шире экрана");
    if (!/wa\.me\/37498337187/.test(r.barHref)) add("мешает", "demo/" + d + " " + L, "плашка SKIYAR без ссылки на наш WhatsApp");
    if (L === "ru") await shot(`demo-${d.replace(/\W+/g, "_")}-ru-375.png`);
  }
}
// 404
for (const p of ["nope-xyz", "ru/nope", "en/missing"]) {
  await open(`${BASE}/${p}`, 375);
  const r = await ev(`(function(){return {lang:document.documentElement.lang, h:(document.querySelector('h1')||{}).textContent, home:(document.getElementById('home')||{}).getAttribute&&document.getElementById('home').getAttribute('href')}})()`);
  if (!r.h) add("сломано", "404 " + p, "нет своей страницы 404");
  console.log("404", p, JSON.stringify(r));
}
await shot("404-375.png");
writeFileSync(join(OUT, "audit.json"), JSON.stringify(issues, null, 1));
const by = (s) => issues.filter((i) => i.sev === s);
console.log(`\nсломано: ${by("сломано").length}, мешает: ${by("мешает").length}, мелочи: ${by("мелочь").length}`);
for (const i of issues.slice(0, 40)) console.log(" -", i.sev, "|", i.where, "|", i.what);
ws.close(); ch.kill(); process.exit(0);
