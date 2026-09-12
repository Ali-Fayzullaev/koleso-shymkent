// Copies the built site files into publish/, the folder netlify.toml
// actually serves. `esbuild` (see package.json "build" script) only
// regenerates script.js in the project root — without this step publish/
// silently goes stale and the live site stops matching the source.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publishDir = path.join(root, 'publish');

const files = [
  'index.html',
  'styles.css',
  'script.css',
  'script.js',
  'assets/favicon.svg',
  'assets/hero.webp',
  'assets/interior.webp',
  'assets/manrope-license.txt',
  'assets/manrope.ttf',
];

for (const relPath of files) {
  const src = path.join(root, relPath);
  const dest = path.join(publishDir, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

console.log(`Synced ${files.length} files into publish/`);
