# Правки v7 (24.11.2026): цена «от 30 000 ֏» на первом экране, кнопка калькулятора,
# подпись к Гору, строка про выход из договора (сверено с framework-ru п. 6.5). Цены не меняются.
import os
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def rd(f): return open(f, encoding="utf-8").read()
def wr(f, s): open(f, "w", encoding="utf-8", newline="\n").write(s)

def sub(f, pairs):
    s = rd(f)
    for old, new in pairs:
        if s.count(old) != 1: raise SystemExit(f"{f}: найдено {s.count(old)} раз: {old[:70]}")
        s = s.replace(old, new)
    wr(f, s)

# 1. цена на первом экране
sub("src/text/hero.js", [
    ('pilot: "<b>Առաջին 5 բիզնեսները</b>', 'hPrice: "ամսական՝ 30 000 ֏-ից",\n    pilot: "<b>Առաջին 5 բիզնեսները</b>'),
    ('pilot: "<b>Первые 5 бизнесов</b>', 'hPrice: "от 30 000 ֏ в месяц",\n    pilot: "<b>Первые 5 бизнесов</b>'),
    ('pilot: "<b>First 5 businesses</b>', 'hPrice: "from 30 000 ֏ a month",\n    pilot: "<b>First 5 businesses</b>'),
])

# 2. кнопка калькулятора
sub("src/text/calc.js", [
    ('caCta: "Իմանալ պայմանները"', 'caCta: "Հաշվել մեզ հետ WhatsApp-ով"'),
    ('caCta: "Узнать условия"', 'caCta: "Посчитать с нами в WhatsApp"'),
    ('caCta: "Ask about the terms"', 'caCta: "Do the math with us on WhatsApp"'),
    ("Ուզում եմ իմանալ միացման պայմանները։", "Ուզում եմ միասին հաշվել իմ բիզնեսի համար։"),
    ("Хочу узнать условия подключения.", "Хочу посчитать вместе для моего бизнеса."),
    ("I’d like to know the terms.", "I’d like to work it out together for my business."),
])

# 3. кто такой Гор
sub("src/text/gor.js", [
    ('grSub: "Նույն սրահը, նույն վարպետները։ Տարբերությունը՝ մեկ շաբաթ։"',
     'grSub: "Նույն սրահը, նույն վարպետները։ Տարբերությունը՝ մեկ շաբաթ։",\n      grWho: "Գորը մեր տեսահոլովակների հերոսն է՝ գործարար, ով հարազատների և ծանոթների միջոցով փորձում է տարբեր բիզնեսներ՝ ռեստորան, սրահ, հյուրատուն։"'),
    ('grSub: "Тот же салон, те же мастера. Разница — одна неделя.",',
     'grSub: "Тот же салон, те же мастера. Разница — одна неделя.",\n      grWho: "Гор — герой наших роликов: бизнесмен, который через родственников и знакомых пробует разные бизнесы — ресторан, салон, гестхаус.",'),
    ('grSub: "Same salon, same staff. The difference is one week.",',
     'grSub: "Same salon, same staff. The difference is one week.",\n      grWho: "Gor is the hero of our videos: a businessman who tries different businesses through relatives and friends — a restaurant, a salon, a guesthouse.",'),
])

# 4. выход из договора (framework п. 6.5: 30 дней, без оплаты оставшихся месяцев; выкуп — только чтобы забрать сайт)
W4 = {
    "hy": "Պայմանագիրը մեկ տարով է, բայց դուրս գալ կարող եք ցանկացած պահի՝ 30 օր առաջ զգուշացնելով, առանց տուգանքի։ Հետգնում՝ միայն եթե ուզում եք կայքը վերցնել ձեզ։",
    "ru": "Договор на год, но выйти можно в любой момент — предупредив за 30 дней, без штрафа. Выкуп — только если хотите забрать сайт себе.",
    "en": "The contract is for a year, but you can leave any time with 30 days’ notice and no penalty. A buyout applies only if you want to keep the site.",
}
sub("src/text/pk.js", [
    ('w3: "12 ամիս հետո կայքը կարող եք վերցնել անվճար։"', 'w3: "12 ամիս հետո կայքը կարող եք վերցնել անվճար։", w4: "' + W4["hy"] + '"'),
    ('w3: "После 12 месяцев сайт можно забрать бесплатно."', 'w3: "После 12 месяцев сайт можно забрать бесплатно.", w4: "' + W4["ru"] + '"'),
    ('w3: "After 12 months you can take the site for free."', 'w3: "After 12 months you can take the site for free.", w4: "' + W4["en"] + '"'),
])
sub("src/text/end.js", [
    ('a5: "Նվազագույն ժամկետը 12 ամիս է։ Դրանից հետո կարող եք դադարեցնել ցանկացած պահի՝ զգուշացնելով մեկ ամիս առաջ, և կայքը վերցնել անվճար։ Մինչև 12 ամիսը կայքը կարելի է հետ գնել մնացորդով՝ 160 000 ֏ − (վճարված ամիսներ × 10 000 ֏)։ Օրինակ՝ 6 ամիս հետո՝ 100 000 ֏։"',
     'a5: "Պայմանագիրը 12 ամսով է, բայց դուրս գալ կարող եք ցանկացած պահի՝ 30 օր առաջ զգուշացնելով, առանց տուգանքի և առանց մնացած ամիսները վճարելու։ Եթե մինչև 12 ամիսը ուզում եք կայքը վերցնել ձեզ՝ հետգնում մնացորդով. 160 000 ֏ − (վճարված ամիսներ × 10 000 ֏), օրինակ՝ 6 ամիս հետո՝ 100 000 ֏։ 12 ամիս հետո կայքը տալիս ենք անվճար։"'),
    ('a5: "Минимальный срок — 12 месяцев. После него можно отказаться в любой момент, предупредив за месяц, и забрать сайт бесплатно. До 12 месяцев сайт можно выкупить по остатку: 160 000 ֏ − (оплаченные месяцы × 10 000 ֏). Например, после 6 месяцев — 100 000 ֏."',
     'a5: "Договор на 12 месяцев, но выйти можно в любой момент: предупредите за 30 дней — без штрафа и без оплаты оставшихся месяцев. Если до 12 месяцев хотите забрать сайт себе — выкуп по остатку: 160 000 ֏ − (оплаченные месяцы × 10 000 ֏), например после 6 месяцев — 100 000 ֏. После 12 месяцев сайт отдаём бесплатно."'),
    ('a5: "The minimum term is 12 months. After that you can cancel any time with a month’s notice and take the site for free. Before 12 months you can buy the site out: 160 000 ֏ − (months paid × 10 000 ֏). For example, after 6 months it’s 100 000 ֏."',
     'a5: "The contract is for 12 months, but you can leave any time with 30 days’ notice: no penalty and no payment for the remaining months. If you want to keep the site before 12 months, you buy it out: 160 000 ֏ − (months paid × 10 000 ֏), e.g. 100 000 ֏ after 6 months. After 12 months the site is yours for free."'),
])

sub("src/home.html", [
    ('<h1 data-t="h1"></h1>\n', '<h1 data-t="h1"></h1>\n      <p class="h-price" data-t="hPrice"></p>\n'),
    ('<p class="lead" data-t="grSub"></p>\n', '<p class="lead" data-t="grSub"></p>\n    <p class="gr-who" data-t="grWho"></p>\n'),
    ('<p class="pk-rules"><span data-t="w2"></span></p>', '<p class="pk-rules"><span data-t="w2"></span> <span data-t="w4"></span></p>'),
])
sub("src/packages.html", [
    ('<li data-t="w3"></li></ul>', '<li data-t="w3"></li><li data-t="w4"></li></ul>'),
])
print("ok")
