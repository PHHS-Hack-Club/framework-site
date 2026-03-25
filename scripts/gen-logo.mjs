import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");

const iconSvg = fs.readFileSync(path.join(publicDir, "icon.svg"));
const logoSvg = fs.readFileSync(path.join(publicDir, "logo.svg"));

// ─── PNG exports ─────────────────────────────────────────────────────────────
// Icon — 512×512
await sharp(iconSvg)
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "icon.png"));
console.log("✓ icon.png (512×512)");

// Logo — 800×144
await sharp(logoSvg)
    .resize(800, 144)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "logo.png"));
console.log("✓ logo.png (800×144)");

// ─── ICO — pack 16, 32, 48 px PNG images into one .ico file ─────────────────
const sizes = [16, 32, 48];

const pngBuffers = await Promise.all(
    sizes.map((s) =>
        sharp(iconSvg)
            .resize(s, s)
            .png({ compressionLevel: 9 })
            .toBuffer()
    )
);

// ICO binary format
// Header: 6 bytes
const HEADER_SIZE = 6;
const DIR_ENTRY_SIZE = 16;
const dirOffset = HEADER_SIZE + DIR_ENTRY_SIZE * sizes.length;

const header = Buffer.alloc(HEADER_SIZE);
header.writeUInt16LE(0, 0);             // reserved
header.writeUInt16LE(1, 2);             // type: 1 = ICO
header.writeUInt16LE(sizes.length, 4);  // image count

const dirEntries = [];
const imageDataChunks = [];
let dataOffset = dirOffset;

for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i];
    const buf = pngBuffers[i];

    const dir = Buffer.alloc(DIR_ENTRY_SIZE);
    dir.writeUInt8(s === 256 ? 0 : s, 0);  // width (0 = 256)
    dir.writeUInt8(s === 256 ? 0 : s, 1);  // height
    dir.writeUInt8(0, 2);                   // color count
    dir.writeUInt8(0, 3);                   // reserved
    dir.writeUInt16LE(1, 4);                // planes
    dir.writeUInt16LE(32, 6);               // bits per pixel
    dir.writeUInt32LE(buf.length, 8);       // size of image data
    dir.writeUInt32LE(dataOffset, 12);      // offset to image data

    dirEntries.push(dir);
    imageDataChunks.push(buf);
    dataOffset += buf.length;
}

const ico = Buffer.concat([header, ...dirEntries, ...imageDataChunks]);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);
console.log("✓ favicon.ico (16×16, 32×32, 48×48)");

console.log("\nDone. All assets written to /public.");
