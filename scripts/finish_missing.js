import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processItem } from './download_all_cuts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'videos');

// Alternatives with confirmed direct download compatibility
const BACKUPS = [
  // Cinema 05 alternative: Nivant Story
  { prefix: 'cinema_05_bcaa_video', id: '1Nwa4SxJqucyCLr9GpaTYDLVkB50mMSaY', title: 'Nivant Story' },
  // AI 02 alternative: AI 16
  { prefix: 'ai_02_ai_clip44', id: '1DCbT4Rh_KaLIdVcExgFTtA83e1Ee7B10', title: 'AI Neural Cut 16' },
  // AI 05 alternative: AI Avatar 1
  { prefix: 'ai_05_automation_basics', id: '1poWZ6BgyqX4n3XHypv6hReuq-zmujSFm', title: 'AI Avatar 1' }
];

for (const b of BACKUPS) {
  const webm = path.join(OUTPUT_DIR, `${b.prefix}.webm`);
  if (!fs.existsSync(webm) || fs.statSync(webm).size < 1000) {
    console.log(`[BACKUP FETCH] Fetching ${b.prefix}...`);
    await processItem(b.prefix, b.id, b.title);
  }
}
console.log('=== All Backups Ready ===');
