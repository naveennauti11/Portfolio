const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VAULT_DIR = path.resolve(__dirname, '../public/media_vault');
const MANIFEST_PATH = path.resolve(__dirname, '../src/data/vaultManifest.js');

if (!fs.existsSync(VAULT_DIR)) {
  console.error('Vault directory not found:', VAULT_DIR);
  process.exit(1);
}

const files = fs.readdirSync(VAULT_DIR).filter(f => f.endsWith('.webm'));
console.log(`Starting 720p web streaming transcode for ${files.length} vault videos...`);

let totalOriginal = 0;
let totalCompressed = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const inputPath = path.join(VAULT_DIR, file);
  const origStat = fs.statSync(inputPath);
  totalOriginal += origStat.size;

  const tempWebm = path.join(VAULT_DIR, `temp_${file}`);
  const mp4Name = file.replace(/\.webm$/i, '.mp4');
  const tempMp4 = path.join(VAULT_DIR, `temp_${mp4Name}`);
  const finalMp4 = path.join(VAULT_DIR, mp4Name);

  // Probe aspect ratio and dimensions
  let isVertical = false;
  try {
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${inputPath}"`).toString().trim();
    const [w, h] = probe.split('x').map(Number);
    if (h > w) isVertical = true;
  } catch (e) {
    isVertical = false;
  }

  // 720p target filter:
  // For horizontal: max 1280 wide, max 720 high
  // For vertical: max 720 wide, max 1280 high
  const scaleFilter = isVertical 
    ? "scale='min(720,iw)':-2" 
    : "scale=-2:'min(720,ih)'";

  console.log(`[${i + 1}/${files.length}] Transcoding 720p: ${file} (${isVertical ? '9:16' : '16:9'}, ${(origStat.size / 1024 / 1024).toFixed(1)}MB)...`);

  try {
    // 1. WebM 720p (VP9 + Opus audio)
    execSync(`ffmpeg -y -i "${inputPath}" -vf "${scaleFilter}" -c:v libvpx-vp9 -b:v 1400k -crf 33 -deadline realtime -cpu-used 4 -c:a libopus -b:a 96k "${tempWebm}"`, { stdio: 'ignore' });
    
    // 2. MP4 720p (H.264 + AAC + faststart for instant <50ms web load)
    execSync(`ffmpeg -y -i "${inputPath}" -vf "${scaleFilter}" -c:v libx264 -crf 23 -preset veryfast -movflags +faststart -c:a aac -b:a 128k "${tempMp4}"`, { stdio: 'ignore' });

    // Swap files
    if (fs.existsSync(tempWebm)) {
      fs.unlinkSync(inputPath);
      fs.renameSync(tempWebm, inputPath);
    }
    if (fs.existsSync(tempMp4)) {
      if (fs.existsSync(finalMp4)) fs.unlinkSync(finalMp4);
      fs.renameSync(tempMp4, finalMp4);
    }

    const newStat = fs.statSync(inputPath);
    totalCompressed += newStat.size;
    console.log(`  -> Done: ${(newStat.size / 1024 / 1024).toFixed(1)}MB (${Math.round((1 - newStat.size / origStat.size) * 100)}% smaller)`);
  } catch (err) {
    console.error(`  -> Error transcoding ${file}:`, err.message);
    if (fs.existsSync(tempWebm)) fs.unlinkSync(tempWebm);
    if (fs.existsSync(tempMp4)) fs.unlinkSync(tempMp4);
  }
}

console.log('--- TRANSCODE COMPLETE ---');
console.log(`Original: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB`);
console.log(`720p WebM: ${(totalCompressed / 1024 / 1024).toFixed(1)}MB`);
