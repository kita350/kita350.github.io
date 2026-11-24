// Замер плавности прокрутки на «телефоне»: node tools/scroll-perf.mjs <url> [cpu=6] [прогонов=2]
// 375×812, мобильная эмуляция, замедление процессора, прокрутка жестом сверху вниз.
// Считает: кадры (средний FPS, доля кадров > 50 мс), длинные задачи, сдвиги раскладки во время прокрутки.
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const [url, cpu = "6", runs = "2"] = process.argv.slice(2);
const port = 9400 + Math.floor(Math.random() * 90);
const ch = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "p-"))}`, "about:blank"], { stdio: "ignore" });
const sl = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 60 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((x) => x.type === "page"); } catch {} await sl(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const P = new Map(); ws.onmessage = (e) => { const m = JSON.parse(e.data); if (P.has(m.id)) { P.get(m.id)(m); P.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (x) => (await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true })).result.result.value;
await send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
const res = [];
for (let r = 0; r < +runs; r++) {
  await send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await send("Page.navigate", { url }); await sl(4000);
  await send("Emulation.setCPUThrottlingRate", { rate: +cpu });
  await ev(`(function(){window.__f=[];window.__lt=[];window.__ls=0;window.__on=true;
    var last=performance.now();(function loop(t){if(!window.__on)return;window.__f.push(t-last);last=t;requestAnimationFrame(loop)})(last);
    new PerformanceObserver(function(l){l.getEntries().forEach(function(e){window.__lt.push(Math.round(e.duration))})}).observe({type:'longtask',buffered:false});
    new PerformanceObserver(function(l){l.getEntries().forEach(function(e){window.__ls+=e.value})}).observe({type:'layout-shift',buffered:false});
    return 1})()`);
  await send("Performance.enable");
  const m0 = Object.fromEntries((await send("Performance.getMetrics")).result.metrics.map((m) => [m.name, m.value]));
  const H = await ev("document.documentElement.scrollHeight");
  // несколько свайпов вниз, как пальцем
  // прокрутка без мыши (как пальцем — без :hover): 1600 px/с по кадрам
  await ev(`new Promise(function(res){var t0=performance.now(),y0=scrollY;(function st(t){var y=y0+(t-t0)*1.6;window.scrollTo(0,y);if(y<${H}-812)requestAnimationFrame(st);else res(1)})(t0)})`);
  await sl(500);
  const o = await ev(`(function(){window.__on=false;var f=window.__f.slice(2);var tot=f.reduce(function(a,b){return a+b},0);
    return {frames:f.length, fps:Math.round(f.length/(tot/1000)*10)/10, slow:f.filter(function(x){return x>50}).length, worst:Math.round(Math.max.apply(null,f)), lt:window.__lt.length, ltSum:window.__lt.reduce(function(a,b){return a+b},0), ltMax:Math.max.apply(null,window.__lt.concat([0])), cls:Math.round(window.__ls*1000)/1000, y:Math.round(scrollY)}})()`);
  const m1 = Object.fromEntries((await send("Performance.getMetrics")).result.metrics.map((m) => [m.name, m.value]));
  const d = (k) => Math.round((m1[k] - m0[k]) * (k.endsWith("Duration") ? 1000 : 1));
  o.main = { layouts: d("LayoutCount"), layoutMs: d("LayoutDuration"), styles: d("RecalcStyleCount"), styleMs: d("RecalcStyleDuration"), scriptMs: d("ScriptDuration"), taskMs: d("TaskDuration") };
  res.push(o);
}
console.log(url, "cpu " + cpu + "x");
for (const o of res) console.log(`  FPS ${o.fps} | кадров ${o.frames}, медленных (>50мс) ${o.slow}, худший ${o.worst} мс | длинных задач ${o.lt} (сумма ${o.ltSum} мс, макс ${o.ltMax}) | сдвиги ${o.cls} | доскроллил до ${o.y}
    главный поток: раскладок ${o.main.layouts} (${o.main.layoutMs} мс), пересчётов стилей ${o.main.styles} (${o.main.styleMs} мс), скрипты ${o.main.scriptMs} мс, всего задач ${o.main.taskMs} мс`);
ws.close(); ch.kill(); process.exit(0);
