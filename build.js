import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Build Script for StockMunch (ESM version)
 * Copies static SEO assets and PHP files to the output directory.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToCopy = ['sitemap.xml', 'robots.txt'];
const distDir = path.resolve(__dirname, 'dist');
const phpSourceDir = path.resolve(__dirname, 'php');

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

// ========================================
// PHP Build: Copy PHP files to dist with folder structure
// ========================================
console.log('\nBuilding PHP pages...');

// PHP pages that need folder structure (e.g., about.php -> about/index.php)
const phpPages = ['about', 'contact', 'privacy', 'terms', 'regulatory', 'login'];

// Copy PHP index.php to dist root
const phpIndexSrc = path.resolve(phpSourceDir, 'index.php');
const phpIndexDest = path.resolve(distDir, 'index.php');
if (fs.existsSync(phpIndexSrc)) {
  fs.copyFileSync(phpIndexSrc, phpIndexDest);
  console.log(`[SUCCESS] Copied index.php -> dist/index.php`);
}

// Copy each PHP page to its own folder as index.php
phpPages.forEach(page => {
  const srcPath = path.resolve(phpSourceDir, `${page}.php`);
  const destDir = path.resolve(distDir, page);
  const destPath = path.resolve(destDir, 'index.php');

  try {
    if (fs.existsSync(srcPath)) {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`[SUCCESS] Copied ${page}.php -> dist/${page}/index.php`);
    } else {
      console.warn(`[WARNING] Source file ${page}.php not found. Skipping.`);
    }
  } catch (err) {
    console.error(`[ERROR] Failed to copy ${page}.php:`, err.message);
  }
});

// Copy PHP includes folder
const includesSrcDir = path.resolve(phpSourceDir, 'includes');
const includesDestDir = path.resolve(distDir, 'includes');
if (fs.existsSync(includesSrcDir)) {
  copyFolderRecursive(includesSrcDir, includesDestDir);
  console.log(`[SUCCESS] Copied includes/ -> dist/includes/`);
}

// Copy PHP assets folder
const phpAssetsSrcDir = path.resolve(phpSourceDir, 'assets');
const phpAssetsDestDir = path.resolve(distDir, 'php-assets');
if (fs.existsSync(phpAssetsSrcDir)) {
  copyFolderRecursive(phpAssetsSrcDir, phpAssetsDestDir);
  console.log(`[SUCCESS] Copied php/assets/ -> dist/php-assets/`);
}

// Copy .htaccess
const htaccessSrc = path.resolve(phpSourceDir, '.htaccess');
const htaccessDest = path.resolve(distDir, '.htaccess');
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, htaccessDest);
  console.log(`[SUCCESS] Copied .htaccess -> dist/.htaccess`);
}

// Create dashboard folder for React app
const dashboardDir = path.resolve(distDir, 'dashboard');
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}
// Copy the main index.html to dashboard/index.html for React SPA
const reactIndexSrc = path.resolve(distDir, 'index.html');
const dashboardIndexDest = path.resolve(dashboardDir, 'index.html');
if (fs.existsSync(reactIndexSrc)) {
  fs.copyFileSync(reactIndexSrc, dashboardIndexDest);
  console.log(`[SUCCESS] Copied index.html -> dist/dashboard/index.html`);
}

console.log('\nBuild post-processing complete.');

// ========================================
// Helper function to copy folder recursively
// ========================================
function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
