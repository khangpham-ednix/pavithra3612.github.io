document.getElementById('year').textContent = new Date().getFullYear();

const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let width, height, nodes;

function resize() {
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;
}

function initNodes() {
  const count = Math.floor((width * height) / 28000);
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  }));
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (const n of nodes) {
    if (!prefersReducedMotion) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }
  }

  const maxDist = 150;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.strokeStyle = `rgba(76, 141, 255, ${0.18 * (1 - dist / maxDist)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const n of nodes) {
    ctx.fillStyle = 'rgba(237, 239, 243, 0.5)';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(draw);
  }
}

function start() {
  resize();
  initNodes();
  draw();
}

window.addEventListener('resize', () => {
  resize();
  initNodes();
  if (prefersReducedMotion) draw();
});

start();
