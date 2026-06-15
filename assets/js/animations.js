/**
 * animations.js
 * 
 * Scroll-driven 3D animation engine.
 * - Intersection Observer for cinematic element reveals
 * - Scroll-progress-linked floating 3D objects
 * - Parallax depth layers
 * - 3D tilt hover for project cards
 * - Counter animation for stat numbers
 */
export function initAnimations() {
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // =============================================
    // 1. CREATE FLOATING 3D OBJECTS
    //    These exist between sections and respond
    //    to scroll position for depth/parallax.
    // =============================================
    if (isDesktop) {
        createFloatingObjects();
    }

    // =============================================
    // 2. INTERSECTION OBSERVER — Cinematic Reveals
    //    Each element gets a 'visible' class when
    //    it enters the viewport, triggering its
    //    CSS 3D transition.
    // =============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stats counter animation
                if (entry.target.classList.contains('stats-card')) {
                    animateCounters(entry.target);
                }

                // Skill pills staggered scatter
                if (entry.target.classList.contains('skills-cloud')) {
                    animateSkillPills(entry.target);
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px"
    });

    // Observe all revealable elements
    const revealTargets = [
        '.section-header',
        '.timeline-item',
        '.project-card',
        '.stats-card',
        '.skills-cloud',
        '.about-story',
        '.quote-container',
        '.contact-info',
        '.contact-form'
    ];
    document.querySelectorAll(revealTargets.join(', ')).forEach(el => {
        revealObserver.observe(el);
    });

    // =============================================
    // 3. SCROLL-LINKED PARALLAX
    //    Different elements move at different
    //    speeds for depth perception.
    // =============================================
    const heroOrb = document.querySelector('.flutter-orb');
    const quoteContainer = document.getElementById('quote');
    const divider = document.getElementById('divider');

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;

                // Hero orb parallax — moves slower than scroll
                if (heroOrb) {
                    heroOrb.style.transform = `translateY(${scrolled * -0.4}px) rotateX(${scrolled * 0.02}deg)`;
                }

                // Quote parallax — counter-scrolls for sticky feel
                if (divider && quoteContainer) {
                    const rect = divider.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                        const offset = (progress - 0.5) * -80;
                        const scale = 0.85 + (progress * 0.15);
                        quoteContainer.style.transform = `translateY(${offset}px) scale(${Math.min(scale, 1)})`;
                    }
                }

                // Move floating objects based on scroll
                if (isDesktop) {
                    updateFloatingObjects(scrolled);
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // =============================================
    // 4. 3D TILT HOVER — Project Cards
    //    Cards tilt toward the mouse with
    //    perspective depth.
    // =============================================
    if (isDesktop) {
        const tiltCards = document.querySelectorAll('.tilt-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                setTimeout(() => { card.style.transition = ''; }, 600);
            });
        });
    }
}


// =============================================
// HELPER: Animate stat counters
// =============================================
function animateCounters(container) {
    const counters = container.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = counter.hasAttribute('data-decimal');
        const duration = 2000;
        const frames = 60;
        const increment = target / (duration / (1000 / frames));
        let current = 0;

        const updateCounter = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target;
                clearInterval(updateCounter);
            } else {
                counter.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
            }
        }, 1000 / frames);

        counter.classList.remove('counter');
    });
}


// =============================================
// HELPER: Animate skill pills with scatter
// =============================================
function animateSkillPills(cloud) {
    const pills = cloud.querySelectorAll('.skill-pill');
    pills.forEach((pill, idx) => {
        const rx = (Math.random() * 60 - 30) + 'px';
        const ry = (Math.random() * 60 - 30) + 'px';
        pill.style.setProperty('--rx', rx);
        pill.style.setProperty('--ry', ry);
        pill.style.animationDelay = `${idx * 0.06}s`;
        pill.classList.add('visible');
    });
}


// =============================================
// FLOATING 3D OBJECTS SYSTEM
// Creates decorative geometric shapes that
// float between sections and respond to scroll.
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

        // Fade in after a moment
        setTimeout(() => { el.style.opacity = '0.6'; }, 500);
    });
}

function updateFloatingObjects(scrollY) {
    const vh = window.innerHeight;
    const totalHeight = document.documentElement.scrollHeight;
    const scrollProgress = scrollY / (totalHeight - vh);

    floatingObjects.forEach(obj => {
        const offset = scrollY * obj.speed;
        const rotation = scrollY * obj.speed * 0.5;
        obj.el.style.transform = `translateY(${offset}px) rotate(${rotation}deg)`;

        // Fade based on proximity to viewport center
        const rect = obj.el.getBoundingClientRect();
        const distFromCenter = Math.abs(rect.top + rect.height / 2 - vh / 2);
        const opacity = Math.max(0.1, Math.min(0.7, 1 - distFromCenter / vh));
        obj.el.style.opacity = opacity;
    });
}
