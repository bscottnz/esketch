// number of rows / columns in grid
let gridSize = 24;

const container = document.querySelector('.grid-container');

let bgColor = '#ffffff'
container.style.backgroundColor = bgColor;

//create new grid items to fill the grid
function createGrid() {

    // having the grid with each item at 1fr would leave left over space at the end of the grid
    //  when there were lots of items, doing it this way seemed to fill in that extra space.
    // however the grid broke when there were 3 or less items, so the if statment fixes that
    let gridWidth = (container.offsetWidth / gridSize);
    container.style.gridTemplateColumns = `repeat(${gridSize-3}, ${gridWidth}px) 1fr 1fr 1fr`;
    container.style.gridTemplateRows = `repeat(${gridSize-3}, ${gridWidth}px) 1fr 1fr 1fr`;
    if (gridSize < 4) {
        container.style.gridTemplateColumns = `repeat(${gridSize},1fr`;
        container.style.gridTemplateRows = `repeat(${gridSize}, 1fr`;
    }
    
    for (let i = 0; i < gridSize ** 2; i++) {
        const square = document.createElement('div');
        square.classList.add('grid-item');
        square.setAttribute('draggable', 'false');
        square.style.backgroundColor = "transperent";
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
        square.classList.add('border-top-left');
    };
    //add a right border the the right most items
    const rightItems = document.querySelectorAll(`.grid-item:nth-child(${gridSize}n)`);
    for (let i = 0; i < rightItems.length; i++) {
        rightItems[i].setAttribute('data-right', 'true');
        rightItems[i].classList.toggle('border-right');
    }

    // add a bottom border to the bottom most items
    let gridItems = document.querySelectorAll(".grid-item");
    const lastItems = Array.from(gridItems).slice(-`${gridSize}`);
    for (let i = 0; i < lastItems.length; i++) {
        lastItems[i].setAttribute('data-bottom', 'true');
        lastItems[i].classList.toggle('border-bottom');
    }


    
}

createGrid()

gridItems = document.querySelectorAll(".grid-item");



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
    gridItems = document.querySelectorAll(".grid-item");
    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].style.backgroundColor = "";
        gridItems[i].removeAttribute('data-inked');
        gridItems[i].removeAttribute('data-shade');

    }
}
clearButton.addEventListener('click', clearGrid);


// set fill to true when the color fill button is pressed 
// if fill is true set it to false (clicking the button without filling)
// when fill is true all other events on the grid will stop and listen for a grid area to fill
const colorFillButton = document.querySelector('#color-fill');
let fill = false;
colorFillButton.addEventListener('click', () => {
    if (fill) {
        fill = false;
    } else { 
        fill = true;
    }
    
});
// convert array into matrix representing the grid
function toMatrix(arr, width) {
    return arr.reduce(function (rows, key, index) { 
      return (index % width == 0 ? rows.push([key]) 
        : rows[rows.length-1].push(key)) && rows;
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
function getAdjacent1D (x, gridX, gridY) {
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
    

    return [xAbove, xBellow, xLeft, xRight]
}


//colorfill
function colorFill (e) {
    if (fill) {
        //get index of the clicked grid cell
        let ogIndex = Array.from(e.target.parentElement.children).indexOf(e.target);
        // console.log(ogIndex);

        // create a list of items to color
        let toFill = [ogIndex];
        let addedToFill = 1;

        gridItems = document.querySelectorAll('.grid-item');
        let gridItemsArray = Array.from(gridItems);
        // console.log(gridItemsArray.length);

        // create grid-like representation of grid items
        let gridItemsArray2D = toMatrix(gridItemsArray, gridSize);
        // console.log(gridItemsArray2D);

        // get index of clicked item in 2d array 
        let gridX = Math.floor(ogIndex / gridSize);
        let gridY = ogIndex % gridSize;
        // console.log(gridX);
        // console.log(gridY);

        // console.log(getAdjacent2D(gridX, gridY));

        // console.log(getAdjacent1D(ogIndex, gridX, gridY));

        // toFill=[12, 13, 11, 17, 7, 2, 6, 8, 22, 16, 18, 10, 14];
        while (addedToFill != 0) {
            let toCheck = toFill.slice(-addedToFill);
            // toCheck = [2, 6, 8, 22, 16, 18, 10, 14];
            let addedItems = [];
            // console.log(toCheck);
            addedToFill = 0;
            for (let j = 0; j < toCheck.length; j++) {
                // console.log(toCheck[j]);
                let toAdd = (getAdjacent1D(toCheck[j], gridX, gridY));
                // console.log(toAdd);
                for (let i = 0; i < toAdd.length; i++) {
                    if (getAdjacent1D(toCheck[j][i], gridX, gridY)[i] != null) {
                        if (!toFill.includes(toAdd[i][0])) {
                            // for some reason it was adding items above the top line
                            // and bellow the bottom line, i couldnt work it out so 
                            // added this if. It would also add string numbers if i changed
                            // the grid size with the slider 
                            if (toAdd[i][0] >= 0 && toAdd[i][0] < gridSize**2 && typeof toAdd[i][0] == "number") {
                                // only color in the surounding items if they are the same color as the selected item
                                if (e.target.parentElement.children[toAdd[i][0]].style.backgroundColor == 
                                    e.target.style.backgroundColor) {
                                    toFill.push(toAdd[i][0]);
                                    addedItems.push(toAdd[i][0]);
                                }
                                
                            }
                            
                        }
                    }
                }
                    
            }
            addedToFill = addedItems.length;
            // console.log(addedItems.length);
            // console.log(addedItems);


            

        }
        
        console.log(toFill);

        for (let i=0; i < toFill.length; i++) {
            e.target.parentElement.children[toFill[i]].style.backgroundColor = ink;

            e.target.parentElement.children[toFill[i]].setAttribute('data-inked', 'true');

        }
     
        colorFillButton.classList.remove('btn-on');
        fill = false;
    }
}




// draw on the grid when clicked
function drawClick(e) {
    // when fill or grab is true do not do anything (a seperate listener is waiting for fill / grab input)
    if (!grab && !fill) {
        if (eraser) {
            e.target.style.backgroundColor = "";
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
            if (e.target.style.backgroundColor == "" || e.target.style.backgroundColor == "transperent") {
                e.target.style.backgroundColor = bgColor;
            }


            e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,-15);
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
            if (e.target.style.backgroundColor == "" || e.target.style.backgroundColor == "transperent") {
                e.target.style.backgroundColor = bgColor;
            }
            e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,+15);
            // e.target.setAttribute('data-inked', 'true');
        } else {
            e.target.style.backgroundColor = ink;
            e.target.setAttribute('data-inked', 'true');
            e.target.removeAttribute('data-shade');
        }
    };
}
// draw when hovering into a grid with the mouse held down
function drawClickHover(e) {
    if (e.buttons > 0) {
        if (!grab && !fill) {
            if (eraser) {
                e.target.style.backgroundColor = "";
                //data-inked = true means the background color change wont affect these elements
                e.target.removeAttribute('data-inked')
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
                if (e.target.style.backgroundColor == "" || e.target.style.backgroundColor == "transperent") {
                    e.target.style.backgroundColor = bgColor;
                }
    
    
                e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,-15);
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
                if (e.target.style.backgroundColor == "" || e.target.style.backgroundColor == "transperent") {
                    e.target.style.backgroundColor = bgColor;
                }
                e.target.style.backgroundColor = adjust(RGBToHex,e.target.style.backgroundColor,+15);
                // e.target.setAttribute('data-inked', 'true');
            } else {
                e.target.style.backgroundColor = ink;
                e.target.setAttribute('data-inked', 'true');
                e.target.removeAttribute('data-shade');
            }
        }
        
    };
}

// listen for events
function listen() {
    gridItems = document.querySelectorAll(".grid-item");
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
                // if trying to grab the color of the background (transperent cell)
                if (ink == "") {
                    colorPicker.value = bgColor;
                } else {
                    colorPicker.value = RGBToHex(ink);
                }
                dropper.classList.remove('btn-on');
                grab = false;   
            }
        });
    }

    // listen for clicks on all grid items when fill is true (colour fill)
    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].addEventListener('click', colorFill)
        }

    bgColorPicker.addEventListener("input", e => {
        gridItems = document.querySelectorAll(".grid-item");
        for (let i = 0; i < gridItems.length; i++) {
            if (!gridItems[i].dataset.inked) {
                bgColor = e.target.value;
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
                    gridItems[i].style.backgroundColor = adjust(RGBToHex,gridItems[i].style.backgroundColor,reshadeValue);
    
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
    })
}

listen()













