var refPal = undefined, newPal = undefined;

var filename = undefined;

function updatePaletteImg(pal, btnName) {
    let canvas = document.querySelector('#color-canvas');
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let btn = document.querySelector('#' + btnName);
    for (let i = 0; i < pal.length; i++) {
        let c = hexToRgb(pal[i]);
        Object.keys(c).forEach(function(key) {
            c[key] = parseFloat(c[key]) * 0.5 | 0;
        });
        c = rgbToHex(c);
        ctx.fillStyle = c;
        ctx.fillRect(i * btn.offsetWidth / pal.length, 0, btn.offsetWidth / pal.length, btn.offsetHeight);
    }
    btn.style.background = "url(" + canvas.toDataURL() + ") no-repeat";
}

function applyPalette() {
    let canvas = document.querySelector('#canvas');
    let ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    newColors = []
    for(let i = 0; i < data.length; i += 4) {
        if (data[i + 3] == 0) continue;
        let c = {
            r: data[i],
            g: data[i + 1],
            b: data[i + 2]
        };
        let index = refPal.indexOf(rgbToHex(c));
        console.log(index, refPal[index], newPal[index]);
        let newColor = newPal[index];
        if (newColor == undefined) continue;
        newColors.push(
            {
                color: newColor,
                pos: {
                    x: i / 4 % canvas.width | 0,
                    y: i / 4 / canvas.width | 0
                }
            }
        );
    }
    newColors.forEach(color => {
        ctx.fillStyle = color.color;
        ctx.fillRect(color.pos.x, color.pos.y, 1, 1);
    })
    loadImg(document.querySelector('#image').getContext('2d'), canvas.toDataURL(), true);
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
    colors.sort((a, b) => {
        let A = hexToRgb(a);
        let B = hexToRgb(b);
        A = (A.r + A.g + A.b) / 3;
        B = (B.r + B.g + B.b) / 3;
        return A - B;
    });
    var pals = (colors.length / 10 | 0) + (colors.length % 10 == 0 ? 1 : 0);
    if (Object.keys(p_dict).length + pals >= 5) return;
    for (var i = 0; i < colors.length; i++) {
        if (i == 0 && (Object.keys(p_dict).length == 0 || p_dict[palName].length != 0)) createPalette();
        if (i % 10 == 0 && i != 0) {
            drawPalette();
            createPalette();
        }
        p_dict[palName].push(colors[i]);
    }
    drawPalette();
}

async function loadImage(e) {
    context ??= document.querySelector('#image').getContext('2d');
    opContext ??= document.querySelector('#canvas').getContext('2d');

    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
        let file = Array.from(input.files)[0];
        if (!isFileImage(file)) return;
        filename = file['name'];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            image = reader.result;
            loadImg(opContext, image, false);
            loadImg(context, image, true);
        }
    };
    input.click();
}

async function saveImage(e) {
    if (filename == undefined) return;
    const handle = await showSaveFilePicker({
        suggestedName: filename,
        types: [{
            description: 'PNG',
            accept: {'image/png': ['.png']},
        }],
    });
    const blob = await fetch(
        canvas.toDataURL("image/png")
    ).then((response) => 
        response.blob()
    );

    const writableStream = await handle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
}