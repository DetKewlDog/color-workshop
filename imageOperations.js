var colors;

function extractPalette() {
    colors = new Set();
    var canvas = document.querySelector('#image');
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
        if (i % 10 == 0) {
            drawPalette();
            createPalette();
        }
        p_dict[palName].push(colors[i]);
    }
    drawPalette();

}