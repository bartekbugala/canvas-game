const player = new Player(center.x, center.y, 30, 'rgba(0,0,100,.5)');
player.draw();
spawnEnemies();

let lastUpdate = new Date();

function GameLoop() {
  /*   //Determine the amount of time since last frame update
  let now = new Date();
  let elapsed = now - lastUpdate;
  lastUpdate = now; */
  if (player.radius < 1) return;

  animate();

  requestAnimationFrame(GameLoop);
  if (player.radius < 0) return;
  player.draw();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  projectiles.forEach((projectile, index) => {
    projectile.draw();
    projectile.update();
    if (isOutOfBounds(projectile)) {
      projectiles.splice(index, 1);
    }
  });
  enemies.forEach((enemy, enemyIndex) => {
    if (enemy.radius < 1) {
      enemies.splice(enemyIndex, 1);
      return;
    }
    enemy.draw();
    enemy.update();
    if (isOutOfBounds(enemy)) {
      enemies.splice(enemyIndex, 1);
    }
    if (isCollision(player, enemy)) {
      console.log(
        'collision',
        player.radius,
        radiusDifference(player.radius, enemy.radius)
      );
      player.radius -=
        player.radius - radiusDifference(player.radius, enemy.radius) >= 1
          ? radiusDifference(player.radius, enemy.radius) || 1
          : player.radius;
      enemies.splice(enemyIndex, 1);
    }
    projectiles.forEach((projectile, projectileIndex) => {
      if (isCollision(projectile, enemy)) {
        player.radius +=
          radiusDifference(player.radius, enemy.radius, 'add') || 1;
        enemies.splice(enemyIndex, 1);
        projectiles.splice(projectileIndex, 1);
      }
    });
  });
}

function spawnEnemies() {
  setInterval(() => {
    enemies.push(new Enemy(500, 200, 25, 'green'));
  }, 800);
}

window.addEventListener('mousedown', (e) => {
  const angle = calculateAngleFromEvent(e, canvas);
  const velocity = calculateVelocity(angle);
  if (player.radius > 0) {
    player.radius -= radiusDifference(player.radius, 5, 'subtract') || 1;
  }
  if (player.radius < 1) {
    alert('YOU HAVE BEEN DEFEATED!');
    return;
  }
  projectiles.push(new Projectile(center.x, center.y, 5, 'red', velocity));
});

GameLoop();
