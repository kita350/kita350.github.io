# Правки v8 (24.11.2026): цены по отраслям под заголовком, без «минимум 12 месяцев» во вкладках,
# «хозяйке не пришлось листать тетрадку», счётчик «свободно N из 5». Цены не меняются.
import os, re
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
N = " "
def num(x): return re.sub(r"(\d) (?=\d)", r"\1" + N, x).replace(" ֏", N + "֏")
def rd(f): return open(f, encoding="utf-8").read()
def wr(f, s): open(f, "w", encoding="utf-8", newline="\n").write(s)

def setkey(f, key, vals):
    """Заменяет значение key: "..." по порядку hy, ru, en."""
    s = rd(f); it = iter(vals)
    s, n = re.subn(r'(?<![A-Za-z])' + key + r': "[^"]*"', lambda m: key + ': "' + next(it) + '"', s)
    if n != len(vals): raise SystemExit(f"{f}: {key} найден {n} раз")
    wr(f, s)

def sub(f, pairs):
    s = rd(f)
    for old, new in pairs:
        if s.count(old) != 1: raise SystemExit(f"{f}: найдено {s.count(old)} раз: {old[:70]}")
        s = s.replace(old, new)
    wr(f, s)

setkey("src/text/hero.js", "hPrice", [
    num("Սրահ՝ 35 000 ֏/ամիս · հյուրատուն՝ 45 000 ֏ · ռեստորան՝ 30 000 ֏"),
    num("Салон — 35 000 ֏/мес · гестхаус — 45 000 ֏ · ресторан — 30 000 ֏"),
    num("Salon 35 000 ֏/mo · guesthouse 45 000 ֏ · restaurant 30 000 ֏"),
])
# Счётчик мест в плашке первого экрана задан текстом. Когда появится клиент — поменять здесь
# и data-taken у #packages в src/home.html и src/packages.html (там счётчик считается сам).
sub("src/text/hero.js", [
    ("<b>Առաջին 5 բիզնեսները</b>", "<b>Առաջին 5 բիզնեսները · ազատ է 5 տեղ 5-ից</b>"),
    ("<b>Первые 5 бизнесов</b>", "<b>Первые 5 бизнесов · свободно 5 из 5</b>"),
    ("<b>First 5 businesses</b>", "<b>First 5 businesses · 5 of 5 places free</b>"),
])
setkey("src/text/ind.js", "inTerm", ["Տարեկան վճարելիս՝ −15%։", "При оплате за год — −15%.", "Pay yearly and save 15%."])
setkey("src/text/pk.js", "pkMin", [
    "Պայմանագիրը մեկ տարով է, դուրս գալ կարող եք ցանկացած պահի՝ 30 օր առաջ զգուշացնելով։",
    "Договор на год, выйти можно в любой момент за 30 дней.",
    "A one-year contract; you can leave any time with 30 days’ notice.",
])
setkey("src/text/pk.js", "pLeft", ["Ազատ է {n} տեղ 5-ից", "Свободно {n} из 5 мест", "{n} of 5 places free"])
setkey("src/text/story.js", "st6p", [
    "Ռուզանը բազկաթոռին է։ Տիրուհին ոչ տետր թերթեց, ոչ էլ որևէ մեկին զանգեց։",
    "Рузан в кресле. Хозяйке не пришлось листать тетрадку и кому-то звонить.",
    "Ruzan is in the chair. The owner didn’t have to open a notebook or make a single call.",
])

# счётчик показывает свободные места: 5 − data-taken
sub("assets/pk.js", [
    ('t("pLeft").split("{n}").join(taken)', 't("pLeft").split("{n}").join(5 - taken)'),
])
# счётчик снова виден
sub("assets/v4.css", [
    ("/* счётчик мест скрыт до первого клиента (вернуть: удалить это правило) */\n.pkt-seats .left,.pk-p .left{display:none}\n",
     "/* счётчик мест «свободно N из 5»: число — data-taken у #packages (src/home.html, src/packages.html) и текст плашки в src/text/hero.js */\n"),
])
# на главной строка про выход теперь в pkMin — убираем дубль из правил под пакетами
sub("src/home.html", [
    ('<p class="pk-rules"><span data-t="w2"></span> <span data-t="w4"></span></p>', '<p class="pk-rules"><span data-t="w2"></span></p>'),
    ('<section class="pk pkb" id="packages" data-sel="b" data-bill="m" data-taken="0">',
     '<!-- data-taken: сколько из 5 мест для первых бизнесов занято; поменять и в src/packages.html, и в плашке src/text/hero.js -->\n<section class="pk pkb" id="packages" data-sel="b" data-bill="m" data-taken="0">'),
])
print("ok")
