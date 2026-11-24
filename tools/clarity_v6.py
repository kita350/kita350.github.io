# Правки v6 (24.11.2026): «первые 5 бизнесов», кнопка калькулятора, менеджер Ани,
# повторы гарантии / «первых 5» / домена, без условия про 2 контакта. Цены не меняются.
import os, re
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def rd(f): return open(f, encoding="utf-8").read()
def wr(f, s): open(f, "w", encoding="utf-8", newline="\n").write(s)

def sub(f, pairs):
    s = rd(f)
    for old, new in pairs:
        if old not in s: raise SystemExit(f"{f}: не найдено: {old[:70]}")
        s = s.replace(old, new)
    wr(f, s)

# ── «первые 5 клиентов» → «первые 5 бизнесов»
sub("src/text/hero.js", [
    ("<b>Առաջին 5 հաճախորդները</b>", "<b>Առաջին 5 բիզնեսները</b>"),
    ("<b>Первые 5 клиентов</b>", "<b>Первые 5 бизнесов</b>"),
    ("<b>First 5 clients</b>", "<b>First 5 businesses</b>"),
])
sub("src/text/pk.js", [
    ("առաջին 5 հաճախորդներին՝ անվճար", "առաջին 5 բիզնեսին՝ անվճար"),
    ("первым 5 клиентам бесплатно", "первым 5 бизнесам бесплатно"),
    ("free for the first 5 clients", "free for the first 5 businesses"),
    ('pTitle: "Առաջին 5 հաճախորդները՝ Online"', 'pTitle: "Online՝ առաջին 5 բիզնեսի համար"'),
    ('pTitle: "Первые 5 клиентов Online"', 'pTitle: "Online для первых 5 бизнесов"'),
    ('pTitle: "First 5 Online clients"', 'pTitle: "Online for the first 5 businesses"'),
    ("Ուզում եմ միանալ՝ որպես SKIYAR-ի առաջին 5 հաճախորդներից մեկը։", "Ուզում եմ միանալ SKIYAR-ին առաջին 5 բիզնեսների թվում։"),
    ("Хочу подключиться как один из первых 5 клиентов SKIYAR.", "Хочу подключиться к SKIYAR в числе первых 5 бизнесов."),
    ("I’d like to join as one of SKIYAR’s first 5 clients.", "I’d like to join SKIYAR as one of the first 5 businesses."),
    # условие про 2 контакта убираем с сайта
    (", թույլտվություն ցույց տալու աշխատանքը և 2 ծանոթ սեփականատիրոջ կոնտակտ", " և թույլտվություն ցույց տալու աշխատանքը"),
    (", разрешение показать работу и 2 контакта знакомых владельцев", " и разрешение показать работу"),
    (", permission to show the work and 2 contacts of owners you know", " and permission to show the work"),
])
sub("src/text/ind.js", [
    ("Առաջին 5 հաճախորդների համար", "Առաջին 5 բիզնեսի համար"),
    ("Первым 5 клиентам", "Первым 5 бизнесам"),
    ("For the first 5 clients", "For the first 5 businesses"),
])

# ── калькулятор: кнопка без «бесплатно всем»
sub("src/text/calc.js", [
    ('caCta: "Միանալ անվճար"', 'caCta: "Իմանալ պայմանները"'),
    ('caCta: "Подключиться бесплатно"', 'caCta: "Узнать условия"'),
    ('caCta: "Get set up for free"', 'caCta: "Ask about the terms"'),
    ("Ուզում եմ անվճար միանալ՝ որպես առաջին 5 հաճախորդներից մեկը։", "Ուզում եմ իմանալ միացման պայմանները։"),
    ("Хочу бесплатное подключение для первых 5 клиентов.", "Хочу узнать условия подключения."),
    ("I’d like the free setup for the first 5 clients.", "I’d like to know the terms."),
])

# ── Ани — менеджер; клиентка в расписании — Мариам
sub("src/text/try.js", [
    ('tyS2: "Անին կճշտի մանրամասները"', 'tyS2: "Մեր մենեջեր Անին կճշտի մանրամասները"'),
    ('tyS2: "Ани уточнит детали"', 'tyS2: "Наш менеджер Ани уточнит детали"'),
    ('tyS2: "Ani checks the details"', 'tyS2: "Our manager Ani checks the details"'),
])
sub("src/text/story.js", [
    ('pC4n: "Անի"', 'pC4n: "Մարիամ"'),
    ('pC4n: "Ани"', 'pC4n: "Мариам"'),
    ('pC4n: "Ani"', 'pC4n: "Mariam"'),
])

# ── повторы: «первые 5» остаются в первом экране и плитке пакетов
sub("src/text/end.js", [
    ("Պայմանագիր 12 ամսով։ Միացում (առաջին 5 հաճախորդներին՝ անվճար), հաշիվ ԱՁ-ի անունով։", "Պայմանագիր 12 ամսով, հաշիվ ԱՁ-ի անունով։"),
    ("Договор на 12 месяцев. Подключение (первым 5 клиентам — бесплатно), счёт на ИП.", "Договор на 12 месяцев, счёт на ИП."),
    ("A 12-month contract. Setup (free for the first 5 clients), invoiced to our sole proprietorship.", "A 12-month contract, invoiced to our sole proprietorship."),
    (" Առաջին 5 հաճախորդները առաջին ամիսը վճարում են գործարկումից հետո։", ""),
    (" Первые 5 клиентов платят за первый месяц после запуска.", ""),
    (" The first 5 clients pay for the first month after launch.", ""),
    ("Աշխատանքների օրինակները այս կայքում են, իսկ առաջին 5 հաճախորդները առաջին ամիսը վճարում են միայն գործարկումից հետո. ռիսկը մեզ վրա է։",
     "Աշխատանքների օրինակները այս կայքում են, պայմանագիրը և հաշիվը՝ պաշտոնապես, ԱՁ-ի անունով։"),
    ("Примеры работ — на этом сайте, а первые 5 клиентов оплачивают первый месяц только после запуска: риск на нас.",
     "Примеры работ — на этом сайте, договор и счёт — официально, на ИП."),
    ("Our sample sites are on this page, and the first 5 clients pay for the first month only after launch, so the risk is on us.",
     "Our sample sites are on this page; the contract and invoices are official, in the proprietorship’s name."),
])
# гарантия остаётся в плитке «Что вы получаете»; пороги других отраслей — на странице пакетов
sub("src/text/bento.js", [
    ("Մյուս տարբերակների շեմերը՝ փաթեթներում։", "Մյուս ոլորտների շեմերը՝ «Բոլոր փաթեթները» էջում։"),
    ("Пороги других вариантов — в пакетах.", "Пороги для других отраслей — на странице «Все пакеты»."),
    ("Thresholds for the other options are in Packages.", "Thresholds for other businesses are on the All packages page."),
])

h = rd("src/home.html")
n0 = h.count('<p class="in-pilot" data-t="inPilot"></p>')
h = h.replace('<p class="in-pilot" data-t="inPilot"></p>', "")
h = re.sub(r'\s*<p class="in-guar" data-guar="in\dg"></p>', "", h)
for old, new in [
    ('<article class="pkt pkt-g"><b>20</b><p data-t="pkbGuar"></p></article>\n', ""),
    ('<p class="pl-s" data-setup="50 000" data-free="1"></p>', '<p class="pl-s" data-setup="50 000"></p>'),
    ('<p class="pk-rules"><span data-t="w1"></span> <span data-t="w2"></span> <span data-t="w3"></span></p>', '<p class="pk-rules"><span data-t="w2"></span></p>'),
]:
    if old not in h: raise SystemExit("home.html: не найдено: " + old[:60])
    h = h.replace(old, new)
wr("src/home.html", h)
print("in-pilot убрано:", n0)

sub("src/packages.html", [
    ('<p class="pl-s" data-setup="50 000" data-free="1"></p>', '<p class="pl-s" data-setup="50 000"></p>'),
    ('<li data-t="p2"></li><li data-t="p3"></li>', '<li data-t="p2"></li>'),
])
print("ok")
