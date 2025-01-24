class Dot {
  static size = 4;
  static pulseAmplitude = 3;
  static growthRate = 0.05;
  static color = "green";
  static pulseColor = "darkgreen";
  static selectedColor = "red";

  constructor(ctx, x, y, shape = "circle") {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.size = Dot.size;
    this.color = Dot.color;
    this.growing = true;
    this.selected = false;
  }

  select() {
    this.selected = true;
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    this.selected = false;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }

  update() {
    if (this.selected) {
      this.color = Dot.selectedColor;
    } else {
      this._pulsate();
    }
  }

  // Private methods

  _pulsate() {
    if (this.growing) {
      this.color = Dot.color;
      this.size += Dot.growthRate;

      if (this.size >= Dot.size + Dot.pulseAmplitude) {
        this.growing = false;
      }
    } else {
      this.color = Dot.pulseColor;
      this.size -= Dot.growthRate;

      if (this.size <= Dot.size) {
        this.growing = true;
      }
    }
  }
}
