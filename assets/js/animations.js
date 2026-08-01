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
    // 0. KINETIC TYPOGRAPHY (Hover Scramble)
    // =============================================
    if (isDesktop) {
        document.querySelectorAll('.hero-title .word').forEach(word => {
            // Keep original text on the DOM element for reference
            const originalText = word.innerText;
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
            let interval = null;
            
            word.addEventListener('mouseenter', () => {
                let iterations = 0;
                clearInterval(interval);
                
                interval = setInterval(() => {
                    word.innerText = word.innerText.split('')
                        .map((letter, index) => {
                            if (index < iterations) {
                                return originalText[index];
                            }
                            return letters[Math.floor(Math.random() * letters.length)];
                        })
                        .join('');
                    
                    if (iterations >= originalText.length) {
                        clearInterval(interval);
                        word.innerText = originalText;
                    }
                    iterations += 1 / 3;
                }, 30);
            });
        });
    }

    // =============================================
    // 1. FLOATING 3D OBJECTS — refined, minimal
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
            { opacity: 0, y: 50, filter: 'blur(8px)' },
            {
                opacity: 1, y: 0, filter: 'blur(0px)',
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
            }
        );
    });

    // Skill category cards — staggered fade-up with scale
    gsap.utils.toArray('.skills-grid').forEach((grid) => {
        const cards = grid.querySelectorAll('.skill-category');
        if (!cards.length) return;
        cards.forEach((c) => { c.style.opacity = ''; c.style.transform = ''; });
        gsap.fromTo(cards,
            { opacity: 0, y: 60, scale: 0.95, filter: 'blur(6px)' },
            {
                opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                stagger: 0.1,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: grid, start: 'top 85%' },
            }
        );
    });

    // Timeline items — staggered slide-in
    gsap.utils.toArray('.timeline').forEach((timeline) => {
        const items = timeline.querySelectorAll('.timeline-item');
        if (!items.length) return;
        items.forEach((item) => {
            item.style.opacity = '';
            item.style.transform = '';
        });
        gsap.fromTo(items,
            { opacity: 0, x: 50, filter: 'blur(4px)' },
            {
                opacity: 1, x: 0, filter: 'blur(0px)',
                stagger: 0.18,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: { trigger: timeline, start: 'top 82%' },
            }
        );
    });

    // Project cards — cinematic stagger with 3D entrance
    gsap.utils.toArray('.projects-grid').forEach((grid) => {
        const cards = grid.querySelectorAll('.proj-card');
        if (!cards.length) return;
        cards.forEach((c) => { c.style.opacity = ''; c.style.transform = ''; });
        gsap.fromTo(cards,
            { opacity: 0, y: 60, rotateX: 8, scale: 0.96, filter: 'blur(6px)' },
            {
                opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
                stagger: 0.12,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: grid, start: 'top 82%' },
            }
        );
    });

    // Contact items — slide in from left
    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems.length) {
        gsap.fromTo(contactItems,
            { opacity: 0, x: -30, filter: 'blur(4px)' },
            {
                opacity: 1, x: 0, filter: 'blur(0px)',
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.contact-grid', start: 'top 85%' },
            }
        );
    }

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
    // 5. HERO PARALLAX — scrub
    // =============================================
    const heroContainer = document.getElementById('hero-container');
    if (heroContainer) {
        gsap.to('.hero-orb-wrap', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: heroContainer,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5,
            },
        });
        gsap.to('.hero-content', {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: heroContainer,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5,
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
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
                trigger: p,
                start: 'top 85%',
                end: 'bottom 45%',
                scrub: 0.5,
            },
        });
    });

    // =============================================
    // 7. QUOTE SECTION — dramatic parallax
    // =============================================
    const quoteText = document.querySelector('.quote-text');
    if (quoteText) {
        gsap.fromTo(quoteText,
            { y: 40, opacity: 0, scale: 0.97 },
            {
                y: 0, opacity: 1, scale: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#quote',
                    start: 'top 80%',
                },
            }
        );
    }

    // =============================================
    // 8. SCROLL-FILL BACKGROUND TEXT (Projects)
    // =============================================
    const scrollFillText = document.getElementById('scroll-fill-text');
    if (scrollFillText) {
        gsap.to(scrollFillText, {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: {
                trigger: '#projects-wrap',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 0.8,
            },
        });
    }

    // =============================================
    // 9. 3D TILT + RIPPLE HOVER — cards
    // =============================================
    if (isDesktop) {
        document.querySelectorAll('.proj-card, .stat-card, .exp-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const px = e.clientX - r.left;
                const py = e.clientY - r.top;

                card.style.setProperty('--ripple-x', `${px}px`);
                card.style.setProperty('--ripple-y', `${py}px`);

                const nx = px / r.width - 0.5;
                const ny = py / r.height - 0.5;

                const isProjCard = card.classList.contains('proj-card');
                const maxRot = isProjCard ? 6 : 3;
                const lift = isProjCard ? -4 : -2;

                gsap.to(card, {
                    rotateX: -ny * maxRot,
                    rotateY: nx * maxRot,
                    y: lift,
                    duration: 0.4,
                    ease: 'power2.out',
                    overwrite: 'auto',
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)',
                    overwrite: 'auto',
                });
            }, { passive: true });
        });

        // Skill category card mouse tracking for radial gradient
        document.querySelectorAll('.skill-category').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
            }, { passive: true });
        });
    }
}


// =============================================
// HELPER: Animate stat counter with spring feel
// =============================================
function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const hasPlus = el.hasAttribute('data-plus');
    const dec = target % 1 !== 0 ? 2 : 0;

    const obj = { val: 0 };
    gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
            el.textContent = obj.val.toFixed(dec) + (hasPlus || (dec === 0 && target >= 10) ? '+' : '');
        },
    });
}


// =============================================
// FLOATING 3D OBJECTS — refined, fewer shapes
// =============================================
function createFloatingObjects() {
    const shapes = [
        { cls: 'shape-ring',    x: '8%',  y: '30%', speed: 0.2,  anim: 'float2',   dur: '18s' },
        { cls: 'shape-diamond', x: '88%', y: '25%', speed: -0.15, anim: 'float3',  dur: '22s' },
        { cls: 'shape-cross',   x: '6%',  y: '70%', speed: 0.25, anim: 'spinSlow', dur: '28s' },
        { cls: 'shape-ring',    x: '92%', y: '75%', speed: -0.2, anim: 'float1',   dur: '20s' },
    ];

    shapes.forEach((s) => {
        const el = document.createElement('div');
        el.className = `scene-object ${s.cls}`;
        el.style.left = s.x;
        el.style.top = s.y;
        el.style.animation = `${s.anim} ${s.dur} ease-in-out infinite`;
        el.style.opacity = '0';
        document.body.appendChild(el);

        gsap.to(el, { opacity: 0.4, duration: 1.5, delay: 1 });

        gsap.to(el, {
            y: () => window.innerHeight * s.speed,
            rotation: () => 360 * s.speed * 0.1,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
            },
        });
    });
}
