"""Редизайн v3 (24.11.2026, docs/site-redesign-proposal.md): шапка с ДЕМО, пакеты бенто-сеткой,
призыв ДЕМО, микроанимация кнопок, без «↗», новый подвал. Одноразовый скрипт правки исходников src/."""
import os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
NB = " "

def sub(path, pairs, many=False):
    s = open(path, encoding="utf-8").read()
    for a, b in pairs:
        n = s.count(a)
        assert n >= 1 and (many or n == 1), (path, a[:70], n)
        s = s.replace(a, b)
    open(path, "w", encoding="utf-8").write(s)

def add_keys(path, adds):
    """adds: {lang: 'key: "v", ...'} — вставка сразу после «lang: {»"""
    s = open(path, encoding="utf-8").read()
    for lang, txt in adds.items():
        m = re.search(r"\n    %s: \{\n" % lang, s)
        assert m, (path, lang)
        s = s[:m.end()] + "      " + txt + "\n" + s[m.end():]
    open(path, "w", encoding="utf-8").write(s)

# ───── 1. Шапка ─────
NAV = '''<header class="nav" id="nav">
  <div class="wrap">
    <a class="logo" href="LOGO"><i>S</i>SKIYAR</a>
    <div class="nav-panel" id="navPanel">
      <nav class="nav-links"><a href="PKS" data-t="navPk"></a><a href="DEMOS" data-t="navDemo"></a><a href="FAQ" data-t="navFaq"></a></nav>
      <div class="langs" role="group" data-t-aria="langAria">
        <button type="button" data-lang-btn="hy">Հայ</button><button type="button" data-lang-btn="ru">Рус</button><button type="button" data-lang-btn="en">Eng</button>
      </div>
    </div>
    <span class="nav-clock" aria-hidden="true">23:47</span>
    <a class="nav-demo" target="_blank" rel="noopener" data-wa="waHello" data-t="navCta"></a>
    <button type="button" class="nav-burger" aria-expanded="false" aria-controls="navPanel" data-t-aria="menuAria"><i></i></button>
  </div>
</header>'''
for f, logo, pks, demos, faq in [("src/home.html", "#", "#packages", "#demos", "#faq"),
                                  ("src/packages.html", "index.html", "#packages", "../src/home.html#demos", "../src/home.html#faq")]:
    s = open(f, encoding="utf-8").read()
    i = s.index('<header class="nav">'); j = s.index("</header>", i) + 9
    s = s[:i] + NAV.replace("LOGO", logo).replace("PKS", pks).replace("DEMOS", demos).replace("FAQ", faq) + s[j:]
    open(f, "w", encoding="utf-8").write(s)

sub("src/text/hero.js", [
    ('navCta: "Ստանալ օրինակ",', 'navCta: "ԴԵՄՈ", menuAria: "Մենյու",'),
    ('navCta: "Получить пример",', 'navCta: "ДЕМО", menuAria: "Меню",'),
    ('navCta: "Get a sample",', 'navCta: "DEMO", menuAria: "Menu",'),
    ('cta1: "Ստանալ օրինակ անվճար"', 'cta1: "Գրել ԴԵՄՈ"'),
    ('cta1: "Получить пример бесплатно"', 'cta1: "Написать ДЕМО"'),
    ('cta1: "Get a free sample"', 'cta1: "Send DEMO"'),
    ('waHello: "Բարև ձեզ։ Ուզում եմ անվճար օրինակ իմ բիզնեսի անունով։"', 'waHello: "ԴԵՄՈ\\nԲարև ձեզ։ Ուզում եմ կայքի օրինակ իմ բիզնեսի անունով։ Անունը՝ "'),
    ('waHello: "Здравствуйте! Хочу бесплатный пример с названием моего бизнеса."', 'waHello: "ДЕМО\\nЗдравствуйте! Хочу пример сайта с названием моего бизнеса. Название: "'),
    ("waHello: \"Hello! I'd like a free sample with my business name.\"", "waHello: \"DEMO\\nHello! I'd like a sample site with my business name. Name: \""),
])

# ───── 2. Призыв ДЕМО (блок «Ваш сайт с вашим названием») ─────
sub("src/home.html", [
    ('''      <label for="tyName" data-t="tyName"></label>
      <input class="ty-input" id="tyName" name="name" type="text" maxlength="60" data-t-ph="tyPh" enterkeyhint="go" spellcheck="false">''',
     '''      <p class="ty-kw"><b data-t="navCta"></b><span data-t="tyKwAlt"></span></p>
      <label for="tyName" data-t="tyName"></label>
      <div class="ty-claim"><span class="ty-pre" data-t="navCta" aria-hidden="true"></span><input class="ty-input" id="tyName" name="name" type="text" maxlength="60" data-t-ph="tyPh" enterkeyhint="send" spellcheck="false"></div>'''),
    ('''        <a class="btn btn-main" id="tyOpen" target="_blank" rel="noopener" data-t="tyOpen"></a>
        <a class="btn btn-line" id="tyWa" target="_blank" rel="noopener" data-t="tyWa"></a>
      </div>
      <p class="ty-note" data-t="tyNote"></p>''',
     '''        <a class="btn btn-main" id="tyWa" target="_blank" rel="noopener"><span data-t="tyWa"></span><small data-t="tyWaS"></small></a>
        <a class="btn btn-line" id="tyOpen" target="_blank" rel="noopener" data-t="tyOpen"></a>
      </div>
      <ol class="ty-steps"><li data-t="tyS1"></li><li data-t="tyS2"></li><li data-t="tyS3"></li></ol>
      <p class="ty-ig"><span data-t="tyIg"></span> <a href="https://www.instagram.com/skiyar_technologies/" target="_blank" rel="noopener">@skiyar_technologies</a></p>
      <p class="ty-note" data-t="tyNote"></p>'''),
])
T = {
 "hy": [('tyTitle: "Ձեր կայքը՝ ձեր անունով"', 'tyTitle: "Կուղարկենք ձեր բիզնեսի կայքը"'),
        ('tySub: "Գրեք բիզնեսի անունը, ընտրեք տեսակը և բացեք օրինակը՝ արդեն ձեր անունով։"', 'tySub: "Մեկ բառ՝ ԴԵՄՈ, և ձեր բիզնեսի անունը։ Մեկ օրում կուղարկենք կայքի օրինակ ձեր անունով։ Անվճար։"'),
        ('tyOpen: "Բացել օրինակը", tyWa: "Գրել WhatsApp-ով", tyWaMsg: "Բարև ձեզ։ Տեսա կայքի օրինակը{for}։ Ուզում եմ իմանալ գինը և ժամկետը։"',
         'tyOpen: "Դիտել օրինակը հիմա", tyWa: "Ուղարկել WhatsApp-ով", tyWaS: "1 օրում", tyKwAlt: "ДЕМО · DEMO", tyS1: "Գրում եք ԴԵՄՈ և անունը", tyS2: "Անին կճշտի մանրամասները", tyS3: "Ստանում եք հղում ձեր կայքին", tyIg: "Կամ գրեք ԴԵՄՈ Instagram-ի դիրեկտ՝", tyWaMsg: "ԴԵՄՈ\\nԱնունը՝ {n}\\nՏեսակը՝ {k}"')],
 "ru": [('tyTitle: "Ваш сайт — с вашим названием"', 'tyTitle: "Пришлём сайт вашего бизнеса"'),
        ('tySub: "Напишите название, выберите тип бизнеса и откройте пример — уже с вашим названием."', 'tySub: "Одно слово — ДЕМО — и название. За день пришлём пример сайта с вашим названием. Бесплатно."'),
        ('tyOpen: "Открыть пример", tyWa: "Написать в WhatsApp", tyWaMsg: "Здравствуйте! Посмотрел(а) пример сайта{for}. Хочу узнать цену и сроки."',
         'tyOpen: "Посмотреть пример сейчас", tyWa: "Отправить в WhatsApp", tyWaS: "за 1 день", tyKwAlt: "ԴԵՄՈ · DEMO", tyS1: "Пишете ДЕМО и название", tyS2: "Ани уточнит детали", tyS3: "Получаете ссылку на ваш сайт", tyIg: "Или напишите ДЕМО в директ Instagram", tyWaMsg: "ДЕМО\\nНазвание: {n}\\nТип: {k}"')],
 "en": [('tyTitle: "Your site, with your name on it"', 'tyTitle: "We’ll send you your business’s site"'),
        ('tySub: "Type your business name, pick the type and open the sample — already with your name on it."', 'tySub: "One word — DEMO — and your business name. Within a day we’ll send a sample site with your name. Free."'),
        ('tyOpen: "Open the sample", tyWa: "Message on WhatsApp", tyWaMsg: "Hello! I saw the sample site{for}. I’d like to know the price and timing."',
         'tyOpen: "See a sample now", tyWa: "Send on WhatsApp", tyWaS: "within 1 day", tyKwAlt: "ԴԵՄՈ · ДЕМО", tyS1: "You send DEMO and your name", tyS2: "Ani checks the details", tyS3: "You get a link to your site", tyIg: "Or send DEMO in an Instagram DM", tyWaMsg: "DEMO\\nName: {n}\\nType: {k}"')],
}
for l, pairs in T.items():
    sub("src/text/try.js", pairs)
sub("assets/try.js", [
    ('    var forName = name ? t("tyFor").split("{name}").join(name) : "";\n    wa.href = window.SITE.wa(t("tyWaMsg").split("{for}").join(forName));',
     '    wa.href = window.SITE.wa(t("tyWaMsg").split("{n}").join(name || "—").split("{k}").join(t(k[0])));'),
    ('box.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); window.open(link.href, "_blank", "noopener"); });',
     'box.querySelector("form").addEventListener("submit", function (e) { e.preventDefault(); window.open(wa.href, "_blank", "noopener"); });'),
])

# ───── 3. Пакеты бенто-сеткой (только главная; на странице «Все пакеты» остаётся таблица) ─────
BENTO = f'''<section class="pk pkb" id="packages" data-sel="b" data-bill="m" data-taken="0">
  <div class="wrap">
    <div class="pk-head">
      <div><h2 data-t="pkTitle"></h2><p class="lead" data-t="pkSub"></p></div>
      <div class="bill" role="radiogroup" data-t-aria="pkBillAria">
        <button type="button" role="radio" data-bill="m" aria-checked="true" data-t="pkMonth"></button>
        <button type="button" role="radio" data-bill="y" aria-checked="false"><span data-t="pkYear"></span> <em data-t="pkSave"></em></button>
      </div>
    </div>
    <div class="pkb-grid">
      <article class="pkt pkt-on">
        <span class="main" data-t="pkMain"></span>
        <h3>SKIYAR Online</h3>
        <p data-t="pkbOnP"></p>
        <p class="pl-p" data-m="35 000" data-y="357 000"><span class="pl-x">35{NB}000</span>{NB}֏ <small data-per></small></p>
        <p class="pl-eq" data-eq="357 000"></p>
        <p class="pl-s" data-setup="50 000" data-free="1"></p>
        <p class="pl-y" data-first="35000,357000,50000"></p>
        <a class="btn btn-main" target="_blank" rel="noopener" data-wa="pkWaOn"><span data-t="pkbOnBtn"></span><small>WhatsApp</small></a>
      </article>
      <article class="pkt"><h3>Start</h3><p data-t="pkbStartP"></p><p class="pr">49{NB}000{NB}֏ <small data-t="pkOnce"></small></p><a class="pkt-a" href="../demo/start/" target="_blank" rel="noopener" data-t="pkStartDemo"></a></article>
      <article class="pkt pkt-ai"><span class="soon" data-t="pkPilotSoon"></span><h3>Online AI</h3><p data-t="pkbAiP"></p><p class="pl-p" data-m="60 000" data-y="612 000"><span class="pl-x">60{NB}000</span>{NB}֏ <small data-per></small></p></article>
      <article class="pkt pkt-g"><b>20</b><p data-t="pkbGuar"></p></article>
      <article class="pkt"><h3>AI Admin</h3><p data-t="pkbAaP"></p><p class="pl-p" data-m="40 000" data-y="408 000"><span class="pl-x">40{NB}000</span>{NB}֏ <small data-per></small></p></article>
      <article class="pkt"><h3 data-t="pkbOnceT"></h3><p data-t="pkbOnceP"></p><p class="pr"><span data-t="pkbFrom"></span></p><a class="pkt-a" href="packages.html#once" data-t="pkbMore"></a></article>
      <article class="pkt pkt-seats">
        <div><h3 data-t="pTitle"></h3><p class="left"><span class="seats" aria-hidden="true"></span><b id="pkLeft"></b></p><p data-t="pkbPilotP"></p></div>
        <a class="btn btn-line" target="_blank" rel="noopener" data-wa="pWa" data-t="pCta"></a>
      </article>
    </div>
    <p class="pk-rules"><span data-t="w1"></span> <span data-t="w2"></span> <span data-t="w3"></span></p>
    <p class="pk-min"><span data-t="pkMin"></span> <a href="packages.html" data-t="pkMore"></a></p>
  </div>
</section>'''
s = open("src/home.html", encoding="utf-8").read()
i = s.index('<section class="pk" id="packages"'); j = s.index("</section>", i) + 10
s = s[:i] + BENTO + s[j:]
open("src/home.html", "w", encoding="utf-8").write(s)
add_keys("src/text/pk.js", {
 "hy": 'pkbOnP: "Կայք, գրանցում 24/7, հիշեցումներ WhatsApp-ով և հաշվետվություն ամեն ամիս։", pkbOnBtn: "Ուզում եմ Online", pkbStartP: "Google քարտ և մեկ էջանոց կայք", pkbAiP: "ԱԲ-ն պատասխանում է հաճախորդներին", pkbGuar: "2 ամսում 20-ից քիչ գրանցո՞ւմ։ Երրորդ ամիսն անվճար է։", pkbAaP: "Եթե կայք արդեն ունեք․ նվազագույնը 6 ամիս", pkbOnceT: "Միանվագ", pkbOnceP: "Site, Site Pro, ռեստորան, Shop", pkbFrom: "120' + NB + '000 ֏-ից", pkbMore: "Բոլոր գները", pkbPilotP: "Միացումն անվճար, առաջին ամիսը՝ գործարկումից հետո",',
 "ru": 'pkbOnP: "Сайт, запись 24/7, напоминания в WhatsApp и отчёт каждый месяц.", pkbOnBtn: "Хочу Online", pkbStartP: "Карточка Google и одна страница", pkbAiP: "ИИ отвечает клиентам", pkbGuar: "Меньше 20 записей за 2 месяца? Третий месяц бесплатно.", pkbAaP: "Если сайт уже есть; минимум 6 месяцев", pkbOnceT: "Разово", pkbOnceP: "Site, Site Pro, ресторан, Shop", pkbFrom: "от 120' + NB + '000 ֏", pkbMore: "Все цены", pkbPilotP: "Подключение бесплатно, первый месяц — после запуска",',
 "en": 'pkbOnP: "Website, 24/7 booking, WhatsApp reminders and a monthly report.", pkbOnBtn: "I want Online", pkbStartP: "Google listing and a one-page site", pkbAiP: "AI replies to clients", pkbGuar: "Fewer than 20 bookings in 2 months? Month 3 is free.", pkbAaP: "If you already have a site; 6 months minimum", pkbOnceT: "One-time", pkbOnceP: "Site, Site Pro, restaurant, Shop", pkbFrom: "from 120' + NB + '000 ֏", pkbMore: "All prices", pkbPilotP: "Free setup, first month paid after launch",',
})
sub("src/text/pk.js", [
    ('pkSub: "Առանց թաքնված վճարների։ Բաժանորդագրությունը՝ 12 ամսով։"', 'pkSub: "Բաժանորդագրությունը՝ 12 ամսով։ Գները՝ հենց այստեղ։"'),
    ('pkSub: "Без скрытых платежей. Подписка — на 12 месяцев."', 'pkSub: "Подписка на 12 месяцев. Цены — прямо здесь."'),
    ('pkSub: "No hidden fees. Subscriptions are for 12 months."', 'pkSub: "Subscriptions run for 12 months. Prices are right here."'),
])

# ───── 4. Без «↗», финальная кнопка ─────
for f in ["src/home.html", "src/packages.html"]:
    sub(f, [(" ↗</a>", "</a>")], many=True)

# ───── 5. Подвал ─────
FOOT = '''<footer class="foot">
  <div class="wrap">
    <p class="foot-big" data-t="h1"></p>
    <div class="foot-cols">
      <div><small>WhatsApp</small><a href="https://wa.me/37498337187" target="_blank" rel="noopener">+374 98 337 187</a></div>
      <div><small>Email</small><a href="mailto:skiyar.technologies@gmail.com">skiyar.technologies@gmail.com</a></div>
      <div><small data-t="ftSite"></small><a href="PKS" data-t="navPk"></a><a href="DEMOS" data-t="navDemo"></a><a href="FAQ" data-t="navFaq"></a></div>
      <div><small>Instagram · Facebook</small><a href="https://www.instagram.com/skiyar_technologies/" target="_blank" rel="noopener">@skiyar_technologies</a><a href="https://www.facebook.com/profile.php?id=61596531779500" target="_blank" rel="noopener">SKIYAR</a></div>
    </div>
    <p class="foot-legal"><span data-t="legal"></span> <a href="../privacy.html" data-t="privacy"></a></p>
  </div>
</footer>'''
for f, pks, demos, faq in [("src/home.html", "#packages", "#demos", "#faq"), ("src/packages.html", "#packages", "../src/home.html#demos", "../src/home.html#faq")]:
    s = open(f, encoding="utf-8").read()
    i = s.index('<footer class="foot">'); j = s.index("</footer>", i) + 9
    s = s[:i] + FOOT.replace("PKS", pks).replace("DEMOS", demos).replace("FAQ", faq) + s[j:]
    open(f, "w", encoding="utf-8").write(s)
add_keys("src/text/end.js", {"hy": 'ftSite: "Կայքում",', "ru": 'ftSite: "На сайте",', "en": 'ftSite: "On the site",'})
sub("src/text/end.js", [
    ('fnBtn: "Ստանալ օրինակ WhatsApp-ով"', 'fnBtn: "Գրել ԴԵՄՈ WhatsApp-ով"'),
    ('fnBtn: "Получить пример в WhatsApp"', 'fnBtn: "Написать ДЕМО в WhatsApp"'),
    ('fnBtn: "Get a sample on WhatsApp"', 'fnBtn: "Send DEMO on WhatsApp"'),
])
print("ok")
