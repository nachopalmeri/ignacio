#!/usr/bin/env bash
# Rebuilds the 8-second hover previews from the full demos: silent, 640px,
# 20 fps, faststart. Sampled from the middle of the walkthrough, past the
# title card, where the product is actually being used.
#   scripts/video/previews.sh jobbot:jobbot fulbotracker:fulbotracker ...
# Each arg is <demo-name>:<preview-name> (files are <name>-demo.mp4 / <name>-preview.mp4).
set -euo pipefail
cd "$(dirname "$0")/../../project-assets/video"
FFMPEG="${FFMPEG:-ffmpeg}"
for pair in "$@"; do
  demo="${pair%%:*}"; prev="${pair##*:}"
  dur=$({ "$FFMPEG" -i "$demo-demo.mp4" 2>&1 || true; } | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
  start=$(awk -v d="$dur" 'BEGIN{printf "%.1f", d*0.33}')
  "$FFMPEG" -loglevel error -y -ss "$start" -t 8 -i "$demo-demo.mp4" -an \
    -vf "fps=20,scale=640:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -movflags +faststart "$prev-preview.mp4"
  echo "$prev-preview.mp4 from $demo-demo.mp4 @ ${start}s"
done
