// DOM Elements
const elements = {
    fileInput: document.getElementById('fileInput'),
    widthMm: document.getElementById('widthMm'),
    heightMm: document.getElementById('heightMm'),
    dpi: document.getElementById('dpi'),
    nozzleSize: document.getElementById('nozzleSizeMm'),
    svgPreview: document.getElementById('svgPreview'),
    downloadBtn: document.getElementById('downloadBtn'),
    canvas: document.getElementById('hiddenCanvas'),
    spinner: document.getElementById('loadingSpinner'),
    warning: document.getElementById('warningMessage')
};

let currentImage = null;
let svgBlob = null;

// Update preview with optimized processing
async function updatePreview() {
    if (!currentImage) return;

    elements.spinner.style.display = 'flex';
    elements.warning.style.display = 'none';
    elements.downloadBtn.style.display = 'none';

    const widthMm = parseFloat(elements.widthMm.value);
    const heightMm = parseFloat(elements.heightMm.value);
    const dpi = parseInt(elements.dpi.value);
    const nozzleSizeMm = parseFloat(elements.nozzleSize.value);

    const width = Math.round(mmToPx(widthMm, dpi));
    const height = Math.round(mmToPx(heightMm, dpi));

    const dimensionsCheck = checkDimensions(width, height);
    if (!dimensionsCheck.isValid) {
        elements.warning.textContent = dimensionsCheck.message;
        elements.warning.style.display = 'block';
        elements.spinner.style.display = 'none';
        return;
    }

    const nozzlePx = Math.max(1, Math.round(mmToPx(nozzleSizeMm, dpi)));

    elements.canvas.width = width;
    elements.canvas.height = height;
    const ctx = elements.canvas.getContext('2d');
    ctx.drawImage(currentImage, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const rects = processImageData(imageData.data, width, height, nozzlePx);
    const svg = generateSVG(width, height, widthMm, heightMm, dpi, nozzleSizeMm, rects);

    svgBlob = new Blob([svg], { type: 'image/svg+xml' });
    elements.svgPreview.innerHTML = svg;
    elements.downloadBtn.style.display = 'inline-block';
    elements.spinner.style.display = 'none';
}

// Event Listeners
elements.fileInput.addEventListener('change', async (e) => {
    try {
        const file = e.target.files[0];
        if (file) {
            currentImage = await loadImage(file);
            updatePreview();
        }
    } catch (err) {
        console.error('Error loading image:', err);
        alert('Error loading image. Please try a different file.');
    }
});

elements.downloadBtn.addEventListener('click', () => {
    if (svgBlob) {
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement('a');
        