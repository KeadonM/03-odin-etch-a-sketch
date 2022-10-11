/*This Event Listener prevents a bug that interrupts drawing when the
browser thinks a grid element is being dragged. This was the only solution
I could find.*/
document.ondragstart = (e) => e.preventDefault();

/*Defaults*/
const DEFAULT_DRAW_MODE = "default";
const DEFAULT_GRID_SIZE = 16;
const DEFAULT_PRIMARY_COLOR = "#333333";
const DEFAULT_SECONDARY_COLOR = "#fafafa";

let drawMode = DEFAULT_DRAW_MODE;
let currentSize = DEFAULT_GRID_SIZE;
let primaryColor = DEFAULT_PRIMARY_COLOR;
let secondaryColor = DEFAULT_SECONDARY_COLOR;
let eraserColor = DEFAULT_SECONDARY_COLOR;
let currentColor = primaryColor;
let mouseDown = false;

/*---Color Pickers---*/
const primaryColorPicker = document.querySelector("#primaryColor");
const secondaryColorPicker = document.querySelector("#secondaryColor");

primaryColorPicker.oninput = (e) => (primaryColor = e.target.value);
secondaryColorPicker.oninput = (e) => (secondaryColor = e.target.value);

/*---Slider---*/
const currentSizeText = document.querySelector("#current-size");
const sizeSelector = document.querySelector("#size-selector");

sizeSelector.onmousemove = (e) => updateSizeText(e.target.value);
sizeSelector.onchange = (e) => createGrid(e.target.value);

function updateSizeText(size) {
  currentSize = size;
  currentSizeText.textContent = `${size} x ${size}`;
}

/*---Buttons---*/
const eraserButton = document.querySelector("#eraser");
const confettiButton = document.querySelector("#confetti");
const invertButton = document.querySelector("#invert");
const gridLinesButton = document.querySelector("#grid-lines");
const clearButton = document.querySelector("#clear");
const exportButton = document.querySelector("#export");

eraserButton.onclick = () => toggleEraser();
confettiButton.onclick = () => changeDrawMode("confetti");
invertButton.onclick = () => toggleInvert();
gridLinesButton.addEventListener("click", () => toggleGridLines());
clearButton.onclick = () => createGrid(currentSize);

function toggleActiveModeButton(mode) {
  switch (mode) {
    case "default":
      confettiButton.classList.remove("active");
      eraserButton.classList.remove("active");
      break;
    case "eraser":
      eraserButton.classList.add("active");
      confettiButton.classList.remove("active");
      break;
    case "confetti":
      confettiButton.classList.add("active");
      eraserButton.classList.remove("active");
      break;
  }
}

function toggleGridLines() {
  gridLinesButton.classList.toggle("active");
  gridContainer.classList.toggle("grid-lines");
  let boxes = document.querySelectorAll(".box");
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].classList.toggle("grid-lines");
  }
}

function toggleInvert() {
  document.querySelector(".grid").classList.toggle("invert");
  invertButton.classList.toggle("active");
}

/*Grid*/

const body = document.querySelector("body");
const gridContainer = document.querySelector(".grid-container");
createGrid(currentSize);

function createGrid(gridWidth) {
  document.querySelector(".grid").remove();
  const grid = document.createElement("div");
  grid.classList.add("grid");
  gridContainer.appendChild(grid);
  populateGrid(grid, gridWidth);
}

function populateGrid(grid, gridWidth) {
  const elementSize = grid.offsetWidth / gridWidth + "px";
  const totalElements = gridWidth * gridWidth;
  const gridLines = gridLinesButton.classList.contains("active");

  for (let i = 0; i < totalElements; i++) {
    const gridElement = document.createElement("div");
    gridElement.style.width = elementSize;
    gridElement.style.height = elementSize;
    gridElement.classList.add("box");
    gridElement.setAttribute("data-confetti", "false");
    if (gridLines) gridElement.classList.add("grid-lines");
    grid.appendChild(gridElement);
    gridElement.onmousedown = (e) => elementTouched(e);
    gridElement.onmouseover = (e) => draw(e.target);
  }
}

function elementTouched(e) {
  if (e.button === 1 && !eraserButton.classList.contains("active")) {
    toggleEraser();
  } else if (e.button === 2) {
    activeColorToggle(secondaryColor, secondaryColorPicker);
  } else {
    activeColorToggle(primaryColor, primaryColorPicker);
  }

  mouseDown = true;
  draw(e.target);
}

function activeColorToggle(color, activeColor) {
  if (eraserButton.classList.contains("active")) return;
  currentColor = color;
  deactivateColorPickers();
  activeColor.classList.add("active-color");
}

function deactivateColorPickers() {
  primaryColorPicker.classList.remove("active-color");
  secondaryColorPicker.classList.remove("active-color");
}

function toggleEraser() {
  eraserButton.classList.toggle("active");
  changeDrawMode("eraser");
  deactivateColorPickers();
}

body.addEventListener("mouseup", (e) => {
  if (e.button === 1) {
    toggleEraser();
  }
  deactivateColorPickers();
  mouseDown = false;
});

/*Draw*/
function changeDrawMode(mode) {
  if (drawMode === mode) {
    mode = "default";
  }
  drawMode = mode;
  toggleActiveModeButton(mode);
}

function draw(gridElement) {
  if (!mouseDown) return;

  switch (drawMode) {
    case "default":
      gridElement.setAttribute("data-confetti", "false");
      gridElement.style.backgroundColor = currentColor;
      break;

    case "eraser":
      gridElement.setAttribute("data-confetti", "false");
      gridElement.style.backgroundColor = eraserColor;
      break;

    case "confetti":
      confettiDraw(gridElement);
      break;
  }
}

function confettiDraw(gridElement) {
  let color;
  if (gridElement.getAttribute("data-confetti") === "false") {
    gridElement.setAttribute("data-confetti", "true");
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

function test() {}
