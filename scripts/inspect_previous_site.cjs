const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching Next.js page bundle...');
  const bundle1 = await fetch('https://naveen-nautiyal-portfolio.vercel.app/_next/static/chunks/app/page-5a9b340ac9943b96.js');
  const bundle2 = await fetch('https://naveen-nautiyal-portfolio.vercel.app/_next/static/chunks/952-608a29459f5aeb74.js');
  
  const combined = bundle1 + '\n' + bundle2;
  fs.writeFileSync('scripts/previous_site_bundle.js', combined);
  console.log('Saved bundle, length:', combined.length);

  // Search for any video extensions
  const mp4s = combined.match(/[a-zA-Z0-9_\-\.\/]+?\.(mp4|webm|mov|m4v)/gi) || [];
  console.log('Found video paths:', [...new Set(mp4s)]);

  // Search for YouTube links / embed IDs
  const youtubeLinks = combined.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)[a-zA-Z0-9_\-]+/gi) || [];
  console.log('Found YouTube links:', [...new Set(youtubeLinks)]);

  // Search for Google Drive links
  const driveLinks = combined.match(/drive\.google\.com\/[^\s\"\'\<\>]+/gi) || [];
  console.log('Found Drive links:', [...new Set(driveLinks)]);

  // Search for Cloudinary / Supabase / AWS S3 / Vercel Blob / Firebase
  const cdnLinks = combined.match(/https?:\/\/[^\s\"\'\<\>]+?(?:cloudinary|supabase|amazonaws|blob\.vercel|storage\.googleapis)[^\s\"\'\<\>]+/gi) || [];
  console.log('Found CDN links:', [...new Set(cdnLinks)]);

  // Search for any project objects or arrays
  const projectTitles = combined.match(/title\s*:\s*["']([^"']+)["']/gi) || [];
  console.log('Found project titles count:', projectTitles.length);
  console.log('Sample titles:', projectTitles.slice(0, 15));
}

run().catch(console.error);
