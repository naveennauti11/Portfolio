# Scroll Animation Frame Generation Guide

This folder contains base frames extracted from your portfolio sequence (`base_frame_00.webp`, `mid_frame_45.webp`, `end_frame_89.webp`).

## Specifications for New Frames
- **Aspect Ratio**: 16:9 (Recommended: 1920x1080 or 1280x720)
- **Format**: `.webp` (preferred for high-speed zero-lag web scrubbing) or `.png` / `.jpg`
- **Recommended File Size**: ~50KB - 100KB per frame for instant zero-lag scrub
- **Frame Rate / Timing**: 24fps - 30fps
- **Naming Convention**: 
  `frame_00.webp`, `frame_01.webp`, ... `frame_XX.webp` (or `frame_00_delay-0.066s.webp`)

## How We Plug In Your New Frames
Once you generate your new video or image sequence:
1. Place all your new frames inside `public/sequence/`.
2. Let us know the new frame count (e.g. 120, 180, or 240 frames).
3. The `<canvas>` scrubbing engine in `OpeningScrollIntro.jsx` will automatically adapt to your new sequence range!
