// Replicates favicon.svg geometry at every icon size using 4x supersampling.
// favicon.svg design (36x36 viewBox):
//   shadow : rect(5,5,28,28,rx=8)  fill=#1C1917
//   box    : rect(2,2,28,28,rx=8)  fill=#0F1117  stroke=#F5A623 sw=1.5
//   bar0   : rect(8,18,4,8,rx=1)   fill=#F5A623
//   bar1   : rect(14,13,4,13,rx=1) fill=#F5A623
//   bar2   : rect(20,8,4,18,rx=1)  fill=#F5A623
// Run: node scripts/generate-icons.mjs

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");

// ── PNG encoder ───────────────────────────────────────────────────────────────

function crc32(buf) {
  if (!crc32.t) {
    crc32.t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crc32.t[i] = c;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crc32.t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const l = Buffer.allocUnsafe(4);
  l.writeUInt32BE(data.length, 0);
  const ci = Buffer.concat([t, data]);
  const cv = Buffer.allocUnsafe(4);
  cv.writeUInt32BE(crc32(ci), 0);
  return Buffer.concat([l, t, data, cv]);
}

function encodePNG(pixels, size) {
  const rowLen = size * 4 + 1;
  const raw = Buffer.allocUnsafe(rowLen * size);
  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0;
    for (let x = 0; x < size; x++) {
      const si = (y * size + x) * 4;
      const di = y * rowLen + 1 + x * 4;
      raw[di] = pixels[si]; raw[di + 1] = pixels[si + 1];
      raw[di + 2] = pixels[si + 2]; raw[di + 3] = pixels[si + 3];
    }
  }
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Geometry ──────────────────────────────────────────────────────────────────

function inRRect(px, py, x, y, w, h, rx) {
  if (px < x || px > x + w || py < y || py > y + h) return false;
  const r = Math.min(rx, w / 2, h / 2);
  if (px < x + r && py < y + r) {
    const dx = px - (x + r), dy = py - (y + r);
    return dx * dx + dy * dy <= r * r;
  }
  if (px > x + w - r && py < y + r) {
    const dx = px - (x + w - r), dy = py - (y + r);
    return dx * dx + dy * dy <= r * r;
  }
  if (px < x + r && py > y + h - r) {
    const dx = px - (x + r), dy = py - (y + h - r);
    return dx * dx + dy * dy <= r * r;
  }
  if (px > x + w - r && py > y + h - r) {
    const dx = px - (x + w - r), dy = py - (y + h - r);
    return dx * dx + dy * dy <= r * r;
  }
  return true;
}

// ── Renderer ──────────────────────────────────────────────────────────────────

const SS = 4; // supersampling factor

function renderIcon(size, maskable = false) {
  const ss = size * SS;

  // Maskable: content at 70% scale, centered (30% total padding > 20% safe zone)
  const scale = maskable ? (0.70 * ss) / 36 : ss / 36;
  const ofs   = maskable ? ss * 0.15 : 0;
  const s = (v) => v * scale + ofs;  // SVG coord → supersampled coord
  const sc = (v) => v * scale;       // SVG dimension → supersampled dimension

  const buf = new Uint8Array(ss * ss * 4); // RGBA, starts transparent

  // Fill entire canvas dark for maskable
  if (maskable) {
    for (let i = 0; i < buf.length; i += 4) {
      buf[i] = 0x0f; buf[i + 1] = 0x11; buf[i + 2] = 0x17; buf[i + 3] = 255;
    }
  }

  function fillRRect(svgX, svgY, svgW, svgH, svgRx, r, g, b) {
    const x = s(svgX), y = s(svgY), w = sc(svgW), h = sc(svgH), rx = sc(svgRx);
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = Math.ceil(x + w), y1 = Math.ceil(y + h);
    for (let py = y0; py <= y1; py++) {
      if (py < 0 || py >= ss) continue;
      for (let px = x0; px <= x1; px++) {
        if (px < 0 || px >= ss) continue;
        if (inRRect(px + 0.5, py + 0.5, x, y, w, h, rx)) {
          const i = (py * ss + px) * 4;
          buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
        }
      }
    }
  }

  function strokeRRect(svgX, svgY, svgW, svgH, svgRx, svgSw, r, g, b) {
    const x = s(svgX), y = s(svgY), w = sc(svgW), h = sc(svgH);
    const rx = sc(svgRx), sw = sc(svgSw) / 2;
    const ox = x - sw, oy = y - sw, ow = w + sw * 2, oh = h + sw * 2, orx = rx + sw;
    const ix = x + sw, iy = y + sw, iw = w - sw * 2, ih = h - sw * 2, irx = Math.max(0, rx - sw);
    const x0 = Math.floor(ox), y0 = Math.floor(oy);
    const x1 = Math.ceil(ox + ow), y1 = Math.ceil(oy + oh);
    for (let py = y0; py <= y1; py++) {
      if (py < 0 || py >= ss) continue;
      for (let px = x0; px <= x1; px++) {
        if (px < 0 || px >= ss) continue;
        const cx = px + 0.5, cy = py + 0.5;
        if (inRRect(cx, cy, ox, oy, ow, oh, orx) && !inRRect(cx, cy, ix, iy, iw, ih, irx)) {
          const i = (py * ss + px) * 4;
          buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
        }
      }
    }
  }

  // Draw in painter's order — matches SVG render order
  fillRRect  (5, 5, 28, 28, 8,   0x1c, 0x19, 0x17); // shadow
  fillRRect  (2, 2, 28, 28, 8,   0x0f, 0x11, 0x17); // box fill
  strokeRRect(2, 2, 28, 28, 8, 1.5, 0xf5, 0xa6, 0x23); // box stroke
  fillRRect  (8,  18, 4,  8, 1,  0xf5, 0xa6, 0x23); // bar 0
  fillRRect  (14, 13, 4, 13, 1,  0xf5, 0xa6, 0x23); // bar 1
  fillRRect  (20,  8, 4, 18, 1,  0xf5, 0xa6, 0x23); // bar 2

  // Downsample (box average)
  const SS2 = SS * SS;
  const out = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * ss + (x * SS + sx)) * 4;
          r += buf[i]; g += buf[i + 1]; b += buf[i + 2]; a += buf[i + 3];
        }
      }
      const oi = (y * size + x) * 4;
      out[oi] = r / SS2 | 0; out[oi + 1] = g / SS2 | 0;
      out[oi + 2] = b / SS2 | 0; out[oi + 3] = a / SS2 | 0;
    }
  }
  return out;
}

// ── Generate ──────────────────────────────────────────────────────────────────

const iconsDir = join(root, "public", "icons");
mkdirSync(iconsDir, { recursive: true });

for (const s of [72, 96, 128, 144, 152, 192, 384, 512]) {
  writeFileSync(join(iconsDir, `icon-${s}x${s}.png`), encodePNG(renderIcon(s), s));
  console.log(`✓ icons/icon-${s}x${s}.png`);
}

writeFileSync(join(iconsDir, "icon-512x512-maskable.png"), encodePNG(renderIcon(512, true), 512));
console.log("✓ icons/icon-512x512-maskable.png");

writeFileSync(join(root, "public", "engram-icon-1024.png"), encodePNG(renderIcon(1024), 1024));
console.log("✓ engram-icon-1024.png");

console.log("\nDone!");
