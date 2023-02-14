var refPal = undefined, newPal = undefined;

function updatePaletteImg(pal, btnName) {
    console.log(pal, btnName);
    var canvas = document.querySelector('#canvas');
    ctx = canvas.getContext("2d");
    var btn = document.querySelector('#' + btnName);
    console.log(btn.offsetWidth);
    for (let i = 0; i < pal.length; i++) {
        let c = hexToRgb(pal[i]);
        Object.keys(c).forEach(function(key) {
            c[key] = parseFloat(c[key]) * 0.5 | 0;
        });
        c = rgbToHex(c);
        console.log(c);
        ctx.fillStyle = c;
        ctx.fillRect(i * btn.offsetWidth / pal.length, 0, btn.offsetWidth / pal.length, btn.offsetHeight);
    }
    btn.style.background = "url(" + canvas.toDataURL() + ") no-repeat";
}

function extractPalette() {
    var colors = new Set();
    var canvas = document.querySelector('#canvas');
    ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for(let i = 0; i < data.length; i += 4) {
        if (data[i + 3] == 0) continue;
        var c = {
            r: data[i],
            g: data[i + 1],
            b: data[i + 2]
        };
        colors.add(rgbToHex(c));
    }
    colors = Array.from(colors);
    var pals = colors.length / 10 + colors.length % 10;
    if (p_dict.length + pals > 5) return;
    for (var i = 0; i < colors.length; i++) {
        if (i % 10 == 0 && i != 0) {
            drawPalette();
            createPalette();
        }
        p_dict[palName].push(colors[i]);
    }
    drawPalette();
}