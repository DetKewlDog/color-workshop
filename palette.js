let p_dict = {}, palName = 'p1', palIndex = 0, parent1 = undefined, parent2 = undefined;

function getPaletteElement() {
    return document.querySelector(`#${palName}`);
}

window.onload = createPalette();

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
    btn.addEventListener('contextmenu', (ev) => {
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

function setDragging (e) { 
    dragging = e.target.id; 
    parent1 = palName;
} 

function setDraggedOver(e) {
    e.preventDefault();
    draggedOver = e.target.id;
    parent2 = palName;
}

function dragPalette(e) {
    if (!dragging.startsWith("p") || !draggedOver.startsWith("p")) return;
    // swap
    if (e.ctrlKey) {
        var temp = p_dict[dragging];
        p_dict[dragging] = p_dict[draggedOver];
        p_dict[draggedOver] = temp;
    }
    // copy
    else if (e.altKey) {
        p_dict[draggedOver] = p_dict[dragging];
    }
    // move
    else {
        var keys = Object.keys(p_dict), values = Object.values(p_dict);
        var i1 = keys.indexOf(dragging), i2 = keys.indexOf(draggedOver);
        var el = keys[i1];
        keys.splice(i1, 1);
        keys.splice(i2, 0, el);
        el = values[i1];
        values.splice(i1, 1);
        values.splice(i2, 0, el);
        p_dict = {};
        keys.forEach((key) => {
            changePal(key);
            getPaletteElement().remove();
        })
        keys.forEach((key, i) => {
            p_dict[key] = values[i];
            createPalette(key);
        });
        return;
    }
    for (let key in p_dict) {
        changePal(key);
        drawPalette();
    }
}

function applyDrag (e) {
    var p1 = parent1, p2 = parent2;
    console.log(p1, p2);
    // move between palettes
    if (p1 != p2) {
        if (p_dict[p1].length == 10 || p_dict[p2].length == 10) return;
        // swap
        if (e.ctrlKey) {
            var temp = p_dict[p1][dragging];
            p_dict[p1][dragging] = p_dict[p2][draggedOver];
            p_dict[p2][draggedOver] = temp;
            drawPalette();
        }
        // copy
        else if (e.altKey) {
            p_dict[p2][draggedOver] = p_dict[p1][dragging];
        }
        // move
        else {
            p_dict[p2].splice(draggedOver, 0, p_dict[p1][dragging]);
            remove(dragging);
        }
        changePal(p1);
        changePal(p2);
        drawPalette();
        return;
    }
    // swap
    if (e.ctrlKey) {
        var temp = p_dict[palName][dragging];
        p_dict[palName][dragging] = p_dict[palName][draggedOver];
        p_dict[palName][draggedOver] = temp;
    }
    // copy
    else if (e.altKey) {
        p_dict[palName][draggedOver] = p_dict[palName][dragging];
    }
    // move
    else {
        var el = p_dict[palName][dragging];
        p_dict[palName].splice(dragging, 1);
        p_dict[palName].splice(draggedOver, 0, el);
    }
    drawPalette();
};

function add(isRight) {
    p_dict[palName].splice(isRight ? p_dict[palName].length : 0, 0, "#000000");
    drawPalette();
}

function modify(id) {
    p_dict[palName][id] = document.querySelector(`#${palName}`).children[id + 1].children[1].value;
    console.log(p_dict[palName]);
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