const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const publicDir = path.join(rootDir, 'public');
const staticDir = path.join(rootDir, '.next', 'static');
const destPublicDir = path.join(standaloneDir, 'public');
const destStaticDir = path.join(standaloneDir, '.next', 'static');

console.log('🚀 Preparing Next.js standalone bundle for cPanel deployment...');

if (!fs.existsSync(standaloneDir)) {
  console.error('❌ Error: .next/standalone folder not found. Please run "npm run build" first.');
  process.exit(1);
}

// 1. Copy public folder
if (fs.existsSync(publicDir)) {
  console.log('📦 Copying public/ -> .next/standalone/public/ ...');
  fs.cpSync(publicDir, destPublicDir, { recursive: true });
}

// 2. Copy .next/static folder
if (fs.existsSync(staticDir)) {
  console.log('📦 Copying .next/static/ -> .next/standalone/.next/static/ ...');
  fs.cpSync(staticDir, destStaticDir, { recursive: true });
}

// 3. Copy .env.production if it exists
const envProd = path.join(rootDir, '.env.production');
if (fs.existsSync(envProd)) {
  console.log('📦 Copying .env.production -> .next/standalone/.env.production ...');
  fs.copyFileSync(envProd, path.join(standaloneDir, '.env.production'));
}

console.log('\n✅ Standalone bundle successfully prepared for cPanel!');
console.log(`📁 Deployment folder ready at: ${standaloneDir}`);
console.log('💡 Simply zip the contents inside .next/standalone/ and upload to your cPanel Node.js app directory.\n');

