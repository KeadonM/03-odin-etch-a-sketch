const DEFAULT_GRID = 16;
const DEFAULT_DRAW_MODE = "default";

let mouseDown = false;
let drawMode = DEFAULT_DRAW_MODE;

const body = document.querySelector("body");
body.addEventListener("mouseup", () => (mouseDown = false));
const gridContainer = document.querySelector(".grid-container");
createGrid(DEFAULT_GRID);

let primaryColor = "#000000";
let secondaryColor = "#ffffff";
let currentColor = primaryColor;
const primaryColorPicker = document.querySelector("#primaryColor");
const secondaryColorPicker = document.querySelector("#secondaryColor");
addColorPickerEvents(primaryColorPicker, secondaryColorPicker);

function createGrid(gridSize) {
  removeOldGrid();
  grid = document.createElement("div");
  grid.classList.add("grid");
  gridContainer.appendChild(grid);
  createBoxes(grid, gridSize);
}

function removeOldGrid() {
  const oldGrid = document.querySelector(".grid");
  oldGrid.remove();
}

function createBoxes(grid, gridSize) {
  size = grid.offsetWidth / gridSize + "px";
  gridSize *= gridSize;
  for (let i = 0; i < gridSize; i++) {
    let gridElement = document.createElement("div");
    gridElement.classList.add("box");
    gridElement.setAttribute("data-colored", "false");
    gridElement.style.width = size;
    gridElement.style.height = size;
    grid.appendChild(gridElement);
    addGridElementEvents(gridElement);
  }
}

function draw(gridElement) {
  switch (drawMode) {
    case "default":
      gridElement.style.backgroundColor = currentColor;
      break;

    case "confetti":
      confettiDraw(gridElement);
      break;

    case "eraser":
      gridElement.style.backgroundColor = "#fafafa";
      break;
  }
}

function confettiDraw(gridElement) {
  let color;
  if (gridElement.getAttribute("data-colored") === "false") {
    gridElement.setAttribute("data-colored", "true");
    color = getConfettiColor();
  } else {
    color = getDarkenedColor(gridElement.style.backgroundColor);
  }
  gridElement.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function getConfettiColor() {
  let confettiColor = [];
  for (let i = 0; i < 3; i++) {
    confettiColor[i] = Math.floor(Math.random() * 180) + 75;
  }
  return confettiColor;
}

function getDarkenedColor(currentColor) {
  currentColor = currentColor.slice(4, currentColor.length - 1).split(",");
  let darkenedColor = [];
  for (let i = 0; i < 3; i++) {
    darkenedColor[i] = parseInt(currentColor[i]) * 0.5;
  }

  return darkenedColor;
}

function addColorPickerEvents(primaryColorPicker, secondaryColorPicker) {
  primaryColorPicker.addEventListener(
    "input",
    (e) => (primaryColor = e.target.value)
  );
  secondaryColorPicker.addEventListener(
    "input",
    (e) => (secondaryColor = e.target.value)
  );
}

function addGridElementEvents(gridElement) {
  gridElement.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      currentColor = primaryColor;
    } else if (e.button === 2) {
      currentColor = secondaryColor;
    }
    mouseDown = true;
    draw(e.target);
  });
  gridElement.addEventListener("mouseover", (e) => {
    if (mouseDown) draw(e.target);
  });
}
