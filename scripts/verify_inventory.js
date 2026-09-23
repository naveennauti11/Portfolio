import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES, PERSONAL_INFO } from '../src/data/portfolioData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'videos');

console.log('=== Checking Video Inventory in public/videos ===');

let totalWebm = 0;
let totalMp4 = 0;
let totalJpg = 0;
let missing = [];

// Check hero reel
const heroFiles = ['hero_showreel.webm', 'hero_showreel.mp4', 'hero_showreel.jpg'];
heroFiles.forEach(f => {
  const p = path.join(OUTPUT_DIR, f);
  if (!fs.existsSync(p) || fs.statSync(p).size === 0) {
    missing.push(`hero: ${f}`);
  }
});

CATEGORIES.forEach(cat => {
  console.log(`\nCategory: ${cat.title} (${cat.videos.length} videos)`);
  cat.videos.forEach(v => {
    const webmName = path.basename(v.webm);
    const mp4Name = path.basename(v.mp4);
    const jpgName = path.basename(v.poster);

    const webmOk = fs.existsSync(path.join(OUTPUT_DIR, webmName)) && fs.statSync(path.join(OUTPUT_DIR, webmName)).size > 50000;
    const mp4Ok = fs.existsSync(path.join(OUTPUT_DIR, mp4Name)) && fs.statSync(path.join(OUTPUT_DIR, mp4Name)).size > 50000;
    const jpgOk = fs.existsSync(path.join(OUTPUT_DIR, jpgName)) && fs.statSync(path.join(OUTPUT_DIR, jpgName)).size > 5000;

    if (webmOk) totalWebm++; else missing.push(webmName);
    if (mp4Ok) totalMp4++; else missing.push(mp4Name);
    if (jpgOk) totalJpg++; else missing.push(jpgName);

    console.log(`  - [${webmOk && mp4Ok && jpgOk ? 'OK' : 'MISSING'}] ${v.title} (${webmName})`);
  });
});

console.log('\n=== Summary ===');
console.log(`WebM files: ${totalWebm}/25`);
console.log(`MP4 files: ${totalMp4}/25`);
console.log(`Poster JPGs: ${totalJpg}/25`);
console.log(`Missing items:`, missing);
