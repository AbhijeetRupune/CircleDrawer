const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let drawing = false;
let points = [];

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mouseup', end);
canvas.addEventListener('mousemove', draw);

// Touch event handlers for mobile support
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  start({
    offsetX: touch.clientX - rect.left,
    offsetY: touch.clientY - rect.top
  });
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  draw({
    offsetX: touch.clientX - rect.left,
    offsetY: touch.clientY - rect.top
  });
});

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  end();
});

function start(e) {
  drawing = true;
  points = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = 'black'; // Or use your color picker if added
  const { offsetX, offsetY } = e;
  ctx.moveTo(offsetX, offsetY);
  points.push([offsetX, offsetY]);
}

function draw(e) {
  if (!drawing) return;
  const { offsetX, offsetY } = e;
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  points.push([offsetX, offsetY]);
}

function end() {
  if (!drawing) return;
  drawing = false;
  ctx.closePath();
  const score = calculateScore(points);

  scoreDisplay.classList.remove('congrats', 'almost');

  if (score >= 95) {
    scoreDisplay.textContent = `😮 Ooh! Just missed the perfect circle! Your score: ${score.toFixed(2)} / 100`;
    scoreDisplay.classList.add('almost');
  } else if (score >= 90) {
    scoreDisplay.textContent = `🎉 Hurray! Congratulations! Your score: ${score.toFixed(2)} / 100`;
    scoreDisplay.classList.add('congrats');
  } else {
    scoreDisplay.textContent = `Your circle score: ${score.toFixed(2)} / 100`;
  }
}

function calculateScore(pts) {
  const centerX = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
  const centerY = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
  const radii = pts.map(p => Math.hypot(p[0] - centerX, p[1] - centerY));
  const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length;
  const variance = radii.reduce((sum, r) => sum + Math.pow(r - avgRadius, 2), 0) / radii.length;
  const stddev = Math.sqrt(variance);
  const score = Math.max(0, 100 - stddev);
  return score;
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  scoreDisplay.textContent = "Draw a circle!";
  scoreDisplay.classList.remove('congrats', 'almost');
}
