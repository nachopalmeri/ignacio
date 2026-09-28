# Builds the intro's avatar frames (intro/avatar/*.webp) from the expressions
# generated from my photo (scripts/intro-avatar-src/*.png): background removed,
# every frame aligned to the neutral one so swapping expressions doesn't make
# the head jump, and one halftone screen over all of them.
#   python3 scripts/intro-avatar.py   (needs opencv-python-headless, numpy)
from collections import deque
from pathlib import Path
import cv2
import numpy as np

SRC = Path('scripts/intro-avatar-src')
OUT = Path('intro/avatar')
OUT.mkdir(parents=True, exist_ok=True)
FRAMES = ['neutral', 'smile', 'wink', 'surprised', 'side', 'talk', 'blink']


def mask_of(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    H, W = g.shape
    bg = np.zeros((H, W), bool)
    q = deque([(0, x) for x in range(W)] + [(y, 0) for y in range(H)] + [(y, W - 1) for y in range(H)])
    while q:
        y, x = q.popleft()
        if y < 0 or x < 0 or y >= H or x >= W or bg[y, x] or g[y, x] < 228:
            continue
        bg[y, x] = True
        q.extend(((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)))
    m = (~bg).astype(np.uint8) * 255
    return cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))


def head_box(m):
    ys, xs = np.where(m[:330] > 0)
    return ys.min(), (xs.min() + xs.max()) / 2, xs.max() - xs.min()


def halftone(gray, lo, hi, cell=5.0, gamma=1.2):
    """Dots on white; dot size grows with darkness between lo and hi."""
    H, W = gray.shape
    S = 3
    big = cv2.resize(gray, (W * S, H * S), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255
    out = np.full((H * S, W * S), 255, np.uint8)
    c, s = np.cos(np.pi / 4), np.sin(np.pi / 4)
    cs = cell * S
    for gy in np.arange(-W * S, W * S * 2, cs):
        for gx in np.arange(-W * S, W * S * 2, cs):
            x, y = gx * c - gy * s, gx * s + gy * c
            if not (0 <= x < W * S and 0 <= y < H * S):
                continue
            t = np.clip(((1 - big[int(y), int(x)]) - lo) / (hi - lo), 0, 1) ** gamma
            r = np.sqrt(t) * cs * 0.74
            if r > 0.6:
                cv2.circle(out, (int(x * 4), int(y * 4)), int(r * 4), 0, -1, lineType=cv2.LINE_AA, shift=2)
    return cv2.resize(out, (W, H), interpolation=cv2.INTER_AREA)


imgs = {n: cv2.imread(str(SRC / f'{n}.png')) for n in FRAMES}
ref = head_box(mask_of(imgs['neutral']))
for n in FRAMES:
    m = mask_of(imgs[n])
    top, cx, w = head_box(m)
    k = ref[2] / w
    M = np.float32([[k, 0, ref[1] - cx * k], [0, k, ref[0] - top * k]])
    img = cv2.warpAffine(imgs[n], M, (600, 600), borderValue=(255, 255, 255))
    m = cv2.warpAffine(m, M, (600, 600), borderValue=0)
    m[560:, :] = np.maximum(m[560:, :], m[559:560, :])
    g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (3, 3), 0)
    ht = halftone(g, 0.22, 0.95)
    a = cv2.GaussianBlur(m, (3, 3), 0)
    cv2.imwrite(str(OUT / f'{n}.webp'), np.dstack([ht, ht, ht, a]), [cv2.IMWRITE_WEBP_QUALITY, 82])

# the noir shot: kept smooth (a halftone breaks it up too much in the dark),
# just a touch more contrast
r = cv2.cvtColor(cv2.imread(str(SRC / 'reading.png')), cv2.COLOR_BGR2GRAY)
r = cv2.convertScaleAbs(r, alpha=1.12, beta=-8)
cv2.imwrite(str(OUT / 'reading.webp'), r, [cv2.IMWRITE_WEBP_QUALITY, 82])
print('frames written to', OUT)
