# Правки v9 (24.11.2026): шаг 4 «Договор» без «оплаты на день 2–3»; во вкладках отраслей
# рядом с подключением — «первым 5 — бесплатно». Цены не меняются.
import os, re
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def rd(f): return open(f, encoding="utf-8").read()
def wr(f, s): open(f, "w", encoding="utf-8", newline="\n").write(s)
def setkey(f, key, vals):
    s = rd(f); it = iter(vals)
    s, n = re.subn(r'(?<![A-Za-z0-9])' + key + r': "[^"]*"', lambda m: key + ': "' + next(it) + '"', s)
    if n != len(vals): raise SystemExit(f"{f}: {key} найден {n} раз")
    wr(f, s)

setkey("src/text/end.js", "s4t", ["Պայմանագիր", "Договор", "Contract"])
setkey("src/text/end.js", "s4p", [
    "Պայմանագիր 12 ամսով, հաշիվ ԱՁ-ի անունով։ Առաջին 5 բիզնեսին՝ միացումն անվճար է, առաջին ամիսը՝ գործարկումից հետո։",
    "Договор на 12 месяцев, счёт на ИП. Первым 5 бизнесам — подключение бесплатно, первый месяц после запуска.",
    "A 12-month contract, invoiced to our sole proprietorship. For the first 5 businesses setup is free and the first month is paid after launch.",
])
# новый ключ inFree рядом с inSetup
s = rd("src/text/ind.js")
for lang_setup, free in [('inSetup: "միացում"', 'առաջին 5-ին՝ անվճար'), ('inSetup: "подключение"', 'первым 5 — бесплатно'), ('inSetup: "setup"', 'free for the first 5')]:
    if s.count(lang_setup) != 1: raise SystemExit("ind.js: " + lang_setup)
    s = s.replace(lang_setup, lang_setup + ', inFree: "' + free + '"')
wr("src/text/ind.js", s)

h = rd("src/home.html")
old = '<span data-t="inSetup"></span></p>'
n = h.count(old)
if n != 5: raise SystemExit(f"home.html: inSetup {n}")
h = h.replace(old, '<span data-t="inSetup"></span> <small class="in-free" data-t="inFree"></small></p>')
wr("src/home.html", h)
print("ok, вкладок:", n)
