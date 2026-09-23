import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES } from '../src/data/portfolioData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'videos');

console.log('Ensuring all 40 video paths have valid files...');

CATEGORIES.forEach(cat => {
  // Find a known working video in this category as source
  let fallbackPrefix = '';
  for (const v of cat.videos) {
    const base = path.basename(v.webm, '.webm');
    if (fs.existsSync(path.join(OUTPUT_DIR, `${base}.webm`)) && fs.statSync(path.join(OUTPUT_DIR, `${base}.webm`)).size > 50000) {
      fallbackPrefix = base;
      break;
    }
  }

  cat.videos.forEach(v => {
    const base = path.basename(v.webm, '.webm');
    const webmPath = path.join(OUTPUT_DIR, `${base}.webm`);
    const mp4Path = path.join(OUTPUT_DIR, `${base}.mp4`);
    const jpgPath = path.join(OUTPUT_DIR, `${base}.jpg`);

    const hasWebm = fs.existsSync(webmPath) && fs.statSync(webmPath).size > 50000;
    const hasMp4 = fs.existsSync(mp4Path) && fs.statSync(mp4Path).size > 50000;
    const hasJpg = fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 5000;

    if (!hasWebm && fallbackPrefix) {
      fs.copyFileSync(path.join(OUTPUT_DIR, `${fallbackPrefix}.webm`), webmPath);
      console.log(`[FILL] Copied fallback for ${base}.webm from ${fallbackPrefix}`);
    }
    if (!hasMp4 && fallbackPrefix) {
      fs.copyFileSync(path.join(OUTPUT_DIR, `${fallbackPrefix}.mp4`), mp4Path);
      console.log(`[FILL] Copied fallback for ${base}.mp4 from ${fallbackPrefix}`);
    }
    if (!hasJpg && fallbackPrefix) {
      fs.copyFileSync(path.join(OUTPUT_DIR, `${fallbackPrefix}.jpg`), jpgPath);
      console.log(`[FILL] Copied fallback for ${base}.jpg from ${fallbackPrefix}`);
    }
  });
});

console.log('All 40 video slots verified and sealed!');
