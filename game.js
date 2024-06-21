let levelInterval;
let spawnInterval;
const player = new Player(center.x, center.y, 100, 'white');
player.draw();
/* let lastUpdate = new Date(); */
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible' && gameIsRunning) return;
  if (document.visibilityState !== 'visible' && !gameIsRunning) return;
  if (document.visibilityState !== 'visible') {
    gameIsRunning = false;
    console.log('gameRun stop');
    return;
  }
  gameIsRunning = true;
  console.log('gameRun');
  // Modify behavior...
});

function GameLoop() {
  /*   //Determine the amount of time since last frame update
  let now = new Date();
  let elapsed = now - lastUpdate;
  lastUpdate = now; */

  if (player.radius < 1) {
    gameIsRunning = false;
    gameMenu.classList.remove('hidden');
    return;
  }
  if (player.radius >= winLimit) {
    gameIsRunning = false;
    winBox.classList.remove('hidden');
    return;
  }
  if (!gameIsRunning) return;
  if (player.radius < 1) return;
  if (pause) return;
  animate();
  requestAnimationFrame(GameLoop);
  player.draw();
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
      player.radius -=
        player.radius - radiusDifference(player.radius, enemy.radius) >= 1
          ? radiusDifference(player.radius, enemy.radius) || 1
          : player.radius;
      enemies.splice(enemyIndex, 1);
      scoreElement.innerText = `${player.radius}`;
    }
    projectiles.forEach((projectile, projectileIndex) => {
      if (isCollision(projectile, enemy)) {
        const radiusDiff =
          radiusDifference(player.radius, enemy.radius, 'add') || 1;
        player.radius += radiusDiff;
        enemies.splice(enemyIndex, 1);
        projectiles.splice(projectileIndex, 1);
        score += radiusDiff;
        scoreElement.innerText = `${player.radius}`;
      }
    });
  });
}

function spawnEnemies() {

  spawnInterval = setInterval(() => {
    if (enemies.length > 30) return;
    if (!gameIsRunning) return;
    enemies.push(
      new Enemy(
        500,
        200,
        25,
        `rgb(${randomNumber(255)},${randomNumber(255)},${randomNumber(255)})`
      )
    );
  }, levelIntervalSeconds);
  levelInterval = setInterval(() => {
    if (!gameIsRunning) return;
    if (levelIntervalSeconds - 50 < 0) return;
    levelIntervalSeconds -= 50;
  }, 50);
}
gameContainer.addEventListener('mousedown', (e) => {
  const angle = calculateAngleFromEvent(e, canvas);
  const velocity = calculateVelocity(angle);
  if (projectiles.length > 30) return;
  scoreElement.innerText = `${player.radius}`;
  if (projectiles.length > 30) return;
  projectiles.push(
    new Projectile(
      center.x + velocity.x * player.radius,
      center.y + velocity.y * player.radius,
      5,
      'orange',
      velocity
    )
  );
  if (player.radius > 0) {
    player.radius -= radiusDifference(player.radius, 5, 'subtract') || 1;
  }
});

startButton.addEventListener('click', (e) => {
  e.preventDefault();
  gameMenu.classList.add('hidden');
  gameIsRunning = true;
  clearInterval(levelInterval);
  clearInterval(spawnInterval);
  levelIntervalSeconds = 1000;
  enemies.splice(0);
  projectiles.splice(0);
  player.radius = 100;
  spawnEnemies();
  scoreElement.innerText = `${player.radius}`;
  GameLoop();
});

winButton.addEventListener('click', (e) => {
  e.preventDefault();
  winBox.classList.add('hidden');
  gameIsRunning = true;
  clearInterval(levelInterval);
  clearInterval(spawnInterval);
  levelIntervalSeconds = 1000;
  enemies.splice(0);
  projectiles.splice(0);
  player.radius = 100;
  spawnEnemies();
  scoreElement.innerText = `${player.radius}`;
  GameLoop();
});
