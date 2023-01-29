let palette = [0]

window.onload = drawPalette();

function emptyBtn(i) {
    return `<button id="${i}" class="btn-pal new" onclick="add(${i})">+</button>\n`;
}
function colorBtn (c, i) {
    return `<button class="btn-pal color"><input type="color" id="${i}" value="${c}" onchange="modify(${i})"></button>\n`;
}

function drawPalette() {
    let res = "";
    palette.forEach(function(color, index) {
        res += color == 0 ?
            emptyBtn(index) : 
            colorBtn(color, index);
    });
    document.getElementById("palette").innerHTML = res;
}

function add(id) {
    if (palette.length == 1) palette.push(0);
    let index = id == 0 ? 1 : id;
    palette.splice(index, 0, "#000000");
    drawPalette();
}

function modify(id) {
    palette[id] = document.getElementById(id).value;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const avg = (x, y) => Math.floor((x + y) / 2);

function avgColor() {
    let c1 = hexToRgb(document.getElementById("c_a").value);
    let c2 = hexToRgb(document.getElementById("c_b").value);
    if (c1 == null || c2 == null) return;
    let res = {
        r: avg(c1.r, c2.r),
        g: avg(c1.g, c2.g),
        b: avg(c1.b, c2.b)
    }
    console.log(res);
    console.log(rgbToHex(res.r, res.g, res.b));
    document.getElementById("c_res").value = rgbToHex(res.r, res.g, res.b);
}