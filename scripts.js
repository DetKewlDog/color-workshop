let palette = []

const pal = document.getElementById('palette');

window.onload = drawPalette();

function addEmptyBtn(isRight) {
    let btn = document.createElement("button");
    btn.classList.add("btn-pal");
    btn.classList.add("new");
    btn.addEventListener('click', () => add(isRight) );
    btn.innerText = '+';
    pal.appendChild(btn);
}

function addColorBtn(color, index) {
    let btn = document.createElement("input");
    btn.classList.add("btn-pal");
    btn.classList.add("color");
    btn.draggable = true;
    btn.addEventListener('drag', setDragging);
    btn.addEventListener('dragover', setDraggedOver);
    btn.addEventListener('drop', applyDrag);
    btn.type = "color";
    btn.id = index;
    btn.value = color;
    btn.addEventListener('change', () => modify(index) );
    btn.addEventListener('contextmenu', (ev) => {
        remove(index);
        ev.preventDefault();
    } );
    pal.appendChild(btn);
}

function drawPalette() {
    pal.innerText = '';
    addEmptyBtn(0)
    palette.forEach((color, index) => addColorBtn(color, index));
    if (palette.length != 0) addEmptyBtn(1)
}

const setDragging = (e) => dragging = e.target.id;
function setDraggedOver(e) {
    e.preventDefault();
    draggedOver = e.target.id
}

const applyDrag = (e) =>{
    var color1 = palette[dragging];
    var color2 = palette[draggedOver];
    palette[draggedOver] = color1;
    palette[dragging] = color2;
    drawPalette();
};

function add(isRight) {
    palette.splice(isRight ? palette.length : 0, 0, "#000000");
    drawPalette();
}

function modify(id) {
    palette[id] = document.getElementById(id).value;
}

function remove(id) {
    palette.splice(id, 1);
    drawPalette();
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
    document.getElementById("c_res").value = rgbToHex(res.r, res.g, res.b);
}