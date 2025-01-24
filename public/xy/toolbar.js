class Toolbar {
  constructor(ctx) {
    this.ctx = ctx;
    this.mode = "add";
    this.currentShape = "circle";
  }

  mouseDown(event) {
    const x = event.clientX;
    const y = event.clientY;

    if (x < 50 && y < 50) this.mode = "add";
    else if (x < 100 && y < 50) this.mode = "remove";
    else if (x < 150 && y < 50) this.mode = "move";
    else if (x < 200 && y < 50) this.mode = "connect";
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
    } else if (this.mode === "connect") {
      this.ctx.fillStyle = "lightgray";
      this.ctx.fillRect(150, 0, 50, 50);
    }

    this.ctx.fillStyle = "green";
    this.ctx.font = "12px Arial";
    this.ctx.fillText("Add", 10, 30);
    this.ctx.fillText("Remove", 60, 30);
    this.ctx.fillText("Move", 110, 30);
    this.ctx.fillText("Connect", 160, 30);

    this.ctx.font = "20px Arial";
    const textWidth = this.ctx.measureText(`Shape: ${this.currentShape}`).width;
    this.ctx.fillText(`Shape: ${this.currentShape}`, canvas.width - textWidth - 10, 30);
  }

  update(currentShape) {
    this.currentShape = currentShape;
  }
}
