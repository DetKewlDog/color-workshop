var lst = document.querySelectorAll('[dropdown]');
lst.forEach(dropdown => {
    var text = dropdown.querySelector('#ddtext');
    var options = Array.from(dropdown.children[1].querySelectorAll('button'));
    options.forEach(op => {
        op.addEventListener('click', (e) => {
            dropdown.value = op.value;
            text.innerText = op.innerText + '▼';
            options.forEach(x => x.style.backgroundColor = null);
            op.style.backgroundColor = '#4A4A52';
            dropdown.dispatchEvent(new Event('change'));
        });
    });
    options[0].dispatchEvent(new Event('click'));
});