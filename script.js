// number of rows / columns in grid
let gridSize = 24;

const container = document.querySelector('.grid-container');

let bgColor = '#ffffff'
//create new grid items to fill the grid
function createGrid(grid_size) {
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize ** 2; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-item');
        square.setAttribute('draggable', 'false');
        square.style.backgroundColor = bgColor;
        container.appendChild(square);
    };

    
}

createGrid(gridSize)

const gridItems = document.querySelectorAll(".grid-item");

// toggle grid lines
const gridButton = document.querySelector('#grid-btn');

gridButton.addEventListener('click', () => {
     container.classList.toggle('toggle-grid');
})

// set default colour to black
let ink = '#000000'; 

//pen color picker
const colorPicker = document.querySelector('#color-select')
colorPicker.addEventListener("change", e => {
    ink = e.target.value;
});

// bg color picker
// will not change the grid items that have the attribute data-inked = true
const bgColorPicker = document.querySelector('#bg-color-select');


// toggle button colour when clicked
const buttons = document.getElementsByTagName('button');

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
        buttons[i].classList.toggle('btn-on');
    })
}

// shading toggle
let shading = false;
const shaderButton = document.querySelector('#shader-btn');
shaderButton.addEventListener('click', () => {
    if (shading) {
        shading = false;
    } else {
        shading = true;
    }
});

// lighten toggle 
let lighten = false;
const lightenButton = document.querySelector('#lighten-btn');
lightenButton.addEventListener('click', () => {
    if (lighten) {
        lighten = false; 
    } else {
        lighten = true;
    }
});

// shading function

function RGBToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
      b = (+rgb[2]).toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    return "#" + r + g + b;
  }


function adjust(RGBToHex, rgb, amount) {
    let color = RGBToHex(rgb);
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(
        255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// eyedrop color grabbing tool
const dropper = document.querySelector("#color-grabber");
let grab = false;
dropper.addEventListener('click', () => {
    // when grab is true, all drawing is frozen until a color is selected
    grab = true;   
});





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

// slider
function rangeSlider(value) {
    document.getElementById('range-value').textContent = value;
    gridSize = value;
    deleteGrid()
    createGrid()
    listen()
}

function rangeSliderValue(value) {
    document.getElementById('range-value').textContent = value;
    
}

function deleteGrid() {
    while (container.firstChild) {
        container.removeEventListener('mousedown', drawClick);
        container.removeEventListener('mouseenter', drawClickHover);
        container.lastChild = null;
        container.removeChild(container.lastChild);
    }
}



// clear grid
const clearButton = document.querySelector('#clear-grid');
function clearGrid() {
    const gridItems = document.querySelectorAll(".grid-item");
    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].style.backgroundColor = bgColor;
        gridItems[i].removeAttribute('data-inked');

    }
}
clearButton.addEventListener('click', clearGrid);


// draw on the grid when clicked
function drawClick(e) {
    if (!grab) {
        if (eraser) {
            e.target.style.backgroundColor = bgColor;
            //data-inked = true means the background color change wont affect these elements
            e.target.removeAttribute('data-inked')
        } else if (rainbow) {
            e.target.style.backgroundColor = randomColor();
            e.target.setAttribute('data-inked', 'true');
        } else if (shading) {
            e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,-15);
            e.target.setAttribute('data-inked', 'true');
        } else if (lighten) {
            e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,+15);
            e.target.setAttribute('data-inked', 'true');
        } else {
            e.target.style.backgroundColor = ink;
            e.target.setAttribute('data-inked', 'true');
        }
    };
}
// draw when hovering over the grid with the mouse held down
function drawClickHover(e) {
    if (e.buttons > 0) {
        if (!grab) {
            if (eraser) {
                e.target.style.backgroundColor = bgColor;
                e.target.removeAttribute('data-inked');
            } else if (rainbow) {
                e.target.style.backgroundColor = randomColor();
                e.target.setAttribute('data-inked', 'true');
            } else if (shading) {
                e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,-15);
                e.target.setAttribute('data-inked', 'true');
            } else if (lighten) {
                e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,+15);
                e.target.setAttribute('data-inked', 'true');
            } else {
                e.target.style.backgroundColor = ink;
                e.target.setAttribute('data-inked', 'true');
            }
        }
        
    };
}

// listen for events
function listen() {
    const gridItems = document.querySelectorAll(".grid-item");
    for (let i = 0; i < gridItems.length; i++) {
        
        gridItems[i].addEventListener('mousedown', drawClick)
        // listen for a mouse over and change colour only if mouse button is pressed
        gridItems[i].addEventListener('mouseenter', drawClickHover)
    };

    //listen for clicks on all grid items when grab is true (color picker)
    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].addEventListener('click', e => {
            if (grab) {
                ink = e.target.style.backgroundColor;
                colorPicker.value = RGBToHex(ink);
                dropper.classList.remove('btn-on');
                grab = false;   
            }
        });
    }

    bgColorPicker.addEventListener("input", e => {
        const gridItems = document.querySelectorAll(".grid-item");
        for (let i = 0; i < gridItems.length; i++) {
            if (!gridItems[i].dataset.inked) {
                bgColor = e.target.value;
                gridItems[i].style.backgroundColor = bgColor;
            }       
        } 
    });
}

listen()













