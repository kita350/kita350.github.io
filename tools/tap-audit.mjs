// Аудит «как клиент с телефона»: node tools/tap-audit.mjs [база] [inapp]
// Ширины 360/375/390/414/768/1440; страница шире экрана, ошибки консоли/сети, кнопки и ссылки меньше 44 px по высоте,
// перекрытие кнопок плавающей кнопкой WhatsApp, обрезанный текст. inapp — UA Instagram и высота окна 640.
import { spawn } from "node:child_process"; import { mkdtempSync } from "node:fs"; import { tmpdir } from "node:os"; import { join } from "node:path";
const BASE = process.argv[2] || "http://127.0.0.1:8350"; const INAPP = process.argv[3] === "inapp";
const port = 9200 + Math.floor(Math.random() * 90);
const ch = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "t-"))}`, "about:blank"], { stdio: "ignore" });
const sl = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 60 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} await sl(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const P = new Map(); const evs = []; ws.onmessage = (e) => { const m = JSON.parse(e.data); if (P.has(m.id)) { P.get(m.id)(m); P.delete(m.id); } else if (m.method) evs.push(m); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true })).result.result.value;
await send("Runtime.enable"); await send("Log.enable"); await send("Network.enable");
if (INAPP) await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0" });
const PAGES = ["/", "/ru/", "/en/", "/packages.html", "/ru/packages.html", "/en/packages.html", "/404.html", "/ru/demo-x-404"];
const WIDTHS = INAPP ? [375] : [360, 375, 390, 414, 768, 1440];
let total = 0;
for (const W of WIDTHS) for (const p of PAGES) {
  const H = INAPP ? 640 : (W < 768 ? 800 : 900);
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 768 });
  evs.length = 0; await send("Page.navigate", { url: BASE + p }); await sl(2500);
  const r = await ev(`(async function(){
    var out=[], vw=document.documentElement.clientWidth;
    document.querySelectorAll('.rv').forEach(function(e){e.classList.add('rv-in')});
    if (document.documentElement.scrollWidth>vw+1) out.push('шире экрана '+document.documentElement.scrollWidth);
    var fab=document.getElementById('fab');
    var H=document.documentElement.scrollHeight;
    for (var y=0;y<H;y+=innerHeight*0.8){ window.scrollTo(0,y); await new Promise(function(r){setTimeout(r,60)});
      var fr=fab&&getComputedStyle(fab).display!=='none'?fab.getBoundingClientRect():null;
      document.querySelectorAll('a[href],button,input,summary,select,[role=tab]').forEach(function(el){
        var cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden'||el.closest('[aria-hidden=true],.st-stage .phone,.lv-phone,.fab')) return;
        var b=el.getBoundingClientRect(); if(!b.width||b.bottom<0||b.top>innerHeight) return;
        var inline = cs.display==='inline' && el.closest('p,li,td');
        if(!el.__chk){ el.__chk=1;
          if(b.height<44 && b.width<44 && !inline) out.push('мелкая цель '+Math.round(b.width)+'×'+Math.round(b.height)+': '+(el.tagName+'.'+(el.className||'')).slice(0,40)+' «'+(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,24)+'»');
          else if(b.height<32 && !inline && el.tagName!=='INPUT') out.push('низкая цель '+Math.round(b.height)+'px: '+(el.tagName+'.'+(el.className||'')).slice(0,40)+' «'+(el.textContent||'').trim().slice(0,24)+'»');
        }
        if(fr && el.tagName!=='A'?false:fr && el.classList.contains('btn')){ var ov=Math.min(b.right,fr.right)-Math.max(b.left,fr.left), oh=Math.min(b.bottom,fr.bottom)-Math.max(b.top,fr.top);
          if(ov>8&&oh>8&&!el.__fab){el.__fab=1; out.push('кнопка WhatsApp закрывает: «'+el.textContent.trim().slice(0,30)+'»')} }
      });
    }
    window.scrollTo(0,0);
    return out;
  })()`);
  const errs = evs.filter((e) => e.method === "Runtime.exceptionThrown" || (e.method === "Log.entryAdded" && e.params.entry.level === "error" && !/404/.test(e.params.entry.text)) || (e.method === "Network.responseReceived" && e.params.response.status >= 400 && !/404|demo-x/.test(p + e.params.response.url))).map((e) => "ОШИБКА " + JSON.stringify(e.params.exceptionDetails?.exception?.description || e.params.entry?.text || (e.params.response && e.params.response.status + " " + e.params.response.url)).slice(0, 150));
  const all = [...new Set([...errs, ...r])];
  if (all.length) { total += all.length; console.log(`${W}px ${p}`); all.slice(0, 14).forEach((x) => console.log("   " + x)); if (all.length > 14) console.log("   … ещё " + (all.length - 14)); }
}
console.log(total ? "замечаний: " + total : "замечаний нет");
ws.close(); ch.kill(); process.exit(0);
