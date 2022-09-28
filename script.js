const grid = document.querySelector(".grid");

for (let i = 0; i < 256; i++) {
    let gridElement = document.createElement("div");
    gridElement.classList.add("box");
    grid.appendChild(gridElement);
    console.log("log");
}