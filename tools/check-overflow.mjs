// Ищет текст, который уезжает за край экрана или своей карточки: node tools/check-overflow.mjs [база]
// Открывает страницы в Chrome без окна на 375 и 1440 px и проверяет каждый текстовый элемент.
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const BASE = process.argv[2] || "http://127.0.0.1:8350";
const PAGES = ["/", "/ru/", "/en/", "/packages.html", "/ru/packages.html", "/en/packages.html", "/404.html", "/hotel.html", "/ru/hotel.html", "/en/hotel.html", "/ru/clinic.html", "/courses.html", "/en/realty.html", "/ru/repair.html", "/ru/salon.html", "/restaurant.html", "/ru/restaurant.html", "/en/restaurant.html", "/autoservice.html", "/ru/autoservice.html", "/en/autoservice.html"];
const port = 9500 + Math.floor(Math.random() * 300);
const ch = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "o-"))}`, "about:blank"], { stdio: "ignore" });
const sl = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 50 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} await sl(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const P = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (P.has(m.id)) { P.get(m.id)(m); P.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send("Runtime.evaluate", { expression: x, returnByValue: true })).result.result.value;
let bad = 0;
for (const W of (process.env.WIDTHS ? process.env.WIDTHS.split(",").map(Number) : [375, 1440])) {
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 768 });
  for (const p of PAGES) {
    await send("Page.navigate", { url: BASE + p }); await sl(2200);
    const r = await ev(`(function(){
      document.querySelectorAll('.rv').forEach(function(e){e.classList.add('rv-in')});
      var out=[], vw=document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth>vw+1) out.push('страница шире экрана: '+document.documentElement.scrollWidth);
      document.querySelectorAll('main p, main h1, main h2, main h3, main li, main td, main th, main small, main a, footer p, footer a').forEach(function(el){
        if (!el.textContent.trim() || el.closest('[aria-hidden=true], .st-stage, .live, .phone, .lv-phone')) return;
        var cs=getComputedStyle(el); if (cs.display==='none'||cs.visibility==='hidden') return;
        if (el.closest('.in-tabs, .tw')) return; // ленты с прокруткой
        var r=el.getBoundingClientRect(); if (!r.width) return;
        var over = el.scrollWidth > el.clientWidth + 2 && cs.overflow==='visible' && cs.display!=='inline';
        if (r.right > vw + 1 || over) out.push((r.right>vw+1?'за краем экрана':'не влезает')+': '+el.tagName+' «'+el.textContent.trim().slice(0,50)+'»');
      });
      return out.slice(0,8);
    })()`);
    if (r.length) { bad += r.length; console.log(W + "px " + p); r.forEach((x) => console.log("   " + x)); }
  }
}
console.log(bad ? `найдено: ${bad}` : "текст нигде не уезжает (375 и 1440 px)");
ws.close(); ch.kill(); process.exit(0);
