#!/usr/bin/env bash
# Re-encode the source Audi S8 videos into scrub-friendly H.264 for the web.
# Usage: tools/media/encode.sh <GOP> <CRF>   (GOP 1 = all-intra, best scrubbing, biggest file)
# Sources in review/ are never modified. No audio track (hero is muted).
set -euo pipefail
GOP=${1:-4}; CRF=${2:-26}; OUT=${3:-khabir-next/public/media}
mkdir -p "$OUT"
for v in desktop mobile; do
  ffmpeg -v error -y -i "review/Audi S8 Engineering Film $v.mp4" \
    -an -c:v libx264 -preset slow -crf "$CRF" -g "$GOP" -keyint_min "$GOP" -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart "$OUT/hero-$v.mp4"
  ffmpeg -v error -y -ss 0 -i "$OUT/hero-$v.mp4" -frames:v 1 -q:v 3 "$OUT/hero-$v-poster.jpg"
done
ls -l "$OUT"
