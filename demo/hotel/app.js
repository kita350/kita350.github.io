/* Демо гостиницы: номера, даты заезда/выезда, заявка через WhatsApp. HY — на проверку Ани. */
(function () {
  "use strict";
  var D = window.DEMO, LI = { hy: 0, ru: 1, en: 2 };

  var I18N = {
    hy: {
      _title: "{name} — համարներ և ամրագրում", _noName: "Ձեր հյուրանոցը",
      brand: "{name}", h1: "{name}", langAria: "Կայքի լեզուն",
      lead: "Համարներ՝ անտառի և լեռների տեսարանով, նախաճաշ տեղական մթերքներից։ Ընտրեք ամսաթվերը և ամրագրեք WhatsApp-ով։",
      leadCity: "{city}։ Համարներ՝ անտառի և լեռների տեսարանով, նախաճաշ տեղական մթերքներից։ Ընտրեք ամսաթվերը և ամրագրեք WhatsApp-ով։",
      checkIn: "Ժամանում", checkOut: "Մեկնում", guests: "Հյուրեր", chooseRoom: "Ընտրել համարը",
      guestsN: "{n} հյուր", nights: "{n} գիշեր", nightsLine: "{in} — {out}, {nights}", badDates: "Մեկնման օրը պետք է լինի ժամանումից հետո",
      viewTitle: "Տեսարան պատուհանից",
      viewText: "Առավոտը սկսվում է լեռներով․ համարների մեծ մասի պատուհանները նայում են անտառին և լեռնաշղթային։",
      viewNote: "Այստեղ կլինեն ձեր հյուրանոցի իրական լուսանկարները՝ համարներ, տեսարան, տարածք։",
      roomsTitle: "Համարներ", roomsSub: "Գինը մեկ գիշերվա համար է՝ նախաճաշով։ Ընտրված ամսաթվերի ընդհանուր գումարը հաշվվում է ավտոմատ։",
      sqm: "{n} մ²", maxG: "մինչև {n} հյուր", perNight: "գիշերը", totalFor: "{nights}՝ {sum}", pickDates: "Ընտրեք ամսաթվերը՝ գումարը տեսնելու համար",
      bookRoom: "Ամրագրել այս համարը", tooMany: "Այս համարում՝ առավելագույնը {n} հյուր",
      waNote: "Օրինակում WhatsApp-ը բացվում է առանց համարի։ Ձեր կայքում հայտը կգա անմիջապես ձեր WhatsApp-ին։",
      waMsg: "Բարև ձեզ։ Ուզում եմ համար ամրագրել{inName}։\nՀամար՝ {room}\nԺամանում՝ {in}\nՄեկնում՝ {out} ({nights})\nՀյուրեր՝ {guests}\nԳումարը կայքում՝ {sum}",
      inName: " «{name}»-ում",
      amenTitle: "Ինչ կա հյուրանոցում",
      aroundTitle: "Շրջակայքը և ինչպես հասնել", aroundSub: "Այստեղ կլինեն ձեր շրջակայքի տեսարժան վայրերը և ճանապարհի նկարագրությունը։",
      capLake: "Լիճ՝ անտառի մեջ", capMonastery: "Հին վանքեր", capMeadow: "Լեռնային արահետներ",
      addrTitle: "Հասցե", addr: "Այստեղ կլինի հյուրանոցի հասցեն", addrCity: "{city}, այստեղ կլինի հյուրանոցի հասցեն",
      carTitle: "Մեքենայով", carText: "Քարտեզի կետը և երթուղին՝ մեկ սեղմումով։",
      transferTitle: "Տրանսֆեր", transferText: "Դիմավորում «Զվարթնոց» օդանավակայանում՝ նախնական հայտով։",
      revTitle: "Կարծիքներ", revSub: "Այստեղ կլինեն ձեր հյուրերի իրական կարծիքները։", example: "օրինակ",
      footer: "Սա կայքի օրինակ է SKIYAR-ից։ Համարները, գները և կարծիքները՝ օրինակի համար։",
      credits: "Լուսանկարներ՝ Unsplash (ազատ լիցենզիա)",
      altHero: "Կանաչ լեռներ ամպերի տակ", altWindow: "Լեռների տեսարան պատուհանից", altBreakfast: "Նախաճաշ՝ ձու, լոլիկ, պանիր, մուրաբա"
    },
    ru: {
      _title: "{name} — номера и бронирование", _noName: "Ваша гостиница",
      brand: "{name}", h1: "{name}", langAria: "Язык сайта",
      lead: "Номера с видом на лес и горы, завтрак из местных продуктов. Выберите даты и забронируйте в WhatsApp.",
      leadCity: "{city}. Номера с видом на лес и горы, завтрак из местных продуктов. Выберите даты и забронируйте в WhatsApp.",
      checkIn: "Заезд", checkOut: "Выезд", guests: "Гости", chooseRoom: "Выбрать номер",
      guestsN: "{n}", nights: "{n} {w}", nightsLine: "{in} — {out}, {nights}", badDates: "Дата выезда должна быть позже заезда",
      viewTitle: "Вид из окна",
      viewText: "Утро начинается с гор: окна большинства номеров выходят на лес и хребет.",
      viewNote: "Здесь будут настоящие фотографии вашей гостиницы — номера, вид, территория.",
      roomsTitle: "Номера", roomsSub: "Цена за ночь с завтраком. Сумма за выбранные даты считается автоматически.",
      sqm: "{n} м²", maxG: "до {n} гостей", perNight: "за ночь", totalFor: "За {nights}: {sum}", pickDates: "Выберите даты, чтобы увидеть сумму",
      bookRoom: "Забронировать этот номер", tooMany: "В этом номере не больше {n} гостей",
      waNote: "В демо WhatsApp откроется без номера. На вашем сайте заявка придёт сразу в ваш WhatsApp.",
      waMsg: "Здравствуйте! Хочу забронировать номер{inName}.\nНомер: {room}\nЗаезд: {in}\nВыезд: {out} ({nights})\nГостей: {guests}\nСумма по сайту: {sum}",
      inName: " в «{name}»",
      amenTitle: "Что есть в гостинице",
      aroundTitle: "Окрестности и как добраться", aroundSub: "Здесь будут места рядом с вашей гостиницей и описание дороги.",
      capLake: "Озеро в лесу", capMonastery: "Старые монастыри", capMeadow: "Горные тропы",
      addrTitle: "Адрес", addr: "Здесь будет адрес гостиницы", addrCity: "{city}, здесь будет адрес гостиницы",
      carTitle: "На машине", carText: "Точка на карте и маршрут в одно касание.",
      transferTitle: "Трансфер", transferText: "Встреча в аэропорту «Звартноц» по предварительной заявке.",
      revTitle: "Отзывы", revSub: "Здесь будут настоящие отзывы ваших гостей.", example: "пример",
      footer: "Это пример сайта от SKIYAR. Номера, цены и отзывы — для примера.",
      credits: "Фото: Unsplash (свободная лицензия)",
      altHero: "Зелёные горы под облаками", altWindow: "Вид на горы из окна", altBreakfast: "Завтрак: яичница, томаты, сыр, варенье"
    },
    en: {
      _title: "{name} — rooms and booking", _noName: "Your hotel",
      brand: "{name}", h1: "{name}", langAria: "Site language",
      lead: "Rooms looking out on forest and mountains, breakfast from local produce. Pick your dates and book on WhatsApp.",
      leadCity: "{city}. Rooms looking out on forest and mountains, breakfast from local produce. Pick your dates and book on WhatsApp.",
      checkIn: "Check-in", checkOut: "Check-out", guests: "Guests", chooseRoom: "Choose a room",
      guestsN: "{n}", nights: "{n} {w}", nightsLine: "{in} — {out}, {nights}", badDates: "Check-out must be after check-in",
      viewTitle: "The view from the window",
      viewText: "Mornings start with the mountains: most rooms face the forest and the ridge.",
      viewNote: "Real photos of your hotel go here — rooms, view, grounds.",
      roomsTitle: "Rooms", roomsSub: "Prices are per night with breakfast. The total for your dates is calculated automatically.",
      sqm: "{n} m²", maxG: "up to {n} guests", perNight: "per night", totalFor: "{nights}: {sum}", pickDates: "Choose dates to see the total",
      bookRoom: "Book this room", tooMany: "This room sleeps up to {n} guests",
      waNote: "In this demo WhatsApp opens without a number. On your site, requests go straight to your WhatsApp.",
      waMsg: "Hello! I’d like to book a room{inName}.\nRoom: {room}\nCheck-in: {in}\nCheck-out: {out} ({nights})\nGuests: {guests}\nTotal on the site: {sum}",
      inName: " at “{name}”",
      amenTitle: "At the hotel",
      aroundTitle: "Around us and getting here", aroundSub: "Places near your hotel and directions go here.",
      capLake: "A forest lake", capMonastery: "Old monasteries", capMeadow: "Mountain trails",
      addrTitle: "Address", addr: "Your hotel’s address goes here", addrCity: "{city}, your hotel’s address goes here",
      carTitle: "By car", carText: "Map pin and directions in one tap.",
      transferTitle: "Transfer", transferText: "Pick-up at Zvartnots airport on request.",
      revTitle: "Reviews", revSub: "Your guests’ real reviews go here.", example: "example",
      footer: "This is a sample website by SKIYAR. Rooms, prices and reviews are examples.",
      credits: "Photos: Unsplash (free licence)",
      altHero: "Green mountains under clouds", altWindow: "Mountain view through a window", altBreakfast: "Breakfast: eggs, tomatoes, cheese, jam"
    }
  };
  var NIGHT_WORDS = { ru: { one: "ночь", few: "ночи", many: "ночей", other: "ночи" }, en: { one: "night", other: "nights" } };

  // Номера: [id, фото, высота 480w, м², гостей, цена, имя hy/ru/en, кровати hy/ru/en, описание hy/ru/en]
  var ROOMS = [
    ["std", "white", 300, 24, 2, 28000, ["Ստանդարտ՝ անտառի տեսարանով", "Стандарт с видом на лес", "Standard, forest view"], ["Մեկ մեծ մահճակալ", "Одна большая кровать", "One large bed"], ["Լուսավոր համար՝ փայտե առաստաղով և աշխատանքային սեղանով։", "Светлый номер с деревянным потолком и рабочим столом.", "A bright room with a timber ceiling and a desk."]],
    ["attic", "attic", 320, 30, 3, 32000, ["Ձեղնահարկ՝ երկու մահճակալով", "Мансарда с двумя кроватями", "Attic room, two beds"], ["Երկու մահճակալ", "Две кровати", "Two beds"], ["Ամբողջովին փայտից՝ թեք առաստաղով և կլոր պատուհանով։", "Вся в дереве, со скошенным потолком и полукруглым окном.", "All in wood, with a sloped ceiling and an arched window."]],
    ["balcony", "sun", 320, 32, 2, 38000, ["Համար պատշգամբով", "Номер с балконом", "Room with a balcony"], ["Մեկ մեծ մահճակալ", "Одна большая кровать", "One large bed"], ["Ապակե դռներ դեպի պատշգամբ. սուրճը՝ արևի առաջին ճառագայթների հետ։", "Стеклянные двери на балкон — кофе с первыми лучами солнца.", "Glass doors to the balcony — coffee with the first light."]],
    ["suite", "snow", 720, 48, 4, 55000, ["Ընտանեկան լյուքս՝ լեռների տեսարանով", "Семейный люкс с видом на горы", "Family suite, mountain view"], ["Մեծ մահճակալ և բազմոց-մահճակալ", "Большая кровать и диван-кровать", "Large bed and a sofa bed"], ["Երկու սենյակ, պատուհան՝ լեռնաշղթային, տեղ երեխաների համար։", "Две комнаты, окно на хребет, место для детей.", "Two rooms, a window onto the ridge, space for children."]]
  ];
  var AMEN = [
    [["Նախաճաշը ներառված է", "Завтрак включён", "Breakfast included"], ["Տեղական պանիր, ձու, մեղր, տնական մուրաբա", "Местный сыр, яйца, мёд, домашнее варенье", "Local cheese, eggs, honey, home-made jam"]],
    [["Wi‑Fi բոլոր համարներում", "Wi‑Fi во всех номерах", "Wi‑Fi in every room"], ["Հարմար է նաև աշխատանքի համար", "Хватает и для работы", "Good enough to work"]],
    [["Անվճար կայանատեղի", "Бесплатная парковка", "Free parking"], ["Հյուրանոցի տարածքում", "На территории", "On the grounds"]],
    [["Տեռաս՝ խորովածի տեղով", "Терраса с мангалом", "Terrace with a grill"], ["Երեկոյան՝ լեռների տեսարանով", "Вечером — с видом на горы", "Evenings with a mountain view"]],
    [["Ժամանում՝ 14:00-ից", "Заезд с 14:00", "Check-in from 14:00"], ["Մեկնում՝ մինչև 12:00", "Выезд до 12:00", "Check-out by 12:00"]],
    [["Տրանսֆեր օդանավակայանից", "Трансфер из аэропорта", "Airport transfer"], ["Նախնական հայտով", "По предварительной заявке", "On request"]]
  ];
  var REVIEWS = [
    [["Արթնացանք, իսկ պատուհանից դուրս՝ ամպեր լեռների վրա։ Նախաճաշը՝ ինչպես տատիկի մոտ։", "Проснулись — за окном облака на горах. Завтрак как у бабушки в деревне.", "We woke up to clouds on the mountains. Breakfast like at grandma’s in the village."], ["Աննա, Երևան", "Анна, Ереван", "Anna, Yerevan"]],
    [["Ամրագրեցինք WhatsApp-ով հինգ րոպեում, դիմավորեցին օդանավակայանում։", "Забронировали через WhatsApp за пять минут, встретили в аэропорту.", "Booked on WhatsApp in five minutes and were met at the airport."], ["Դմիտրի, Մոսկվա", "Дмитрий, Москва", "Dmitry, Moscow"]],
    [["Հանգիստ վայր երեխաների հետ. տեռասը և երեկոյան խորովածը՝ լավագույնը։", "Тихое место для отдыха с детьми, терраса и вечерний шашлык — лучшее.", "A quiet place with kids; the terrace and the evening barbecue were the best part."], ["Sarah, London", "Sarah, London", "Sarah, London"]]
  ];

  var st = { guests: 2 };
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parse(v) { if (!v) return null; var p = v.split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function fmt(d) { return D.date(d, "dm"); }
  function nightsText(n) {
    var w = NIGHT_WORDS[D.lang];
    var word = w ? (w[new Intl.PluralRules(D.locale()).select(n)] || w.other) : "";
    return D.t("nights", { n: n, w: word });
  }
  function stay() {
    var a = parse($("dIn").value), b = parse($("dOut").value);
    if (!a || !b) return null;
    var n = Math.round((b - a) / 864e5);
    return n > 0 ? { a: a, b: b, n: n } : { bad: true };
  }

  function renderRooms() {
    var box = $("roomList"), l = LI[D.lang], s = stay();
    box.textContent = "";
    ROOMS.forEach(function (r) {
      var row = el("article", { "class": "room" });
      var ph = el("div", { "class": "ph" });
      ph.appendChild(el("img", {
        src: "img/" + r[1] + "-480.webp", srcset: "img/" + r[1] + "-480.webp 480w, img/" + r[1] + "-960.webp 960w",
        sizes: "(min-width:760px) 58vw, 100vw", width: "480", height: String(r[2]), loading: "lazy", decoding: "async", alt: r[6][l]
      }));
      row.appendChild(ph);
      var tx = el("div");
      tx.appendChild(el("h3", null, r[6][l]));
      var facts = el("ul", { "class": "facts" });
      facts.appendChild(el("li", null, D.t("sqm", { n: r[3] })));
      facts.appendChild(el("li", null, r[7][l]));
      facts.appendChild(el("li", null, D.t("maxG", { n: r[4] })));
      tx.appendChild(facts);
      tx.appendChild(el("p", null, r[8][l]));
      var pr = el("div", { "class": "price" });
      pr.appendChild(el("b", null, D.price(r[5])));
      pr.appendChild(el("span", null, D.t("perNight")));
      tx.appendChild(pr);
      var ok = s && !s.bad, sum = ok ? D.price(r[5] * s.n) : "";
      tx.appendChild(el("p", { "class": "total" }, ok ? D.t("totalFor", { nights: nightsText(s.n), sum: sum }) : D.t("pickDates")));
      var btn = el("a", { "class": "btn", target: "_blank", rel: "noopener" }, D.t("bookRoom"));
      var fits = st.guests <= r[4];
      if (ok && fits) {
        btn.href = D.wa(D.t("waMsg", {
          room: r[6][l], "in": fmt(s.a), out: fmt(s.b), nights: nightsText(s.n), guests: st.guests, sum: sum,
          inName: D.name ? D.t("inName") : ""
        }));
      } else btn.setAttribute("aria-disabled", "true");
      tx.appendChild(btn);
      if (!fits) tx.appendChild(el("p", { "class": "warn" }, D.t("tooMany", { n: r[4] })));
      row.appendChild(tx);
      box.appendChild(row);
    });
  }

  function renderBar() {
    var sel = $("gSel"), keep = st.guests;
    sel.textContent = "";
    for (var i = 1; i <= 6; i++) sel.appendChild(el("option", { value: String(i) }, String(i)));
    sel.value = String(keep);
    var s = stay();
    $("nights").textContent = !s ? "" : s.bad ? D.t("badDates") : D.t("nightsLine", { "in": fmt(s.a), out: fmt(s.b), nights: nightsText(s.n) });
  }

  function renderStatic() {
    var c = D.city(), l = LI[D.lang];
    $("lead").textContent = c ? D.t("leadCity") : D.t("lead");
    $("addr").textContent = c ? D.t("addrCity") : D.t("addr");
    var ul = $("amenList"); ul.textContent = "";
    AMEN.forEach(function (a) { var li = el("li"); li.appendChild(el("b", null, a[0][l])); li.appendChild(el("span", null, a[1][l])); ul.appendChild(li); });
    var rv = $("revList"); rv.textContent = "";
    REVIEWS.forEach(function (r) {
      var d = el("div", { "class": "rev" });
      d.appendChild(el("q", null, r[0][l]));
      var p = el("p", null, r[1][l]);
      p.appendChild(el("span", { "class": "tagx" }, D.t("example")));
      d.appendChild(p);
      rv.appendChild(d);
    });
  }

  function all() { renderBar(); renderRooms(); }

  var t = new Date(), inD = new Date(t.getTime() + 7 * 864e5), outD = new Date(t.getTime() + 9 * 864e5);
  $("dIn").min = iso(t); $("dOut").min = iso(new Date(t.getTime() + 864e5));
  $("dIn").value = iso(inD); $("dOut").value = iso(outD);
  $("dIn").addEventListener("change", function () {
    var a = parse($("dIn").value);
    if (a) { var m = new Date(a.getTime() + 864e5); $("dOut").min = iso(m); if (!stay() || stay().bad) $("dOut").value = iso(m); }
    all();
  });
  $("dOut").addEventListener("change", all);
  $("gSel").addEventListener("change", function () { st.guests = +$("gSel").value; all(); });

  document.querySelector("footer details").addEventListener("toggle", function () {
    var ul = $("credits"); if (ul.childNodes.length) return;
    fetch("img/credits.json").then(function (r) { return r.json(); }).then(function (list) {
      list.forEach(function (c) { var li = el("li"); li.appendChild(el("a", { href: c.url, target: "_blank", rel: "noopener" }, c.url.replace("https://", ""))); ul.appendChild(li); });
    }).catch(function () {});
  });

  D.init(I18N, function () { renderStatic(); all(); });
})();
