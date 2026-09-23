const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = path.resolve(__dirname, '../public/media_vault');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm') && !f.startsWith('temp_'));
const horizontal = [];

for (const f of files) {
  try {
    const fullPath = path.join(dir, f);
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${fullPath}"`).toString().trim();
    const [w, h] = probe.split('x').map(Number);
    if (w > h) {
      horizontal.push({ file: f, width: w, height: h });
    }
  } catch (e) {}
}

console.log(`Horizontal cuts found in media_vault: ${horizontal.length}`);
console.log(JSON.stringify(horizontal, null, 2));
