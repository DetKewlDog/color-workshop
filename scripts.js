let palette = []

window.onload = drawPalette();

function addEmptyBtn(pal, i) {
    let btn = document.createElement("button");
    btn.classList.add("btn-pal");
    btn.classList.add("new");
    btn.addEventListener('click', function() {
        add(i);
    });
    btn.innerText = '+';
    pal.appendChild(btn);
}

function addColorBtn(pal, c, i) {
    let btn = document.createElement("button");
    btn.classList.add("btn-pal");
    btn.classList.add("color");
    // btn.draggable = true;
    // btn.addEventListener('drag', setDragging);
    // btn.addEventListener('dragover', setDraggedOver);
    // btn.addEventListener('drop', compare);

    var col = document.createElement("input");
    col.type = "color";
    col.id = i;
    col.value = c;
    col.addEventListener('change', function() {
        modify(this.id);
    });
    btn.appendChild(col);
    pal.appendChild(btn);
}

function drawPalette() {
    let pal = document.getElementById("palette");
    pal.innerText = '';
    addEmptyBtn(pal, 0)
    palette.forEach(function(color, index) {
        addColorBtn(pal, color, index);
    });
    if (palette.length != 0) {
        addEmptyBtn(pal, 1)
    }
}

function add(id) {
    palette.splice(id == 0 ? 0 : palette.length, 0, "#000000");
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