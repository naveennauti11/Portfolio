/**
 * Video Processing & Conversion Pipeline for Naveen Nautiyal Portfolio
 * 
 * Downloads representative videos from Google Drive folders and encodes
 * ultra-smooth, lightweight WebM (VP9) and MP4 (H.264) video loops using FFmpeg.
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

// Curated selections from Google Drive folders
export const VIDEO_CATALOG = {
  hero_reel: {
    id: '1Ybq4BI1nm696Jcnpmcu-yiB33d4PdbS9', // AMT Cinematic 1
    filename: 'hero_showreel',
    title: 'Naveen Nautiyal Master Showreel 2026',
    duration: 12,
    start: 0,
    aspect: '9/16'
  },
  typography: [
    {
      id: '1L60r2xN5wn14Mq9merHokP28-jupD1cb',
      filename: 'typo_01_digital_campaign',
      title: 'Digital Campaign Kinetic Launch',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1zC7EMrc5AEE-JPmbA_qelDwVDL_55wmg',
      filename: 'typo_02_community_moment',
      title: 'Community Moment Kinetic Teaser',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1SpCKsrheSnBLqCe7ZxmzmUBCeNAk6ItW',
      filename: 'typo_03_countdown_mindset',
      title: 'The Countdown Mindset — Dynamic Sequence',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1wjp03XJT3tt1yU-xE1zMdfTzuSax3u34',
      filename: 'typo_04_britts_college',
      title: 'Britts College Brand Storytelling',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1QzQ5NojjPitQUkzK4TjfeVqDblGE9lnL',
      filename: 'typo_05_guidebook_re2',
      title: 'Editorial Motion Guidebook',
      duration: 8,
      start: 0,
      aspect: '9/16'
    }
  ],
  motion: [
    {
      id: '1KL32tomrkGty7H7MeQKNU2tpg5oeeDSo',
      filename: 'motion_01_new_year',
      title: 'Damani New Year Kinetic Graphics',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1r-0bKq0A_Rb2ucMf_lIfyTRKH7373c5j',
      filename: 'motion_02_christmas_v3',
      title: 'Luxury Brand Holiday Motion Reel',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1YNEh6q9MIYTF2znNDc8B2ViBfBFb3sDn',
      filename: 'motion_03_christmas_updated',
      title: 'Commercial 2D Layer Animation',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1ZwhZQyoCcMKJML1dIQfLGZiRmfeVu6bR',
      filename: 'motion_04_artboard_vector',
      title: 'Vector Brand Identity Animation',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '163iARcUh2PzGGUdCP16DP5EgszaIKU-w',
      filename: 'motion_05_bhogi_ndc',
      title: 'Cultural Festival Motion Poster',
      duration: 8,
      start: 0,
      aspect: '9/16'
    }
  ],
  cinematic: [
    {
      id: '1Ybq4BI1nm696Jcnpmcu-yiB33d4PdbS9',
      filename: 'cinema_01_amt_cinematic',
      title: 'AMT Automotive Cinematic Film',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1xZyhCx-yo0s3HDfJjsvgu9dwSohiXzLr',
      filename: 'cinema_02_royal_cinematic',
      title: 'Royal Heritage Narrative Cut',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1VX_pSeyh81JlCx8lFK-mEIRZfkUVexvt',
      filename: 'cinema_03_network_fp',
      title: 'Network FP High-Paced Promo',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1Gkl-i9e5Y8Mc2Dpayca2bUm_0rI1qbm-',
      filename: 'cinema_04_americal_video',
      title: 'High-Impact Brand Film Production',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1QtRw1_mdEqJea4KgkXFGLmkd4jy94Qsy',
      filename: 'cinema_05_bcaa_video',
      title: 'BCAA Commercial Master Edit',
      duration: 8,
      start: 0,
      aspect: '9/16'
    }
  ],
  vfx: [
    {
      id: '1kBNqL4Va-Xd0NmTtK7E-wseoMSKWXM8C',
      filename: 'vfx_01_silvertank',
      title: 'SilverTank 3D Composite & CGI',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1sYeW1TdZxUJxl07gCFIeNpbdg9C8Qno6',
      filename: 'vfx_02_teaser_particles',
      title: 'Particle Simulation & Title Compositing',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1fU5BhIsnfaHAf4OQgZVKMwuTxlzZg8tA',
      filename: 'vfx_03_networkfp_final',
      title: 'Cyberpunk Multi-Layer VFX Integration',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1JRTEyIvpimI9s3_mDrPCT-B9ws2y6thz',
      filename: 'vfx_04_greenmat_dev',
      title: 'Greenmat Extraction & Screen Replacement',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1FJmYyX2PoW9X3XFLzWpHOSZf7npoGnSC',
      filename: 'vfx_05_greenmat_design',
      title: 'Studio Lighting Match & Chroma Keying',
      duration: 8,
      start: 0,
      aspect: '9/16'
    }
  ],
  ai: [
    {
      id: '1aJBkpYICW255DIPKhV90K0jpy_xtu6zs',
      filename: 'ai_01_naville_c1',
      title: 'Generative AI Surrealism & Neural World',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1Zy-nx-l8oMMRkUEe0Nv84qcIrQm4j4hu',
      filename: 'ai_02_ai_clip44',
      title: 'AI Stylization & Interpolation Flow',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1NesQwBEOwa5dNtn9IatTVb1j3QvFK-aB',
      filename: 'ai_03_adelaide_bucket',
      title: 'Generative Travel Simulation Reel',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1iaQI5x_nBQe6_ixGGqg5bVpS1v9P_DWB',
      filename: 'ai_04_clip19_avatar',
      title: 'Photorealistic AI Avatar Synthesis',
      duration: 8,
      start: 0,
      aspect: '9/16'
    },
    {
      id: '1UzYUghtBTnLCknwis6MaxjDmDMbWBu_6',
      filename: 'ai_05_automation_basics',
      title: 'Neural Automation & Smart Workflow Cut',
      duration: 8,
      start: 0,
      aspect: '9/16'
    }
  ]
};

/**
 * Downloads a video from Google Drive and transcodes to WebM + MP4 + Poster Image
 */
export async function processVideo(item, category = '') {
  const targetPrefix = item.filename;
  const webmPath = path.join(OUTPUT_DIR, `${targetPrefix}.webm`);
  const mp4Path = path.join(OUTPUT_DIR, `${targetPrefix}.mp4`);
  const posterPath = path.join(OUTPUT_DIR, `${targetPrefix}.jpg`);

  if (fs.existsSync(webmPath) && fs.existsSync(mp4Path) && fs.existsSync(posterPath)) {
    console.log(`[SKIP] Already exists: ${targetPrefix}`);
    return;
  }

  const rawDownloadPath = path.join(TEMP_DIR, `${targetPrefix}_raw.mp4`);
  const driveUrl = `https://drive.usercontent.google.com/download?id=${item.id}&export=download`;

  console.log(`\n[DOWNLOADING] ${item.title} (${item.id})...`);
  try {
    // Download first 8MB using curl (plenty for 8-10s at high bitrate)
    execSync(`curl.exe -sL -m 25 --range 0-8000000 -o "${rawDownloadPath}" "${driveUrl}"`, { stdio: 'inherit' });
  } catch (err) {
    console.warn(`[WARN] Range download completed with note: ${err.message}`);
  }

  if (!fs.existsSync(rawDownloadPath) || fs.statSync(rawDownloadPath).size < 100000) {
    console.error(`[ERROR] Download failed or file too small for ${targetPrefix}`);
    return;
  }

  console.log(`[TRANSCODING] ${targetPrefix} to WebM & MP4...`);
  try {
    // 1. Generate WebM (VP9, muted, 720p vertical, crf 30, super fast web loading)
    execSync(`ffmpeg.exe -y -ss ${item.start || 0} -t ${item.duration || 8} -i "${rawDownloadPath}" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:v libvpx-vp9 -b:v 800k -crf 32 -an "${webmPath}"`, { stdio: 'pipe' });

    // 2. Generate MP4 (H.264 fallback, faststart, baseline/main)
    execSync(`ffmpeg.exe -y -ss ${item.start || 0} -t ${item.duration || 8} -i "${rawDownloadPath}" -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -crf 26 -movflags +faststart -an "${mp4Path}"`, { stdio: 'pipe' });

    // 3. Generate Poster thumbnail JPG
    execSync(`ffmpeg.exe -y -ss 0.5 -i "${rawDownloadPath}" -vframes 1 -q:v 2 "${posterPath}"`, { stdio: 'pipe' });

    console.log(`[DONE] Created ${targetPrefix}.webm (${fs.statSync(webmPath).size} bytes), ${targetPrefix}.mp4 (${fs.statSync(mp4Path).size} bytes)`);
  } catch (transcodeErr) {
    console.error(`[TRANSCODE ERROR] ${transcodeErr.message}`);
  } finally {
    if (fs.existsSync(rawDownloadPath)) {
      try { fs.unlinkSync(rawDownloadPath); } catch {}
    }
  }
}

// Run standalone if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('=== Processing Naveen Nautiyal Portfolio Videos ===');
  // Process hero reel first
  await processVideo(VIDEO_CATALOG.hero_reel, 'hero');
  
  // Process 1 representative from each category for initial lightning seed
  for (const cat of ['typography', 'motion', 'cinematic', 'vfx', 'ai']) {
    for (const item of VIDEO_CATALOG[cat]) {
      await processVideo(item, cat);
    }
  }
  console.log('=== Finished Video Processing ===');
}
