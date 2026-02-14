// Create twinkling stars
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 70 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (Math.random() * 2 + 2) + 's';
    starsContainer.appendChild(star);
}

// Screen transitions
const nameScreen = document.getElementById('nameScreen');
const envelopeScreen = document.getElementById('envelopeScreen');
const flowerScreen = document.getElementById('flowerScreen');
const nameInput = document.getElementById('nameInput');
const submitBtn = document.getElementById('submitBtn');
const envelopeContainer = document.getElementById('envelopeContainer');
const recipientName = document.getElementById('recipientName');
const surpriseBtn = document.getElementById('surpriseBtn');
const clickHint = document.getElementById('clickHint');

let userName = '';
let flowerAnimationInitialized = false;

// Handle name submission
function submitName() {
    userName = nameInput.value.trim();
    if (userName) {
        nameScreen.classList.add('hidden');
        setTimeout(() => {
            recipientName.textContent = `- For ${userName}`;
            envelopeScreen.classList.add('active');
        }, 500);
    }
}

submitBtn.addEventListener('click', submitName);
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitName();
    }
});

// Handle envelope opening
envelopeContainer.addEventListener('click', () => {
    if (!envelopeContainer.classList.contains('opened')) {
        envelopeContainer.classList.add('opened');
        clickHint.style.opacity = '0';
        clickHint.style.display = 'none';
    }
});

// Handle surprise button
surpriseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    envelopeScreen.style.opacity = '0';
    envelopeScreen.style.pointerEvents = 'none';
    
    setTimeout(() => {
        flowerScreen.classList.add('active');
        if (!flowerAnimationInitialized) {
            initFlowerAnimation();
            flowerAnimationInitialized = true;
        }
    }, 1000);
});

// Flower animation code
const canvas = document.getElementById('flowerCanvas');
const ctx = canvas.getContext('2d');

let animationTime = 0;
let fireflies = [];
let fireworks = [];
let hearts = [];

// Firework class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.hue = Math.random() * 360;
        
        // Create particles (reduced from 50 to 30)
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 1.5 + Math.random() * 2; // Reduced velocity
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                decay: 0.015 + Math.random() * 0.015 // Faster decay
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.life -= p.decay;
        });
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw() {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); // Reduced size from 3 to 2
            ctx.fill();
            ctx.restore();
        });
    }

    isDead() {
        return this.particles.length === 0;
    }
}

// Heart particle class
class HeartParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 15 + Math.random() * 20; // Reduced from 20-50 to 15-35
        this.vx = (Math.random() - 0.5) * 3; // Reduced velocity
        this.vy = -1.5 - Math.random() * 2; // Reduced velocity
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        this.life = 1;
        this.decay = 0.012 + Math.random() * 0.012; // Faster decay
        this.color = Math.random() > 0.5 ? '#ff1744' : '#ff6b8a';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.size / 30, this.size / 30);
        
        // Draw heart shape
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10; // Reduced glow
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.bezierCurveTo(-15, -5, -30, 0, -15, 20);
        ctx.bezierCurveTo(-15, 25, 0, 30, 0, 30);
        ctx.bezierCurveTo(0, 30, 15, 25, 15, 20);
        ctx.bezierCurveTo(30, 0, 15, -5, 0, 10);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

function createFirework(x, y) {
    fireworks.push(new Firework(x, y));
    
    // Create heart explosions (reduced from 8 to 5)
    for (let i = 0; i < 5; i++) {
        hearts.push(new HeartParticle(x, y));
    }
}

// Add click handler for flower screen
function handleFlowerClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createFirework(x, y);
}

function initFlowerAnimation() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Add stars to flower screen
    const flowerStars = document.getElementById('flowerStars');
    flowerStars.innerHTML = ''; // Clear existing stars
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1;
        star.style.width = star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 70 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        flowerStars.appendChild(star);
    }

    // Enable click events for fireworks
    canvas.addEventListener('click', handleFlowerClick);
    canvas.style.cursor = 'pointer';

    class AnimationState {
        constructor() {
            this.startTime = Date.now();
            this.duration = 5000;
        }

        getProgress() {
            const elapsed = Date.now() - this.startTime;
            return Math.min(elapsed / this.duration, 1);
        }
    }

    let state = new AnimationState();

    class Firefly {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.7;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 4 + 3;
            this.brightness = Math.random();
            this.brightnessSpeed = 0.02 + Math.random() * 0.02;
            this.color = Math.random() > 0.3 ? '#FFD700' : '#40E0D0';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height * 0.7) this.vy *= -1;
            
            if (Math.random() < 0.02) {
                this.vx += (Math.random() - 0.5) * 0.3;
                this.vy += (Math.random() - 0.5) * 0.3;
            }
            
            this.brightness = (Math.sin(animationTime * this.brightnessSpeed) + 1) / 2;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.brightness * 0.8;
            
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.4, this.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    for (let i = 0; i < 30; i++) {
        fireflies.push(new Firefly());
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function drawGrass(progress) {
        const grassProgress = Math.min(progress * 1.5, 1);
        
        for (let i = 0; i < 30; i++) {
            const x = (i / 30) * (canvas.width * 0.4);
            const height = (40 + Math.random() * 50) * easeOutCubic(grassProgress);
            const angle = (-15 + Math.random() * 10) * Math.PI / 180;
            const sway = Math.sin(animationTime * 0.001 + i * 0.3) * 0.03;
            
            ctx.save();
            ctx.translate(x, canvas.height);
            ctx.rotate(angle + sway);
            
            const gradient = ctx.createLinearGradient(0, 0, 0, -height);
            gradient.addColorStop(0, '#2a4a1a');
            gradient.addColorStop(0.5, '#3d6e2a');
            gradient.addColorStop(1, '#5a9c3f');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(Math.sin(sway * 2) * height * 0.15, -height * 0.6, 0, -height);
            ctx.stroke();
            ctx.restore();
        }

        for (let i = 0; i < 30; i++) {
            const x = canvas.width - (i / 30) * (canvas.width * 0.4);
            const height = (40 + Math.random() * 50) * easeOutCubic(grassProgress);
            const angle = (-8 + Math.random() * 10) * Math.PI / 180;
            const sway = Math.sin(animationTime * 0.001 + i * 0.3) * 0.03;
            
            ctx.save();
            ctx.translate(x, canvas.height);
            ctx.rotate(angle + sway);
            
            const gradient = ctx.createLinearGradient(0, 0, 0, -height);
            gradient.addColorStop(0, '#2a4a1a');
            gradient.addColorStop(0.5, '#3d6e2a');
            gradient.addColorStop(1, '#5a9c3f');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(Math.sin(sway * 2) * height * 0.15, -height * 0.6, 0, -height);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawMainStem(x, y, height, progress) {
        const stemProgress = Math.min(progress * 1.2, 1);
        const currentHeight = height * easeOutCubic(stemProgress);
        
        ctx.save();
        ctx.translate(x, y);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, -currentHeight);
        gradient.addColorStop(0, '#2d5a5a');
        gradient.addColorStop(0.3, '#3d7a7a');
        gradient.addColorStop(0.7, '#4d9a9a');
        gradient.addColorStop(1, '#5dbaba');
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(93, 186, 186, 0.4)';
        
        ctx.fillRect(-6, -currentHeight, 12, currentHeight);
        
        ctx.restore();
    }

    function drawLeaves(stemX, stemY, progress) {
        const leafProgress = Math.max(0, Math.min((progress - 0.2) * 1.5, 1));
        
        if (leafProgress <= 0) return;
        
        const leafPositions = [
            { y: -100, side: -1 },
            { y: -180, side: 1 },
            { y: -260, side: -1 },
            { y: -340, side: 1 }
        ];
        
        leafPositions.forEach((leaf, idx) => {
            const delay = idx * 0.1;
            const leafScale = Math.max(0, Math.min((leafProgress - delay) * 2, 1));
            
            if (leafScale > 0) {
                ctx.save();
                ctx.translate(stemX, stemY + leaf.y);
                
                const angle = leaf.side * 45 * Math.PI / 180;
                ctx.rotate(angle);
                ctx.scale(easeOutBack(leafScale), easeOutBack(leafScale));
                
                const gradient = ctx.createLinearGradient(-30, 0, 30, 50);
                gradient.addColorStop(0, '#4dbaba');
                gradient.addColorStop(0.3, '#3d9a9a');
                gradient.addColorStop(0.7, '#2d7a7a');
                gradient.addColorStop(1, '#1d5a5a');
                
                ctx.fillStyle = gradient;
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(77, 186, 186, 0.3)';
                
                ctx.beginPath();
                ctx.ellipse(0, 25, 25, 40, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 50);
                ctx.stroke();
                
                for (let i = 1; i <= 3; i++) {
                    const yPos = i * 15;
                    ctx.beginPath();
                    ctx.moveTo(-12, yPos);
                    ctx.lineTo(12, yPos);
                    ctx.stroke();
                }
                
                ctx.restore();
            }
        });
    }

    function drawBaseFoliage(x, y, progress) {
        const foliageProgress = Math.max(0, Math.min((progress - 0.15) * 1.8, 1));
        
        if (foliageProgress <= 0) return;
        
        for (let i = 0; i < 25; i++) {
            const angle = (i / 25) * Math.PI * 2;
            const radius = 30 + (i % 4) * 18;
            const scale = easeOutCubic(Math.max(0, Math.min(foliageProgress - i * 0.015, 1)));
            
            if (scale > 0) {
                ctx.save();
                ctx.translate(
                    x + Math.cos(angle) * radius,
                    y - Math.abs(Math.sin(angle)) * radius * 0.5
                );
                ctx.rotate(angle + Math.PI / 2);
                ctx.scale(scale, scale);
                
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 35);
                gradient.addColorStop(0, '#4dbaba');
                gradient.addColorStop(0.5, '#3d9a9a');
                gradient.addColorStop(1, '#2d6a6a');
                
                ctx.fillStyle = gradient;
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(77, 186, 186, 0.2)';
                
                ctx.beginPath();
                ctx.ellipse(0, 0, 22, 35, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }
    }

    function drawPetal(angle, size, progress) {
        if (progress <= 0) return;
        
        ctx.save();
        ctx.rotate(angle);
        ctx.scale(progress, progress);
        
        const width = 50 * size;
        const length = 80 * size;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, length);
        gradient.addColorStop(0, '#85e5e5');
        gradient.addColorStop(0.3, '#65d5d5');
        gradient.addColorStop(0.6, '#45c5c5');
        gradient.addColorStop(0.85, '#35b5b5');
        gradient.addColorStop(1, '#259595');
        
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-width * 0.6, length * 0.3, -width * 0.4, length * 0.8, 0, length);
        ctx.bezierCurveTo(width * 0.4, length * 0.8, width * 0.6, length * 0.3, 0, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(30, 100, 100, 0.25)';
        ctx.lineWidth = 1;
        
        for (let i = 10; i < length; i += 10) {
            const widthAtY = width * (1 - (i / length) * 0.5);
            ctx.beginPath();
            ctx.moveTo(-widthAtY * 0.3, i);
            ctx.lineTo(widthAtY * 0.3, i);
            ctx.stroke();
        }
        
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            const offset = (width / 5) * i;
            ctx.moveTo(offset * 0.6, 0);
            ctx.quadraticCurveTo(offset * 0.4, length * 0.5, offset * 0.2, length);
            ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(20, 90, 90, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, length * 0.92);
        ctx.stroke();
        
        ctx.restore();
    }

    function drawFlowerCenter(size, progress) {
        if (progress <= 0) return;
        
        ctx.save();
        ctx.scale(progress, progress);
        
        const radius = 25 * size;
        const pulse = Math.sin(animationTime * 0.002) * 0.08 + 1;
        ctx.scale(pulse, pulse);
        
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.8);
        glowGradient.addColorStop(0, 'rgba(255, 240, 180, 0.6)');
        glowGradient.addColorStop(0.5, 'rgba(255, 230, 150, 0.3)');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();
        
        const centerGradient = ctx.createRadialGradient(
            -radius * 0.3, -radius * 0.3, 0,
            0, 0, radius
        );
        centerGradient.addColorStop(0, '#FFFFFF');
        centerGradient.addColorStop(0.2, '#FFFEF8');
        centerGradient.addColorStop(0.5, '#FFF5D0');
        centerGradient.addColorStop(0.8, '#FFE8A0');
        centerGradient.addColorStop(1, '#FFD070');
        
        ctx.fillStyle = centerGradient;
        ctx.shadowBlur = 25;
        ctx.shadowColor = 'rgba(255, 235, 180, 0.8)';
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    function drawFlower(x, y, size, progress, delay) {
        const flowerProgress = Math.max(0, Math.min((progress - delay) * 1.5, 1));
        
        if (flowerProgress <= 0) return;
        
        ctx.save();
        ctx.translate(x, y);
        
        const rotationOffset = delay * 20;
        ctx.rotate(rotationOffset * Math.PI / 180);
        
        const numPetals = 5;
        const startAngle = -Math.PI / 2;
        
        for (let i = 0; i < numPetals; i++) {
            const angle = startAngle + (i * 2 * Math.PI / numPetals);
            const petalProgress = Math.max(0, Math.min((flowerProgress - i * 0.06) * 1.4, 1));
            const scale = easeOutBack(petalProgress);
            
            drawPetal(angle, size, scale);
        }
        
        const centerProgress = Math.max(0, Math.min((flowerProgress - 0.35) * 1.8, 1));
        const centerScale = easeOutBack(centerProgress);
        
        drawFlowerCenter(size, centerScale);
        
        ctx.restore();
    }

    function drawScene() {
        const progress = state.getProgress();
        const centerX = canvas.width / 2;
        const baseY = canvas.height;
        
        drawGrass(progress);
        drawMainStem(centerX, baseY, 500, progress);
        drawBaseFoliage(centerX, baseY, progress);
        drawLeaves(centerX, baseY, progress);
        
        const flowers = [
            { x: 0, y: -500, size: 1.15, delay: 0.5 },
            { x: -75, y: -400, size: 0.95, delay: 0.55 },
            { x: 80, y: -420, size: 1.0, delay: 0.58 },
            { x: -70, y: -300, size: 0.85, delay: 0.62 },
            { x: 75, y: -320, size: 0.9, delay: 0.65 },
            { x: 0, y: -200, size: 0.75, delay: 0.68 }
        ];
        
        flowers.forEach(flower => {
            drawFlower(
                centerX + flower.x,
                baseY + flower.y,
                flower.size,
                progress,
                flower.delay
            );
        });
    }

    function animate() {
        animationTime = Date.now();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw fireflies
        fireflies.forEach(firefly => {
            firefly.update();
            firefly.draw();
        });
        
        // Update and draw fireworks
        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            if (firework.isDead()) {
                fireworks.splice(index, 1);
            }
        });
        
        // Update and draw hearts
        hearts.forEach((heart, index) => {
            heart.update();
            heart.draw();
            if (heart.isDead()) {
                hearts.splice(index, 1);
            }
        });
        
        // Draw flower scene
        drawScene();
        
        requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener('resize', () => {
    if (flowerAnimationInitialized) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});