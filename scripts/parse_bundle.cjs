const fs = require('fs');

const text = fs.readFileSync('scripts/previous_site_bundle.js', 'utf8');

// Find all occurrences of "Typography" or categories
const idx = text.indexOf('Typography');
console.log('Index of Typography:', idx);
if (idx !== -1) {
  console.log('Snippet around Typography:');
  console.log(text.slice(Math.max(0, idx - 200), idx + 1500));
}

// Search for any URLs or paths in the bundle
const allUrls = text.match(/https?:\/\/[^"'\s<>]+/g) || [];
console.log('All http URLs count:', allUrls.length);
console.log('Unique URLs:', [...new Set(allUrls)]);

// Search for iframe src, video src, or embeds
const srcs = text.match(/src\s*:\s*["'][^"']+["']/g) || [];
console.log('Sample srcs:', [...new Set(srcs)].slice(0, 30));
