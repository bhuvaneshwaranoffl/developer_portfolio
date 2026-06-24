/**
 * animations.js
 *
 * GSAP ScrollTrigger-driven animation engine.
 * Zero native scroll listeners. All parallax, reveals, text fills,
 * tilt hovers, and floating objects run through GSAP's batched pipeline
 * which is synced to Lenis via the shared gsap.ticker rAF loop.
 */
export function initAnimations() {
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // =============================================
    // 1. FLOATING 3D OBJECTS — GSAP scrub parallax
    // =============================================
    if (isDesktop) {
        createFloatingObjects();
    }

    // =============================================
    // 2. CINEMATIC REVEALS — blur→sharp, staggered
    // =============================================

    // Generic .reveal elements (eyebrows, titles, misc)
    gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40, filter: 'blur(6px)' },
            {
                opacity: 1, y: 0, filter: 'blur(0px)',
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // Timeline items — staggered slide-in
    gsap.utils.toArray('.timeline').forEach((timeline) => {
        const items = timeline.querySelectorAll('.timeline-item');
        if (!items.length) return;
        items.forEach((item) => {
            // Reset the CSS initial state so GSAP can take over
            item.style.opacity = '';
            item.style.transform = '';
        });
        gsap.fromTo(items,
            { opacity: 0, x: 40, filter: 'blur(4px)' },
            {
                opacity: 1, x: 0, filter: 'blur(0px)',
                stagger: 0.15,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: timeline, start: 'top 82%' },
            }
        );
    });

    // Project cards — staggered fade-up
    gsap.utils.toArray('.projects-grid').forEach((grid) => {
        const cards = grid.querySelectorAll('.proj-card');
        if (!cards.length) return;
        cards.forEach((c) => { c.style.opacity = ''; c.style.transform = ''; });
        gsap.fromTo(cards,
            { opacity: 0, y: 50, scale: 0.97 },
            {
                opacity: 1, y: 0, scale: 1,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: grid, start: 'top 82%' },
            }
        );
    });

    // =============================================
    // 3. SKILL PILLS — staggered scatter-in
    // =============================================
    gsap.utils.toArray('.skills-inner').forEach((container) => {
        const pills = container.querySelectorAll('.skill-pill');
        if (!pills.length) return;
        gsap.fromTo(pills,
            { opacity: 0, y: 12, scale: 0.88 },
            {
                opacity: 1, y: 0, scale: 1,
                stagger: 0.035,
                duration: 0.45,
                ease: 'back.out(1.4)',
                scrollTrigger: { trigger: container, start: 'top 82%' },
            }
        );
    });

    // =============================================
    // 4. STAT COUNTERS — count-up on enter
    // =============================================
    document.querySelectorAll('.stat-card').forEach((card) => {
        const numEl = card.querySelector('[data-count]');
        if (!numEl) return;
        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            once: true,
            onEnter: () => animateCount(numEl),
        });
    });

    // =============================================
    // 5. HERO PARALLAX — scrub (no native scroll!)
    // =============================================
    const heroContainer = document.getElementById('hero-container');
    if (heroContainer) {
        gsap.to('.hero-orb-wrap', {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: {
                trigger: heroContainer,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });
        gsap.to('.hero-content', {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
                trigger: heroContainer,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });
    }

    // =============================================
    // 6. SCROLL-FILL TEXT — scrub word opacity
    // =============================================
    const fillParagraphs = document.querySelectorAll('.scroll-fill-paragraph');
    fillParagraphs.forEach((p) => {
        const raw = p.innerText;
        const words = raw.split(' ');
        p.innerHTML = words.map((w) => `<span class="fill-word">${w}</span>`).join(' ');

        gsap.to(p.querySelectorAll('.fill-word'), {
            opacity: 1,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: {
                trigger: p,
                start: 'top 85%',
                end: 'bottom 50%',
                scrub: 0.6,
            },
        });
    });

    // =============================================
    // 7. 3D TILT + RIPPLE HOVER — project/stat/exp cards
    // =============================================
    if (isDesktop) {
        document.querySelectorAll('.proj-card, .stat-card, .exp-card').forEach((card) => {
            // Tilt on mousemove
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const px = e.clientX - r.left;
                const py = e.clientY - r.top;

                // Ripple position CSS vars
                card.style.setProperty('--ripple-x', `${px}px`);
                card.style.setProperty('--ripple-y', `${py}px`);

                // Normalized -0.5…0.5
                const nx = px / r.width - 0.5;
                const ny = py / r.height - 0.5;

                const isProjCard = card.classList.contains('proj-card');
                const maxRot = isProjCard ? 8 : 4;
                const lift = isProjCard ? -6 : -3;

                // Use GSAP for spring-like easing instead of direct assignment
                gsap.to(card, {
                    rotateX: -ny * maxRot,
                    rotateY: nx * maxRot,
                    y: lift,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            }, { passive: true });

            // Spring-back on leave
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)',
                    overwrite: 'auto',
                });
            }, { passive: true });
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
// FLOATING 3D OBJECTS — GSAP scrub parallax
// =============================================
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

    shapes.forEach((s) => {
        const el = document.createElement('div');
        el.className = `scene-object ${s.cls}`;
        el.style.left = s.x;
        el.style.top = s.y;
        el.style.animation = `${s.anim} ${s.dur} ease-in-out infinite`;
        el.style.opacity = '0';
        document.body.appendChild(el);

        // Fade in
        gsap.to(el, { opacity: 0.6, duration: 1, delay: 0.5 });

        // Multi-layer parallax — each object scrolls at a different rate
        gsap.to(el, {
            y: () => window.innerHeight * s.speed,
            rotation: () => 360 * s.speed * 0.15,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
            },
        });
    });
}
