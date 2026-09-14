const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Parthenium leaf SVG path data
const pathStr = `M 500,74
C 510,95 519,128 528,154
C 544,138 572,116 592,132
C 596,150 576,176 568,196
C 596,180 624,170 640,190
C 644,212 616,236 592,256
C 628,248 670,244 688,272
C 692,300 652,324 616,340
C 648,336 688,340 708,368
C 712,396 672,420 632,436
C 668,444 712,464 716,500
C 712,532 664,548 624,552
C 664,568 732,600 736,648
C 732,692 676,708 632,704
C 668,728 720,772 704,820
C 684,852 624,836 576,824
C 596,852 612,884 584,912
C 552,928 524,884 508,860
C 506,892 508,936 500,956
C 492,936 494,892 492,860
C 476,884 448,928 416,912
C 388,884 404,852 424,824
C 376,836 316,852 296,820
C 280,772 332,728 368,704
C 324,708 268,692 264,648
C 268,600 336,568 376,552
C 336,548 288,532 284,500
C 288,464 332,444 368,436
C 328,420 288,396 292,368
C 312,340 352,336 384,340
C 348,324 308,300 312,272
C 330,244 372,248 408,256
C 384,236 356,212 360,190
C 376,170 404,180 432,196
C 424,176 404,150 408,132
C 428,116 456,138 472,154
C 481,128 490,95 500,74
Z`;

// Parse SVG path into dense polygon vertices
function parseSvgPathToPolygon(d) {
  const tokens = d.replace(/[\n\r\t,]/g, ' ').trim().split(/\s+/);
  const polygon = [];
  let currentX = 0;
  let currentY = 0;
  let i = 0;

  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === 'M') {
      currentX = parseFloat(tokens[i++]);
      currentY = parseFloat(tokens[i++]);
      polygon.push([currentX, currentY]);
    } else if (cmd === 'C') {
      const x1 = parseFloat(tokens[i++]);
      const y1 = parseFloat(tokens[i++]);
      const x2 = parseFloat(tokens[i++]);
      const y2 = parseFloat(tokens[i++]);
      const x3 = parseFloat(tokens[i++]);
      const y3 = parseFloat(tokens[i++]);

      // Sample cubic bezier into segments
      const steps = 12;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const mt = 1 - t;
        const px = mt*mt*mt*currentX + 3*mt*mt*t*x1 + 3*mt*t*t*x2 + t*t*t*x3;
        const py = mt*mt*mt*currentY + 3*mt*mt*t*y1 + 3*mt*t*t*y2 + t*t*t*y3;
        polygon.push([px, py]);
      }
      currentX = x3;
      currentY = y3;
    } else if (cmd === 'Z') {
      break;
    }
  }
  return polygon;
}

const leafPolygon = parseSvgPathToPolygon(pathStr);

// Point-in-polygon test (standard ray casting)
function isPointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Flask hit-test in 0..1000 coordinate space
function isPointInFlask(px, py) {
  // Lip: rect x=442..558, y=416..440, rx=7
  if (py >= 416 && py <= 440) {
    if (px >= 442 && px <= 558) return true;
  }
  // Neck: rect x=456..544, y=428..544
  if (py >= 428 && py <= 544) {
    if (px >= 456 && px <= 544) return true;
  }
  // Conical Body: polygon (456,544), (544,544), (628,768), (372,768)
  if (py >= 544 && py <= 768) {
    const t = (py - 544) / (768 - 544);
    const leftX = 456 + (372 - 456) * t;
    const rightX = 544 + (628 - 544) * t;
    if (px >= leftX && px <= rightX) return true;
  }
  // Base: rect x=370..630, y=750..790, rx=20
  if (py >= 750 && py <= 790) {
    if (px >= 370 && px <= 630) {
      if (py > 770) {
        // rounded bottom corners
        if (px < 390) {
          const dx = px - 390, dy = py - 770;
          return (dx*dx + dy*dy) <= 400;
        } else if (px > 610) {
          const dx = px - 610, dy = py - 770;
          return (dx*dx + dy*dy) <= 400;
        }
      }
      return true;
    }
  }
  return false;
}

// Flask measurement tick / graduation hit test (subtle emerald green line inside flask)
function isFlaskTick(px, py) {
  // 3 subtle graduation ticks inside conical body
  if (py >= 620 && py <= 626 && px >= 480 && px <= 540) return true;
  if (py >= 665 && py <= 671 && px >= 465 && px <= 560) return true;
  if (py >= 710 && py <= 716 && px >= 445 && px <= 580) return true;
  return false;
}

// Create PNG buffer from pixel evaluation
function createPNG(width, height, getPixel) {
  const bytesPerPixel = 4;
  const rowSize = 1 + width * bytesPerPixel;
  const raw = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const typeAndData = Buffer.concat([typeBuf, data]);
    let c = 0xffffffff;
    for (let i = 0; i < typeAndData.length; i++) {
      c = crcTable[(c ^ typeAndData[i]) & 0xff] ^ (c >>> 8);
    }
    const crcVal = Buffer.alloc(4);
    crcVal.writeUInt32BE((c ^ 0xffffffff) >>> 0, 0);
    return Buffer.concat([len, typeAndData, crcVal]);
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Generate ICO file combining multiple PNGs
function createICO(pngList) {
  const count = pngList.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // ICO format
  header.writeUInt16LE(count, 4);

  let offset = 6 + 16 * count;
  const dirEntries = [];
  for (const item of pngList) {
    const dir = Buffer.alloc(16);
    dir[0] = item.width >= 256 ? 0 : item.width;
    dir[1] = item.height >= 256 ? 0 : item.height;
    dir[2] = 0;
    dir[3] = 0;
    dir.writeUInt16LE(1, 4); // planes
    dir.writeUInt16LE(32, 6); // bpp
    dir.writeUInt32LE(item.buffer.length, 8);
    dir.writeUInt32LE(offset, 12);
    dirEntries.push(dir);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngList.map(p => p.buffer)]);
}

// Render the Emblem with high-quality 2x2 or 3x3 supersampling
function renderEmblem(size) {
  const samples = size <= 32 ? 4 : 2; // supersampling grid
  const invSamplesSq = 1 / (samples * samples);

  return createPNG(size, size, (px, py) => {
    let accR = 0, accG = 0, accB = 0, accA = 0;

    for (let sy = 0; sy < samples; sy++) {
      for (let sx = 0; sx < samples; sx++) {
        const subX = px + (sx + 0.5) / samples;
        const subY = py + (sy + 0.5) / samples;

        // Normalized to 0..1
        const u = subX / size;
        const v = subY / size;

        // Map to emblem circle
        const cx = 0.5, cy = 0.5;
        const dx = u - cx, dy = v - cy;
        const distSq = dx * dx + dy * dy;
        const rOuter = 0.48;
        const rInner = 0.44;

        if (distSq > rOuter * rOuter) {
          // outside badge: transparent
          continue;
        }

        // Inside emblem badge
        let r, g, b, a = 255;

        // Border ring: vibrant emerald #10b981
        if (distSq > rInner * rInner) {
          r = 16; g = 185; b = 129;
        } else {
          // Emblem background: deep forest gradient #042f1a -> #021f11
          const grad = v; // 0..1
          r = Math.round(4 * (1 - grad) + 2 * grad);
          g = Math.round(47 * (1 - grad) + 31 * grad);
          b = Math.round(26 * (1 - grad) + 17 * grad);

          // Map to 1000x1000 leaf coordinates
          // Scale leaf to fit comfortably inside the circle with breathing room
          const scale = 0.78;
          const leafX = (u - 0.5) / scale * 1000 + 500;
          const leafY = (v - 0.5) / scale * 1000 + 500;

          if (leafX >= 0 && leafX <= 1000 && leafY >= 0 && leafY <= 1000) {
            const inLeaf = isPointInPolygon(leafX, leafY, leafPolygon);

            if (inLeaf) {
              const inFlask = isPointInFlask(leafX, leafY);

              if (inFlask) {
                // Flask is pure bright white #ffffff
                if (isFlaskTick(leafX, leafY)) {
                  // Subtle laboratory tick mark #00873e
                  r = 0; g = 135; b = 62;
                } else {
                  r = 255; g = 255; b = 255;
                }
              } else {
                // Vibrant botanical leaf green #00A84D to #00873E
                const leafGrad = (leafY - 74) / (956 - 74);
                r = Math.round(0 * (1 - leafGrad) + 16 * leafGrad);
                g = Math.round(175 * (1 - leafGrad) + 145 * leafGrad);
                b = Math.round(75 * (1 - leafGrad) + 65 * leafGrad);
              }
            }
          }
        }

        accR += r;
        accG += g;
        accB += b;
        accA += a;
      }
    }

    const finalA = Math.round(accA * invSamplesSq);
    if (finalA === 0) return [0, 0, 0, 0];
    const finalR = Math.round(accR * invSamplesSq);
    const finalG = Math.round(accG * invSamplesSq);
    const finalB = Math.round(accB * invSamplesSq);
    return [finalR, finalG, finalB, finalA];
  });
}

console.log('Rendering favicon assets...');

const png16 = renderEmblem(16);
const png32 = renderEmblem(32);
const png48 = renderEmblem(48);
const png180 = renderEmblem(180);

const publicDir = path.join(__dirname, '..', 'public');

fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), png16);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

const icoBuffer = createICO([
  { width: 16, height: 16, buffer: png16 },
  { width: 32, height: 32, buffer: png32 },
  { width: 48, height: 48, buffer: png48 }
]);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

console.log('Generated:');
console.log('- public/favicon-16x16.png (' + png16.length + ' bytes)');
console.log('- public/favicon-32x32.png (' + png32.length + ' bytes)');
console.log('- public/apple-touch-icon.png (' + png180.length + ' bytes)');
console.log('- public/favicon.ico (' + icoBuffer.length + ' bytes)');
