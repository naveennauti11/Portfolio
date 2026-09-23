# Project Specifications: Naveen Nautiyal Portfolio 2026

This document is the single source of truth for design, media, and architectural specifications agreed upon with Naveen Nautiyal.

---

## 1. Core Principles & Copywriting Rules
* **No Dashes in Copy**: Strictly NO em-dashes (—) or en-dashes (–) anywhere in website copywriting, titles, descriptions, or tooltips.
* **Tone**: Confident, minimalist, editorial, craft-first.
* **Color Palette**: Obsidian Black (`#0A0A0A`), Clean White (`#F5F5F5`), Luxury Warm Amber Gold (`#FFBD59`).

---

## 2. Section Hierarchy (Top to Bottom)
1. **0. Opening Editorial Cover (`CinematicHeroCover.jsx`)**:
   * Master name on left: **NAVEEN NAUTIYAL** (Video Editor & Motion Designer).
   * Right side: Editorial Portrait Card with **Naveen's actual portrait photo image** (`/images/naveen_portrait.webp`), corner viewfinder brackets, subtle parallax float, and status chip `CREATIVE LEAD // NAVEEN NAUTIYAL`.
   * Primary CTA: `Explore Motion Parade` (scrolls to `#motion-parade`).
   * Secondary CTA: `Get In Touch` (scrolls to `#contact`).
   * No "Watch Reels" button at the start.

2. **1. Crafting Stories Panel (`Hero.jsx`)**:
   * Headline: **CRAFTING STORIES THROUGH VIDEO EDITING.**
   * Background: **Dual-buffer playlist of ALL horizontal 16:9 widescreen videos**, strictly excluding pure typography/text-heavy videos.
   * **Minute Blur on Video**: Applied `blur-[2.5px]` on background video so background text in videos never clashes or overlaps with the foreground typography.
   * Dual-slot seamless cross-dissolve transition when video ends.
   * "Play With Sound" button to open active clip in high-fidelity lightbox.

3. **2. Motion Parade (`LivingVerticalStrip.jsx`)**:
   * Placed **DIRECTLY AFTER Crafting Stories**.
   * Speed: Always initialized at **2x Speed** by default (with active gold toggle badge).
   * Engine: 100% GPU Hardware-Accelerated CSS Marquee (`transform: translate3d`) for 0% CPU usage and rock-solid 60-120fps.
   * Hover pauses marquee; clicking opens video modal with full audio.

4. **3. Selected Work (`SelectedWork.jsx`)**:
   * 4 Flagship Case Studies with deep dive modals.
   * **Complete Vault Archive Drawer**: **OPEN BY DEFAULT**, displaying the **Cinematic** video category filter automatically to showcase full video variety right away. Can be collapsed by the user if desired.

5. **4. Process, Arsenal, About & Contact**:
   * Process flow, tool capability radar, editorial timeline, service tiers, inquiry contact modal.

---

## 3. Video Assets & Ingest Specs
* Total unique master cuts cataloged: 98 verified cuts.
* All files strictly under GitHub's 100MB per-file limit.
* WebM dual-pipeline with 25KB WebP thumbnails.
