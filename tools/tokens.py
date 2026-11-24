"""Выносит цвета, заданные прямо в стилях, в переменные (правило Hallmark 48: цвет только через токен).
Читает assets/*.css (кроме собранных index/packages и шрифтов), заменяет литералы на var(--c-…),
список токенов пишет в assets/tokens.css. Повторный запуск безопасен. python tools/tokens.py"""
import os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
FILES = ["site", "home", "story", "bento", "try", "ind", "calc", "pk", "end", "pkpage", "v3", "v4"]
LIT = re.compile(r"#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)")
tok = {}
if os.path.exists("assets/tokens.css"):
    for name, val in re.findall(r"(--c-[\w-]+):([^;]+);", open("assets/tokens.css", encoding="utf-8").read()):
        tok[val.strip().lower()] = name

def name_for(v):
    v = v.lower().replace(" ", "")
    if v in ("#fff", "#ffffff"):
        v = "#fdfdfb"  # чистый белый → тёплый почти белый (правило 7a)
    if v not in tok:
        tok[v] = "--c-" + re.sub(r"[^0-9a-z]+", "-", v.strip("#")).strip("-")
    return "var(%s)" % tok[v]

for f in FILES:
    p = "assets/%s.css" % f
    s = open(p, encoding="utf-8").read()
    out, i = [], 0
    for m in re.finditer(r":root[^{]*\{[^}]*\}", s):  # блоки токенов не трогаем
        out.append(LIT.sub(lambda x: name_for(x.group(0)), s[i:m.start()])); out.append(m.group(0)); i = m.end()
    out.append(LIT.sub(lambda x: name_for(x.group(0)), s[i:]))
    open(p, "w", encoding="utf-8").write("".join(out))
body = "\n".join("  %s:%s;" % (n, v) for v, n in sorted(tok.items(), key=lambda x: x[1]))
open("assets/tokens.css", "w", encoding="utf-8").write("/* Цвета, вынесенные из стилей (tools/tokens.py). Бренд — в :root site.css. */\n:root{\n%s\n}\n" % body)
print(len(tok), "tokens")
