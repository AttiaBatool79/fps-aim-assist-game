const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let timeLeft = 60;
const targets = [];
const crosshair = { x: canvas.width / 2, y: canvas.height / 2 };

// Create moving targets
function spawnTarget() {
    let t = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 30,
        color: randomColor(),
        dx: (Math.random() - 0.5) * 3,
        dy: (Math.random() - 0.5) * 3
    };
    targets.push(t);
}

function randomColor() {
    let colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
    return colors[Math.floor(Math.random() * colors.length)];
}

for (let i = 0; i < 7; i++) spawnTarget();

// Mouse movement = move crosshair
document.addEventListener("mousemove", (e) => {
    crosshair.x = e.clientX;
    crosshair.y = e.clientY;
});

// Shooting detection
document.addEventListener("click", () => {
    for (let i = 0; i < targets.length; i++) {
        let t = targets[i];

        let dist = Math.hypot(crosshair.x - t.x, crosshair.y - t.y);

        if (dist <= t.r) {
            score++;
            document.getElementById("score").textContent = score;

            // Remove target & respawn
            targets.splice(i, 1);
            spawnTarget();
            break;
        }
    }
});

// AI Aim Assist
function aimAssist() {
    let nearest = null;
    let minDist = 150; // detect only near targets

    for (let t of targets) {
        let dist = Math.hypot(crosshair.x - t.x, crosshair.y - t.y);
        if (dist < minDist) {
            minDist = dist;
            nearest = t;
        }
    }

    if (nearest) {
        crosshair.x += (nearest.x - crosshair.x) * 0.05;
        crosshair.y += (nearest.y - crosshair.y) * 0.05;
    }
}

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move targets
    for (let t of targets) {
        t.x += t.dx;
        t.y += t.dy;

        if (t.x < 0 || t.x > canvas.width) t.dx *= -1;
        if (t.y < 0 || t.y > canvas.height) t.dy *= -1;

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = t.color;
        ctx.fill();
    }

    // Draw crosshair
    ctx.beginPath();
    ctx.arc(crosshair.x, crosshair.y, 12, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    aimAssist();

    if (timeLeft > 0) requestAnimationFrame(update);
    else gameOver();
}

update();

// Timer
let timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) clearInterval(timer);
}, 1000);

function gameOver() {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText("Final Score: " + score, canvas.width / 2 - 130, canvas.height / 2 + 50);
}
