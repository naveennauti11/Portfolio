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
  title = title.replace(/^\(?\d+[\s_-]*/, '');
  title = title.replace(/\s+/g, ' ').trim();
  title = title.replace(/^copy of\s+/i, '');
  if (!title || /^\d+$/.test(title)) {
    title = `Vault Showcase ${rawName.replace(/\.webm$/i, '')}`;
  }
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function getCategory(relPath) {
  const norm = relPath.toLowerCase().replace(/\\/g, '/');
  if (norm.startsWith('typography')) return 'Typography';
  if (norm.startsWith('motion graphics')) return 'Motion Graphics';
  if (norm.startsWith('ai')) return 'AI Video';
  if (norm.startsWith('cinematic')) return 'Cinematic';
  return 'Commercial';
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
const rawFiles = walkSync(SOURCE_DIR);
console.log(`Found ${rawFiles.length} total WebM files in source`);

// Deduplication map by file size
const sizeMap = new Map();

rawFiles.forEach((file) => {
  const stat = fs.statSync(file);
  const rel = path.relative(SOURCE_DIR, file);
  const size = stat.size;

  if (!sizeMap.has(size)) {
    sizeMap.set(size, file);
  } else {
    // Conflict resolution: prefer Typography over AI, prefer descriptive filename over raw numbers
    const existing = sizeMap.get(size);
    const existingRel = path.relative(SOURCE_DIR, existing).toLowerCase().replace(/\\/g, '/');
    const currentRel = rel.toLowerCase().replace(/\\/g, '/');

    const score = (fRel, fPath) => {
      let s = 0;
      if (fRel.startsWith('typography')) s += 10;
      if (fRel.startsWith('motion graphics')) s += 8;
      if (fRel.startsWith('cinematic')) s += 6;
      if (fRel.startsWith('ai')) s += 2;
      const base = path.basename(fPath, '.webm');
      if (base.length > 5 && !/^\d+$/.test(base)) s += 5; // descriptive name
      if (base.toLowerCase().startsWith('copy of')) s -= 3;
      return s;
    };

    if (score(currentRel, file) > score(existingRel, existing)) {
      console.log(`Deduplicate: replacing ${existingRel} with ${currentRel}`);
      sizeMap.set(size, file);
    } else {
      console.log(`Deduplicate: skipping ${currentRel} in favor of ${existingRel}`);
    }
  }
});

const uniqueFiles = Array.from(sizeMap.values());
console.log(`Unique video files after deduplication: ${uniqueFiles.length}`);

// Sort by category then title
uniqueFiles.sort((a, b) => {
  const relA = path.relative(SOURCE_DIR, a);
  const relB = path.relative(SOURCE_DIR, b);
  const catA = getCategory(relA);
  const catB = getCategory(relB);
  if (catA !== catB) return catA.localeCompare(catB);
  return path.basename(a).localeCompare(path.basename(b));
});

const manifest = [];
const usedTargetFiles = new Set();
let thumbCount = 0;

uniqueFiles.forEach((srcFile, idx) => {
  const rel = path.relative(SOURCE_DIR, srcFile);
  const cat = getCategory(rel);
  const baseName = path.basename(srcFile, '.webm')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const catPrefix = cat.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const safeBase = `${catPrefix}_${String(idx + 1).padStart(3, '0')}_${baseName.slice(0, 32)}`;
  
  const videoName = `${safeBase}.webm`;
  const thumbName = `${safeBase}.webp`;

  const destVideo = path.join(TARGET_DIR, videoName);
  const destThumb = path.join(TARGET_DIR, thumbName);

  usedTargetFiles.add(videoName);
  usedTargetFiles.add(thumbName);

  // Link or copy video
  if (!fs.existsSync(destVideo)) {
    try {
      fs.linkSync(srcFile, destVideo);
    } catch (e) {
      fs.copyFileSync(srcFile, destVideo);
    }
  }

  // Generate WebP poster thumbnail via ffmpeg if not exists
  if (!fs.existsSync(destThumb)) {
    try {
      const cmd = `ffmpeg -y -ss 00:00:01 -i "${srcFile}" -vframes 1 -q:v 70 -vf "scale='min(640,iw)':-2" "${destThumb}"`;
      execSync(cmd, { stdio: 'ignore' });
      thumbCount++;
    } catch (err) {
      console.warn(`Could not extract thumb for ${rel}`);
    }
  }

  // Probe aspect ratio via ffprobe
  let aspect = '9/16';
  try {
    const probeCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${srcFile}"`;
    const dims = execSync(probeCmd, { encoding: 'utf8' }).trim();
    if (dims) {
      const [w, h] = dims.split('x').map(Number);
      if (w && h) {
        aspect = w > h ? '16/9' : '9/16';
      }
    }
  } catch (e) {
    if (rel.toLowerCase().includes('horizontal')) aspect = '16/9';
  }

  const stat = fs.statSync(destVideo);
  const title = cleanTitle(path.basename(srcFile));

  manifest.push({
    id: `vault-${idx + 1}`,
    title,
    category: cat,
    client: 'Vault Archive',
    year: '2026',
    webm: `/media_vault/${videoName}`,
    poster: `/media_vault/${thumbName}`,
    sizeMb: (stat.size / 1024 / 1024).toFixed(1),
    aspect
  });
});

console.log(`Generated ${thumbCount} new thumbnails`);

// Manifest output
const manifestCode = `/**
 * Central Media Vault Manifest (${manifest.length} Master WebM Cuts)
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

// Clean up stale files in TARGET_DIR
const existingMedia = fs.readdirSync(TARGET_DIR);
let removedCount = 0;
existingMedia.forEach((f) => {
  if (!usedTargetFiles.has(f)) {
    try {
      fs.unlinkSync(path.join(TARGET_DIR, f));
      removedCount++;
    } catch (e) {}
  }
});
console.log(`Pruned ${removedCount} stale files from media_vault`);
