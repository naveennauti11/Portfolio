# Video Processing & Transcoding Pipeline

This document details the video architecture, folder mapping, and automated transcoding pipeline for **Naveen Nautiyal's Portfolio**.

---

## 1. Video-First Autoplay Architecture

To solve the core client drop-off issue of traditional YouTube embeds (where visitors don't click play), every project features a **self-hosted, dual-format video loop**:

```html
<video
  autoplay
  muted
  loop
  playsinline
  poster="/videos/filename.jpg"
  preload="metadata"
  class="w-full h-full object-cover"
>
  <source src="/videos/filename.webm" type="video/webm" />
  <source src="/videos/filename.mp4" type="video/mp4" />
</video>
```

### Format Hierarchy:
1. **WebM (VP9 codec)**: Primary modern format. Provides up to 40% higher compression efficiency than H.264 at identical perceptual visual quality. Perfect for Chrome, Edge, Firefox, and newer Safari browsers.
2. **MP4 (H.264 / AVC codec)**: Universal fallback format with `+faststart` (moov atom placed at file head for instantaneous zero-wait playback on iOS Safari and legacy web clients).
3. **Poster JPG**: Single-frame fallback captured at `t=0.5s` ensuring the video frame is never blank while initial chunks load.

---

## 2. Google Drive Folder Mapping

The portfolio curates source cuts from Naveen's Google Drive archive (`1ceJPJ3FxvR3iOEKbx0W-uCUrb6QUla6-`):

| Portfolio Category | Google Drive Source Folder | Folder ID | Format / Vibe |
|---|---|---|---|
| **Typography** | `Typography/` | `1or255rEmfA6fzh4-_hm98uGxy7ClGpNy` | Kinetic type, high-energy text tracking, commercial teasers |
| **Motion Graphics** | `PSD Animate/` | `1qUNwUA5w-gIAKyKKpB8o_i97Eg7FDSiO` | 2D/3D brand animations, seasonal social reels, vector graphics |
| **Cinematic** | `Best/Cinematic/` & `Best/` | `1Lr-rFOgeSvzke4smHIQPMZu0wVC4L8TQ` | Narrative color-graded films, automotive reels, brand stories |
| **VFX** | `Best/` & `Some other Edit/` | `1XeWXJYOz65hGTZhzzonHi-8FhDHZwfjK` | Greenmat keying, SilverTank CGI, screen replacement, particles |
| **AI Video** | `AI/` (Shots & Avatars) & `Best/AI/` | `13xF9Jrvj6VhMKvfVjv6TXNtFxeLxeP74` | Neural synthesis, AI avatars, dreamscapes, generative storytelling |

---

## 3. Automated FFmpeg Transcoding Script

Run the automated pipeline at any time:

```bash
node scripts/download_and_convert.js
```

### Under the Hood FFmpeg Commands:

#### WebM Encoding (VP9):
```bash
ffmpeg -y -ss 0 -t 8 -i "input_source.mp4" \
  -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -b:v 800k -crf 32 -an \
  "output.webm"
```

#### MP4 Encoding (H.264):
```bash
ffmpeg -y -ss 0 -t 8 -i "input_source.mp4" \
  -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -preset fast -crf 26 -movflags +faststart -an \
  "output.mp4"
```

#### First Frame Thumbnail Poster:
```bash
ffmpeg -y -ss 0.5 -i "input_source.mp4" -vframes 1 -q:v 2 "output.jpg"
```

---

## 4. Production Deployment Notes (Vercel / Netlify)

- Video loops are kept under 1.5MB each.
- Total portfolio video payload for 25 clips is ~25MB, loading lazily per category row via IntersectionObserver so initial page weight is < 3MB.
- When deploying to Vercel, static files in `/public/videos/` are cached automatically on the global Edge Network CDN with `Cache-Control: public, max-age=31536000, immutable`.
