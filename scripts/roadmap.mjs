#!/usr/bin/env node
// Статус дорожной карты: текущий этап, прогресс по этапам, следующие задачи.
// Читает docs/ROADMAP.md, ничего не меняет. Запуск: node scripts/roadmap.mjs [--next N]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const text = readFileSync(join(root, "docs", "ROADMAP.md"), "utf8");

const nextArg = process.argv.indexOf("--next");
const nextCount = nextArg > -1 ? Number(process.argv[nextArg + 1]) || 3 : 3;

const stages = [];
for (const line of text.split(/\r?\n/)) {
  const stage = line.match(/^## Этап (\d+)\. (.+)$/);
  if (stage) {
    stages.push({ n: Number(stage[1]), title: stage[2], tasks: [] });
    continue;
  }
  const task = line.match(/^- \[( |x)\] \*\*(\d+\.\d+)\*\* (.+)$/i);
  if (task && stages.length) {
    stages.at(-1).tasks.push({
      done: task[1].toLowerCase() === "x",
      id: task[2],
      text: task[3].split(". Готово, когда")[0],
    });
  }
}

if (!stages.length) {
  console.error("В docs/ROADMAP.md не найдено ни одного этапа «## Этап N. ...»");
  process.exit(1);
}

const bar = (done, total) => {
  const width = 10;
  const filled = total ? Math.round((done / total) * width) : 0;
  return "█".repeat(filled) + "░".repeat(width - filled);
};

const current = stages.find((s) => s.tasks.some((t) => !t.done)) ?? stages.at(-1);
const allTasks = stages.flatMap((s) => s.tasks);
const allDone = allTasks.filter((t) => t.done).length;

console.log(`Avenue: этап ${current.n} «${current.title}»`);
console.log(`Всего закрыто ${allDone} из ${allTasks.length} задач\n`);

for (const s of stages) {
  const done = s.tasks.filter((t) => t.done).length;
  const mark = s === current ? "→" : " ";
  console.log(`${mark} Этап ${s.n} ${bar(done, s.tasks.length)} ${done}/${s.tasks.length}  ${s.title}`);
}

const next = current.tasks.filter((t) => !t.done).slice(0, nextCount);
if (next.length) {
  console.log("\nДальше:");
  for (const t of next) console.log(`  ${t.id}  ${t.text}`);
}
