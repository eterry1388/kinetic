class Toolbar {
  constructor(ctx) {
    this.ctx = ctx;
    this.mode = "add";
  }

  mouseDown(event) {
    const x = event.clientX;
    const y = event.clientY;

    if (x < 50 && y < 50) this.mode = "add";
    else if (x < 100 && y < 50) this.mode = "remove";
    else if (x < 150 && y < 50) this.mode = "move";
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.width, 50);

    if (this.mode === "add") {
      this.ctx.fillStyle = "lightgray";
      this.ctx.fillRect(0, 0, 50, 50);
    } else if (this.mode === "remove") {
      this.ctx.fillStyle = "lightgray";
      this.ctx.fillRect(50, 0, 50, 50);
    } else if (this.mode === "move") {
      this.ctx.fillStyle = "lightgray";
      this.ctx.fillRect(100, 0, 50, 50);
    }
  }

  update() {}
}
