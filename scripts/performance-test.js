#!/usr/bin/env node

/**
 * Local performance testing script
 * Alternative to Lighthouse CI for local development
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Performance Test Script\n');

// Check if build directory exists
const buildDir = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Analyze bundle sizes
const buildStatic = path.join(buildDir, 'static');
const analysisResults = {
  js: { files: [], totalSize: 0 },
  css: { files: [], totalSize: 0 },
  assets: { files: [], totalSize: 0 },
};

function analyzeDirectory(dir, type) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      const size = stats.size;
      analysisResults[type].files.push({ name: file, size, sizeKB: Math.round(size / 1024) });
      analysisResults[type].totalSize += size;
    }
  });
}

// Analyze files
analyzeDirectory(path.join(buildStatic, 'js'), 'js');
analyzeDirectory(path.join(buildStatic, 'css'), 'css');

// Calculate total bundle size
const totalSize = analysisResults.js.totalSize + analysisResults.css.totalSize;
const totalSizeKB = Math.round(totalSize / 1024);
const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log('📊 Bundle Analysis Results:\n');

// JavaScript Analysis
console.log('🟨 JavaScript Files:');
analysisResults.js.files.forEach((file) => {
  const status = file.sizeKB > 500 ? '⚠️' : file.sizeKB > 200 ? '🟡' : '✅';
  console.log(`  ${status} ${file.name}: ${file.sizeKB} KB`);
});
console.log(`  📦 Total JS: ${Math.round(analysisResults.js.totalSize / 1024)} KB\n`);

// CSS Analysis
console.log('🟦 CSS Files:');
analysisResults.css.files.forEach((file) => {
  const status = file.sizeKB > 50 ? '⚠️' : file.sizeKB > 20 ? '🟡' : '✅';
  console.log(`  ${status} ${file.name}: ${file.sizeKB} KB`);
});
console.log(`  🎨 Total CSS: ${Math.round(analysisResults.css.totalSize / 1024)} KB\n`);

// Overall Assessment
console.log('🎯 Performance Assessment:');
console.log(`  📦 Total Bundle Size: ${totalSizeKB} KB (${totalSizeMB} MB)`);

// Performance recommendations
const recommendations = [];

if (totalSizeKB > 1000) {
  recommendations.push('⚠️  Bundle size > 1MB - consider code splitting');
}

if (analysisResults.js.files.some((f) => f.sizeKB > 500)) {
  recommendations.push('⚠️  Large JS chunks detected - implement lazy loading');
}

if (analysisResults.css.files.some((f) => f.sizeKB > 50)) {
  recommendations.push('⚠️  Large CSS files detected - consider CSS-in-JS or purging');
}

// Bundle size targets
const targets = {
  excellent: totalSizeKB < 300,
  good: totalSizeKB < 500,
  acceptable: totalSizeKB < 1000,
  warning: totalSizeKB >= 1000,
};

let status = '❌ Needs Improvement';
if (targets.excellent) status = '🏆 Excellent';
else if (targets.good) status = '✅ Good';
else if (targets.acceptable) status = '🟡 Acceptable';

console.log(`  🎖️  Overall Rating: ${status}`);

if (recommendations.length > 0) {
  console.log('\n💡 Recommendations:');
  recommendations.forEach((rec) => console.log(`  ${rec}`));
}

console.log('\n🔍 For detailed Lighthouse analysis, run:');
console.log('  npm run lighthouse  (in CI/CD)');
console.log('  or use Chrome DevTools > Lighthouse tab');

// Write results to file for CI
const resultsFile = path.join(process.cwd(), '.lighthouseci', 'performance-summary.json');
if (!fs.existsSync(path.dirname(resultsFile))) {
  fs.mkdirSync(path.dirname(resultsFile), { recursive: true });
}

fs.writeFileSync(
  resultsFile,
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      bundleSize: { totalKB: totalSizeKB, totalMB: totalSizeMB },
      js: analysisResults.js,
      css: analysisResults.css,
      rating: status,
      recommendations,
    },
    null,
    2
  )
);

console.log(`\n📄 Results saved to: ${resultsFile}`);
