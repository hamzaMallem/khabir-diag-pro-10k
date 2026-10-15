#!/usr/bin/env bash
# Re-encode the source Audi S8 videos into scrub-friendly H.264 for the web.
# Usage: tools/media/encode.sh <GOP> <CRF>   (GOP 1 = all-intra, best scrubbing, biggest file)
# Sources in review/ are never modified. No audio track (hero is muted).
set -euo pipefail
GOP=${1:-4}; CRF=${2:-26}; OUT=${3:-khabir-next/public/media}
mkdir -p "$OUT"
# The generator stamps a "Dola AI" watermark in the bottom-right corner (dark floor, so delogo blends cleanly).
# Boxes are x:y:w:h in source pixels; keep them if the source resolution changes.
declare -A LOGO=( [desktop]="x=1108:y=652:w=150:h=52" [mobile]="x=598:y=1228:w=110:h=40" )
for v in desktop mobile; do
  ffmpeg -v error -y -i "review/Audi S8 Engineering Film $v.mp4" \
    -an -vf "delogo=${LOGO[$v]}" -c:v libx264 -preset slow -crf "$CRF" -g "$GOP" -keyint_min "$GOP" -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart "$OUT/hero-$v.mp4"
  ffmpeg -v error -y -ss 0 -i "$OUT/hero-$v.mp4" -frames:v 1 -q:v 3 "$OUT/hero-$v-poster.jpg"
done
ls -l "$OUT"
