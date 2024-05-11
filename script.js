function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu.style.left === '0px') {
        menu.style.left = '-100%';
    } else {
        menu.style.left = '0px';
    }
}

let particles = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style("position", "absolute");
  canvas.style("top", "0");
  canvas.style("left", "0");
  frameRate(60);
}

function draw() {
  clear(); // Instead of background(255), use clear() for transparency

  particles.push({ x: mouseX, y: mouseY, size: 24 });

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    fill(0, 0, 255, map(i, 0, particles.length, 0, 255));
    noStroke();
    ellipse(p.x, p.y, p.size, p.size);

    p.size *= 0.96;

    if (p.size < 0.5) {
      particles.splice(i, 1);
    }
  }
}