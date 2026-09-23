const fs = require('fs');
const path = require('path');

const VAULT_DIR = path.resolve(__dirname, '../public/media_vault');
const MANIFEST_PATH = path.resolve(__dirname, '../src/data/vaultManifest.js');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Manifest file not found:', MANIFEST_PATH);
  process.exit(1);
}

// Read current manifest
const manifestRaw = fs.readFileSync(MANIFEST_PATH, 'utf8');
const match = manifestRaw.match(/export const VAULT_VIDEOS = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not extract VAULT_VIDEOS from manifest');
  process.exit(1);
}

let videos = JSON.parse(match[1]);
let totalSize = 0;

videos = videos.map(video => {
  const webmName = path.basename(video.webm);
  const webmPath = path.join(VAULT_DIR, webmName);
  const mp4Name = webmName.replace(/\.webm$/i, '.mp4');
  const mp4Path = path.join(VAULT_DIR, mp4Name);

  let sizeMb = video.sizeMb;
  if (fs.existsSync(webmPath)) {
    const stat = fs.statSync(webmPath);
    sizeMb = (stat.size / 1024 / 1024).toFixed(1);
    totalSize += stat.size;
  }

  return {
    ...video,
    mp4: fs.existsSync(mp4Path) ? `/media_vault/${mp4Name}` : video.webm.replace(/\.webm$/i, '.mp4'),
    sizeMb
  };
});

const manifestCode = `/**
 * Central Media Vault Manifest (${videos.length} Master 720p WebM Cuts)
 * Auto-generated with on-demand streaming, 720p optimization and 25KB WebP posters
 */

export const VAULT_VIDEOS = ${JSON.stringify(videos, null, 2)};

export const VAULT_CATEGORIES = [
  { id: 'all', name: 'All Vault Cuts', count: ${videos.length} },
  { id: 'ai', name: 'AI Video', count: ${videos.filter(v => v.category === 'AI Video').length} },
  { id: 'cinematic', name: 'Cinematic', count: ${videos.filter(v => v.category === 'Cinematic').length} },
  { id: 'motion', name: 'Motion Graphics', count: ${videos.filter(v => v.category === 'Motion Graphics').length} },
  { id: 'typography', name: 'Typography', count: ${videos.filter(v => v.category === 'Typography').length} },
  { id: 'commercial', name: 'Commercial', count: ${videos.filter(v => v.category === 'Commercial').length} }
];
`;

fs.writeFileSync(MANIFEST_PATH, manifestCode, 'utf8');
console.log(`Updated manifest with ${videos.length} items. Total WebM size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
