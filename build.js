const fs = require('fs');
const path = require('path');

/**
 * Build Script for StockMunch
 * Copies static SEO assets to the output directory.
 */

const filesToCopy = ['sitemap.xml', 'robots.txt'];
const distDir = path.resolve(__dirname, 'dist');

// Ensure the distribution directory exists
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('Moving static assets to dist...');

filesToCopy.forEach(file => {
  const srcPath = path.resolve(__dirname, file);
  const destPath = path.resolve(distDir, file);

  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[SUCCESS] Copied ${file} -> dist/${file}`);
    } else {
      console.warn(`[WARNING] Source file ${file} not found in root. Skipping.`);
    }
  } catch (err) {
    console.error(`[ERROR] Failed to copy ${file}:`, err.message);
  }
});

console.log('Build post-processing complete.');
