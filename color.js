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

function hexToHsv(hex) {
    let {r, g, b} = hexToRgb(hex);
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    return {
        r: 42.5 * (h < 0 ? h + 6 : h),
        g: v && c / v * 255,
        b: v
    };
}

function hsvToHex(obj) {
    let [h, s, v] = Object.values(obj).map(i => i / 255);
    h *= 360;
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return rgbToHex({
        r: Math.round(f(5) * 255),
        g: Math.round(f(3) * 255),
        b: Math.round(f(1) * 255)
    });
  }