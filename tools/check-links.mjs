// Проверка ссылок собранного сайта на локальном сервере: node tools/check-links.mjs [http://127.0.0.1:8350]
// Обходит главные страницы и демо, проверяет внутренние ссылки, картинки, стили и скрипты (код 200).
const BASE = process.argv[2] || "http://127.0.0.1:8350";
const START = ["/", "/ru/", "/en/", "/packages.html", "/ru/packages.html", "/en/packages.html", "/privacy.html", "/hotel.html", "/ru/clinic.html", "/en/courses.html", "/realty.html", "/ru/repair.html", "/ru/salon.html", "/ru/restaurant.html", "/en/autoservice.html", "/autoservice.html", "/ru/autoservice.html", "/restaurant.html",
  "/demo/salon/", "/demo/nails/", "/demo/barber/", "/demo/hotel/", "/demo/restaurant/", "/demo/restaurant/menu.html", "/demo/start/", "/demo/reminder/", "/demo/auto/", "/demo/clinic/", "/demo/courses/", "/demo/realty/", "/demo/repair/"];
const seen = new Map();
const bad = [];
async function status(u) {
  if (seen.has(u)) return seen.get(u);
  const p = fetch(u, { redirect: "follow" }).then((r) => r.status).catch(() => 0);
  seen.set(u, p);
  return p;
}
for (const page of START) {
  const url = BASE + page;
  const st = await status(url);
  if (st !== 200) { bad.push(`${st} ${page}`); continue; }
  const html = await (await fetch(url)).text();
  const refs = [...html.matchAll(/\s(?:href|src)="([^"#][^"]*)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    const abs = new URL(ref.replace(/&amp;/g, "&"), url).href.split("#")[0];
    const s = await status(abs);
    if (s !== 200) bad.push(`${s} ${abs.replace(BASE, "")} ← ${page}`);
  }
}
console.log(`проверено адресов: ${seen.size}`);
console.log(bad.length ? "ОШИБКИ:\n" + [...new Set(bad)].join("\n") : "все внутренние ссылки отвечают 200");
