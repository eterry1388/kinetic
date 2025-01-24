const fps = 60;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const toolbar = new Toolbar(ctx);
const dots = [];

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
    dots.push(new Dot(ctx, x, y));
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

function update() {
  toolbar.update();
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
