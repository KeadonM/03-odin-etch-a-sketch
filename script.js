/*This Event Listener prevents a bug that interrupts drawing when the
browser thinks a grid element is being dragged. This was the only solution
I could find.*/
document.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

const DEFAULT_GRID = 16;
const DEFAULT_DRAW_MODE = "default";

let mouseDown = false;
let drawMode = DEFAULT_DRAW_MODE;

let primaryColor = "#333333";
let secondaryColor = "#fafafa";
let currentColor = primaryColor;
const primaryColorPicker = document.querySelector("#primaryColor");
const secondaryColorPicker = document.querySelector("#secondaryColor");
addColorPickerEvents();

const currentSize = document.querySelector("#current-size");
const sizeSelector = document.querySelector("#size-selector");
addSizeEvents();

const confettiButton = document.querySelector("#confetti");
const eraserButton = document.querySelector("#eraser");
const invertButton = document.querySelector("#invert");
const clearButton = document.querySelector("#clear");
const gridLinesButton = document.querySelector("#grid-lines");
const exportButton = document.querySelector("#export");
addButtonEvents();

const body = document.querySelector("body");
body.addEventListener("mouseup", () => {
  mouseDown = false;
  primaryColorPicker.classList.remove("activeColor");
  secondaryColorPicker.classList.remove("activeColor");
});
const gridContainer = document.querySelector(".grid-container");
createGrid(DEFAULT_GRID);

function createGrid(gridSize) {
  document.querySelector(".grid").remove();
  grid = document.createElement("div");
  grid.classList.add("grid");
  gridContainer.appendChild(grid);
  createBoxes(grid, gridSize);
}

function createBoxes(grid, gridSize) {
  size = grid.offsetWidth / gridSize + "px";
  gridSize *= gridSize;
  for (let i = 0; i < gridSize; i++) {
    let gridElement = document.createElement("div");
    gridElement.classList.add("box");
    if (gridLinesButton.classList.contains("active")) {
      gridElement.classList.add("grid-lines");
    }
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
      gridElement.setAttribute("data-colored", "false");
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

function toggleGridLines() {
  gridLinesButton.classList.toggle("active");
  gridContainer.classList.toggle("grid-lines");
  let boxes = document.querySelectorAll(".box");
  for (let i = 0; i < boxes.length; i++) {
    console.log(boxes[i]);
    boxes[i].classList.toggle("grid-lines");
  }
}

function addColorPickerEvents() {
  primaryColorPicker.addEventListener(
    "input",
    (e) => (primaryColor = e.target.value)
  );
  secondaryColorPicker.addEventListener(
    "input",
    (e) => (secondaryColor = e.target.value)
  );
}

function addButtonEvents() {
  confettiButton.addEventListener("click", () => {
    console.log(drawMode);
    if (drawMode != "confetti") {
      drawMode = "confetti";
      confettiButton.classList.add("active");
      eraserButton.classList.remove("active");
    } else {
      drawMode = "default";
      confettiButton.classList.remove("active");
    }
  });
  eraserButton.addEventListener("click", () => {
    if (drawMode != "eraser") {
      drawMode = "eraser";
      eraserButton.classList.toggle("active");
      confettiButton.classList.remove("active");
    } else {
      drawMode = "default";
      eraserButton.classList.remove("active");
    }
  });
  invertButton.addEventListener("click", () => {
    document.querySelector(".grid").classList.toggle("invert");
    invertButton.classList.toggle("active");
  });
  clearButton.addEventListener("click", () => {
    document.querySelector(".grid").classList.remove("invert");
    invertButton.classList.remove("active");
    createGrid(DEFAULT_GRID);
  });
  gridLinesButton.addEventListener("click", () => toggleGridLines());
}

function addSizeEvents() {
  sizeSelector.addEventListener(
    "mousemove",
    (e) => (currentSize.textContent = `${e.target.value} x ${e.target.value}`)
  );
  sizeSelector.addEventListener("change", (e) => createGrid(e.target.value));
}

function addGridElementEvents(gridElement) {
  gridElement.addEventListener("mouseup", () => {
    mouseDown = false;
    primaryColorPicker.classList.remove("activeColor");
    secondaryColorPicker.classList.remove("activeColor");
  });
  gridElement.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      currentColor = primaryColor;
      primaryColorPicker.classList.add("activeColor");
      secondaryColorPicker.classList.remove("activeColor");
    } else if (e.button === 2) {
      currentColor = secondaryColor;
      primaryColorPicker.classList.remove("activeColor");
      secondaryColorPicker.classList.add("activeColor");
    }

    if (e.button === 0 || e.button === 2) {
      mouseDown = true;
      draw(e.target);
    }
  });
  gridElement.addEventListener("mouseover", (e) => {
    if (mouseDown) draw(e.target);
  });
}
