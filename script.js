// number of rows / columns in grid
let gridSize = 24;

const container = document.querySelector('.grid-container');
container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

//create new grid items to fill the grid
for (i = 0; i < gridSize ** 2; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-item');
    square.setAttribute('draggable', 'false');
    container.appendChild(square);
};

// toggle grid lines
const gridButton = document.querySelector('#grid-btn');

gridButton.addEventListener('click', () => {
     container.classList.toggle('toggle-grid');
})

// set default colour to black
let ink = 'black';

//color picker
const colorPicker = document.querySelector('#color-select')

// toggle button colour when clicked
const buttons = document.getElementsByTagName('button');

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
        buttons[i].classList.toggle('btn-on');
    })
}


// default eraser to false and listen for toggle
let eraser = false;
const eraserButton = document.querySelector('#eraser-btn');
eraserButton.addEventListener('click', () => {
    if (eraser) {
        eraser = false;
    } else {
        eraser = true;
    }
});

// default rainbow ink to false and listen for toggle 
let rainbow = false;
const rainbowButton = document.querySelector('#rainbow-btn');
rainbowButton.addEventListener('click', () => {
    if (rainbow) {
        rainbow = false;
    } else {
        rainbow = true;
    }
});


//create random colour generator
function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}


// listen on grid squares for a click or click over and colour it in
const gridItems = document.querySelectorAll(".grid-item");

for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mousedown', e => {
        if (eraser) {
            gridItems[i].style.backgroundColor = 'white';
        } else if (rainbow) {
            gridItems[i].style.backgroundColor = randomColor();
        } else {
            gridItems[i].style.backgroundColor = ink;
        }
        
        
    })
    // listen for a mouse over and change colour only if mouse button is pressed
    gridItems[i].addEventListener('mouseenter', e => {
        if (e.buttons > 0) {
            if (eraser) {
                gridItems[i].style.backgroundColor = 'white';
            } else if (rainbow) {
                gridItems[i].style.backgroundColor = randomColor();
            } else {
                gridItems[i].style.backgroundColor = ink;
            }
        };
    })
};










