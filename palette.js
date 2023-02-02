let p_dict = {}, palName = 'p1', palIndex = 0, parent1 = undefined, parent2 = undefined;

function getPaletteElement() {
    return document.querySelector(`#${palName}`);
}

window.onload = () => createPalette()

function createPalette(name = "") {
    let workspace = document.querySelector("#workspace");
    let pal = document.createElement("section");
    palName = pal.id = (name == "" ? `p${++palIndex}` : name);
    pal.style.height = "66px";
    let addpal = document.querySelector("#addpal");
    workspace.insertBefore(pal, addpal);
    drawPalette();
    changePal(palName);
    if (Object.keys(p_dict).length >= 5) {
        addpal.style.display = "none";
    }
}

function changePal(pName) {
    palName = pName;
    if (!(palName in p_dict)) p_dict[palName] = [];
}

function removePalette() {
    delete p_dict[palName];
    getPaletteElement().remove();
    if (Object.keys(p_dict).length < 5) {
        document.querySelector("#addpal").style.removeProperty("display");
    }
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
    btn.addEventListener('contextenu', (ev) => {
        changePal(ev.target.parentElement.id);
        if (ev.shiftKey || p_dict[palName].length == 0) removePalette();
        palName = Object.keys(p_dict)[0];
        ev.preventDefault();
    } );
    btn.innerText = '+';
    getPaletteElement().appendChild(btn);
}

function addColorBtn(color, index) {
    let btn = document.createElement("input");
    btn.classList.add("coloris");
    btn.draggable = true;
    btn.addEventListener('drag', setDragging);
    btn.addEventListener('dragover', setDraggedOver);
    btn.addEventListener('drop', applyDrag);
    btn.value = color;
    btn.id = index;
    btn.setAttribute('data-coloris', '');
    btn.addEventListener('change', () => modify(index) );
    btn.addEventListener('contextmenu', (ev) => {
        changePal(p);
        remove(index);
        if (ev.shiftKey) removePalette();
        ev.preventDefault();
    } );
    var p = palName;
    btn.addEventListener('mouseenter', function() {
        changePal(p);
    } );
    getPaletteElement().appendChild(btn);
    reloadPickers();
}

function drawPalette() {
    var p = getPaletteElement();
    p.innerText = '';
    p.draggable = true;
    p.addEventListener('drag', setDragging);
    p.addEventListener('dragover', setDraggedOver);
    p.addEventListener('drop', dragPalette);
    if (p_dict[palName] == null || p_dict[palName].length < 10) addEmptyBtn(0);
    p_dict[palName]?.forEach((color, index) => addColorBtn(color, index));
    if (p_dict[palName] != null && p_dict[palName].length != 0 && p_dict[palName].length < 10) addEmptyBtn(1)
    reloadPickers();
}

function add(isRight) {
    p_dict[palName].splice(isRight ? p_dict[palName].length : 0, 0, "#000000");
    drawPalette();
}

function modify(id) {
    p_dict[palName][id] = document.querySelector(`#${palName}`).children[id + 1].children[1].value;
}

function remove(id) {
    p_dict[palName].splice(id, 1);
    drawPalette();
}

function reloadPickers() {
    Coloris({
        el: '.coloris',
        theme: 'polaroid',
        defaultColor: '#000000',
        alpha: false,
        themeMode: 'dark'
    });
}