const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const projectiles = [];
const enemies = [];

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
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy extends Player {
  constructor(x, y, radius, color) {
    super(x, y, radius, color);
    const genX = getRandom(canvas.width);
    const genY = getRandom(canvas.height);
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

const player = new Player(center.x, center.y, 30, 'rgba(0,0,100,.5)');
player.draw();
spawnEnemies();

function GameLoop() {
  requestAnimationFrame(GameLoop);

  animate();
  player.draw();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  projectiles.forEach((proj) => {
    proj.draw();
    proj.update();
  });
  enemies.forEach((enem) => {
    enem.draw();
    enem.update();
  });
}

function spawnEnemies() {
  setInterval(() => {
    enemies.push(new Enemy(500, 200, 25, 'green' /* , { x: 2, y: 3 } */));
  }, 2000);
}

window.addEventListener('click', (e) => {
  const angle = calculateAngleFromEvent(e, canvas);
  const velocity = calculateVelocity(angle);
  projectiles.push(new Projectile(center.x, center.y, 5, 'red', velocity));
});
GameLoop();
// HELPER FUNCTIONS
function calculateAngleFromEvent(event, canvas) {
  return Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
}
function calculateAngle(coordinates, canvas) {
  return Math.atan2(
    coordinates.y - canvas.height / 2,
    coordinates.x - canvas.width / 2
  );
}

function calculateVelocity(angle, reverse) {
  if (reverse) {
    return {
      x: Math.sin(angle),
      y: Math.cos(angle),
    };
  }
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

function getRandom(max) {
  return Math.floor(Math.random() * max);
}
