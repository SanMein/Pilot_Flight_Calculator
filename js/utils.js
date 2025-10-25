export function debounce(func, wait) {
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

export function isValidNumber(value) {
    if (value === null || value === undefined || value === '') return false;
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// Additional utility functions
export function formatNumber(value, decimals = 2) {
    if (!isValidNumber(value)) return '0';
    return parseFloat(value).toFixed(decimals);
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}