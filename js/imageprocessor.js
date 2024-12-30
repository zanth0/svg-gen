// Process image data efficiently
function processImageData(data, width, height, nozzlePx) {
    const rects = [];
    for (let y = 0; y < height; y += nozzlePx) {
        for (let x = 0; x < width; x += nozzlePx) {
            let hasBlack = false;
            pixelBlock: for (let ny = y; ny < Math.min(y + nozzlePx, height); ny++) {
                for (let nx = x; nx < Math.min(x + nozzlePx, width); nx++) {
                    const idx = 4 * (ny * width + nx);
                    if ((data[idx] + data[idx + 1] + data[idx + 2]) / 3 < 128) {
                        hasBlack = true;
                        break pixelBlock;
                    }
                }
            }
            if (hasBlack) {
                rects.push(`<rect x="${x}" y="${y}" width="${nozzlePx}" height="${nozzlePx}"/>`);
            }
        }
    }
    return rects;
}

// Generate SVG
function generateSVG(width, height, widthMm, heightMm, dpi, nozzleSizeMm, rects) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${widthMm}mm" height="${heightMm}mm">
<!-- 3D Print Style SVG
     Physical Size: ${widthMm}mm × ${heightMm}mm
     DPI: ${dpi}
     Nozzle Size: ${nozzleSizeMm}mm -->
<style>rect{fill:black}</style>
${rects.join('')}
</svg>`;