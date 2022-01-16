// HELPER FUNCTIONS
function calculateAngleFromEvent(event, canvas) {
  return Math.atan2(
    event.clientY - gameContainer.offsetTop + canvas.offsetTop - canvas.height / 2,
    event.clientX - gameContainer.offsetLeft + canvas.offsetLeft - canvas.width / 2
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

function isOutOfBounds(entity) {
  if (
    entity.x + entity.radius < 0 ||
    entity.y + entity.radius < 0 ||
    entity.x - entity.radius > canvas.width ||
    entity.y - entity.radius > canvas.width
  ) {
    return true;
  }
}

function isCollision(entity1, entity2) {
  const dist = Math.hypot(entity1.x - entity2.x, entity1.y - entity2.y);
  return dist - entity2.radius - entity1.radius < 1;
}

function fieldFromRadius(radius) {
  return Math.ceil(Math.PI * Math.pow(radius, 2));
}

function radiusFromField(field) {
  return Math.ceil(Math.sqrt(field / Math.PI));
}

function radiusDifference(radius1, radius2, add) {
  console.log('player.radius', radius1);
  console.log('enemy.radius', radius2);
  const field1 = fieldFromRadius(radius1);
  const field2 = fieldFromRadius(radius2);
  if (add === 'add') {
    return Math.ceil(radiusFromField(field1 + field2) - radius1);
  }
  return Math.round(radius1 - radiusFromField(field1 - field2));
}
