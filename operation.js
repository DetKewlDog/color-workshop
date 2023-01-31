class Operation {
    constructor(inputCount, outputCount) {
        console.log(inputCount, outputCount);
        this.inputs = Array(inputCount).fill('#000000');
        this.outputs = Array(outputCount).fill('#000000');

        this.iElement = document.querySelector("#inputs");
        this.iElement.innerText = '';
        this.inputs.forEach((color, index) => this.addColor(this.iElement, this.inputs, index));

        this.oElement = document.querySelector("#outputs");
        this.oElement.innerText = '';
        this.outputs.forEach((color, index) => this.addColor(this.oElement, this.outputs, index));
    }

    addColor(element, list, index) {
        let btn = document.createElement("input");
        btn.classList.add("btn-pal");
        btn.classList.add("color");
        btn.draggable = true;
        btn.addEventListener('dragover', setDraggedOver);
        btn.addEventListener('drop', applyDrag);
        btn.addEventListener('change', () => {
            list[index] = this.value;
            if (list == this.inputs) {
                this.calculate(this.inputs, this.outputs, this.doOperation);
            }
        });
        btn.type = "color";
        btn.id = index;
        btn.value = '#000000';
        element.appendChild(btn);
    }

    calculate(inputs, outputs, func) {
        this.inputs = inputs;
        this.outputs = outputs;
        console.log(this.inputs, this.outputs);
        var iArr = [];
        this.inputs.forEach((color, index) => {
            iArr[index] = hexToRgb(color);
        });
        if (iArr.some(x => x == null)) return;
        var oArr = this.doOperation(iArr);
        console.log(oArr);
        oArr.forEach((color, index) => {
            this.outputs[index] = rgbToHex(color.r, color.g, color.b);
        });
        this.outputs.forEach((color, index) => {
            this.oElement.children[index].value = this.outputs[index];
        });
    }

    doOperation(i) {
        return this.outputs;
    }
}

class AverageColor extends Operation {
    constructor() {
        super(2, 1);
    }
    calculate(inputs, outputs, func) {
        inputs.forEach((x, index) => {
            inputs[index] = this.inputs[index] = this.iElement.children[index].value;
        });
        super.calculate(this.inputs, this.outputs, this.doOperation);
    }
    doOperation(i) {
        var res = [{
            r: avg(i[0].r, i[1].r),
            g: avg(i[0].g, i[1].g),
            b: avg(i[0].b, i[1].b)
        }];
        console.log(res);
        return res;
    }
}

var _avg = new AverageColor();