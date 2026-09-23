const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '../src/data/portfolioData.js');
let content = fs.readFileSync(target, 'utf8');

// Replace any mp4: '/media_vault/....webm' with .mp4
content = content.replace(/mp4:\s*'\/media_vault\/([^']+)\.webm'/g, "mp4: '/media_vault/$1.mp4'");

fs.writeFileSync(target, content, 'utf8');
console.log('Successfully fixed portfolioData.js');
