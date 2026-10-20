// Screenshots a URL into ./temporary screenshots/screenshot-N[-label].png (never overwrites).
// Usage: node screenshot.mjs http://localhost:3000 [label] [--width=1440] [--height=900] [--theme=light|dark] [--full]
import { mkdir, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.slice(2).split("=");
    return [k, v ?? true];
  }),
);
const [url = "http://localhost:3000", label] = args.filter((a) => !a.startsWith("--"));
const width = Number(flags.width ?? 1440);
const height = Number(flags.height ?? 900);

const dir = resolve(fileURLToPath(new URL(".", import.meta.url)), "temporary screenshots");
await mkdir(dir, { recursive: true });
const existing = (await readdir(dir)).map((f) => Number(/^screenshot-(\d+)/.exec(f)?.[1] ?? 0));
const n = Math.max(0, ...existing) + 1;
const file = join(dir, `screenshot-${n}${label ? `-${label}` : ""}.png`);

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  if (flags.theme) {
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: flags.theme }]);
  }
  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: file, fullPage: Boolean(flags.full) });
  console.log(file);
} finally {
  await browser.close();
}
