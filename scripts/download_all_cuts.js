/**
 * Robust Video Downloader & Transcoder
 * Handles both direct Google Drive downloads and large file confirmation forms.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'videos');
const TEMP_DIR = path.join(ROOT_DIR, 'tmp_videos');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

async function downloadDriveSnippet(fileId, targetPath) {
  const cookiePath = path.join(TEMP_DIR, `cookie_${fileId}.txt`);
  const initialUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;

  try {
    // 1. Try initial direct download with range
    execSync(`curl.exe -sL -m 30 -c "${cookiePath}" -b "${cookiePath}" --range 0-8000000 -o "${targetPath}" "${initialUrl}"`);

    // Check if what was returned is HTML (confirm warning)
    if (fs.existsSync(targetPath)) {
      const header = fs.readFileSync(targetPath, { encoding: 'utf8', flag: 'r' }).slice(0, 500);
      if (header.includes('<!DOCTYPE html>') || header.includes('<form id="download-form"')) {
        // Extract uuid
        const uuidMatch = header.match(/name="uuid"\s+value="([^"]+)"/);
        const uuid = uuidMatch ? uuidMatch[1] : '';
        const confirmUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t${uuid ? `&uuid=${uuid}` : ''}`;
        
        console.log(`[CONFIRM RETRY] Retrying large file with confirm token for ${fileId}...`);
        execSync(`curl.exe -sL -m 40 -c "${cookiePath}" -b "${cookiePath}" --range 0-8000000 -o "${targetPath}" "${confirmUrl}"`);
      }
    }
  } catch (err) {
    console.warn(`[CURL NOTE] ${err.message}`);
  } finally {
    if (fs.existsSync(cookiePath)) {
      try { fs.unlinkSync(cookiePath); } catch {}
    }
  }

  return fs.existsSync(targetPath) && fs.statSync(targetPath).size > 150000;
}

export async function processItem(prefix, fileId, title) {
  const webmPath = path.join(OUTPUT_DIR, `${prefix}.webm`);
  const mp4Path = path.join(OUTPUT_DIR, `${prefix}.mp4`);
  const posterPath = path.join(OUTPUT_DIR, `${prefix}.jpg`);

  if (fs.existsSync(webmPath) && fs.existsSync(mp4Path) && fs.existsSync(posterPath)) {
    console.log(`[EXISTS] ${prefix}`);
    return true;
  }

  const rawPath = path.join(TEMP_DIR, `${prefix}_raw.mp4`);
  console.log(`[START] ${prefix} (${title})...`);

  const success = await downloadDriveSnippet(fileId, rawPath);
  if (!success) {
    console.error(`[FAIL] Could not download valid video for ${prefix}`);
    return false;
  }

  try {
    // 1. WebM (VP9, 720p, 8s, crf 32)
    execSync(`ffmpeg.exe -y -ss 0 -t 8 -i "${rawPath}" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:v libvpx-vp9 -b:v 800k -crf 32 -an "${webmPath}"`, { stdio: 'pipe' });

    // 2. MP4 (H.264, 720p, 8s, crf 26, faststart)
    execSync(`ffmpeg.exe -y -ss 0 -t 8 -i "${rawPath}" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -crf 26 -movflags +faststart -an "${mp4Path}"`, { stdio: 'pipe' });

    // 3. Poster Image
    execSync(`ffmpeg.exe -y -ss 0.5 -i "${rawPath}" -vframes 1 -q:v 2 "${posterPath}"`, { stdio: 'pipe' });

    console.log(`[SUCCESS] Generated ${prefix} (.webm, .mp4, .jpg)`);
    return true;
  } catch (err) {
    console.error(`[TRANSCODE ERR] ${err.message}`);
    return false;
  } finally {
    if (fs.existsSync(rawPath)) {
      try { fs.unlinkSync(rawPath); } catch {}
    }
  }
}

// Target cuts to fulfill any missing files
const MISSING_CUTS = [
  // Cinematic
  { prefix: 'cinema_03_network_fp', id: '1VX_pSeyh81JlCx8lFK-mEIRZfkUVexvt', title: 'Network FP' },
  { prefix: 'cinema_04_americal_video', id: '1Gkl-i9e5Y8Mc2Dpayca2bUm_0rI1qbm-', title: 'Americal Video' },
  { prefix: 'cinema_05_bcaa_video', id: '1QtRw1_mdEqJea4KgkXFGLmkd4jy94Qsy', title: 'BCAA Video' },
  // VFX
  { prefix: 'vfx_03_networkfp_final', id: '1fU5BhIsnfaHAf4OQgZVKMwuTxlzZg8tA', title: 'Network FP Final' },
  { prefix: 'vfx_04_greenmat_dev', id: '1JRTEyIvpimI9s3_mDrPCT-B9ws2y6thz', title: 'Greenmat Dev' },
  { prefix: 'vfx_05_greenmat_design', id: '1FJmYyX2PoW9X3XFLzWpHOSZf7npoGnSC', title: 'Greenmat Design' },
  // AI
  { prefix: 'ai_02_ai_clip44', id: '1Zy-nx-l8oMMRkUEe0Nv84qcIrQm4j4hu', title: 'AI Clip 44' },
  { prefix: 'ai_04_clip19_avatar', id: '1iaQI5x_nBQe6_ixGGqg5bVpS1v9P_DWB', title: 'AI Clip 19 Avatar' },
  { prefix: 'ai_05_automation_basics', id: '1UzYUghtBTnLCknwis6MaxjDmDMbWBu_6', title: 'AI Automation Basics' },
];

for (const cut of MISSING_CUTS) {
  await processItem(cut.prefix, cut.id, cut.title);
}

console.log('=== All Processing Complete ===');
