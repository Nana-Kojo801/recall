/**
 * Run: node scripts/gen-icons.mjs
 * Requires: npm install -D sharp
 *
 * Generates maskable PWA icons with full-bleed #F5A623 background
 * so Android adaptive icons show correctly.
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const maskableSvg = readFileSync(path.join(root, "public/icons/maskable-icon.svg"));

const maskableSizes = [192, 512];

for (const size of maskableSizes) {
  const suffix = size === 512 ? "icon-512x512-maskable.png" : `icon-${size}x${size}-maskable.png`;
  await sharp(maskableSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(root, "public/icons", suffix));
  console.log(`Generated ${suffix}`);
}

// Also regenerate regular icons with solid dark background
const regularSvg = readFileSync(path.join(root, "public/favicon.svg"));
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  const filename = `icon-${size}x${size}.png`;
  // Composite favicon SVG onto solid #0F1117 background
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
