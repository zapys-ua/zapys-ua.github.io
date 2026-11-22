// Полностраничный или обрезанный скриншот: node scripts/shot.mjs <url> <ширина> <out.png> [top] [высота]. Нужен локальный Chrome; telegram.org блокируется, ленивые фото грузятся сразу.
// Полностраничный скриншот через Chrome DevTools Protocol без зависимостей.
// node shot.mjs <url> <width> <out.png>
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [url, width, out, top, maxH] = process.argv.slice(2);
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9300 + Math.floor(Math.random() * 500);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), "shot-"));
const proc = spawn(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

const w = +width, mobile = w < 768;
await send("Emulation.setDeviceMetricsOverride", { width: w, height: mobile ? 844 : 900, deviceScaleFactor: 1, mobile });
await send("Page.enable");
await send("Network.enable");
await send("Network.setBlockedURLs", { urls: ["*telegram.org*"] });
await send("Page.navigate", { url });
await sleep(2000);
for (let i = 0; i < 36; i++) { const r = await send("Runtime.evaluate", { expression: "/Завантаження/.test(document.body.innerText)", returnByValue: true }); if (!r.result.value) break; await sleep(500); }
await sleep(1500);
const { result } = await send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true });
const h = result.value; const y0 = +(top||0), hh = maxH ? Math.min(+maxH, h - y0) : h - y0;
await send("Runtime.evaluate", { expression: "document.querySelectorAll('.rv,.steps li').forEach(e=>e.classList.add('in')); document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')" });
await sleep(2500);
await sleep(800);
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: y0, width: w, height: hh, scale: 1 } });
fs.writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(`${out}: ${w}x${h}`);
ws.close(); proc.kill();
