/**
 * Run: node scripts/gen-icons.mjs
 * Requires: npm install -D sharp
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Regenerate regular icons with transparent background
const regularSvgRaw = readFileSync(path.join(root, "public/favicon.svg"), "utf8");
// Strip the dark background rect so PNG icons are transparent
const transparentSvg = Buffer.from(regularSvgRaw.replace(/<rect[^>]*fill="#0F1117"[^>]*\/>/, ""));
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  const filename = `icon-${size}x${size}.png`;
  await sharp(transparentSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(root, "public/icons", filename));
  console.log(`Generated ${filename}`);
}

console.log("Done.");
