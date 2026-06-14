import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const sourcePath = path.join(root, "assets/envelope-paper-texture.png");
const outputPath = path.join(root, "assets/envelope-material-atlas.png");
const tempSvgPath = path.join(root, "assets/.envelope-material-atlas.svg");

const atlasWidth = 788;
const atlasHeight = 450;
const tileWidth = 220;
const tileHeight = 150;

const source = fs.readFileSync(sourcePath).toString("base64");
const sourceHref = `data:image/png;base64,${source}`;

const tileFor = () => `
  <svg width="${tileWidth}" height="${tileHeight}" viewBox="0 0 ${tileWidth} ${tileHeight}" preserveAspectRatio="none">
    <image href="${sourceHref}" width="${atlasWidth}" height="${atlasHeight}" preserveAspectRatio="none"/>
  </svg>`;

const cols = Math.ceil(atlasWidth / tileWidth);
const rows = Math.ceil(atlasHeight / tileHeight);
const tiles = [];

for (let row = 0; row < rows; row += 1) {
  for (let col = 0; col < cols; col += 1) {
    const dx = col * tileWidth;
    const dy = row * tileHeight;
    const mirrorX = col % 2 === 1;
    const mirrorY = row % 2 === 1;
    const tx = dx + (mirrorX ? tileWidth : 0);
    const ty = dy + (mirrorY ? tileHeight : 0);
    const sx = mirrorX ? -1 : 1;
    const sy = mirrorY ? -1 : 1;

    tiles.push(`<g transform="translate(${tx} ${ty}) scale(${sx} ${sy})">${tileFor()}</g>`);
  }
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${atlasWidth}" height="${atlasHeight}" viewBox="0 0 ${atlasWidth} ${atlasHeight}">
  <defs>
    <clipPath id="atlasBounds">
      <rect width="${atlasWidth}" height="${atlasHeight}"/>
    </clipPath>
  </defs>
  <rect width="${atlasWidth}" height="${atlasHeight}" fill="#c9a46c"/>
  <g clip-path="url(#atlasBounds)">
    ${tiles.join("\n    ")}
  </g>
</svg>
`;

fs.writeFileSync(tempSvgPath, svg);

const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "suhana-envelope-material-atlas-profile-"));
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--disable-background-networking",
  "--disable-component-update",
  "--disable-sync",
  "--metrics-recording-only",
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${profileDir}`,
  "--window-size=788,450",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=500",
  `--screenshot=${outputPath}`,
  `file://${tempSvgPath}`
], { stdio: "inherit" });

fs.unlinkSync(tempSvgPath);
fs.rmSync(profileDir, { recursive: true, force: true });
