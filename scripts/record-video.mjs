// Видео страницы без ffmpeg: кадры CDP screencast → canvas → MediaRecorder (mp4, если Chrome умеет, иначе webm).
// node scripts/record-video.mjs <url> <width> <height> <seconds> <out-without-ext> [scrollSelector] [scrollAtSec]
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [url, W, H, SEC, out, sel, at] = process.argv.slice(2);
const w = +W, h = +H, secs = +SEC;
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9800 + Math.floor(Math.random() * 300);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), "rec-"));
const proc = spawn(chrome, ["--headless=new", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, `--window-size=${w},${h}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl, { maxPayload: 1 << 30 });
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map(); const frames = [];
ws.addEventListener("message", async (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  if (m.method === "Page.screencastFrame") { frames.push({ t: m.params.metadata.timestamp, d: m.params.data }); ws.send(JSON.stringify({ id: ++id, method: "Page.screencastFrameAck", params: { sessionId: m.params.sessionId } })); }
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 });
await send("Page.enable"); await send("Runtime.enable");
await send("Page.navigate", { url });
await sleep(4000);
// Виртуальное время: страница стоит, мы двигаем часы на 1/30 с и снимаем кадр. Плавно при любой скорости съёмки.
const FPS = 30, N = secs * FPS; let expired = null;
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.method === "Emulation.virtualTimeBudgetExpired" && expired) { const r = expired; expired = null; r(); } });
await send("Emulation.setVirtualTimePolicy", { policy: "pause" });
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  if (sel && i === Math.round((+at || 5) * FPS)) await send("Runtime.evaluate", { expression: `document.querySelector(${JSON.stringify(sel)}).scrollIntoView({behavior:"smooth",block:"start"})` });
  await new Promise((r) => { expired = r; send("Emulation.setVirtualTimePolicy", { policy: "advance", budget: 1000 / FPS }); });
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 90 });
  frames.push({ t: i / FPS, d: shot.data });
}
console.log("frames", frames.length, "captured in", (Date.now() - t0) / 1000, "s");

// Чистый Chrome для кодирования: в первом остались виртуальные часы
ws.close(); proc.kill(); await sleep(800);
const port2 = port + 400, prof2 = fs.mkdtempSync(path.join(os.tmpdir(), "enc-"));
const proc2 = spawn(chrome, ["--headless=new", `--remote-debugging-port=${port2}`, `--user-data-dir=${prof2}`, "about:blank"], { stdio: "ignore" });
let t2; for (let i = 0; i < 60 && !t2; i++) { await sleep(200); try { t2 = (await (await fetch(`http://127.0.0.1:${port2}/json`)).json()).find((t) => t.type === "page"); } catch {} }
const ws2 = new WebSocket(t2.webSocketDebuggerUrl); await new Promise((r) => ws2.addEventListener("open", r));
let id2 = 0; const pend2 = new Map(); ws2.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pend2.has(m.id)) { pend2.get(m.id)(m.result); pend2.delete(m.id); } });
const send2 = (method, params = {}) => new Promise((r) => { const i = ++id2; pend2.set(i, r); ws2.send(JSON.stringify({ id: i, method, params })); });
await send2("Runtime.evaluate", { expression: `window.F=[];` });
for (let i = 0; i < frames.length; i += 20) {
  const chunk = frames.slice(i, i + 20).map((f) => [f.t, f.d]);
  await send2("Runtime.evaluate", { expression: `F.push(...${JSON.stringify(chunk)});` });
}
const res = await send2("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: `(async () => {
  const c = document.createElement("canvas"); c.width = ${w}; c.height = ${h}; document.body.appendChild(c); const x = c.getContext("2d");
  const imgs = await Promise.all(F.map(f => new Promise(r => { const i = new Image(); i.onload = () => r([f[0], i]); i.src = "data:image/jpeg;base64," + f[1]; })));
  const mime = ["video/mp4;codecs=avc1.640028", "video/mp4", "video/webm;codecs=vp9"].find(m => MediaRecorder.isTypeSupported(m));
  const st = c.captureStream(0), tr = st.getVideoTracks()[0], rec = new MediaRecorder(st, { mimeType: mime, videoBitsPerSecond: 8000000 }), parts = [];
  rec.ondataavailable = e => parts.push(e.data);
  const done = new Promise(r => rec.onstop = r);
  x.drawImage(imgs[0][1], 0, 0); rec.start(); const wait = ms => new Promise(r => setTimeout(r, ms));
  const t0 = performance.now();
  for (let k = 0; k < imgs.length; k++) { x.drawImage(imgs[k][1], 0, 0); tr.requestFrame(); const due = t0 + (k + 1) * (1000 / 30); await wait(Math.max(0, due - performance.now())); }
  rec.stop(); await done;
  const b = new Blob(parts, { type: mime }); const buf = new Uint8Array(await b.arrayBuffer()); let s = ""; for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode.apply(null, buf.subarray(i, i + 32768));
  return { mime, b64: btoa(s), ms: Math.round(performance.now() - t0), n: imgs.length, uniq: new Set(F.map(f => f[1].length)).size };
})()` });
const v = res.result.value; const ext = v.mime.includes("mp4") ? "mp4" : "webm";
fs.writeFileSync(out + "." + ext, Buffer.from(v.b64, "base64"));
console.log(out + "." + ext, v.mime, fs.statSync(out + "." + ext).size, "encodeMs", v.ms, "frames", v.n, "distinct", v.uniq);
ws2.close(); proc2.kill();
