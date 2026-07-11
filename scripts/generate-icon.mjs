import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../assets/icon.png");

const BG = "#080810";
const P1 = "#ff5f35";
const GOLD = "#ffdd00";
const P0 = "#00ff88";
const FONT = "'Hiragino Sans', 'Yu Gothic UI', 'Noto Sans JP', sans-serif";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${BG}"/>
  <text x="256" y="130" text-anchor="middle" dominant-baseline="central"
        font-family="${FONT}" font-size="140" font-weight="900" fill="${P1}">あ</text>
  <text x="256" y="262" text-anchor="middle" dominant-baseline="central"
        font-family="${FONT}" font-size="120" font-weight="900" fill="${GOLD}">い</text>
  <text x="256" y="390" text-anchor="middle" dominant-baseline="central"
        font-family="${FONT}" font-size="140" font-weight="900" fill="${P0}">こ</text>
</svg>
`;

await mkdir(dirname(outPath), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath}`);
