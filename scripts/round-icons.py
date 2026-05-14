#!/usr/bin/env python3
"""
Round PNG icon corners to match SVG border radius.
Requires: pip install Pillow
Run: python scripts/round-icons.py
"""
from PIL import Image, ImageDraw
import os, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS_DIR = os.path.join(ROOT, "public", "icons")

# SVG viewBox 36x36, rx=10 → ratio 10/36
RADIUS_RATIO = 10 / 36

sizes = [72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    filename = f"icon-{size}x{size}.png"
    filepath = os.path.join(ICONS_DIR, filename)
    img = Image.open(filepath).convert("RGBA")
    radius = math.floor(size * RADIUS_RATIO)
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    img.putalpha(mask)
    img.save(filepath)
    print(f"Rounded {filename} (r={radius}px)")

print("Done.")
