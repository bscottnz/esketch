//##############################################################################
// After revisting this project, I was thinking whether or not I should clean up
// the code. I decided to leave it as it was so I would have something to look
// back on. So if you're reading this and it seems messy, I'm sorry but my
// later projects get a lot cleaner and organised.
//##############################################################################

// number of rows / columns in grid
let gridSize = 24;

const container = document.querySelector('.grid-container');

let bgColor = '#ffffff';
container.style.backgroundColor = bgColor;

//create new grid items to fill the grid
function createGrid() {
  // having the grid with each item at 1fr would leave left over space at the end of the grid
  //  when there were lots of items, doing it this way seemed to fill in that extra space.
  // however the grid broke when there were 3 or less items, so the if statment fixes that
  let gridWidth = container.offsetWidth / gridSize;
  container.style.gridTemplateColumns = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;
  container.style.gridTemplateRows = `repeat(${gridSize - 3}, ${gridWidth}px) 1fr 1fr 1fr`;
  if (gridSize < 4) {
    container.style.gridTemplateColumns = `repeat(${gridSize},1fr`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 1fr`;
  }

  for (let i = 0; i < gridSize ** 2; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-item');
    square.setAttribute('draggable', 'false');
    square.style.backgroundColor = bgColor;
    container.appendChild(square);

    //to avoid double borders, top and left borders are applied to every cell,
    //then the remaining borderless cells are determined and given a border.
    // i originally used grid gap and had the container background
    //color as the borders. However when i changed the background color by changing each
    // cell individually, it got quite slow with large grids. I changed un-colored
    // grid items to be transperent, so i could use the container background as the
    //background color. now when i change the background color i am only changing the
    // one container and it is much faster.
    //set border top and left to every grid item

    //! Pav: changed transparent color to bgColor to simplify grid traversal for color-fill

    square.classList.add('border-top-left');
  }
  //add a right border the the right most items
  const rightItems = document.querySelectorAll(`.grid-item:nth-child(${gridSize}n)`);
  for (let i = 0; i < rightItems.length; i++) {
    rightItems[i].setAttribute('data-right', 'true');
    rightItems[i].classList.toggle('border-right');
  }

  // add a bottom border to the bottom most items
  let gridItems = document.querySelectorAll('.grid-item');
  const lastItems = Array.from(gridItems).slice(-`${gridSize}`);
  for (let i = 0; i < lastItems.length; i++) {
    lastItems[i].setAttribute('data-bottom', 'true');
    lastItems[i].classList.toggle('border-bottom');
  }
}

createGrid();

gridItems = document.querySelectorAll('.grid-item');

// set default colour to black
let ink = '#000000';

//pen color picker
const colorPicker = document.querySelector('#color-select');
colorPicker.addEventListener('input', (e) => {
  ink = e.target.value;
  if (grab) {
    grab = false;
    dropper.classList.remove('btn-on');
  }
  // fill = false;
  // colorFillButton.classList.remove('btn-on');
});

// bg color picker
// will not change the grid items that have the attribute data-inked = true
const bgColorPicker = document.querySelector('#bg-color-select');

// toggle button colour when clicked
const buttons = document.getElementsByTagName('button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    buttons[i].classList.toggle('btn-on');
  });
}

// shading toggle
let shading = false;
const shaderButton = document.querySelector('#shader-btn');
shaderButton.addEventListener('click', () => {
  if (shading) {
    shading = false;
  } else {
    shading = true;
    rainbow = false;
    rainbowButton.classList.remove('btn-on');
    lighten = false;
    lightenButton.classList.remove('btn-on');
    eraser = false;
    eraserButton.classList.remove('btn-on');
  }
  if (grab) {
    grab = false;
    dropper.classList.remove('btn-on');
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
    shading = false;
    shaderButton.classList.remove('btn-on');
    rainbow = false;
    rainbowButton.classList.remove('btn-on');
    eraser = false;
    eraserButton.classList.remove('btn-on');
  }
  if (grab) {
    grab = false;
    dropper.classList.remove('btn-on');
  }
});

// shading function

function RGBToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(')')[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  b = (+rgb[2]).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  return '#' + r + g + b;
}

function adjust(RGBToHex, rgb, amount) {
  let color = RGBToHex(rgb);
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
      )
  );
}

// eyedrop color grabbing tool
const dropper = document.querySelector('#color-grabber');
let grab = false;
dropper.addEventListener('click', () => {
  // when grab is true, all drawing is frozen until a color is selected
  if (grab) {
    grab = false;
    dropper.classList.remove('btn-on');
  } else {
    grab = true;
  }

  if (fill) {
    fill = false;
    colorFillButton.classList.remove('btn-on');
  }
});

// default eraser to false and listen for toggle
let eraser = false;
const eraserButton = document.querySelector('#eraser-btn');
eraserButton.addEventListener('click', () => {
  if (eraser) {
    eraser = false;
  } else {
    eraser = true;
    shading = false;
    shaderButton.classList.remove('btn-on');
    rainbow = false;
    rainbowButton.classList.remove('btn-on');
    lighten = false;
    lightenButton.classList.remove('btn-on');
  }

  if (grab) {
    grab = false;
    dropper.classList.remove('btn-on');
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
    shading = false;
    shaderButton.classList.remove('btn-on');
    lighten = false;
    lightenButton.classList.remove('btn-on');
    eraser = false;
    eraserButton.classList.remove('btn-on');
  }

  if (grab) {
    grab = false;
    dropper.classList.remove('btn-on');
  }
});

//create random colour generator
function randomColor() {
  // return "#" + Math.floor(Math.random()*16777215).toString(16);
  // this returns fewer colors but they are all nice and bright
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

// slider

let progressBar = document.getElementById('progress-bar');

function rangeSlider(value) {
  let gridLabels = document.querySelectorAll('#range-value');
  progressBar.style.width = (value / 60) * 100 + '%';
  for (let i = 0; i < gridLabels.length; i++) {
    gridLabels[i].textContent = value;
  }
  // document.querySelectorAll('#range-value').textContent = value;
  gridSize = parseInt(value);
  deleteGrid();
  createGrid();
  listen();
  reInit();
  // turn the grid button back on if it is off.
  const gridButton = document.querySelector('#grid-btn');
  if (gridButton.classList.contains('btn-on')) {
    //pass
  } else {
    gridButton.classList.toggle('btn-on');
  }
}

function reInit() {
  deleteGrid();
  createGrid();
  listen();
}

// let progressBar = document.getElementById('progress-bar');

function rangeSliderValue(value) {
  let gridLabels = document.querySelectorAll('#range-value');
  for (let i = 0; i < gridLabels.length; i++) {
    gridLabels[i].textContent = value;
  }
  progressBar.style.width = (value / 60) * 100 + '%';
}

function deleteGrid() {
  while (container.firstChild) {
    container.removeEventListener('mousedown', drawClick);
    container.removeEventListener('mouseenter', drawClickHover);
    container.lastChild = null;
    container.removeChild(container.lastChild);
  }
}

//fade grid
function fadeGrid(item) {
  // if the cell hasnt been coloured, set it to the background color (un marked cells are transperent)
  if (item.style.backgroundColor == '' || item.style.backgroundColor == 'transperent') {
    item.style.backgroundColor == bgColor;
  }

  // attatch class to each item. this fades the color to the background color over 1.5 seconds

  // apply a random fadeout time to each item

  let fadeSpeed = Math.random() * 10;
  if (fadeSpeed > 8) {
    item.classList.add('clear-fade');
  } else if (fadeSpeed > 6) {
    item.classList.add('clear-fade-2');
  } else if (fadeSpeed > 4) {
    item.classList.add('clear-fade-3');
  } else if (fadeSpeed > 2) {
    item.classList.add('clear-fade-4');
  } else {
    item.classList.add('clear-fade-5');
  }
}

// clear grid with a fade out
let root = document.documentElement;
const clearButton = document.querySelector('#clear-grid');
function clearGrid() {
  // sets the css background color to the js variable bgColor. this is so the fadeout class can be applied, and use its background color
  root.style.setProperty('--bg-color', bgColor);
  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    fadeGrid(gridItems[i]);
  }
  // set a timer so the fade has time to execute, then reset all the grid cells.
  setTimeout(function () {
    for (let i = 0; i < gridItems.length; i++) {
      gridItems[i].style.backgroundColor = '';
      gridItems[i].removeAttribute('data-inked');
      gridItems[i].removeAttribute('data-shade');
      gridItems[i].classList.remove('clear-fade');
      gridItems[i].classList.remove('clear-fade-2');
      gridItems[i].classList.remove('clear-fade-3');
      gridItems[i].classList.remove('clear-fade-4');
      gridItems[i].classList.remove('clear-fade-5');
    }
  }, 1500);
  container.style.backgroundColor = bgColor;

  // turn off the button after a very short delay
  setTimeout(function () {
    clearButton.classList.remove('btn-on');
  }, 1400);
}
clearButton.addEventListener('click', clearGrid);

// set fill to true when the color fill button is pressed
// if fill is true set it to false (clicking the button without filling)
// when fill is true all other events on the grid will stop and listen for a grid area to fill
const colorFillButton = document.querySelector('#color-fill');
let fill = false;
colorFillButton.addEventListener('click', () => {
  if (grab) {
    grab = false;
    dropper.classList.remove('btn-on');
  }
  if (fill) {
    fill = false;
  } else {
    fill = true;
  }
});
// convert array into matrix representing the grid
function toMatrix(arr, width) {
  return arr.reduce(function (rows, key, index) {
    return (index % width == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows;
  }, []);
}

//helper funtion to grab adjacent cells of a 2d grid
//function getAdjacent2D(x, y) {
// let xAbove = [x - 1, y];

// let xBellow = [x + 1, y];

// let xLeft = [x, y - 1];

// let xRight = [x, y + 1];

// return [xAbove, xBellow, xLeft, xRight]
//}

//helper function to grab adjacent cells of a 2d grid stored as a 1d array
// only return cells that do not cross over the edge of the grid

/*
function getAdjacent1D(x, gridX, gridY) {
  let xAbove = null;
  let xBellow = null;
  let xLeft = null;
  let xRight = null;

  // make sure x is not in the top row before returning the cell above
  if (gridX != 0) {
    xAbove = [x - gridSize];
  }
  // make sure x is not in the bottom row before returning the cell bellow
  if (gridX != gridSize - 1) {
    xBellow = [x + gridSize];
  }
  // make sure x is not in the left column before returning the cell to its left
  if (gridY != 0) {
    xLeft = [x - 1];
  }
  // make sure x is not in the right column before returning the cell to its right
  if (gridY != gridSize - 1) {
    xRight = [x + 1];
  }

  // console.log(xAbove, xBellow, xLeft, xRight);
  return [xAbove, xBellow, xLeft, xRight];
}
*/

function hexToRGB(hex) {
  let r = parseInt(hex[1] + hex[2], 16);
  let g = parseInt(hex[3] + hex[4], 16);
  let b = parseInt(hex[5] + hex[6], 16);

  return `rgb(${r}, ${g}, ${b})`;
}

function findNeighbors(matrix, x, y, oldColor, newColor) {
  const possibleNeighbors = [
    { cell: matrix?.[x]?.[y - 1], x: x, y: y - 1 }, // west
    { cell: matrix?.[x]?.[y + 1], x: x, y: y + 1 }, // east
    { cell: matrix?.[x - 1]?.[y], x: x - 1, y: y }, // north
    { cell: matrix?.[x + 1]?.[y], x: x + 1, y: y }, // south
  ];

  const neighbors = [];

  for (const neighbor of possibleNeighbors) {
    if (
      neighbor.cell !== undefined &&
      neighbor.cell.style.backgroundColor === oldColor &&
      neighbor.cell.style.backgroundColor !== newColor
    ) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
}

function floodFill(image, x, y, oldColor, newColor) {
  if (oldColor === newColor) return;

  oldColor = hexToRGB(oldColor);
  newColor = hexToRGB(newColor);

  const toPaint = [{ x: x, y: y }]; // queue

  while (toPaint.length > 0) {
    const { x, y } = toPaint.shift();

    const neighbors = findNeighbors(image, x, y, oldColor, newColor);

    for (const { cell, x, y } of neighbors) {
      toPaint.push({ x, y });
      cell.style.backgroundColor = rainbow ? randomColor() : newColor;
      cell.setAttribute('data-inked', 'true');
    }
  }
}

//colorfill
function colorFill(e) {
  if (fill) {
    //get index of the clicked grid cell
    const ogIndex = Array.from(e.target.parentElement.children).indexOf(
      e.target
    );
    // console.log(ogIndex);

    gridItems = document.querySelectorAll('.grid-item');
    const gridItemsArray = Array.from(gridItems);
    // console.log(gridItemsArray.length);

    // create grid-like representation of grid items
    const gridItemsArray2D = toMatrix(gridItemsArray, gridSize);

    // get index of clicked item in 2d array
    const gridX = Math.floor(ogIndex / gridSize);
    const gridY = ogIndex % gridSize;

    const seed = gridItemsArray2D[gridX][gridY];
    const oldInk = seed.style.backgroundColor
      ? RGBToHex(seed.style.backgroundColor)
      : bgColor;

    floodFill(gridItemsArray2D, gridX, gridY, oldInk, ink);

    colorFillButton.classList.remove('btn-on');
    fill = false;
  }
}

// draw on the grid when clicked
function drawClick(e) {
  // when fill or grab is true do not do anything (a seperate listener is waiting for fill / grab input)
  if (!grab && !fill) {
    if (eraser) {
      e.target.style.backgroundColor = '';
      //data-inked = true means the background color change wont affect these elements
      e.target.removeAttribute('data-inked');
      e.target.removeAttribute('data-shade');
    } else if (rainbow) {
      e.target.style.backgroundColor = randomColor();
      e.target.setAttribute('data-inked', 'true');
      e.target.removeAttribute('data-shade');
    } else if (shading) {
      // first check to see if this grid item has been shadded. if it hasnt, set data-shade to 1
      // this is nessesarry to transfer shading between bg color changes
      if (!e.target.dataset.shade) {
        e.target.setAttribute('data-shade', '1');
      } else {
        // if the grid item has been shadded, increment the data-shade value
        // this keeps track of how many times the grid item has been shaded
        let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
        shadeAmount++;
        e.target.setAttribute('data-shade', `${shadeAmount}`);
      } // a transperent item cant be shadded. if item is transperent first set the cell color to bg color
      if (e.target.style.backgroundColor == '' || e.target.style.backgroundColor == 'transperent') {
        e.target.style.backgroundColor = bgColor;
      }

      e.target.style.backgroundColor = adjust(RGBToHex, e.target.style.backgroundColor, -15);
      // e.target.setAttribute('data-inked', 'true');
    } else if (lighten) {
      if (!e.target.dataset.shade) {
        e.target.setAttribute('data-shade', '-1');
      } else {
        // if the grid item has been lightened, decrement the data-shade value
        // this keeps track of how many times the grid item has been shaded
        let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
        shadeAmount--;
        e.target.setAttribute('data-shade', `${shadeAmount}`);
      }
      if (e.target.style.backgroundColor == '' || e.target.style.backgroundColor == 'transperent') {
        e.target.style.backgroundColor = bgColor;
      }
      e.target.style.backgroundColor = adjust(RGBToHex, e.target.style.backgroundColor, +15);
      // e.target.setAttribute('data-inked', 'true');
    } else {
      e.target.style.backgroundColor = ink;
      e.target.setAttribute('data-inked', 'true');
      e.target.removeAttribute('data-shade');
    }
  }
}
// draw when hovering into a grid with the mouse held down
function drawClickHover(e) {
  if (e.buttons > 0) {
    if (!grab && !fill) {
      if (eraser) {
        e.target.style.backgroundColor = '';
        //data-inked = true means the background color change wont affect these elements
        e.target.removeAttribute('data-inked');
        e.target.removeAttribute('data-shade');
      } else if (rainbow) {
        e.target.style.backgroundColor = randomColor();
        e.target.setAttribute('data-inked', 'true');
        e.target.removeAttribute('data-shade');
      } else if (shading) {
        // first check to see if this grid item has been shadded. if it hasnt, set data-shade to 1
        // this is nessesarry to transfer shading between bg color changes
        if (!e.target.dataset.shade) {
          e.target.setAttribute('data-shade', '1');
        } else {
          // if the grid item has been shadded, increment the data-shade value
          // this keeps track of how many times the grid item has been shaded
          let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
          shadeAmount++;
          e.target.setAttribute('data-shade', `${shadeAmount}`);
        } // a transperent item cant be shadded. if item is transperent first set the cell color to bg color
        if (
          e.target.style.backgroundColor == '' ||
          e.target.style.backgroundColor == 'transperent'
        ) {
          e.target.style.backgroundColor = bgColor;
        }

        e.target.style.backgroundColor = adjust(RGBToHex, e.target.style.backgroundColor, -15);
        // e.target.setAttribute('data-inked', 'true');
      } else if (lighten) {
        if (!e.target.dataset.shade) {
          e.target.setAttribute('data-shade', '-1');
        } else {
          // if the grid item has been lightened, decrement the data-shade value
          // this keeps track of how many times the grid item has been shaded
          let shadeAmount = parseInt(e.target.getAttribute('data-shade'));
          shadeAmount--;
          e.target.setAttribute('data-shade', `${shadeAmount}`);
        }
        if (
          e.target.style.backgroundColor == '' ||
          e.target.style.backgroundColor == 'transperent'
        ) {
          e.target.style.backgroundColor = bgColor;
        }
        e.target.style.backgroundColor = adjust(RGBToHex, e.target.style.backgroundColor, +15);
        // e.target.setAttribute('data-inked', 'true');
      } else {
        e.target.style.backgroundColor = ink;
        e.target.setAttribute('data-inked', 'true');
        e.target.removeAttribute('data-shade');
      }
    }
  }
}

// listen for events
function listen() {
  gridItems = document.querySelectorAll('.grid-item');
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('mousedown', drawClick);
    // listen for a mouse over and change colour only if mouse button is pressed
    gridItems[i].addEventListener('mouseenter', drawClickHover);
  }

  //listen for clicks on all grid items when grab is true (color picker)
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('click', (e) => {
      if (grab) {
        ink = e.target.style.backgroundColor;
        // if trying to grab the color of the background (transperent cell)
        if (ink == '') {
          colorPicker.value = bgColor;
        } else {
          colorPicker.value = RGBToHex(ink);
        }
        dropper.classList.remove('btn-on');
        grab = false;

        // once color has been grabbed, turn off other buttons so you can draw with the new color without
        // having to toggle the other button manually
        rainbow = false;
        rainbowButton.classList.remove('btn-on');
        shading = false;
        shaderButton.classList.remove('btn-on');
        lighten = false;
        lightenButton.classList.remove('btn-on');
        eraser = false;
        eraserButton.classList.remove('btn-on');
      }
    });
  }

  // listen for clicks on all grid items when fill is true (colour fill)
  for (let i = 0; i < gridItems.length; i++) {
    gridItems[i].addEventListener('click', colorFill);
  }

  bgColorPicker.addEventListener('input', (e) => {
    gridItems = document.querySelectorAll('.grid-item');
    bgColor = e.target.value;
    for (let i = 0; i < gridItems.length; i++) {
      if (!gridItems[i].dataset.inked) {
        container.style.backgroundColor = bgColor;
      }
      // carry over shading when the bg color changes
      //set all shaded items to bg color, so that the shading ran be re-applyed to the new bg color

      // dont change the color of shaded inked cells, only background cells that have been shaded
      if (!gridItems[i].dataset.inked) {
        if (gridItems[i].dataset.shade) {
          gridItems[i].style.backgroundColor = bgColor;
          // grab the value of data-shade (the amount of times the cell has been shaded)
          let shadeAmount = parseInt(gridItems[i].getAttribute('data-shade'));
          // multiply the default shading intensity by shadeAmount, then apply this ammount
          //of shading to the cell
          let reshadeValue = shadeAmount * -15;
          gridItems[i].style.backgroundColor = adjust(
            RGBToHex,
            gridItems[i].style.backgroundColor,
            reshadeValue
          );
        }
      }
    }
  });

  // toggle grid lines
  const gridButton = document.querySelector('#grid-btn');

  gridButton.addEventListener('click', () => {
    for (i = 0; i < gridItems.length; i++) {
      //toggle top and left cell borders
      gridItems[i].classList.toggle('border-top-left');
      //toggle the remaining right borders
      if (gridItems[i].dataset.right) {
        gridItems[i].classList.toggle('border-right');
      }
      // toggle the remaining bottom borders
      if (gridItems[i].dataset.bottom) {
        gridItems[i].classList.toggle('border-bottom');
      }
    }
  });
}

listen();
