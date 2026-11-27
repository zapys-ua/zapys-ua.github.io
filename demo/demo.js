// Спільне для демо-сайтів Avenue: вікно запису, живий вільний час з API, поява блоків, підпис студії.
// Кожен сайт підключає цей файл і викликає AV.init({ v: "barber", name: "Борода і Ко" }).
(function () {
  var API = "https://ykhvfjbolifnpstftpzk.supabase.co/functions/v1/zapys-api";
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WD = ["неділю", "понеділок", "вівторок", "середу", "четвер", "п'ятницю", "суботу"];
  var MON = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
  var TODAY = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kiev", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  var cfg = {}, cache = {};

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fm(m) { return ("0" + Math.floor(m / 60)).slice(-2) + ":" + ("0" + (m % 60)).slice(-2); }
  function tomorrow() { var d = new Date(TODAY + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); }
  // «сьогодні о 15:30», «завтра о 10:00», «у суботу, 29 листопада, о 11:00»
  function when(day, start) {
    if (day === TODAY) return "сьогодні о " + fm(start);
    if (day === tomorrow()) return "завтра о " + fm(start);
    var p = day.split("-").map(Number), d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return "у " + WD[d.getUTCDay()] + ", " + p[2] + " " + MON[p[1] - 1] + ", о " + fm(start);
  }
  // Найближче вільне вікно послуги (і майстра): перший день і перший час, які віддає API запису.
  function nextFree(svc, m) {
    var k = svc + "|" + (m || "*");
    if (!cache[k]) cache[k] = fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ a: "slots", b: "demo", v: cfg.v, svc: svc, m: m || "*", tg: "" }) })
      .then(function (r) { return r.json(); })
      .then(function (j) { var d = j && j.days && j.days[0]; return d && d.s && d.s.length ? { day: d.d, start: d.s[0], text: when(d.d, d.s[0]), count: d.s.length } : null; })
      .catch(function () { return null; });
    return cache[k];
  }
  // <span data-free="b_cut" data-m="b_andr">…</span> → «сьогодні о 15:30». Без відповіді API лишається запасний текст.
  function fillFree(root) {
    [].forEach.call((root || document).querySelectorAll("[data-free]"), function (el) {
      nextFree(el.dataset.free, el.dataset.m).then(function (x) {
        if (!x) return;
        el.textContent = (el.dataset.pre || "") + x.text;
        el.classList.add("is-live");
      });
    });
  }

  // Вікно запису: сторінка запису Avenue в режимі embed. На телефоні виїжджає знизу на весь екран.
  function dialog() {
    var d = document.createElement("dialog");
    d.className = "av-dlg"; d.setAttribute("aria-label", "Онлайн-запис");
    d.innerHTML = '<div class="av-dlg-h"><span class="av-dlg-t">Онлайн-запис</span><button class="av-dlg-x" type="button" aria-label="Закрити"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div><iframe title="Онлайн-запис"></iframe>';
    document.body.appendChild(d);
    var fr = d.querySelector("iframe"), t = d.querySelector(".av-dlg-t");
    function close() { d.classList.remove("on"); setTimeout(function () { d.close(); fr.src = "about:blank"; }, RM ? 0 : 280); }
    d.querySelector(".av-dlg-x").addEventListener("click", close);
    d.addEventListener("click", function (e) { if (e.target === d) close(); });
    d.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-book]"); if (!b) return;
      e.preventDefault();
      var svc = b.dataset.book, m = b.dataset.m;
      var src = "../../book/?v=" + cfg.v + "&embed=1" + (svc ? "&svc=" + encodeURIComponent(svc) : "") + (m ? "&m=" + encodeURIComponent(m) : "") + (cfg.acc ? "&acc=" + cfg.acc + "&font=" + encodeURIComponent(cfg.font || "") + (cfg.bg ? "&bg=" + cfg.bg : "") : "");
      if (!d.showModal) { location.href = src.replace("&embed=1", ""); return; }
      fr.src = src;
      t.textContent = b.dataset.title || (svc && b.dataset.name) || "Запис · " + cfg.name;
      d.showModal();
      requestAnimationFrame(function () { d.classList.add("on"); });
    });
  }

  // Поява блоків: .rv отримує .in, коли потрапляє в кадр. Без IntersectionObserver або з reduced motion усе видно одразу.
  function reveal() {
    var els = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window) || RM) { [].forEach.call(els, function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    [].forEach.call(els, function (el) { io.observe(el); });
  }

  // Стрічка, яку на комп'ютері можна тягнути мишею.
  function drag(el) {
    if (!el) return; var sx = 0, sl = 0, down = false, moved = false;
    el.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; el.style.scrollSnapType = "none"; el.classList.add("grab"); });
    addEventListener("pointermove", function (e) { if (!down) return; if (Math.abs(e.clientX - sx) > 4) moved = true; el.scrollLeft = sl - (e.clientX - sx); });
    addEventListener("pointerup", function () { if (!down) return; down = false; el.style.scrollSnapType = ""; el.classList.remove("grab"); });
    el.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  // Підпис студії: маленька пігулка в кутку замість плашки «демо» на весь екран. Закривається.
  function credit() {
    try { if (sessionStorage.getItem("av-credit") === "0") return; } catch (e) {}
    var a = document.createElement("div");
    a.className = "av-credit";
    a.innerHTML = '<a href="../../?s=' + cfg.v + '#sites"><b translate="no">Avenue</b><span>Демо-сайт. Хочу такий</span></a><button type="button" aria-label="Сховати">×</button>';
    a.querySelector("button").addEventListener("click", function () { a.remove(); try { sessionStorage.setItem("av-credit", "0"); } catch (e) {} });
    document.body.appendChild(a);
  }

  // Персональне демо для ліда: ?name=Назва&city=Львів підміняє назву і місто в тексті сторінки.
  // Тільки текстові вузли, тому чужий текст із посилання не стане розміткою.
  var CITY = {
    "Дніпро": ["Дніпрі", "Дніпра"], "Київ": ["Києві", "Києва"], "Львів": ["Львові", "Львова"], "Вінниця": ["Вінниці", "Вінниці"],
    "Одеса": ["Одесі", "Одеси"], "Харків": ["Харкові", "Харкова"], "Запоріжжя": ["Запоріжжі", "Запоріжжя"],
    "Івано-Франківськ": ["Івано-Франківську", "Івано-Франківська"], "Тернопіль": ["Тернополі", "Тернополя"],
    "Луцьк": ["Луцьку", "Луцька"], "Рівне": ["Рівному", "Рівного"], "Полтава": ["Полтаві", "Полтави"], "Черкаси": ["Черкасах", "Черкас"]
  };
  function personalize() {
    var p = new URLSearchParams(location.search);
    var name = (p.get("name") || "").trim().slice(0, 40), city = (p.get("city") || "").trim();
    var c = CITY[city], l = p.get("l") || "";
    // Пристрій власника: один раз відкрити ?owner=1, далі його відкриття не рахуються як «лід відкрив демо». ?owner=0 знімає.
    var o = p.get("owner"), mine = false;
    try { if (o === "1") localStorage.setItem("av_owner", "1"); else if (o === "0") localStorage.removeItem("av_owner"); mine = !!localStorage.getItem("av_owner"); } catch (e) {}
    // Сигнал «лід відкрив демо»: лише код із посилання, без особистих даних.
    if (!mine && /^[0-9a-f]{8}$/.test(l)) fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ a: "seen", l: l }), keepalive: true }).catch(function () {});
    if (!name && !c) return;
    var swap = function (s) {
      if (name) s = s.split(cfg.name).join(name);
      if (c) s = s.replace(/Дніпрі/g, c[0]).replace(/Дніпра/g, c[1]).replace(/Дніпро/g, city);
      return s;
    };
    document.title = swap(document.title);
    // Назва, розбита на частини («Борода <em>і Ко</em>»): такий елемент цілком отримує нову назву. Від глибших до зовнішніх.
    if (name) [].slice.call(document.querySelectorAll("body *")).reverse().forEach(function (el) {
      if (el.children.length && el.textContent.replace(/\s+/g, " ").trim() === cfg.name) el.textContent = name;
    });
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) { var t = swap(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; }
    // Заголовок вікна запису і підписи живуть в атрибутах, їх теж міняємо.
    ["data-title", "aria-label", "alt", "title"].forEach(function (a) {
      [].forEach.call(document.querySelectorAll("[" + a + "]"), function (el) { var v = el.getAttribute(a), t = swap(v); if (t !== v) el.setAttribute(a, t); });
    });
    if (name) {
      cfg.name = name;
      // Назва ліда буває довшою за демо-назву: зменшуємо заголовок, доки він не влізе в ширину.
      [].forEach.call(document.querySelectorAll("h1"), function (h) {
        var fs = parseFloat(getComputedStyle(h).fontSize), r = document.createRange(), maxR = document.documentElement.clientWidth - 16;
        r.selectNodeContents(h);
        for (var i = 0; i < 30 && r.getBoundingClientRect().right > maxR; i++) h.style.fontSize = (fs *= 0.92) + "px";
      });
    }
  }

  var CSS =".av-dlg{border:0;padding:0;margin:auto;width:min(500px,100vw);max-width:100vw;height:min(840px,100dvh);max-height:100dvh;border-radius:24px;background:#fff;color:#14120E;overflow:hidden;opacity:0;transform:translateY(24px) scale(.98);transition:opacity .28s cubic-bezier(.2,.8,.2,1),transform .34s cubic-bezier(.2,.8,.2,1)}" +
    ".av-dlg[open]{display:flex;flex-direction:column}.av-dlg.on{opacity:1;transform:none}" +
    ".av-dlg::backdrop{background:rgba(10,9,7,.62);backdrop-filter:blur(3px)}" +
    ".av-dlg-h{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px 10px 18px;border-bottom:1px solid rgba(20,18,14,.1);font:600 15px/1.2 'Golos Text',system-ui,sans-serif}" +
    ".av-dlg-x{width:44px;height:44px;border-radius:50%;border:1px solid rgba(20,18,14,.14);background:#fff;color:#14120E;display:grid;place-items:center;cursor:pointer;flex:none}" +
    ".av-dlg iframe{flex:1;width:100%;border:0;display:block}" +
    "@media (max-width:539px){.av-dlg{width:100vw;height:100dvh;border-radius:0;transform:translateY(40px)}}" +
    ".av-credit{position:fixed;right:12px;bottom:12px;z-index:40;display:flex;align-items:center;background:rgba(14,13,11,.86);color:#F3EEE4;border-radius:999px;font:500 12px/1 'Golos Text',system-ui,sans-serif;backdrop-filter:blur(8px);box-shadow:0 10px 30px -12px rgba(0,0,0,.5)}" +
    ".av-credit a{display:flex;align-items:center;gap:8px;padding:9px 4px 9px 14px;color:inherit;text-decoration:none}.av-credit b{font-weight:700;letter-spacing:.02em}.av-credit span{opacity:.75}" +
    ".av-credit button{width:32px;height:32px;border:0;background:none;color:inherit;opacity:.6;font-size:16px;cursor:pointer}" +
    // На телефоні знизу кнопка запису, тому підпис студії лишається тільки в підвалі сайту.
    "@media (max-width:759px){.av-credit{display:none}}" +
    ".is-live{animation:avlive .6s cubic-bezier(.2,.8,.2,1)}@keyframes avlive{from{opacity:0;transform:translateY(6px)}}" +
    "@media (prefers-reduced-motion:reduce){.av-dlg{transition:none}.is-live{animation:none}}";

  window.AV = {
    esc: esc, fm: fm, when: when, nextFree: nextFree, fillFree: fillFree, drag: drag, RM: RM, TODAY: TODAY,
    init: function (o) {
      cfg = o;
      var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
      personalize(); dialog(); reveal(); credit(); fillFree();
      requestAnimationFrame(function () { document.documentElement.classList.add("ready"); });
    }
  };
})();
