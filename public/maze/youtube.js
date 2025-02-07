const fps = 60;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Maze {
  static mazeSize = 400;
  static maxPaths = 300;
  static branchingProbability = 0.03;
  static mazeSpeed = 1;
  static pathWidth = 0;

  constructor() {
    this.startPoint = this.createStartPoint();
    this.endPoint = this.createEndPoint();
    this.paths = [];
    this.solvable = false;
    this.lastUpdate = Date.now();

    this.addPath(true, [this.startPoint])
  }

  addPath(mainPath, points = []) {
    const path = new Path(this, mainPath, this.endPoint, points);
    this.paths.push(path);
    return path;
  }

  createStartPoint() {
    const initialA = Math.floor(Math.random() * Maze.mazeSize);
    const initialB = Math.random() < 0.5 ? 0 : Maze.mazeSize - 1;
    return Math.random() < 0.5 ? [initialA, initialB] : [initialB, initialA];
  }

  createEndPoint() {
    if (this.startPoint[0] === 0) {
      return [Maze.mazeSize - 1, Math.floor(Math.random() * Maze.mazeSize)];
    } else if (this.startPoint[0] === Maze.mazeSize - 1) {
      return [0, Math.floor(Math.random() * Maze.mazeSize)];
    } else if (this.startPoint[1] === 0) {
      return [Math.floor(Math.random() * Maze.mazeSize), Maze.mazeSize - 1];
    } else if (this.startPoint[1] === Maze.mazeSize - 1) {
      return [Math.floor(Math.random() * Maze.mazeSize), 0];
    }
  }

  update() {
    if (Date.now() - this.lastUpdate < Maze.mazeSpeed) return;
    this.lastUpdate = Date.now();

    this.paths.forEach(path => path.update());

    if (!this.solvable && this.paths.some(path => path.solution)) {
      this.solvable = true;
    }

    if (this.paths.length < Maze.maxPaths && Math.random() < Maze.branchingProbability) {
      this.addPath(false, [this.paths[0].lastPoint()]);
    }
  }

  draw(ctx) {
    this.paths.forEach(path => path.draw(ctx));

    ctx.fillStyle = "green";
    ctx.fillRect(this.startPoint[0] * Maze.pathWidth, this.startPoint[1] * Maze.pathWidth, Maze.pathWidth, Maze.pathWidth);

    ctx.fillStyle = "red";
    ctx.fillRect(this.endPoint[0] * Maze.pathWidth, this.endPoint[1] * Maze.pathWidth, Maze.pathWidth, Maze.pathWidth);
  }
}

class Path {
  constructor(maze, mainPath, goalPoint, points = []) {
    this.maze = maze;
    this.mainPath = mainPath;
    this.goalPoint = goalPoint;
    this.points = points;
    this.blacklist = [];
    this.solution = false;
  }

  addPoint(x, y) {
    this.points.push([x, y]);
  }

  possibleNextPoints() {
    return this.nextPointCandidates().filter((point) =>
      point[0] >= 0 && point[0] < Maze.mazeSize &&
      point[1] >= 0 && point[1] < Maze.mazeSize &&
      this.maze.paths.every((path) => !path.points.some(p => p[0] === point[0] && p[1] === point[1])) &&
      this.blacklist.every((p) => p[0] !== point[0] || p[1] !== point[1])
    );
  }

  nextPointCandidates() {
    const lastPoint = this.lastPoint();

    return [
      [lastPoint[0] - 1, lastPoint[1]],
      [lastPoint[0] + 1, lastPoint[1]],
      [lastPoint[0], lastPoint[1] - 1],
      [lastPoint[0], lastPoint[1] + 1]
    ];
  }

  lastPoint() {
    return this.points[this.points.length - 1];
  }

  forward() {
    const nextPoint = this.possibleNextPoints()[Math.floor(Math.random() * this.possibleNextPoints().length)];
    this.points.push(nextPoint);

    if (!this.solution && nextPoint[0] === this.goalPoint[0] && nextPoint[1] === this.goalPoint[1]) {
      this.solution = true;
    }
  }

  reverse() {
    this.blacklist.push(this.points.pop());
  }

  isDeadEnd() {
    return this.possibleNextPoints().length === 0;
  }

  update() {
    if (this.points.length === 0) return;
    if (this.solution) return;

    if (this.isDeadEnd()) {
      if (this.maze.solvable) return;

      this.reverse();
      return;
    }

    this.forward();
  }

  draw(ctx) {
    this.points.forEach((point) => {
      ctx.fillStyle = this.solution || this.mainPath ? "yellow" : "white";
      ctx.fillRect(point[0] * Maze.pathWidth, point[1] * Maze.pathWidth, Maze.pathWidth, Maze.pathWidth);
    });
  }
}

const maze = new Maze();

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  Maze.pathWidth = canvas.height / Maze.mazeSize;
}

function update() {
  maze.update();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  maze.draw(ctx);
}

function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 1000 / fps);
