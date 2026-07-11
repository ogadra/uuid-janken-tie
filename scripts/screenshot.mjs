import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXT_PATH = resolve(__dirname, "../.output/chrome-mv3");
const OUT_DIR = resolve(__dirname, "../screenshots");
const VIEWPORT = { width: 1280, height: 800 };

await mkdir(OUT_DIR, { recursive: true });

const context = await chromium.launchPersistentContext("", {
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  headless: false,
  viewport: VIEWPORT,
  args: [
    `--disable-extensions-except=${EXT_PATH}`,
    `--load-extension=${EXT_PATH}`,
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
    "--no-first-run",
    "--no-default-browser-check",
  ],
});

const page = await context.newPage();
await page.setViewportSize(VIEWPORT);
await page.goto("https://uuid-janken.mimifuwa.cc/", { waitUntil: "networkidle" });
await page.waitForSelector(".half", { timeout: 10_000 });
await page.waitForTimeout(400);

await page.click("#half-0");
await page.click("#half-1");

await page.waitForSelector(".half.draw", { timeout: 30_000 });
await page.waitForTimeout(200);
await page.screenshot({ path: resolve(OUT_DIR, "01-draw-moment.png") });
console.log("Wrote 01-draw-moment.png");

await page.waitForSelector(".replay-btn", { timeout: 5_000 });
await page.waitForTimeout(600);
await page.screenshot({ path: resolve(OUT_DIR, "02-replay-shown.png") });
console.log("Wrote 02-replay-shown.png");

await context.close();
