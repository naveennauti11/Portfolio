const https = require('https');

const chunks = [
  'webpack-859ed9aa51f47af4.js',
  'fd9d1056-b11b2651f33aae7f.js',
  '117-4f5b424f20efdcae.js',
  'main-app-2dcde4753ea0d175.js',
  '952-608a29459f5aeb74.js',
  'app/page-5a9b340ac9943b96.js'
];

async function scan() {
  for (const c of chunks) {
    const url = 'https://naveen-nautiyal-portfolio.vercel.app/_next/static/chunks/' + c;
    await new Promise((resolve) => {
      https.get(url, (res) => {
        let d = '';
        res.on('data', (chunk) => d += chunk);
        res.on('end', () => {
          const yt = d.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))[a-zA-Z0-9_\-]{11}/g) || [];
          const ids = d.match(/videoId\s*:\s*["']([a-zA-Z0-9_\-]+)["']/g) || [];
          console.log(c, 'YouTube matches:', [...new Set(yt)], 'videoId matches:', [...new Set(ids)]);
          resolve();
        });
      }).on('error', () => resolve());
    });
  }
}
scan();
