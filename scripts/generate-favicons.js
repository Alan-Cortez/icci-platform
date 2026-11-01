const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function createIco(pngBuffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved. Must always be 0.
  header.writeUInt16LE(1, 2); // Image type: 1 for icon (.ICO)
  header.writeUInt16LE(pngBuffers.length, 4); // Number of images

  let offset = 6 + 16 * pngBuffers.length;
  const directoryEntries = [];

  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image data size
    entry.writeUInt32LE(offset, 12); // Offset of image data
    directoryEntries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...directoryEntries, ...pngBuffers.map(p => p.buffer)]);
}

async function generate() {
  const root = path.join(__dirname, '..');
  const source = path.join(root, 'public', 'images', 'logo.png');
  const publicDir = path.join(root, 'public');
  const appDir = path.join(root, 'src', 'app');

  console.log('Source:', source);

  // Trim source first to remove any uneven margins so it centers symmetrically in a square
  const trimmedBuffer = await sharp(source).trim().toBuffer();

  const sizes = [16, 32, 48, 96, 144, 180, 192, 512];
  const pngs = {};

  for (const s of sizes) {
    pngs[s] = await sharp(trimmedBuffer)
      .resize(s, s, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ compressionLevel: 9 })
      .toBuffer();
  }

  // 1. Generate ICO with 16, 32, 48
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: pngs[16] },
    { width: 32, height: 32, buffer: pngs[32] },
    { width: 48, height: 48, buffer: pngs[48] },
  ]);

  // Write favicon.ico to public and src/app
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('Written favicon.ico (public & app)');

  // 2. Google-compliant 48x48 icon
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), pngs[48]);
  console.log('Written favicon-48x48.png');

  // 3. Apple Touch Icon 180x180
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngs[180]);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), pngs[180]);
  console.log('Written apple-touch-icon.png & apple-icon.png');

  // 4. Standard PWA / Android / Google 192x192 & 512x512
  fs.writeFileSync(path.join(publicDir, 'icon-192.png'), pngs[192]);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), pngs[512]);
  fs.writeFileSync(path.join(appDir, 'icon.png'), pngs[512]); // Replace the 900KB non-square with a crisp 512x512 square!
  console.log('Written icon-192.png, icon-512.png & updated src/app/icon.png');
}

generate().catch(console.error);
