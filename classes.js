const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');
canvas.width = gameContainer.clientWidth;
canvas.height = gameContainer.clientHeight;
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const projectiles = [];
const enemies = [];
let score = 0;
const scoreElement = document.getElementById('score');
let levelIntervalSeconds = 1000;
const pause = false;

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Projectile extends Player {
  constructor(x, y, radius, color, velocity) {
    super(x, y, radius, color);
    this.velocity = velocity;
  }
  update() {
    this.x = this.x + this.velocity.x * 4;
    this.y = this.y + this.velocity.y * 4;
  }
}

class Enemy extends Player {
  constructor(x, y, radius, color) {
    super(x, y, radius, color);
    const genX = getRandom(canvas.width);
    const genY = [0, canvas.height].random();

    const angle = calculateAngle({ x: genX, y: genY }, canvas);
    const velocity = calculateVelocity(angle);
    this.velocity = velocity;
    this.x = genX;
    this.y = genY;
    this.radius = getRandom(50);
    this.color = color;
  }
  update() {
    this.x = this.x - this.velocity.x;
    this.y = this.y - this.velocity.y;
  }
}
