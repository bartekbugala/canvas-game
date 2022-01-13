const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const projectiles = [];

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

const player = new Player(center.x, center.y, 30, 'blue');
player.draw();

function GameLoop() {
    animate()
    requestAnimationFrame(GameLoop);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  projectiles.forEach((proj) => {
    proj.draw();
    proj.update();
  });
}

window.addEventListener('click', (e) => {
  const angle = calculateAngle(e, canvas);
  const velocity = calculateVelocity(angle);
  console.log(velocity);
  projectiles.push(new Projectile(center.x, center.y, 5, 'orange', velocity));
  animate();
});

// HELPER FUNCTIONS
function calculateAngle(event, canvas) {
  return Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
}

function calculateVelocity(angle) {
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

GameLoop()
