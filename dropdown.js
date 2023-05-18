var lst = document.querySelectorAll('[dropdown]');
lst.forEach(dropdown => {
    createDropdown(dropdown); // actually sets up the dropdown's inner HTML
    tweakDropdown(dropdown); // tweaks the dropdown to fix some bugs
});

function createDropdown(dropdown) {
    dropdown.classList.add('dropdown');
    dropdown.innerHTML = '<button id="ddtext" class="dropbtn">Dropdown</button>\n'
        + '<div class="dropdown-content">\n'
        + dropdown.innerText
            .split(' ')
            .map(x => `<button value="${x}">${x}</button><br>\n`)
            .join('')
        + '</div>';
}

function tweakDropdown(dropdown) {
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
}