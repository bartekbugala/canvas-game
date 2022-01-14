const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const projectiles = [];
const enemies = [];

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
  projectiles.forEach((projectile, index) => {
    projectile.draw();
    projectile.update();
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.y + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y - projectile.radius > canvas.width
    ) {
      projectiles.splice(index, 1);
    }
  });
  enemies.forEach((enemy, enemyIndex) => {
    enemy.draw();
    enemy.update();

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - enemy.radius - projectile.radius < 1) {
        enemies.splice(enemyIndex, 1);
        projectiles.splice(projectileIndex, 1);
      }
    });
  });
}

function spawnEnemies() {
  setInterval(() => {
    enemies.push(new Enemy(500, 200, 25, 'green' /* , { x: 2, y: 3 } */));
  }, 1000);
}

window.addEventListener('mousedown', (e) => {
  console.log(projectiles);
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
