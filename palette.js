let p_dict = {}

let palName = 'p1';
let palIndex = 0;
let parent1;
let parent2;

function getPaletteElement() {
    return document.getElementById(palName);
}

window.onload = createPalette();

function createPalette() {
    let workspace = document.getElementById('workspace');
    let pal = document.createElement("section");
    palIndex++;
    palName = pal.id = `p${palIndex}`;
    pal.style.height = "66px";
    let addpal = document.getElementById("addpal");
    workspace.insertBefore(pal, addpal);
    drawPalette();
    changePal(palName);
}

function changePal(pName) {
    palName = pName;
    if (!(palName in p_dict)) p_dict[palName] = [];
}

function addEmptyBtn(isRight) {
    let btn = document.createElement("button");
    btn.classList.add("btn-pal");
    btn.classList.add("new");
    var p = palName;
    btn.addEventListener('click', () => {
        changePal(p);
        add(isRight)
    } );
    btn.addEventListener('contextmenu', (ev) => {
        if (ev.shiftKey || p_dict[palName].length == 0) {
            delete p_dict[palName];
            getPaletteElement().remove();
        }
        palName = Object.keys(p_dict)[0];
        ev.preventDefault();
    } );
    btn.innerText = '+';
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
        if (ev.shiftKey) {
            delete p_dict[palName];
            getPaletteElement().remove();
        }
        ev.preventDefault();
    } );
    var p = palName;
    btn.addEventListener('mouseenter', function() {
        changePal(p);
    } );
    getPaletteElement().appendChild(btn);
}

function drawPalette() {
    var p = getPaletteElement();
    p.innerText = '';
    p.draggable = true;
    p.addEventListener('drag', setDragging);
    p.addEventListener('dragover', setDraggedOver);
    p.addEventListener('drop', dragPalette);
    addEmptyBtn(0);
    p_dict[palName]?.forEach((color, index) => addColorBtn(color, index));
    if (p_dict[palName] != null && p_dict[palName].length != 0) addEmptyBtn(1)
}

function setDragging (e) { 
    dragging = e.target.id; 
    parent1 = e.target.parentElement;
} 

function setDraggedOver(e) {
    e.preventDefault();
    draggedOver = e.target.id;
    parent2 = e.target.parentElement;
}

function dragPalette(e) {
    if (!dragging.startsWith("p") || !draggedOver.startsWith("p")) return;
    var temp = p_dict[dragging];
    p_dict[dragging] = p_dict[draggedOver];
    p_dict[draggedOver] = temp;
    for (let key in p_dict) {
        changePal(key);
        drawPalette();
    }
}

function applyDrag (e) {
    var p1 = parent1.id;
    var p2 = parent2.id;
    if (p1 != p2) {
        p_dict[p2].splice(draggedOver, 0, p_dict[p1][dragging]);
        remove(dragging);
        changePal(p1);
        changePal(p2);
        drawPalette();
        return;
    }
    var temp = p_dict[palName][dragging];
    p_dict[palName][dragging] = p_dict[palName][draggedOver];
    p_dict[palName][draggedOver] = temp;
    drawPalette();
};

function add(isRight) {
    p_dict[palName].splice(isRight ? p_dict[palName].length : 0, 0, "#000000");
    drawPalette();
}

function modify(id) {
    p_dict[palName][id] = document.getElementById(palName).children[id + 1].value;
}

function remove(id) {
    p_dict[palName].splice(id, 1);
    drawPalette();
}