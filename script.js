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
let ink = '#000000'; 

//color picker
const colorPicker = document.querySelector('#color-select')
colorPicker.addEventListener("change", e => {
    ink = e.target.value;
    console.log(ink);
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

// shading function

// convert hex color to hsl
// function RGBToHSL(rgb) {
//     let sep = rgb.indexOf(",") > -1 ? "," : " ";
//     rgb = rgb.substr(4).split(")")[0].split(sep);
  
//     for (let R in rgb) {
//       let r = rgb[R];
//       if (r.indexOf("%") > -1)
//         rgb[R] = Math.round(r.substr(0,r.length - 1) / 100 * 255);
//     }
  
//     // Make r, g, and b fractions of 1
//     let r = rgb[0] / 255,
//         g = rgb[1] / 255,
//         b = rgb[2] / 255;

//     // Find greatest and smallest channel values
//     let cmin = Math.min(r,g,b),
//         cmax = Math.max(r,g,b),
//         delta = cmax - cmin,
//         h = 0,
//         s = 0,
//         l = 0;

//     // Calculate hue
//     // No difference
//     if (delta == 0)
//         h = 0;
//     // Red is max
//     else if (cmax == r)
//         h = ((g - b) / delta) % 6;
//     // Green is max
//     else if (cmax == g)
//         h = (b - r) / delta + 2;
//     // Blue is max
//     else
//         h = (r - g) / delta + 4;

//     h = Math.round(h * 60);
  
//     // Make negative hues positive behind 360°
//     if (h < 0)
//         h += 360;

//     // Calculate lightness
//     l = (cmax + cmin) / 2;

//     // Calculate saturation
//     s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
//     // Multiply l and s by 100
//     s = +(s * 100).toFixed(1);
//     l = +(l * 100).toFixed(1);

//     return "hsl(" + h + "," + s + "%," + l + "%)";
  
    
//   }


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
  
    return "#" + r + g + b;
  }

function adjust(RGBToHex, rgb, amount) {
    let color = RGBToHex(rgb);
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

console.log(RGBToHex('rgb(255,255,255)'))

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
        } else if (shading) {
            console.log(adjust(e.target.style.backgroundColor,-20));
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










