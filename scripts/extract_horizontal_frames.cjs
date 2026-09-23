const fs = require('fs');
const { execSync } = require('child_process');

const list = [
  'ai_video_007_44.webm',
  'ai_video_009_livey_2min.webm',
  'ai_video_010_upila_video_1_2_jan_mg.webm',
  'ai_video_040_4_aug_cinematic3.webm',
  'ai_video_041_4aug_jewel_cinematic_4.webm',
  'cinematic_069_bcaa_video_final2.webm',
  'cinematic_071_stay_vista_14.webm',
  'motion_graphics_084_map.webm',
  'motion_graphics_102_the_super_saver_store_video.webm',
  'typography_115_guidebook_re2.webm',
  'typography_116_networkfp_2026_final_video.webm',
  'typography_117_network_fp_teaser_1.webm',
  'typography_118_teaser_3_the_community_moment.webm',
  'typography_119_teaser_5_the_countdown_mindset.webm',
  'typography_120_teasor_6_raw.webm'
];

if (!fs.existsSync('public/horizontal_frames')) {
  fs.mkdirSync('public/horizontal_frames', { recursive: true });
}

list.forEach(f => {
  const out = 'public/horizontal_frames/' + f.replace('.webm', '.jpg');
  try {
    execSync(`ffmpeg -y -ss 3 -i "public/media_vault/${f}" -vframes 1 "${out}"`, { stdio: 'ignore' });
    console.log('Extracted:', out);
  } catch(e) {
    console.log('Failed:', f, e.message);
  }
});
