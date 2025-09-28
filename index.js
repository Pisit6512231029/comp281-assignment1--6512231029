const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// ========== ตัวแปร animation ==========
let sunY = 100; // ตำแหน่งพระอาทิตย์
let angle = 0;  // ใช้ทำหญ้าไหว
let smokeParticles = []; // เก็บควันจากปล่องบ้าน

// เมฆ
let clouds = [
  { x: 200, y: 100, scale: 1.2, speed: 0.3 },
  { x: 400, y: 70, scale: 0.9, speed: 0.2 },
  { x: 600, y: 190, scale: 1.5, speed: 0.25 },
  { x: 700, y: 150, scale: 1.5, speed: 0.1 },
  { x: 300, y: 200, scale: 1.5, speed: 0.5 },
  { x: 500, y: 150, scale: 1.0, speed: 0.6 }
];

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ===== 1) ท้องฟ้า =====
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#87CEEB");
  sky.addColorStop(1, "#ff7300ff");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ===== 2) พระอาทิตย์ (ตก) =====
  const sunGradient = ctx.createRadialGradient(750, sunY, 30, 750, sunY, 80);
  sunGradient.addColorStop(0, "yellow");
  sunGradient.addColorStop(1, "rgba(255,255,0,0)");
  ctx.fillStyle = sunGradient;
  ctx.beginPath();
  ctx.arc(750, sunY, 80, 0, Math.PI * 2);
  ctx.fill();

  // ===== 3) ก้อนเมฆ =====
  for (let cloud of clouds) {
    drawCloud(cloud.x, cloud.y, cloud.scale);
    cloud.x += cloud.speed;
    if (cloud.x > canvas.width + 100) cloud.x = -100;
  }

  // ===== 4) ภูเขา =====
  ctx.fillStyle = "#225c15ff";
  ctx.beginPath();
  ctx.moveTo(30, 300);
  ctx.lineTo(200, 100);
  ctx.lineTo(400, 300);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(300, 300);
  ctx.lineTo(550, 80);
  ctx.lineTo(800, 300);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(700, 300);
  ctx.lineTo(950, 150);
  ctx.lineTo(1200, 300);
  ctx.closePath();
  ctx.fill();

// ===== 5) ทุ่งนา =====
ctx.fillStyle = "#5bc924ff";
ctx.fillRect(0, 300, canvas.width, 200);

ctx.strokeStyle = "#b4b431ff";
for (let i = 0; i < canvas.width; i += 60) {
  ctx.beginPath();
  ctx.moveTo(i, 300);
  ctx.lineTo(i, 500);
  ctx.stroke();
}

  // 🌱 หญ้าไหว 
for (let i = 0; i < canvas.width; i += 30) {
  let sway = Math.sin(angle + i * 0.1) * 10;
  drawGrass(i, 400, sway);
}
// 🌱 วาดหญ้าไหวหลายแถว
for (let j = 0; j < 15; j++) {       // จำนวนแถว (15 แถว)
  let grassY = 300 + j * 15;        // ระยะห่างแต่ละแถว
  for (let i = 0; i < canvas.width; i += 30) {
    let sway = Math.sin(angle + i * 0.1 + j) * 8; 
    drawGrass(i, grassY, sway);
  }
}

  // ===== 6) แม่น้ำ =====
  ctx.fillStyle = "#297cd0ff";
  ctx.beginPath();
  ctx.moveTo(360, 300);
  ctx.lineTo(380, 300);
  ctx.lineTo(500, 500);
  ctx.lineTo(200, 500);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(450, 500);
  ctx.quadraticCurveTo(600, 450, 800, 500);
  ctx.lineTo(450, 500);
  ctx.closePath();
  ctx.fill();

  // ===== 7) บ้าน =====
  ctx.fillStyle = "#deb887";
  ctx.fillRect(100, 350, 100, 80);
  ctx.fillStyle = "#d71616ff";
  ctx.beginPath();
  ctx.moveTo(90, 350);
  ctx.lineTo(150, 300);
  ctx.lineTo(210, 350);
  ctx.closePath();
  ctx.fill();

  // ประตู
  ctx.fillStyle = "#040302ff";
  ctx.fillRect(135, 390, 30, 40);

  // ปล่องบ้าน
  ctx.fillStyle = "#b82b1bff";
  ctx.fillRect(115, 290, 20, 40);

  // ===== ควันปล่องบ้าน =====
  if (Math.random() < 0.05) {
    smokeParticles.push({ x: 125, y: 290, alpha: 1, size: 10 });
  }
  for (let i = 0; i < smokeParticles.length; i++) {
    let s = smokeParticles[i];
    ctx.fillStyle = `rgba(200,200,200,${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();

    // อัปเดต
    s.y -= 1;
    s.alpha -= 0.01;
    s.size += 0.05;
  }
  // ลบควันที่หายไปแล้ว
  smokeParticles = smokeParticles.filter(s => s.alpha > 0);

  // ===== 8) ต้นไม้ =====
  drawTree(700, 300);
  drawTree(50, canvas.height - 100);
  drawTree(50, canvas.height - 250);
  drawTree(480, canvas.height - 150);
  drawTree(250, canvas.height - 200);
  drawTree(600, canvas.height - 120);
  drawTree(800, canvas.height - 120);
}

// ===== ฟังก์ชันวาด =====
function drawTree(x, y) {
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(x - 10, y, 20, 60);

  ctx.fillStyle = "#228b22";
  ctx.beginPath();
  ctx.arc(x, y - 10, 30, 0, Math.PI * 2);
  ctx.arc(x - 30, y, 25, 0, Math.PI * 2);
  ctx.arc(x + 30, y, 25, 0, Math.PI * 2);
  ctx.arc(x, y + 20, 25, 0, Math.PI * 2);
  ctx.fill();
}

function drawGrass(x, y, sway = 0) {
  ctx.strokeStyle = "darkgreen";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + sway, y - 15);
  ctx.stroke();
}

function drawCloud(x, y, scale = 1) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 25 * scale, y - 10 * scale, 25 * scale, 0, Math.PI * 2);
  ctx.arc(x + 55 * scale, y, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 30 * scale, y + 10 * scale, 25 * scale, 0, Math.PI * 2);
  ctx.fill();
}

// ===== animation loop =====
function animate() {
  sunY += 0.05; // พระอาทิตย์ค่อย ๆ ตก
  if (sunY > 500) sunY = 100;

  angle += 0.03; // ใช้ให้หญ้าไหว
  drawScene();
  requestAnimationFrame(animate);
}

animate();
