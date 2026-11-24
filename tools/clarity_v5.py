"""Правки понятности по аудиту 24.11.2026 (docs/site-audit-2026-11-24.md), одобрены основателем.
Цены не меняются. Одноразовый скрипт правки исходников src/."""
import os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
NB = " "

def setv(f, key, vals):
    """Заменить значение ключа в блоках hy, ru, en (по порядку вхождений)."""
    p = "src/text/%s.js" % f
    s = open(p, encoding="utf-8").read()
    rx = re.compile(r'(\b%s: ")((?:[^"\\]|\\.)*)(")' % re.escape(key))
    ms = list(rx.finditer(s))
    assert len(ms) == 3, (f, key, len(ms))
    for m, v in reversed(list(zip(ms, vals))):
        s = s[:m.start(2)] + v + s[m.end(2):]
    open(p, "w", encoding="utf-8").write(s)

def subv(f, key, pairs):
    """Заменить подстроку внутри значения ключа: pairs = [(старое, новое) для hy, ru, en]."""
    p = "src/text/%s.js" % f
    s = open(p, encoding="utf-8").read()
    rx = re.compile(r'(\b%s: ")((?:[^"\\]|\\.)*)(")' % re.escape(key))
    ms = list(rx.finditer(s))
    assert len(ms) == 3, (f, key, len(ms))
    for m, (a, b) in reversed(list(zip(ms, pairs))):
        v = m.group(2)
        assert a in v, (f, key, a)
        s = s[:m.start(2)] + v.replace(a, b) + s[m.end(2):]
    open(p, "w", encoding="utf-8").write(s)

def sub(p, pairs):
    s = open(p, encoding="utf-8").read()
    for a, b in pairs:
        assert s.count(a) == 1, (p, a[:60]); s = s.replace(a, b)
    open(p, "w", encoding="utf-8").write(s)

# 1. Заголовок — про то, что есть сейчас; ИИ — дополнение. «Ամեն ինչ վարում ենք մենք» → понятная фраза (Ани)
setv("hero", "h1", ["Հաճախորդները գրանցվում են ինքնուրույն՝ նույնիսկ գիշերը", "Клиенты записываются сами, даже ночью", "Clients book themselves, even at night"])
setv("hero", "sub", ["Կայք՝ առցանց գրանցումով և հիշեցումներով <span class=nw>WhatsApp-ով</span>, երեք լեզվով։ Տեխնիկական ամբողջ աշխատանքը մենք ենք անում։",
                     "Сайт с онлайн-записью и напоминаниями в WhatsApp на трёх языках. Всё техническое берём на себя.",
                     "A website with online booking and WhatsApp reminders in three languages. We take care of everything technical."])
setv("story", "stNote", ["Ավելի ուշ՝ որպես հավելում. ԱԲ ադմինիստրատոր, որն ինքն է պատասխանում հարցերին Instagram-ում և WhatsApp-ում։ Հիմա այն փորձարկում ենք։",
                         "Позже, как дополнение: ИИ-администратор, который сам отвечает на вопросы в Instagram и WhatsApp. Сейчас мы его тестируем.",
                         "Later, as an add-on: an AI front desk that answers questions on Instagram and WhatsApp by itself. We’re testing it now."])

# 3. Первые 5 клиентов — одной строкой, без слова «пилот»
setv("hero", "pilot", ["<b>Առաջին 5 հաճախորդները</b><span>Միացումն անվճար է, առաջին ամիսը վճարում եք գործարկումից հետո, երբ ամեն ինչ տեսել եք աշխատանքում</span>",
                       "<b>Первые 5 клиентов</b><span>Подключение бесплатно, первый месяц платите после запуска, когда увидели всё в работе</span>",
                       "<b>First 5 clients</b><span>Free setup; you pay for the first month after launch, once you’ve seen it all working</span>"])
setv("ind", "inPilot", ["Առաջին 5 հաճախորդների համար միացումն անվճար է, առաջին ամիսը՝ գործարկումից հետո։",
                        "Первым 5 клиентам подключение бесплатно, первый месяц — после запуска.",
                        "For the first 5 clients setup is free and the first month is paid after launch."])
setv("pk", "pkSetupFree", ["միացում՝ {x}, առաջին 5 հաճախորդներին՝ անվճար", "подключение {x}, первым 5 клиентам бесплатно", "setup {x}, free for the first 5 clients"])
setv("pk", "pTitle", ["Առաջին 5 հաճախորդները՝ Online", "Первые 5 клиентов Online", "First 5 Online clients"])
setv("pk", "pCta", ["Ուզում եմ լինել առաջին հինգում", "Хочу быть в первых пяти", "I want to be one of the first five"])
setv("pk", "pWa", ["Բարև ձեզ։ Ուզում եմ միանալ՝ որպես SKIYAR-ի առաջին 5 հաճախորդներից մեկը։", "Здравствуйте! Хочу подключиться как один из первых 5 клиентов SKIYAR.", "Hello! I’d like to join as one of SKIYAR’s first 5 clients."])
setv("calc", "caCta", ["Միանալ անվճար", "Подключиться бесплатно", "Get set up for free"])
setv("calc", "caWa", ["Բարև ձեզ։ Հաշվեցի չեկածները ձեր կայքում։ Ուզում եմ անվճար միանալ՝ որպես առաջին 5 հաճախորդներից մեկը։",
                      "Здравствуйте! Посчитал(а) неявки у вас на сайте. Хочу бесплатное подключение для первых 5 клиентов.",
                      "Hello! I did the no-show math on your site. I’d like the free setup for the first 5 clients."])
subv("end", "s4p", [("(կամ պիլոտ՝ առանց վճարի)", "(առաջին 5 հաճախորդներին՝ անվճար)"), ("(или пилот без оплаты)", "(первым 5 клиентам — бесплатно)"), ("(or the pilot, with no payment)", "(free for the first 5 clients)")])
subv("end", "a2", [("Պիլոտում առաջին ամիսը վճարում եք գործարկումից հետո։", "Առաջին 5 հաճախորդները առաջին ամիսը վճարում են գործարկումից հետո։"),
                   ("В пилоте первый месяц вы платите после запуска.", "Первые 5 клиентов платят за первый месяц после запуска."),
                   ("In the pilot you pay for the first month after launch.", "The first 5 clients pay for the first month after launch.")])
subv("end", "a8", [("իսկ պիլոտում առաջին ամիսը վճարում եք", "իսկ առաջին 5 հաճախորդները առաջին ամիսը վճարում են"),
                   ("а в пилоте первый месяц вы оплачиваете", "а первые 5 клиентов оплачивают первый месяц"),
                   ("and in the pilot you pay for the first month", "and the first 5 clients pay for the first month")])
subv("pkpage", "_descPk", [("և պիլոտ", "և պայմաններ առաջին հաճախորդների համար"), ("и пилот", "и условия для первых клиентов"), ("and the pilot", "and terms for the first clients")])

# ИИ — «в тесте», без слова «пилот»
for f, k in [("pk", "pkPilotSoon"), ("pkpage", "aaPilot")]:
    setv(f, k, ["Շուտով, փորձարկվում է", "Скоро, в тесте", "Coming soon, in testing"])
setv("ind", "inAi", ["ԱԲ ադմինիստրատորով (փորձարկվում է)՝ {p}" + NB + "֏ ամսական, միացում՝ {f}" + NB + "֏",
                     "С ИИ-администратором (в тесте) — {p}" + NB + "֏ в месяц, подключение {f}" + NB + "֏",
                     "With the AI front desk (in testing): {p}" + NB + "֏ a month, setup {f}" + NB + "֏"])
setv("pkpage", "vh5", ["ԱԲ-ով (փորձարկվում է)", "С ИИ (в тесте)", "With AI (in testing)"])
subv("pk", "pkHelp", [("Online AI-ն՝ միայն պիլոտ։", "Online AI՝ ԱԲ պատասխաններ, դեռ փորձարկվում է։"), ("Online AI — пока только пилот.", "Online AI — ИИ-ответы, пока в тесте."), ("Online AI is a pilot for now.", "Online AI adds AI replies; still in testing.")])
subv("pk", "pkAiNote", [("վաճառում ենք որպես պիլոտ", "միացնում ենք փորձնական ռեժիմով"), ("продаём как пилот", "подключаем в тестовом режиме"), ("we offer it as a pilot", "we connect it in test mode")])
setv("pk", "pkAsk", ["Իմանալ ԱԲ պատասխանների մասին", "Узнать про ИИ-ответы", "Ask about AI replies"])
setv("pk", "pkWaAi", ["Բարև ձեզ։ Ուզում եմ իմանալ Online AI-ի (ԱԲ պատասխանների) մասին։", "Здравствуйте! Хочу узнать про Online AI (ИИ-ответы).", "Hello! I’d like to know about Online AI (AI replies)."])
subv("end", "a7", [("Այն պիլոտի փուլում է", "Այն փորձարկում ենք"), ("Он на стадии пилота", "Мы его тестируем"), ("It’s in the pilot stage", "We’re testing it")])

# 4. ДЕМО — что это и что придёт
setv("try", "tySub", ["Գրեք ԴԵՄՈ և բիզնեսի անունը, և կուղարկենք, թե ինչպես կերևա ձեր բիզնեսի կայքը։ Անվճար, մինչև պայմանագիրը։",
                      "Напишите ДЕМО и название — пришлём, как будет выглядеть сайт вашего бизнеса. Бесплатно и до договора.",
                      "Send DEMO and your business name, and we’ll show you how your site will look. Free, before any contract."])
s = open("src/text/hero.js", encoding="utf-8").read()
for lang, v in [("hy", "Գրեք ԴԵՄՈ, և կուղարկենք, թե ինչպես կերևա ձեր բիզնեսի կայքը։"), ("ru", "Напишите ДЕМО — пришлём, как будет выглядеть сайт вашего бизнеса."), ("en", "Send DEMO and we’ll show you how your business’s site will look.")]:
    m = re.search(r"\n\s*%s: \{\n" % lang, s); s = s[:m.end()] + '    dmHint: "%s",\n' % v + s[m.end():]
open("src/text/hero.js", "w", encoding="utf-8").write(s)
sub("src/home.html", [('      <p class="pilot" data-t-html="pilot"></p>', '      <p class="dm-hint" data-t="dmHint"></p>\n      <p class="pilot" data-t-html="pilot"></p>')])

# 5. Простые слова вместо «хостинг», «защищённое соединение»; пояснения к латинским названиям
setv("pk", "r6", ["Դոմեն՝ ձեր անունով, տեխնիկական ամեն ինչ՝ մեզ վրա", "Домен на ваше имя, всё техническое — на нас", "Domain in your name, all the technical side on us"])
subv("pkpage", "oSub", [("հոսթինգը՝ նվեր 3 ամիսների ընթացքում", "կայքի աշխատանքը նվեր 3 ամիսների ընթացքում"), ("хостинг в подарочные 3 месяца", "работа сайта в подарочные 3 месяца"), ("hosting for the 3 free months", "keeping the site online for the 3 free months")])
setv("pk", "pkbAaP", ["Միայն ԱԲ պատասխաններ, եթե կայք արդեն ունեք․ նվազագույնը 6 ամիս", "Только ИИ-ответы, если сайт уже есть; минимум 6 месяцев", "AI replies only, if you already have a site; 6 months minimum"])
setv("pk", "pkbAiP", ["Online + ԱԲ-ն պատասխանում է հաճախորդներին", "Online + ИИ отвечает клиентам", "Online plus AI replies to clients"])

# 6. Пример — бесплатный и до договора
setv("pk", "w2", ["Կայքի օրինակն անվճար է և պատրաստվում է մինչև պայմանագիրը։", "Пример сайта бесплатный и делается до договора.", "The sample site is free and made before any contract."])

# 2. Главная: цена в месяц, без годовых сумм и переключателя (он остаётся на «Все пакеты»)
h = open("src/home.html", encoding="utf-8").read()
i = h.index('<section class="pk pkb"'); j = h.index("</section>", i)
blk = h[i:j]
blk = re.sub(r'\s*<div class="bill" role="radiogroup"[\s\S]*?</div>\n', "\n", blk, count=1)
blk = re.sub(r'\n\s*<p class="pl-y" data-first="[^"]*"></p>', "", blk)
blk = re.sub(r'\n\s*<p class="pl-eq" data-eq="[^"]*"></p>', "", blk)
h = h[:i] + blk + h[j:]

# 7. Гор: без цифр и без подписи «сценка из роликов»
h = re.sub(r'\n\s*<div class="gr-cnt">.*?</div></div>', "", h)
h = h.replace('\n    <p class="gr-foot" data-t="grFoot"></p>', "")

# 9. Место под кейс — подготовлено, скрыто до первого реального клиента
case = '''
<!-- Кейс первого клиента: включить (убрать hidden), когда будет реальный клиент с согласием на фото и отзыв. Тексты: csTitle, csQuote, csWho. -->
<section class="case" id="case" hidden>
  <div class="wrap"><h2 data-t="csTitle"></h2><blockquote><p data-t="csQuote"></p><footer data-t="csWho"></footer></blockquote></div>
</section>
'''
k = h.index('<section class="bento"'); h = h[:k] + case.lstrip("\n") + h[k:]
open("src/home.html", "w", encoding="utf-8").write(h)
s = open("src/text/gor.js", encoding="utf-8").read()
for lang in ["hy", "ru", "en"]:
    m = re.search(r"\n\s*%s: \{\n" % lang, s); s = s[:m.end()] + '      csTitle: "", csQuote: "", csWho: "",\n' + s[m.end():]
open("src/text/gor.js", "w", encoding="utf-8").write(s)
assert "gr-cnt" not in h and "grFoot" not in h and 'data-first' not in h[h.index('<section class="pk pkb"'):h.index('</section>', h.index('<section class="pk pkb"'))]
print("ok")
