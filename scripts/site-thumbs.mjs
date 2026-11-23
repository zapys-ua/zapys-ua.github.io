// Превью демо-сайтів для першого екрана головної: assets/sites/<ніша>.jpg, 960×600, JPEG.
// node scripts/site-thumbs.mjs [http://localhost:8765] — потрібен локальний сервер сайту і Chrome.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const base = process.argv[2] || "http://localhost:8765";
const niches = ["barber", "sto", "groom", "nails", "massage", "dental"];
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync("assets/sites", { recursive: true });

const port = 9300 + Math.floor(Math.random() * 500);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), "thumbs-"));
const proc = spawn(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, "about:blank"], { stdio: "ignore" });
let target;
for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Network.enable");
await send("Network.setBlockedURLs", { urls: ["*telegram.org*"] });
for (const n of niches) {
  await send("Page.navigate", { url: `${base}/demo/${n}/` });
  await sleep(4500);
  // Підпис студії в кутку на превью не потрібен.
  await send("Runtime.evaluate", { expression: "document.querySelectorAll('.av-credit').forEach(e=>e.remove())" });
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 74, clip: { x: 0, y: 0, width: 1440, height: 900, scale: 960 / 1440 } });
  fs.writeFileSync(`assets/sites/${n}.jpg`, Buffer.from(shot.data, "base64"));
  console.log(n, Math.round(Buffer.from(shot.data, "base64").length / 1024) + " KB");
}
ws.close(); proc.kill();
