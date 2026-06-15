/**
 * cursor.js
 * Logic for the custom violet dot and lerping ring cursor.
 * Only applies on desktop devices without reduced motion enabled.
 */
export function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    if (!cursorDot || !cursorRing) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isDesktop && !prefersReducedMotion) {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
        });

        // Lerp function for smooth ring trailing
        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
        
        const renderRing = () => {
            ringX = lerp(ringX, mouseX, 0.15);
            ringY = lerp(ringY, mouseY, 0.15);
            
            cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
            requestAnimationFrame(renderRing);
        };
        requestAnimationFrame(renderRing);

        // Add hover effects for interactive elements
        const interactables = document.querySelectorAll('a, button, input, textarea, .project-card, .contact-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }
}
