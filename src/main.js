(() => {
  "use strict";

  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.querySelector("#score");
  const bestEl = document.querySelector("#best");
  const overlay = document.querySelector("#overlay");
  const overlayTitle = document.querySelector("#overlay-title");
  const overlayCopy = document.querySelector("#overlay-copy");
  const startButton = document.querySelector("#start-button");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const keys = new Set();
  const player = { x: WIDTH / 2, y: HEIGHT - 74, w: 42, h: 42, speed: 310 };
  let hazards = [];
  let score = 0;
  let best = readBest();
  let running = false;
  let lastTime = 0;
  let spawnClock = 0;
  let elapsed = 0;
  let animationId = 0;

  bestEl.textContent = String(best);

  function readBest() {
    try { return Number(localStorage.getItem("mierdijuego-best")) || 0; }
    catch { return 0; }
  }

  function saveBest(value) {
    try { localStorage.setItem("mierdijuego-best", String(value)); }
    catch { /* El juego funciona aunque el almacenamiento esté bloqueado. */ }
  }

  function drawBackground() {
    ctx.fillStyle = "#151a15";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "#ffffff0b";
    ctx.lineWidth = 1;
    for (let x = 24; x < WIDTH; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
    }
    for (let y = 24; y < HEIGHT; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
    }
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.font = "36px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("😎", 0, 0);
    ctx.restore();
  }

  function drawHazard(hazard) {
    ctx.save();
    ctx.translate(hazard.x, hazard.y);
    ctx.font = "30px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("💩", 0, 0);
    ctx.restore();
  }

  function draw() {
    drawBackground();
    hazards.forEach(drawHazard);
    drawPlayer();
  }

  function intersects(a, b) {
    return Math.abs(a.x - b.x) < (a.w + b.w) * 0.38 &&
      Math.abs(a.y - b.y) < (a.h + b.h) * 0.38;
  }

  function spawnHazard() {
    hazards.push({
      x: 24 + Math.random() * (WIDTH - 48),
      y: -28,
      w: 34,
      h: 34,
      speed: 150 + Math.random() * 90 + Math.min(elapsed * 2.2, 180)
    });
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - lastTime) / 1000 || 0, 0.035);
    lastTime = now;
    elapsed += dt;
    score = Math.floor(elapsed * 10);
    scoreEl.textContent = String(score);

    let direction = 0;
    if (keys.has("ArrowLeft") || keys.has("a")) direction -= 1;
    if (keys.has("ArrowRight") || keys.has("d")) direction += 1;
    player.x = Math.max(player.w / 2, Math.min(WIDTH - player.w / 2, player.x + direction * player.speed * dt));

    spawnClock += dt;
    const interval = Math.max(0.28, 0.82 - elapsed * 0.008);
    if (spawnClock >= interval) {
      spawnClock = 0;
      spawnHazard();
    }

    for (const hazard of hazards) hazard.y += hazard.speed * dt;
    hazards = hazards.filter(hazard => hazard.y < HEIGHT + 40);

    const playerBox = { x: player.x, y: player.y, w: player.w, h: player.h };
    if (hazards.some(hazard => intersects(playerBox, hazard))) {
      endGame();
      return;
    }

    draw();
    animationId = requestAnimationFrame(frame);
  }

  function startGame() {
    cancelAnimationFrame(animationId);
    hazards = [];
    score = 0;
    elapsed = 0;
    spawnClock = 0;
    player.x = WIDTH / 2;
    lastTime = performance.now();
    running = true;
    scoreEl.textContent = "0";
    overlay.classList.add("hidden");
    animationId = requestAnimationFrame(frame);
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(animationId);
    if (score > best) {
      best = score;
      bestEl.textContent = String(best);
      saveBest(best);
    }
    overlayTitle.textContent = "¡Te han pillado!";
    overlayCopy.textContent = "Has aguantado " + score + " puntos. ¿Otra ronda?";
    startButton.textContent = "Jugar de nuevo";
    overlay.classList.remove("hidden");
    draw();
  }

  window.addEventListener("keydown", event => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (["ArrowLeft", "ArrowRight", " "].includes(key)) event.preventDefault();
    keys.add(key);
    if (!running && key === "Enter") startGame();
  });

  window.addEventListener("keyup", event => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    keys.delete(key);
  });

  window.addEventListener("blur", () => keys.clear());
  startButton.addEventListener("click", startGame);

  canvas.addEventListener("pointerdown", event => {
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    keys.delete("a"); keys.delete("d");
    keys.add(x < bounds.width / 2 ? "a" : "d");
  });
  canvas.addEventListener("pointerup", () => { keys.delete("a"); keys.delete("d"); });
  canvas.addEventListener("pointercancel", () => { keys.delete("a"); keys.delete("d"); });

  draw();
})();
