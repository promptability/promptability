// scripts/prepare-extension.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const manifestPath = path.resolve(rootDir, 'manifest.json');
const iconsDir = path.resolve(rootDir, 'public/icons');
const distIconsDir = path.resolve(distDir, 'icons');

// Copy manifest.json to dist folder
console.log('Copying manifest.json to dist folder...');
fs.copySync(manifestPath, path.resolve(distDir, 'manifest.json'));

// Create icons directory in dist if it doesn't exist
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// Copy icons to dist folder
console.log('Copying icons to dist folder...');
fs.copySync(iconsDir, distIconsDir);

console.log('Extension preparation complete!');