import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEQ_DIR = path.resolve(__dirname, '..', 'public', 'sequence');

if (!fs.existsSync(SEQ_DIR)) fs.mkdirSync(SEQ_DIR, { recursive: true });

console.log('Downloading 90 frames of scroll sequence from live site...');

for (let i = 0; i < 90; i++) {
  const pad = i.toString().padStart(2, '0');
  const filename = `frame_${pad}_delay-0.066s.webp`;
  const filePath = path.join(SEQ_DIR, filename);

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    continue;
  }

  const url = `https://naveen-nautiyal-portfolio.vercel.app/sequence/${filename}`;
  try {
    execSync(`curl.exe -sL -o "${filePath}" "${url}"`);
    process.stdout.write(`.`);
  } catch (err) {
    console.error(`Failed ${filename}: ${err.message}`);
  }
}

console.log('\nFinished downloading sequence frames!');
const downloaded = fs.readdirSync(SEQ_DIR).length;
console.log(`Total sequence frames downloaded: ${downloaded}/90`);
