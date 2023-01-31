class Operation {
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
        btn.classList.add("btn-pal");
        btn.classList.add("color");
        btn.draggable = true;
        btn.addEventListener('dragover', setDraggedOver);
        btn.addEventListener('drop', applyDrag);
        btn.addEventListener('change', () => {
            if (type == this.Type.INPUT) this.calculate();
        });
        btn.type = "color";
        btn.id = index;
        btn.value = '#000000';
        (type == this.Type.INPUT ? this.iElement : this.oElement).appendChild(btn);
    }

    calculate() {
        this.inputs = this.inputs.map((i) => hexToRgb(i));
        if (this.inputs.some(x => x == null)) return;
        this.outputs = this.doOperation(this.inputs);
        this.outputs = this.outputs.map((i) => rgbToHex(i));

        var o = Array.from(this.oElement.children).filter(element => element.tagName == "INPUT");
        this.outputs.forEach((color, index) => {
            o[index].value = color;
        });
    }

    doOperation(i) { return []; }
}

class AverageColor extends Operation {
    constructor() { super(2, 1); }

    calculate() {
        this.inputs = Array.from(this.iElement.children)
            .filter(i => i.tagName == "INPUT")
            .map(i => i.value);
        super.calculate();
    }

    doOperation(i) {
        return [{
            r: Math.floor((i[0].r + i[1].r) / 2),
            g: Math.floor((i[0].g + i[1].g) / 2),
            b: Math.floor((i[0].b + i[1].b) / 2),
        }];
    }
}

var _avg = new AverageColor();