// RGB + HEX
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

// HSV
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

// HSL
function hexToHsl(hex) {
    let {r, g, b} = hexToRgb(hex);
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b), f = -(1 - Math.abs(v + v - c - 1));
    let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    console.log({
        r: 42.5 * (h < 0 ? h + 6 : h) / 255 * 360,
        g: (f ? c / f : 0) * 255,
        b: (v + v - c) / 2
    });
    return {
        r: 42.5 * (h < 0 ? h + 6 : h),
        g: (f ? c / f : 0) * 255,
        b: (v + v - c) / 2
    };
}

function hslToHex(obj) {
    let [h, s, l] = Object.values(obj).map(i => i / 255);
    h *= 360;
    let a = s * Math.min(l, 1 - l);
    let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return rgbToHex({
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255)
    });
}