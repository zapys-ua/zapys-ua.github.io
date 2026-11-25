// Сверяет цены пакетов: docs/product.md (источник), главная index.html, оферта oferta/index.html и выплаты на partners/index.html.
// Правило раздела 5 плана: сайт, product.md, оферта и бот совпадают. Запуск: node scripts/check-prices.mjs
// Код выхода 1, если хоть одна цена расходится.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const num = (s) => Number(String(s).replace(/[^\d]/g, ""));
const spaced = (n) => n.toLocaleString("uk-UA").replace(/\s/g, " ");

// product.md: строки таблицы «| Старт | ... | 950 грн | 1 900 грн | 390 грн |»
const product = {};
for (const line of read("docs/product.md").split(/\r?\n/)) {
  const m = line.match(/^\|\s*(Старт|Бізнес|Преміум)\s*\|[^|]*\|\s*([\d\s]+)грн\s*\|\s*([\d\s]+)грн\s*\|\s*([\d\s]+)грн\s*\|/);
  if (m) product[m[1]] = { founder: num(m[2]), launch: num(m[3]), month: num(m[4]) };
}

// Оферта: массив PACKS в скрипте страницы.
const oferta = {};
for (const m of read("oferta/index.html").matchAll(/name:\s*"(Старт|Бізнес|Преміум)"[^}]*?founder:\s*(\d+),\s*launch:\s*(\d+),\s*month:\s*(\d+)/g)) {
  oferta[m[1]] = { founder: +m[2], launch: +m[3], month: +m[4] };
}

// Главная: блок тарифа от <h3>Название</h3> до следующего тарифа. Пробелы и &nbsp; приводим к обычным.
const home = read("index.html").replace(/&nbsp;| | /g, " ");
const block = (name) => {
  const i = home.search(new RegExp(`<h3[^>]*>\\s*${name}\\s*</h3>`));
  return i < 0 ? "" : home.slice(i, i + 2500).split(/<h3[^>]*>\s*(?:Старт|Бізнес|Преміум)\s*<\/h3>/)[1] ?? "";
};

const partners = read("partners/index.html").replace(/&nbsp;| | /g, " ");
let bad = 0;
const names = ["Старт", "Бізнес", "Преміум"];
for (const n of names) {
  const p = product[n];
  if (!p) { console.log(`✗ ${n}: нет строки в docs/product.md`); bad++; continue; }
  const o = oferta[n];
  for (const k of ["founder", "launch", "month"]) {
    if (!o || o[k] !== p[k]) { console.log(`✗ ${n} ${k}: product.md ${p[k]}, оферта ${o ? o[k] : "нет"}`); bad++; }
  }
  const b = block(n);
  for (const k of ["founder", "launch", "month"]) {
    if (!b.includes(spaced(p[k]))) { console.log(`✗ ${n} ${k}: на главной нет «${spaced(p[k])}» в блоке тарифа`); bad++; }
  }
  // Партнёры: строка пакета с ценами и выплатами 30% от запуска засновника и 20% от подписки.
  const row = partners.match(new RegExp(`«${n}»:[^<]*</td><td>[^<]*`))?.[0] ?? "";
  for (const v of [p.founder, p.month, Math.round(p.founder * 0.3), Math.round(p.month * 0.2)]) {
    if (!row.includes(spaced(v) + " грн")) { console.log(`✗ ${n}: на странице партнёров нет «${spaced(v)} грн» в строке пакета`); bad++; }
  }
  if (!bad) console.log(`✓ ${n}: ${p.founder} / ${p.launch} / ${p.month} грн совпадают`);
}
process.exit(bad ? 1 : 0);
