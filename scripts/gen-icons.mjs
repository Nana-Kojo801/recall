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

// Regenerate regular icons composited over #0F1117 background
const regularSvg = readFileSync(path.join(root, "public/favicon.svg"));
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  const filename = `icon-${size}x${size}.png`;
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#0F1117"/></svg>`
  );
  await sharp(bg)
    .composite([{
      input: await sharp(regularSvg).resize(size, size).png().toBuffer(),
      blend: "over",
    }])
    .png()
    .toFile(path.join(root, "public/icons", filename));
  console.log(`Generated ${filename}`);
}

console.log("Done.");
