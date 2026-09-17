const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadedDir = 'C:\\Users\\Manuel Adolfo\\.gemini\\antigravity-ide\\brain\\e7e26c91-e119-4da6-b7fb-09e473341ef1\\.user_uploaded';
const outputDir = path.join(__dirname, 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertAll() {
  const files = fs.readdirSync(uploadedDir)
    .filter(f => /\.(jpe?g|png|heic|webp)$/i.test(f))
    .sort(); // sorted by timestamp/filename

  console.log(`Found ${files.length} uploaded files.`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcPath = path.join(uploadedDir, file);
    const targetName = `photo${i + 1}.webp`;
    const targetPath = path.join(outputDir, targetName);

    console.log(`Processing [${i + 1}/${files.length}]: ${file} -> ${targetName}`);
    await sharp(srcPath)
      .rotate() // auto-orient based on EXIF
      .webp({ quality: 82 })
      .toFile(targetPath);
  }

  // Update memoriesData.js
  const memoriesDataPath = path.join(__dirname, 'src', 'data', 'memoriesData.js');
  const photosList = files.map((_, i) => `  'images/photo${i + 1}.webp'`);
  const content = `export const CAROUSEL_PHOTOS = [\n${photosList.join(',\n')}\n];\n`;
  fs.writeFileSync(memoriesDataPath, content, 'utf-8');
  console.log(`Updated memoriesData.js with ${files.length} photos.`);
}

convertAll().catch(err => {
  console.error('Error converting images:', err);
  process.exit(1);
});
