// Configuration
const config = {
    MAX_WIDTH_PX: 5000,
    MAX_HEIGHT_PX: 5000,
    debounceDelay: 300
};

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Convert mm to pixels
const mmToPx = (mm, dpi) => (mm * dpi) / 25.4;

// Load image file
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();
        
        reader.onload = () => {
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Image load failed'));
            img.src = reader.result;
        };
        reader.onerror = () => reject(new Error('File read failed'));
        reader.readAsDataURL(file);
    });
}

// Check dimensions
function checkDimensions(width, height) {
    return {
        isValid: width <= config.MAX_WIDTH_PX && height <= config.MAX_HEIGHT_PX,
        message: `Maximum allowed size exceeded. Please reduce the size or DPI.`
    };
}