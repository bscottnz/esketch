// number of rows / columns in grid
let gridSize = 24;

const container = document.querySelector('.grid-container');
container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
let bgColor = '#ffffff'
//create new grid items to fill the grid
for (i = 0; i < gridSize ** 2; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-item');
    square.setAttribute('draggable', 'false');
    square.style.backgroundColor = bgColor;
    container.appendChild(square);
};

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
bgColorPicker.addEventListener("input", e => {
    for (let i = 0; i < gridItems.length; i++) {
        if (!gridItems[i].dataset.inked) {
            bgColor = e.target.value;
            gridItems[i].style.backgroundColor = bgColor;
        }       
    } 
});

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

//listen for clicks on all grid items when grab is true


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


for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mousedown', e => {
        if (!grab) {
            if (eraser) {
                gridItems[i].style.backgroundColor = bgColor;
                //data-inked = true means the background color change wont affect these elements
                gridItems[i].removeAttribute('data-inked')
            } else if (rainbow) {
                gridItems[i].style.backgroundColor = randomColor();
                gridItems[i].setAttribute('data-inked', 'true');
            } else if (shading) {
                gridItems[i].style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,-15);
                gridItems[i].setAttribute('data-inked', 'true');
            } else if (lighten) {
                gridItems[i].style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,+15);
                gridItems[i].setAttribute('data-inked', 'true');
            } else {
                gridItems[i].style.backgroundColor = ink;
                gridItems[i].setAttribute('data-inked', 'true');
            }
        }
        
        
        
    })
    // listen for a mouse over and change colour only if mouse button is pressed
    gridItems[i].addEventListener('mouseenter', e => {
        if (e.buttons > 0) {
            if (!grab) {
                if (eraser) {
                    gridItems[i].style.backgroundColor = bgColor;
                    gridItems[i].removeAttribute('data-inked');
                } else if (rainbow) {
                    gridItems[i].style.backgroundColor = randomColor();
                    gridItems[i].setAttribute('data-inked', 'true');
                } else if (shading) {
                    gridItems[i].style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,-15);
                    gridItems[i].setAttribute('data-inked', 'true');
                } else if (lighten) {
                    gridItems[i].style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,+15);
                    gridItems[i].setAttribute('data-inked', 'true');
                } else {
                    gridItems[i].style.backgroundColor = ink;
                    gridItems[i].setAttribute('data-inked', 'true');
                }
            }
            
        };
    })
};










