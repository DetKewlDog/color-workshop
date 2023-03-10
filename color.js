function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(obj) {
    return '#' + Object.values(obj).map(i =>
        (i >= 0 ? (i <= 255 ? i : 255) : 0)
        .toString(16).padStart(2, '0')
    ).join('');
}