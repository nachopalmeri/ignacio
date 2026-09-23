#!/usr/bin/env bash
# Lays a licensed track under each demo (video stream copied, not re-encoded).
# Tracks and credits live in music.json; every one is CC BY or CC0 from the
# Free Music Archive. Put the downloaded MP3s in $MUSIC_DIR named
# "<artist> - <title>.mp3".
#   MUSIC_DIR=~/music scripts/video/add-music.sh [demo ...]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cd "$here/../../project-assets/video"
FFMPEG="${FFMPEG:-ffmpeg}"
MUSIC_DIR="${MUSIC_DIR:?set MUSIC_DIR}"
ids=("$@")
if [ ${#ids[@]} -eq 0 ]; then mapfile -t ids < <(node -e "console.log(Object.keys(require('$here/music.json')).join('\n'))"); fi
for id in "${ids[@]}"; do
  { IFS= read -r artist; IFS= read -r title; IFS= read -r start; } < <(node -e "const m=require('$here/music.json')[process.argv[1]];console.log([m.artist,m.title,m.start].join('\\n'))" "$id")
  src="$MUSIC_DIR/$artist - $title.mp3"
  video="$id-demo.mp4"
  dur=$({ "$FFMPEG" -i "$video" 2>&1 || true; } | sed -n 's/.*Duration: \([0-9:.]*\).*/\1/p' | awk -F: '{print $1*3600+$2*60+$3}')
  fade_out=$(awk -v d="$dur" 'BEGIN{printf "%.2f", d-2.8}')
  "$FFMPEG" -loglevel error -y -i "$video" -ss "$start" -t "$dur" -i "$src" \
    -map 0:v:0 -map 1:a:0 -c:v copy \
    -af "afade=t=in:st=0:d=1.2,afade=t=out:st=$fade_out:d=2.8,loudnorm=I=-19:TP=-2:LRA=9" \
    -c:a aac -b:a 128k -ar 44100 -shortest -movflags +faststart "$id.tmp.mp4"
  mv "$id.tmp.mp4" "$video"
  echo "$video ← $artist - $title (from ${start}s)"
done
