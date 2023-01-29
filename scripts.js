let p_dict = {}

let palName = 'p1';
let palIndex = 0;
function getPaletteElement() {
    return document.getElementById(palName);
}

window.onload = newPal();

function newPal() {
    let workspace = document.getElementById('workspace');
    let pal = document.createElement("section");
    palIndex++;
    palName = pal.id = `p${palIndex}`;
    pal.classList.add("palette");
    workspace.appendChild(pal);
    workspace.appendChild(document.createElement('br'));
    drawPalette();
    changePal(palName);
}

function changePal(palName) {
    if (!(palName in p_dict)) p_dict[palName] = [];
}

function addEmptyBtn(isRight) {
    let btn = document.createElement("button");
    btn.classList.add("btn-pal");
    btn.classList.add("new");
    btn.addEventListener('click', () => {
        palName = p;
        changePal(p);
        add(isRight)
    } );
    btn.addEventListener('contextmenu', (ev) => {
        if (p_dict[palName].length == 0) {
            delete p_dict[palName];
            getPaletteElement().remove();
        }
        palName = Object.keys(p_dict)[0];
        ev.preventDefault();
    } );
    btn.innerText = '+';
    var p = palName;
    getPaletteElement().appendChild(btn);
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
    var p = palName;
    btn.addEventListener('mouseenter', function() {
        palName = p;
        changePal(p);
    } );
    getPaletteElement().appendChild(btn);
}

function drawPalette() {
    getPaletteElement().innerText = '';
    addEmptyBtn(0);
    p_dict[palName]?.forEach((color, index) => addColorBtn(color, index));
    if (p_dict[palName] != null && p_dict[palName].length != 0) addEmptyBtn(1)
}

const setDragging = (e) => dragging = e.target.id;
function setDraggedOver(e) {
    e.preventDefault();
    draggedOver = e.target.id
}

const applyDrag = (e) =>{
    var color1 = p_dict[palName][dragging];
    var color2 = p_dict[palName][draggedOver];
    p_dict[palName][draggedOver] = color1;
    p_dict[palName][dragging] = color2;
    drawPalette();
};

function add(isRight) {
    p_dict[palName].splice(isRight ? p_dict[palName].length : 0, 0, "#000000");
    drawPalette();
}

function modify(id) {
    p_dict[palName][id] = document.getElementById(palName).children[id + 1].value;
    console.log(p_dict);
}

function remove(id) {
    p_dict[palName].splice(id, 1);
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