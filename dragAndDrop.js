function setDragging (e) { 
    dragging = e.target.id; 
    parent1 = palName;
} 

function setDraggedOver(e) {
    e.preventDefault();
    draggedOver = e.target.id;
    parent2 = e.target.parentElement.parentElement.id;
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
    // else if (e.altKey) {
    //     p_dict[draggedOver] = p_dict[dragging];
    // }
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

function dragBetweenPalettes(e, p1, p2) {
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
}

function dragInputOutput() {
    var dst = document.querySelector('#' + draggedOver);
    dst.value = document.querySelector('#' + dragging).value;
    dst.dispatchEvent(new Event('input', { bubbles: true }));
}

function dragOutputPalette(e, p) {
    var c = document.querySelector('#' + dragging).value;
    if (e.altKey || e.ctrlKey) {
        p_dict[p][draggedOver] = c;
    }
    else {
        p_dict[p].splice(draggedOver, 0, c);
    }
    changePal(p);
    drawPalette();
}

function dragPaletteInput(p) {
    var c = document.querySelector('#' + draggedOver);
    c.value = p_dict[p][dragging];
    c.dispatchEvent(new Event('input', { bubbles: true }));
}

function dragColor(e) {
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
}

function applyDrag (e) {
    dragColorOp = dragging.startsWith('o') || dragging.startsWith('i');
    dragOverInput = draggedOver.startsWith('i');

    // from output to input
    if (dragColorOp && dragOverInput) {
        dragInputOutput();
        return;
    }
    // color output to palette
    if (dragColorOp) {
        dragOutputPalette(e, parent2);
        return;
    }
    // palette to color input
    if (dragOverInput) {
        dragPaletteInput(parent1);
        return;
    }
    // move between palettes
    if (parent1 != parent2) {
        dragBetweenPalettes(e, parent1, parent2);
        return;
    }
    dragColor(e);
};

function dragToPalInput(e) {
    e.preventDefault();
    if (!parent1.startsWith('p')) return;
    let pal = undefined, name = undefined;
    if (draggedOver == "ref-pal") {
        refPal = p_dict[parent1];
        pal = refPal;
        name = "ref-pal";
    } else if (draggedOver == "new-pal") {
        newPal = p_dict[parent1];
        pal = newPal;
        name = "new-pal";
    }
    localStorage.removeItem(document.querySelector('#' + name).style.background);
    updatePaletteImg(pal, name);
}

// ----------------------------------------------------------------------------------

var context = undefined, opContext = undefined, image = undefined;

function imgDrop(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    context ??= ev.target.getContext('2d');
    opContext ??= document.querySelector('#canvas').getContext('2d');

    if (!ev.dataTransfer.items) return;
    
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind !== 'file') return;
        const file = item.getAsFile();
        if (!isFileImage(file)) return;
        filename = file['name'];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            image = reader.result;
            loadImg(opContext, image, false);
            loadImg(context, image, true);
        }
    });
}


function dragOverHandler(ev) {
    ev.preventDefault();
}

function isFileImage(file) {
    return file && file['type'].split('/')[0] === 'image';
}

function loadImg(ctx, file, resize) {
    ctx.imageSmoothingEnabled = false;
    var img = new Image();
    img.src = file;
    img.onload = function() {
        var canvas = document.querySelector((resize ? '#image' : '#canvas'));
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let width = img.width, height = img.height;
        if (resize) {
            if (img.width != 300 && img.width >= img.height) {
                height = img.height / img.width * 300;
                width = 300;
            }
            else if (img.height != 300) {
                width = img.width / img.height * 300;
                height = 300;
            }
        }
        else {
            canvas.width = ctx.width = img.width;
            canvas.height = ctx.height = img.height;
        }
        ctx.drawImage(img, 0, 0, width.toFixed(0), height.toFixed(0));
    }
}