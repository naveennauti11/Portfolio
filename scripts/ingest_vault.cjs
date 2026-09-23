const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_DIR = 'C:\\Users\\navee\\Documents\\Antigravity\\sharp-einstein\\WebM';
const TARGET_DIR = path.resolve(__dirname, '../public/media_vault');
const MANIFEST_PATH = path.resolve(__dirname, '../src/data/vaultManifest.js');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function cleanTitle(rawName) {
  let title = rawName.replace(/\.webm$/i, '');
  title = title.replace(/_/g, ' ');
  title = title.replace(/^\d+[\s_-]*/, '');
  title = title.replace(/\s+/g, ' ').trim();
  if (!title || /^\d+$/.test(title)) {
    title = `Vault Showcase ${rawName.replace(/\.webm$/i, '')}`;
  }
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function getCategory(relPath) {
  const norm = relPath.toLowerCase().replace(/\\/g, '/');
  if (norm.startsWith('ai')) return 'AI Video';
  if (norm.startsWith('cinematic')) return 'Cinematic';
  if (norm.startsWith('motion graphics')) return 'Motion Graphics';
  if (norm.startsWith('typography')) return 'Typography';
  return 'Commercial';
}

function getSafeFilename(relPath, index) {
  const ext = path.extname(relPath);
  const base = path.basename(relPath, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const cat = getCategory(relPath).toLowerCase().replace(/[^a-z0-9]+/g, '_');
  return `${cat}_${String(index + 1).padStart(3, '0')}_${base.slice(0, 30)}${ext}`;
}

function walkSync(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walkSync(full));
    } else if (item.toLowerCase().endsWith('.webm')) {
      results.push(full);
    }
  }
  return results;
}

console.log('--- SCANNING WEBM VAULT ---');
const files = walkSync(SOURCE_DIR);
console.log(`Found ${files.length} WebM master files in ${SOURCE_DIR}`);

const manifest = [];
let thumbSuccess = 0;

files.forEach((srcFile, idx) => {
  const rel = path.relative(SOURCE_DIR, srcFile);
  const cat = getCategory(rel);
  const safeBase = getSafeFilename(rel, idx);
  const safeName = safeBase;
  const thumbName = safeBase.replace(/\.webm$/i, '.webp');

  const destVideo = path.join(TARGET_DIR, safeName);
  const destThumb = path.join(TARGET_DIR, thumbName);

  // 1. Hardlink or copy video file
  if (!fs.existsSync(destVideo)) {
    try {
      fs.linkSync(srcFile, destVideo);
    } catch (e) {
      fs.copyFileSync(srcFile, destVideo);
    }
  }

  // 2. Generate WebP poster thumbnail via ffmpeg if not exists
  if (!fs.existsSync(destThumb)) {
    try {
      const cmd = `ffmpeg -y -ss 00:00:01 -i "${srcFile}" -vframes 1 -q:v 70 -vf "scale='min(640,iw)':-2" "${destThumb}"`;
      execSync(cmd, { stdio: 'ignore' });
      thumbSuccess++;
    } catch (err) {
      console.warn(`Could not extract thumb for ${rel}`);
    }
  }

  const stat = fs.statSync(destVideo);
  const title = cleanTitle(path.basename(srcFile));

  manifest.push({
    id: `vault-${idx + 1}`,
    title,
    category: cat,
    client: 'Vault Archive',
    year: '2026',
    webm: `/media_vault/${safeName}`,
    poster: `/media_vault/${thumbName}`,
    sizeMb: (stat.size / 1024 / 1024).toFixed(1),
    aspect: cat === 'Typography' || rel.toLowerCase().includes('reel') || rel.toLowerCase().includes('shots') ? '9/16' : '16/9'
  });
});

console.log(`Extracted/verified ${thumbSuccess} new WebP thumbnails`);

// Generate JS Manifest
const manifestCode = `/**
 * Central Media Vault Manifest (132 Master WebM Cuts)
 * Auto-generated with on-demand streaming and 25KB WebP posters
 */

export const VAULT_VIDEOS = ${JSON.stringify(manifest, null, 2)};

export const VAULT_CATEGORIES = [
  { id: 'all', name: 'All Vault Cuts', count: ${manifest.length} },
  { id: 'ai', name: 'AI Video', count: ${manifest.filter(v => v.category === 'AI Video').length} },
  { id: 'cinematic', name: 'Cinematic', count: ${manifest.filter(v => v.category === 'Cinematic').length} },
  { id: 'motion', name: 'Motion Graphics', count: ${manifest.filter(v => v.category === 'Motion Graphics').length} },
  { id: 'typography', name: 'Typography', count: ${manifest.filter(v => v.category === 'Typography').length} },
  { id: 'commercial', name: 'Commercial', count: ${manifest.filter(v => v.category === 'Commercial').length} }
];
`;

fs.writeFileSync(MANIFEST_PATH, manifestCode, 'utf8');
console.log(`Wrote manifest with ${manifest.length} entries to ${MANIFEST_PATH}`);
