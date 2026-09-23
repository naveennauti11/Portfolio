import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES, PERSONAL_INFO } from '../src/data/portfolioData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const VIDEOS_SRC = path.join(ROOT_DIR, 'public', 'videos');
const TARGET_BASE = path.join(ROOT_DIR, 'previous_website_videos');

const FOLDER_MAP = {
  typography: '01_Typography',
  motion: '02_Motion_Graphics',
  cinematic: '03_Cinematic',
  vfx: '04_VFX_and_CGI',
  ai: '05_AI_Video'
};

console.log('Copying and organizing videos into previous_website_videos...');

// 1. Copy Master Showreel
const heroReel = PERSONAL_INFO.heroReel;
if (heroReel) {
  const targetDir = path.join(TARGET_BASE, '06_Master_Showreel');
  const mp4Src = path.join(ROOT_DIR, 'public', heroReel.mp4);
  const webmSrc = path.join(ROOT_DIR, 'public', heroReel.webm);
  if (fs.existsSync(mp4Src)) {
    fs.copyFileSync(mp4Src, path.join(targetDir, 'Naveen_Nautiyal_Master_Showreel.mp4'));
    console.log('[COPIED] Master Showreel MP4');
  }
  if (fs.existsSync(webmSrc)) {
    fs.copyFileSync(webmSrc, path.join(targetDir, 'Naveen_Nautiyal_Master_Showreel.webm'));
  }
}

// 2. Copy Category Videos
let totalCopied = 0;
for (const cat of CATEGORIES) {
  const folderName = FOLDER_MAP[cat.id] || cat.id;
  const targetDir = path.join(TARGET_BASE, folderName);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  cat.videos.forEach((vid, idx) => {
    const safeTitle = (vid.title || `video_${idx + 1}`)
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .replace(/_+/g, '_');
    const filename = `${String(idx + 1).padStart(2, '0')}_${safeTitle}`;

    const mp4Src = path.join(ROOT_DIR, 'public', vid.mp4);
    const webmSrc = path.join(ROOT_DIR, 'public', vid.webm);

    if (fs.existsSync(mp4Src)) {
      fs.copyFileSync(mp4Src, path.join(targetDir, `${filename}.mp4`));
      totalCopied++;
    }
    if (fs.existsSync(webmSrc)) {
      fs.copyFileSync(webmSrc, path.join(targetDir, `${filename}.webm`));
    }
  });
}

console.log(`Successfully organized ${totalCopied} video cuts across all categories!`);
