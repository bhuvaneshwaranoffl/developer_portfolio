/**
 * cursor.js
 * Premium custom cursor with dot + lerping ring.
 * Mix-blend-mode screen for elegant glow effect.
 */
export function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    if (!cursorDot || !cursorRing) return;

    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    // Track mouse for dot (instant follow)
    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top = my + 'px';
    });

    // Lerp ring for smooth trailing
    function lerpRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
        requestAnimationFrame(lerpRing);
    }
    lerpRing();

    // Add hover effects for interactive elements
    const interactables = document.querySelectorAll(
        'a, button, .proj-card, .stat-card, .skill-pill, .contact-item, input, textarea'
    );
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}
