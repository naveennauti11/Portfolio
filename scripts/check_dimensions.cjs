const fs = require('fs');
const { execSync } = require('child_process');

const files = fs.readdirSync('public/media_vault').filter(f => f.endsWith('.webm'));
const results = [];

for (const f of files) {
  try {
    const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "public/media_vault/${f}"`;
    const out = execSync(cmd, { encoding: 'utf8' }).trim();
    const [w, h] = out.split(',').map(Number);
    if (w && h) {
      results.push({ file: f, w, h, isHorizontal: w > h, isSquare: w === h });
    }
  } catch(e) {}
}

const horiz = results.filter(r => r.isHorizontal);
const square = results.filter(r => r.isSquare);
console.log('Total files checked:', results.length);
console.log('True horizontal files (w > h):', horiz.length);
horiz.forEach(r => console.log(`${r.w}x${r.h} | ${r.file}`));

console.log('\nSquare files (w == h):', square.length);
square.forEach(r => console.log(`${r.w}x${r.h} | ${r.file}`));
