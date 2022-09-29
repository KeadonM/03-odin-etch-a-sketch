const DEFAULT_GRID = 16;

const gridButton = document.querySelector("#new-grid");
const gridContainer = document.querySelector(".grid-container");

gridButton.addEventListener("click", () => promptNewGrid());

createGrid(DEFAULT_GRID);

function promptNewGrid() {
    let gridSize;
    do {
        gridSize = prompt("Enter a grid size below 100");
    } while (gridSize > 100 || gridSize < 2);

    createGrid(gridSize);
}

function createGrid(gridSize) {
    removeOldGrid();
    grid = document.createElement("div");
    grid.classList.add("grid");
    gridContainer.appendChild(grid);
    createBoxes(grid, gridSize);
}

function removeOldGrid() {
    let oldGrid = document.querySelector(".grid");
    oldGrid.remove();
}

function createBoxes(grid, gridSize) {
    size = grid.offsetWidth / gridSize + "px";
    console.log
    gridSize *= gridSize;
    for (let i = 0; i < gridSize; i++) {
        let gridElement = document.createElement("div");
        gridElement.classList.add("box");
        gridElement.setAttribute("data-colored", "false");
        gridElement.style.width = size;
        gridElement.style.height = size;
        grid.appendChild(gridElement);
        gridElement.addEventListener("mouseover", e => eventHandler(e));
    }
}

function eventHandler(e) {
    if (e.altKey && e.target.getAttribute("data-colored") === "false") {
        randomColorOnHover(e.target);
        e.target.setAttribute("data-colored", "true");
    } else if (e.altKey) {
        darkenColorOnHover(e.target);
    }
}

function darkenColorOnHover(gridElement) {
    let currentColor = gridElement.style.backgroundColor;
    currentColor = currentColor.slice(4, currentColor.length - 1);
    let values = currentColor.split(",");

    for (let i = 0; i < values.length; i++) {
        values[i] = parseInt(values[i]) * 0.9;
    }

    gridElement.style.backgroundColor = `rgb(${parseInt(values[0])}, 
                                            ${parseInt(values[1])},
                                            ${parseInt(values[2])})`;
}

function randomColorOnHover(gridElement) {
    gridElement.style.backgroundColor = `rgb(${getRandomValue()},
                                            ${getRandomValue()},
                                            ${getRandomValue()})`;
}

function getRandomValue() {
    return Math.floor(Math.random() * 256);
}
