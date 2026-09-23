const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../public/media_vault');
const largeFiles = [
  'ai_video_009_44.webm',
  'typography_089_network_fp_wrap.webm',
  'typography_095_networkfp_2026_final_video.webm'
];

largeFiles.forEach((file) => {
  const input = path.join(targetDir, file);
  const output = path.join(targetDir, `opt_${file}`);
  if (fs.existsSync(input)) {
    console.log(`Compressing ${file}...`);
    try {
      execSync(`ffmpeg -y -i "${input}" -c:v libvpx-vp9 -b:v 1500k -crf 32 -c:a libopus -b:a 128k "${output}"`, { stdio: 'inherit' });
      fs.unlinkSync(input);
      fs.renameSync(output, input);
      const newSize = (fs.statSync(input).size / 1024 / 1024).toFixed(1);
      console.log(`Optimized ${file} to ${newSize} MB`);
    } catch (err) {
      console.error(`Failed ${file}:`, err.message);
    }
  }
});
