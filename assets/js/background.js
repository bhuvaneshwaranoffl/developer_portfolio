/**
 * background.js
 * Particle canvas background with grid lines
 * and connected particle system.
 */
export function initBackground() {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) return;

    const ctx = bgCanvas.getContext('2d');
    let W, H;
    const particles = [];

    function resize() {
        W = bgCanvas.width = window.innerWidth;
        H = bgCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.7
                ? 'rgba(124,58,237,'
                : 'rgba(167,139,250,';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(124,58,237,0.04)';
        ctx.lineWidth = 1;
        const gs = 80;
        for (let x = 0; x < W; x += gs) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let y = 0; y < H; y += gs) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        drawGrid();

        // Draw connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }
    animate();
}
