const fps = 60;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toolbar = new Toolbar(ctx);
const dots = [];
let currentShape = "circle";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousedown", handleMouseDown);

function handleMouseDown(event) {
  toolbar.mouseDown(event);
  const x = event.clientX;
  const y = event.clientY;

  const clickedDot = dots.find(dot => Math.hypot(dot.x - x, dot.y - y) <= dot.size);

  if (toolbar.mode === "add") {
    dots.push(new Dot(ctx, x, y, currentShape));
  } else if (toolbar.mode === "remove") {
    if (clickedDot) {
      dots.splice(dots.indexOf(clickedDot), 1);
    }
  } else if (toolbar.mode === "move") {
    if (clickedDot) {
      clickedDot.select();
    } else {
      const selectedDot = dots.find(dot => dot.selected);
      if (selectedDot) {
        selectedDot.move(x, y);
      }
    }
  }
}

window.addEventListener("keydown", (event) => {
  if (event.key === "1") {
    currentShape = "circle";
  } else if (event.key === "2") {
    currentShape = "square";
  } else if (event.key === "3") {
    currentShape = "triangle";
  } else if (event.key === "4") {
    currentShape = "line";
  }
});

function update() {
  toolbar.update(currentShape);
  dots.forEach(dot => dot.update());
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  toolbar.draw();
  dots.forEach(dot => dot.draw());
}

function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 1000 / fps);
