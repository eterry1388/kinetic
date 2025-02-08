const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const lines = [];
const horizontalLines = [];
const verticalLines = [];
const outsideGaps = [];
let cellSize = 0;
let startingPoint;
let endingPoint;
let player;
const paths = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function update() {
  if (!player) return;
  if (paths.length > 0) return;

  paths.push(findSolvablePath());
  console.log("Solved!");
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  });

  if (startingPoint) {
    ctx.fillStyle = "green";
    ctx.fillRect(
      startingPoint.x - (cellSize / 4),
      startingPoint.y - (cellSize / 4),
      cellSize / 2,
      cellSize / 2
    );
  }

  if (endingPoint) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      endingPoint.x - (cellSize / 4),
      endingPoint.y - (cellSize / 4),
      cellSize / 2,
      cellSize / 2
    );
  }

  if (player) {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      player.x - (cellSize / 4),
      player.y - (cellSize / 4),
      cellSize / 2,
      cellSize / 2
    );
  }
}

function loop() {
  update();
  draw();
}

async function init() {
  //
  // Get lines from svg maze
  //
  const regex = /<line x1="(\d+)" y1="(\d+)" x2="(\d+)" y2="(\d+)" \/>/;
  const svgContent = await (await fetch("maze.svg")).text(); // TODO: Fetch from https://www.mazegenerator.net
  svgContent.split("\n").forEach(line => {
    const match = line.match(regex);
    if (match) {
      const [_, x1, y1, x2, y2] = match;
      lines.push({ x1: Number(x1), y1: Number(y1), x2: Number(x2), y2: Number(y2) });
    }
  });

  //
  // Figure out the gaps for the start and end positions
  //
  const minX = Math.min(...lines.map(line => line.x1));
  const minY = Math.min(...lines.map(line => line.y1));
  const maxX = Math.max(...lines.map(line => line.x2));
  const maxY = Math.max(...lines.map(line => line.y2));

  const xMinBorders = lines.filter(line => (line.x1 === minX && line.x2 === minX)).sort((a, b) => a.y1 - b.y1);
  const xMaxBorders = lines.filter(line => (line.x1 === maxX && line.x2 === maxX)).sort((a, b) => a.y1 - b.y1);
  const yMinBorders = lines.filter(line => (line.y1 === minY && line.y2 === minY)).sort((a, b) => a.x1 - b.x1);
  const yMaxBorders = lines.filter(line => (line.y1 === maxY && line.y2 === maxY)).sort((a, b) => a.x1 - b.x1);

  if (xMinBorders.length === 2) {
    if (xMinBorders[0].y2 !== xMinBorders[1].y1) {
      outsideGaps.push({ x1: minX, y1: xMinBorders[0].y2, x2: minX, y2: xMinBorders[0].y1 });
    }
  }

  if (xMaxBorders.length === 2) {
    if (xMaxBorders[0].y2 !== xMaxBorders[1].y1) {
      outsideGaps.push({ x1: maxX, y1: xMaxBorders[0].y2, x2: maxX, y2: xMaxBorders[0].y1 });
    }
  }

  if (yMinBorders.length === 2) {
    if (yMinBorders[0].x2 !== yMinBorders[1].x1) {
      outsideGaps.push({ x1: yMinBorders[0].x2, y1: minY, x2: yMinBorders[1].x1, y2: minY });
    }
  }

  if (yMaxBorders.length === 2) {
    if (yMaxBorders[0].x2 !== yMaxBorders[1].x1) {
      outsideGaps.push({ x1: yMaxBorders[0].x2, y1: maxY, x2: yMaxBorders[1].x1, y2: maxY });
    }
  }

  //
  // Figure out the maze cell size and the player's starting point
  //
  const startGap = outsideGaps[0];
  const endGap = outsideGaps[1];
  const startOrientation = startGap.x1 === startGap.x2 ? "vertical" : "horizontal";
  const endOrientation = endGap.x1 === endGap.x2 ? "vertical" : "horizontal";
  cellSize = startOrientation === "vertical" ? startGap.y2 - startGap.y1 : startGap.x2 - startGap.x1;

  // TODO: Make these accurate according to what wall the gap is on
  startingPoint = {
    x: startGap.x1 + (cellSize / 2),
    y: startGap.y1 + (cellSize / 2)
  };

  endingPoint = {
    x: endGap.x1 + (cellSize / 2),
    y: endGap.y1 - (cellSize / 2)
  };

  //
  // Divide out lines into horizontal/vertical
  //
  horizontalLines.push(...lines.filter(line => line.y1 === line.y2));
  if (startOrientation === "horizontal") { horizontalLines.push(startGap); }
  if (endOrientation === "horizontal") { horizontalLines.push(endGap); }

  verticalLines.push(...lines.filter(line => line.x1 === line.x2));
  if (startOrientation === "vertical") { verticalLines.push(startGap); }
  if (endOrientation === "vertical") { verticalLines.push(endGap); }

  //
  // Initialize the player
  //
  player = startingPoint;
}

function findSolvablePath() {
  const path = [];
  while (!movePlayer()) {
    path.push({ x: player.x, y: player.y });
  }

  return path;
}

function movePlayer() {
  const possibleDirections = findPossibleDirections();
  const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

  if (direction === "right") {
    player.x += cellSize;
  } else if (direction === "left") {
    player.x -= cellSize;
  } else if (direction === "up") {
    player.y -= cellSize;
  } else if (direction === "down") {
    player.y += cellSize;
  }

  return (player.x === endingPoint.x && player.y === endingPoint.y);
}

function findPossibleDirections() {
  const possibleDirections = [];

  // Right
  const newRightX = player.x + cellSize;
  const rightCollision = verticalLines.filter(line => line.x1 > player.x && line.x1 <= newRightX && line.y1 <= player.y && line.y2 >= player.y);
  if (rightCollision.length === 0) {
    possibleDirections.push("right");
  }

  // Left
  const newLeftX = player.x - cellSize;
  const leftCollision = verticalLines.filter(line => line.x1 < player.x && line.x1 >= newLeftX && line.y1 <= player.y && line.y2 >= player.y);
  if (leftCollision.length === 0) {
    possibleDirections.push("left");
  }

  // Up
  const newUpY = player.y - cellSize;
  const upCollision = horizontalLines.filter(line => line.y1 < player.y && line.y1 >= newUpY && line.x1 <= player.x && line.x2 >= player.x);
  if (upCollision.length === 0) {
    possibleDirections.push("up");
  }

  // Down
  const newDownY = player.y + cellSize;
  const downCollision = horizontalLines.filter(line => line.y1 > player.y && line.y1 <= newDownY && line.x1 <= player.x && line.x2 >= player.x);
  if (downCollision.length === 0) {
    possibleDirections.push("down");
  }

  return possibleDirections;
}

init();
setInterval(loop, 1000 / 60);
