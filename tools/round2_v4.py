"""Второй круг (24.11.2026, docs/site-round2-plan.md): живой телефон в первом экране, блок «Как было у Гора»,
появление при прокрутке. Одноразовый скрипт правки исходников src/."""
import os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

def sub(path, pairs):
    s = open(path, encoding="utf-8").read()
    for a, b in pairs:
        assert s.count(a) == 1, (path, a[:70])
        s = s.replace(a, b)
    open(path, "w", encoding="utf-8").write(s)

def add_keys(path, adds):
    s = open(path, encoding="utf-8").read()
    for lang, txt in adds.items():
        m = re.search(r"\n  ?  ?%s: \{\n" % lang, s)
        assert m, (path, lang)
        s = s[:m.end()] + "    " + txt + "\n" + s[m.end():]
    open(path, "w", encoding="utf-8").write(s)

# ── 1. Живой телефон вместо «ночной» карточки ──
h = open("src/home.html", encoding="utf-8").read()
i = h.index('    <div class="night" aria-hidden="true">')
j = h.index('<p class="closed" data-t="bNote"></p>\n    </div>', i) + len('<p class="closed" data-t="bNote"></p>\n    </div>')
LIVE = '''    <div class="live" id="live" aria-label="" data-t-aria="lpAria">
      <div class="lv-toast" data-step="4"><b data-t="lpToastT"></b><small data-t="lpToastS"></small></div>
      <div class="lv-phone">
        <div class="lv-screen">
          <div class="lv-sb"><span class="lv-time">23:47</span><span aria-hidden="true">●●●</span></div>
          <div class="lv-hd"><span class="lv-av" aria-hidden="true">L</span><div><b>Liora Beauty</b><small>Instagram</small></div></div>
          <div class="lv-body">
            <div class="lv-m lv-out" data-step="0" data-t="lpMsg"></div>
            <div class="lv-typing" data-step="1" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="lv-m lv-in" data-step="2"><span class="lv-lbl" data-t="lpAuto"></span><span data-t="lpAutoT"></span><span class="lv-btn" data-t="lpBtn"></span></div>
            <div class="lv-m lv-ok" data-step="3"><i aria-hidden="true"></i><span data-t="lpOk"></span></div>
          </div>
        </div>
      </div>
      <ol class="lv-dots" aria-hidden="true"><li></li><li></li><li></li><li></li></ol>
    </div>'''
h = h[:i] + LIVE + h[j:]
open("src/home.html", "w", encoding="utf-8").write(h)
add_keys("src/text/hero.js", {
 "hy": 'lpAria: "Օրինակ. հաճախորդը գրում է 23:47-ին և ինքն է գրանցվում", lpMsg: "Բարև ձեզ, ուրբաթ օրը մատնահարդարման ազատ ժամ կա՞", lpAuto: "Ավտոպատասխան · 23:47", lpAutoT: "Հիմա փակ ենք, բայց ազատ ժամերը կարող եք տեսնել այստեղ", lpBtn: "Գրանցվել առցանց", lpOk: "Գրանցում՝ ուրբաթ 11:00, Նարինե", lpToastT: "Հիշեցումն ուղարկված է", lpToastS: "Հինգշաբթի 18:00, Ռուզանը պատասխանեց՝ «Կգամ»",',
 "ru": 'lpAria: "Пример: клиентка пишет в 23:47 и записывается сама", lpMsg: "Здравствуйте, на маникюр в пятницу есть время?", lpAuto: "Автоответ · 23:47", lpAutoT: "Сейчас закрыты, но свободное время видно здесь", lpBtn: "Записаться онлайн", lpOk: "Запись: пятница 11:00, Нарине", lpToastT: "Напоминание отправлено", lpToastS: "Четверг 18:00, Рузан ответила «Приду»",',
 "en": 'lpAria: "Example: a client writes at 23:47 and books herself", lpMsg: "Hi, any time for a manicure on Friday?", lpAuto: "Auto-reply · 23:47", lpAutoT: "We’re closed now, but you can see free times here", lpBtn: "Book online", lpOk: "Booked: Friday 11:00, Narine", lpToastT: "Reminder sent", lpToastS: "Thursday 18:00, Ruzan replied “I’ll be there”",',
})

# ── 2. «Как было у Гора / как стало» — после истории ──
GOR = '''
<section class="gor" id="gor">
  <div class="wrap">
    <h2 data-t="grTitle"></h2>
    <p class="lead" data-t="grSub"></p>
    <div class="gr-grid">
      <article class="gr-col gr-was">
        <span class="gr-k" data-t="grWasK"></span>
        <h3 data-t="grWasT"></h3>
        <div class="gr-cnt"><div><b>2</b><span data-t="grW1"></span></div><div><b>14</b><span data-t="grW2"></span></div><div><b>3</b><span data-t="grW3"></span></div></div>
        <div class="gr-scene"><img class="px gr-px" src="../assets/img/px/gor-panic.png" width="70" height="147" alt="" data-t-alt="grAltWas" loading="lazy">
          <div class="gr-note" aria-hidden="true"><span data-t="grN1"></span><span><span data-t="grN2a"></span> <s data-t="grN2b"></s> <em>?!</em></span><span data-t="grN3"></span><span data-t="grN4"></span></div></div>
      </article>
      <article class="gr-col gr-now">
        <span class="gr-k" data-t="grNowK"></span>
        <h3 data-t="grNowT"></h3>
        <div class="gr-cnt"><div><b>0</b><span data-t="grS1"></span></div><div><b>23:47</b><span data-t="grS2"></span></div><div><b>18:00</b><span data-t="grS3"></span></div></div>
        <div class="gr-scene"><img class="px gr-px" src="../assets/img/px/gor-joy.png" width="84" height="142" alt="" data-t-alt="grAltNow" loading="lazy">
          <div class="gr-cal" aria-hidden="true"><b data-t="grCalT"></b><div><span>11:00</span><em data-t="grC1"></em></div><div class="hot"><span>15:00</span><em data-t="grC2"></em></div><div><span>16:30</span><em data-t="grC3"></em></div></div></div>
      </article>
    </div>
    <p class="gr-foot" data-t="grFoot"></p>
  </div>
</section>
'''
h = open("src/home.html", encoding="utf-8").read()
k = h.index('<section class="bento"')
h = h[:k] + GOR.lstrip("\n") + "\n" + h[k:]
h = h.replace('<link rel="stylesheet" href="../assets/v3.css">', '<link rel="stylesheet" href="../assets/v3.css">\n<link rel="stylesheet" href="../assets/v4.css">')
h = h.replace('<script src="text/end.js"></script>', '<script src="text/end.js"></script>\n<script src="text/gor.js"></script>')
h = h.replace('<script src="../assets/fab.js"></script>', '<script src="../assets/fab.js"></script>\n<script src="../assets/live.js"></script>\n<script src="../assets/reveal.js"></script>')
open("src/home.html", "w", encoding="utf-8").write(h)
p = open("src/packages.html", encoding="utf-8").read()
p = p.replace('<link rel="stylesheet" href="../assets/v3.css">', '<link rel="stylesheet" href="../assets/v3.css">\n<link rel="stylesheet" href="../assets/v4.css">')
p = p.replace('<script src="../assets/fab.js"></script>', '<script src="../assets/fab.js"></script>\n<script src="../assets/reveal.js"></script>')
open("src/packages.html", "w", encoding="utf-8").write(p)

open("src/text/gor.js", "w", encoding="utf-8").write('''/* Тексты блока «Как было у Гора / как стало». Гор — герой наших роликов (лист: social/out/pixel/gor-sheet.png).
   Цифры «было» — сценка из роликов, не статистика клиента (так и подписано). HY — на проверку Ани. */
(function () {
  var G = {
    hy: {
      grTitle: "Ինչպես էր Գորի մոտ, և ինչպես դարձավ", grSub: "Նույն սրահը, նույն վարպետները։ Տարբերությունը՝ մեկ շաբաթ։",
      grWasK: "Առաջ՝ տետր", grWasT: "Գրանցումը տետրում, հեռախոսը՝ մինչև գիշեր",
      grW1: "հաճախորդ 15:00-ին", grW2: "նամակ առանց պատասխանի", grW3: "չեկած շաբաթում",
      grN1: "Ուրբ 15:00 — Աննա", grN2a: "Ուրբ 15:00 —", grN2b: "Մարի", grN3: "Շբթ 11:00 — ???", grN4: "հետ զանգել՝ 6 հոգու",
      grNowK: "Հիմա՝ SKIYAR Online", grNowT: "Հաճախորդները գրանցվում են ինքնուրույն, հիշեցումը գնում է ինքը",
      grS1: "կրկնակի գրանցում", grS2: "գրանցումը եկավ գիշերը", grS3: "հիշեցում նախորդ օրը",
      grCalT: "Ուրբաթ, Նարինե", grC1: "Ռուզան, կայքից", grC2: "Աննա, հաստատեց", grC3: "Ազատ",
      grAltWas: "Գորը խուճապի մեջ է՝ տետրում երկու հաճախորդ նույն ժամին", grAltNow: "Գորը ուրախ է՝ գրանցումները հավաքվում են ինքնուրույն",
      grFoot: "«Առաջ» թվերը տեսարան են մեր տեսանյութերից, ոչ թե հաճախորդի վիճակագրություն։"
    },
    ru: {
      grTitle: "Как было у Гора и как стало", grSub: "Тот же салон, те же мастера. Разница — одна неделя.",
      grWasK: "Было: тетрадка", grWasT: "Запись в тетрадке, телефон до ночи",
      grW1: "клиента на 15:00", grW2: "сообщений без ответа", grW3: "неявки за неделю",
      grN1: "Пт 15:00 — Анна", grN2a: "Пт 15:00 —", grN2b: "Мари", grN3: "Сб 11:00 — ???", grN4: "перезвонить: 6 чел.",
      grNowK: "Стало: SKIYAR Online", grNowT: "Клиенты записываются сами, напоминание уходит само",
      grS1: "двойных записей", grS2: "запись пришла ночью", grS3: "напоминание накануне",
      grCalT: "Пятница, Нарине", grC1: "Рузан, с сайта", grC2: "Анна, подтвердила", grC3: "Свободно",
      grAltWas: "Гор в панике: в тетрадке два клиента на одно время", grAltNow: "Гор радуется: записи собираются сами",
      grFoot: "Цифры «было» — сценка из наших роликов, не статистика клиента."
    },
    en: {
      grTitle: "How it was for Gor, and how it is now", grSub: "Same salon, same masters. The difference is one week.",
      grWasK: "Before: the notebook", grWasT: "Bookings in a notebook, the phone ringing till midnight",
      grW1: "clients at 15:00", grW2: "unanswered messages", grW3: "no-shows a week",
      grN1: "Fri 15:00 — Anna", grN2a: "Fri 15:00 —", grN2b: "Mari", grN3: "Sat 11:00 — ???", grN4: "call back: 6 people",
      grNowK: "Now: SKIYAR Online", grNowT: "Clients book themselves, reminders go out on their own",
      grS1: "double bookings", grS2: "a booking came in at night", grS3: "reminder the day before",
      grCalT: "Friday, Narine", grC1: "Ruzan, from the site", grC2: "Anna, confirmed", grC3: "Free",
      grAltWas: "Gor panicking: two clients at the same time in the notebook", grAltNow: "Gor happy: bookings collect themselves",
      grFoot: "The “before” numbers are a scene from our videos, not client statistics."
    }
  };
  for (var l in G) for (var k in G[l]) window.T[l][k] = G[l][k];
})();
''')
b = open("tools/build.mjs", encoding="utf-8").read()
b = b.replace('text: ["hero", "story", "bento", "try", "ind", "calc", "pk", "end"],', 'text: ["hero", "story", "gor", "bento", "try", "ind", "calc", "pk", "end"],')
b = b.replace('"pk", "end", "v3"]', '"pk", "end", "v3", "v4"]').replace('"pkpage", "v3"]', '"pkpage", "v3", "v4"]')
b = b.replace('js: ["site", "story", "try", "ind", "calc", "pk", "fab"],', 'js: ["site", "story", "try", "ind", "calc", "pk", "fab", "live", "reveal"],')
b = b.replace('js: ["site", "pk", "fab"],', 'js: ["site", "pk", "fab", "reveal"],')
assert b.count('"v4"') == 2 and '"live", "reveal"' in b and '"gor", "bento"' in b
open("tools/build.mjs", "w", encoding="utf-8").write(b)
print("ok")
