/**
 * animations.js
 * 
 * Scroll-driven animation engine.
 * - Intersection Observer for element reveals
 * - Counter animation for stats
 * - Staggered skill pill reveals
 * - Scroll parallax for hero and orb
 * - 3D tilt hover for project cards
 * - Floating 3D decorative objects
 */
export function initAnimations() {
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // =============================================
    // 1. CREATE FLOATING 3D OBJECTS
    // =============================================
    if (isDesktop) {
        createFloatingObjects();
    }

    // =============================================
    // 2. INTERSECTION OBSERVER — Reveals
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px"
    });

    // Observe all revealable elements
    document.querySelectorAll('.reveal, .timeline-item, .proj-card').forEach(el => {
        revealObserver.observe(el);
    });

    // =============================================
    // 3. SKILL PILLS — Staggered animation
    // =============================================
    const pillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pills = entry.target.querySelectorAll('.skill-pill');
                pills.forEach((p, i) => {
                    p.style.animationDelay = i * 40 + 'ms';
                    p.classList.add('visible');
                });
                pillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skills-inner').forEach(el => pillObserver.observe(el));

    // =============================================
    // 4. STAT COUNTERS — Count up animation
    // =============================================
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const num = entry.target.querySelector('[data-count]');
                if (num) animateCount(num);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

    // =============================================
    // 5. SCROLL FILL TEXT & PARALLAX
    // =============================================
    
    // Split paragraphs into words
    const fillParagraphs = document.querySelectorAll('.scroll-fill-paragraph');
    fillParagraphs.forEach(p => {
        const words = p.innerText.split(' ');
        p.innerHTML = words.map(w => `<span class="fill-word">${w}</span>`).join(' ');
    });

    let fillLines = [];
    function calculateLines() {
        fillLines = [];
        fillParagraphs.forEach(p => {
            let currentLine = [];
            let lastTop = -1;
            const words = Array.from(p.querySelectorAll('.fill-word'));
            
            words.forEach(w => {
                const top = w.offsetTop;
                if (lastTop !== -1 && Math.abs(top - lastTop) > 5) {
                    fillLines.push(currentLine);
                    currentLine = [];
                }
                currentLine.push(w);
                lastTop = top;
            });
            if (currentLine.length > 0) {
                fillLines.push(currentLine);
            }
        });
    }

    // Delay calculation slightly to ensure CSS/fonts are loaded and layout is stable
    setTimeout(calculateLines, 100);
    window.addEventListener('resize', calculateLines);

    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        
        // Hero Parallax
        const orbWrap = document.querySelector('.hero-orb-wrap');
        if (orbWrap) orbWrap.style.transform = `translateY(${sy * 0.18}px)`;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.style.transform = `translateY(${sy * 0.08}px)`;

        if (isDesktop) {
            updateFloatingObjects(sy);
        }

        // About Text Fill (Line by line)
        const vh = window.innerHeight;
        const container = document.querySelector('.scroll-fill-text-container');
        if (container && fillLines.length > 0) {
            const rect = container.getBoundingClientRect();
            // Start revealing when container top is 80% down the screen
            // Finish when container top is 30% down the screen
            const startReveal = vh * 0.8;
            const endReveal = vh * 0.3;
            
            let progress = (startReveal - rect.top) / (startReveal - endReveal);
            progress = Math.max(0, Math.min(1, progress));

            const totalLines = fillLines.length;
            const linesToReveal = Math.floor(progress * totalLines);

            fillLines.forEach((line, index) => {
                const opacity = (index < linesToReveal) ? '1' : '0.15';
                line.forEach(w => {
                    w.style.opacity = opacity;
                });
            });
        }
    });

    // =============================================
    // 6. 3D TILT HOVER — Project Cards
    // =============================================
    if (isDesktop) {
        document.querySelectorAll('.proj-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
                card.style.transition = 'transform 0.1s';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                card.style.transition = 'transform 0.5s';
            });
        });
    }
}


// =============================================
// HELPER: Animate stat counter
// =============================================
function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const hasPlus = el.hasAttribute('data-plus');
    const dec = target % 1 !== 0 ? 2 : 0;
    const dur = 1200, step = 16;
    let current = 0, elapsed = 0;

    const timer = setInterval(() => {
        elapsed += step;
        current = target * (elapsed / dur);
        if (elapsed >= dur) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current.toFixed(dec) + (hasPlus || (dec === 0 && target >= 10) ? '+' : '');
    }, step);
}


// =============================================
// FLOATING 3D OBJECTS SYSTEM
// =============================================
const floatingObjects = [];

function createFloatingObjects() {
    const shapes = [
        { cls: 'shape-diamond', x: '8%',  y: '25%', speed: 0.3,  anim: 'float3',  dur: '12s' },
        { cls: 'shape-ring',    x: '85%', y: '35%', speed: -0.2, anim: 'float2',  dur: '15s' },
        { cls: 'shape-cross',   x: '12%', y: '55%', speed: 0.4,  anim: 'spinSlow', dur: '20s' },
        { cls: 'shape-triangle',x: '90%', y: '65%', speed: -0.35,anim: 'float1',  dur: '18s' },
        { cls: 'shape-ring',    x: '75%', y: '15%', speed: 0.25, anim: 'float2',  dur: '14s' },
        { cls: 'shape-diamond', x: '92%', y: '80%', speed: -0.15,anim: 'float3',  dur: '16s' },
        { cls: 'shape-cross',   x: '5%',  y: '85%', speed: 0.35, anim: 'spinSlow', dur: '22s' },
        { cls: 'shape-hex',     x: '50%', y: '45%', speed: -0.28,anim: 'float1',  dur: '19s' },
    ];

    shapes.forEach(s => {
        const el = document.createElement('div');
        el.className = `scene-object ${s.cls}`;
        el.style.left = s.x;
        el.style.top = s.y;
        el.style.animation = `${s.anim} ${s.dur} ease-in-out infinite`;
        el.style.opacity = '0';
        document.body.appendChild(el);

        floatingObjects.push({ el, speed: s.speed, baseY: parseFloat(s.y) });

        setTimeout(() => { el.style.opacity = '0.6'; }, 500);
    });
}

function updateFloatingObjects(scrollY) {
    const vh = window.innerHeight;

    floatingObjects.forEach(obj => {
        const offset = scrollY * obj.speed;
        const rotation = scrollY * obj.speed * 0.5;
        obj.el.style.transform = `translateY(${offset}px) rotate(${rotation}deg)`;

        const rect = obj.el.getBoundingClientRect();
        const distFromCenter = Math.abs(rect.top + rect.height / 2 - vh / 2);
        const opacity = Math.max(0.1, Math.min(0.7, 1 - distFromCenter / vh));
        obj.el.style.opacity = opacity;
    });
}
