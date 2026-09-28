# Regenerates intro/portrait.js from cv/photo.jpeg: background removed, side
# light, 96x54 grid of brightness levels (0-15) packed two per byte.
#   python3 scripts/intro-portrait.py
import base64
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

im = Image.open('cv/photo.jpeg').convert('RGB')
a = np.asarray(im).astype(np.float32)
H, W, _ = a.shape
diff = np.abs(a - np.array([220, 220, 220.])).max(axis=2)
bg = np.zeros((H, W), bool)
q = deque([(0, x) for x in range(W)] + [(y, 0) for y in range(H)] + [(y, W - 1) for y in range(H)])
while q:
    y, x = q.popleft()
    if y < 0 or x < 0 or y >= H or x >= W or bg[y, x] or diff[y, x] > 26:
        continue
    bg[y, x] = True
    q.extend(((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)))
fg = np.asarray(Image.fromarray(((~bg) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.5))).astype(np.float32) / 255
g = np.asarray(im.convert('L').filter(ImageFilter.UnsharpMask(radius=8, percent=140, threshold=0))).astype(np.float32)
v = np.clip((g - 20) / 200, 0, 1) ** 1.15
xs = np.linspace(0, 1, W)[None, :]
ys = np.linspace(0, 1, H)[:, None]
v = np.clip(v * np.clip(1.3 - 0.8 * xs, 0.4, 1.2) * np.clip(1.12 - 0.4 * ys, 0.55, 1.1), 0, 1)
v = (0.13 + 0.87 * v) * fg
s = np.asarray(Image.fromarray((v * 255).astype(np.uint8)).resize((96, 54), Image.LANCZOS)).astype(np.float32) / 255
lv = np.clip(np.round(s * 15), 0, 15).astype(np.uint8).flatten()
packed = ((lv[0::2].astype(np.uint16) << 4) | lv[1::2]).astype(np.uint8)
b64 = base64.b64encode(packed.tobytes()).decode()
with open('intro/portrait.js', 'w') as f:
    f.write("// My photo reduced to a 96x54 grid of brightness levels (0-15, two per byte),\n"
            "// side-lit and without the background (scripts/intro-portrait.py). The film\n"
            f"// draws it with code characters.\nexport const PORTRAIT = '{b64}';\n")
