class ColorOperation {
    Type = {
        INPUT: 0,
        OUTPUT: 1
    }

    constructor(inputCount, outputCount) {
        this.inputs = Array(inputCount).fill('#000000');
        this.outputs = Array(outputCount).fill('#000000');

        this.iElement = document.querySelector("#inputs");
        this.iElement.innerText = '';
        this.inputs.forEach((color, index) => {
            this.addColor(this.Type.INPUT, index)
            if (index + 1 != this.inputs.length) this.addArrow(this.iElement);
        });

        this.oElement = document.querySelector("#outputs");
        this.oElement.innerText = '';
        this.outputs.forEach((color, index) => {
            this.addColor(this.Type.OUTPUT, index);
            if (index + 1 != this.outputs.length) this.addArrow(this.oElement);
        });
    }

    addArrow(element) {
        let arrow = document.createElement("button");
        arrow.classList.add("arrow");
        arrow.innerText = '⇨';
        element.appendChild(arrow);
    }

    addColor(type, index) {
        let btn = document.createElement("input");
        btn.classList.add("coloris");
        btn.draggable = true;
        if (type == this.Type.INPUT) btn.addEventListener('dragover', setDraggedOver);
        btn.addEventListener('drag', setDragging);
        btn.addEventListener('drop', () => {
            applyDrag();
            if (type == this.Type.INPUT) this.calculate();
        });
        btn.addEventListener('coloris:pick', () => {
            if (type == this.Type.INPUT) this.calculate();
        });
        btn.addEventListener('change', () => {
            if (type == this.Type.INPUT) this.calculate();
        });
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        })
        btn.setAttribute('data-coloris', '');
        btn.id = `${type == this.Type.INPUT ? 'i' : 'o'}${index}`;
        btn.value = '#000000';
        (type == this.Type.INPUT ? this.iElement : this.oElement).appendChild(btn);
        reloadPickers();
    }

    calculate() {
        this.inputs = Array.from(this.iElement.children)
            .filter(i => i.tagName == "DIV")
            .map(i => colorSpace[0](colorFormat[0](i.children[1].value)));
        if (this.inputs.some(x => x == null)) return;
        this.outputs = this.doOperation(this.inputs);
        this.outputs = this.outputs.map((i) => colorFormat[1](colorSpace[1](i)));

        var o = Array.from(this.oElement.children)
            .filter(element => element.tagName == "DIV")
            .map(element => element.children[1]);
        this.outputs.forEach((color, index) => {
            o[index].value = color;
            o[index].dispatchEvent(new Event('input', { bubbles: true }));
        });
        reloadPickers();
    }

    doOperation(i) { return []; }
}

class AverageColor extends ColorOperation {
    constructor() { super(2, 1); }

    doOperation(i) {
        return [{
            r: (i[0].r + i[1].r) / 2,
            g: (i[0].g + i[1].g) / 2,
            b: (i[0].b + i[1].b) / 2,
        }];
    }
}

class ColorDistance extends ColorOperation {
    constructor() { super(3, 1); }

    doOperation(i) {
        return [{
            r: i[2].r - i[0].r + i[1].r,
            g: i[2].g - i[0].g + i[1].g,
            b: i[2].b - i[0].b + i[1].b,
        }];
    }
}

class Grayscale extends ColorOperation {
    constructor() { super(1, 1); }

    doOperation(i) {
        var x = Math.floor((i[0].r + i[0].g + i[0].b) / 3);
        return [{
            r: x,
            g: x,
            b: x,
        }];
    }
}

class Invert extends ColorOperation {
    constructor() { super(1, 1); }

    doOperation(i) {
        var x = colorSpace[0]({ r: 255, g: 255, b: 255 });
        return [{
            r: x.r - i[0].r,
            g: x.g - i[0].g,
            b: x.b - i[0].b,
        }];
    }
}

let colorOp = new AverageColor();
let colorFormat = [hexToRgb, rgbToHex];

const op_dict = {
    "Average": AverageColor,
    "Distance": ColorDistance,
    "Grayscale": Grayscale,
    "Invert": Invert,
} ;

const format_dict = {
    "RGB": [hexToRgb, rgbToHex],
    "HSV": [hexToHsv, hsvToHex],
    "HSL": [hexToHsl, hslToHex]
} ;

const colorspace_dict = {
    "Gamma": [
        (c) => ({ r: c.r, g: c.g, b: c.b }),
        (c) => ({ r: Math.floor(c.r), g: Math.floor(c.g), b: Math.floor(c.b) }),
    ],
    "Linear": [
        (c) => ({ r: c.r ** 2, g: c.g ** 2, b: c.b ** 2 }),
        (c) => ({ r: Math.floor(Math.sqrt(c.r)), g: Math.floor(Math.sqrt(c.g)), b: Math.floor(Math.sqrt(c.b)) })
    ]
}
let colorSpace = colorspace_dict["Linear"];

function changeColorOp(e) {
    colorOp = new op_dict[e.target.value]();
}

function changeColorFormat(e) {
    colorFormat = format_dict[e.target.value];
    try { colorOp.calculate(); } catch { }
}

function changeColorSpace(e) {
    colorSpace = colorspace_dict[e.target.value];
    try { colorOp.calculate(); } catch { }
}