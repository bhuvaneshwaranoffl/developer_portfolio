/**
 * cursor.js
 * Adaptive cursor — black on white sections, white on dark sections.
 * Detects which section the cursor is over and flips color.
 * Smoother lerp for trailing ring.
 */
export function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    if (!cursorDot || !cursorRing) return;

    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isDesktop || prefersReducedMotion) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let isOnDark = false;

    // Track mouse for dot (instant follow) + detect dark sections
    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top = my + 'px';

        // Detect if cursor is over a dark section
        const el = document.elementFromPoint(mx, my);
        if (el) {
            const darkParent = el.closest('.dark-section, .marquee-wrap, footer, .modal-content');
            const nowOnDark = !!darkParent;
            if (nowOnDark !== isOnDark) {
                isOnDark = nowOnDark;
                document.body.classList.toggle('cursor-on-dark', isOnDark);
            }
        }
    });

    // Smoother lerp ring — lower value = smoother trailing
    function lerpRing() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top = ry + 'px';
        requestAnimationFrame(lerpRing);
    }
    lerpRing();

    // Use MutationObserver to handle dynamically loaded content
    function attachHoverListeners() {
        const interactables = document.querySelectorAll(
            'a, button, .proj-card, .stat-card, .skill-pill, .skill-category, .contact-item, input, textarea'
        );
        interactables.forEach(el => {
            if (el.dataset.cursorAttached) return;
            el.dataset.cursorAttached = 'true';
            
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));

            // Magnetic effect for buttons and nav links
            if (el.classList.contains('btn') || el.closest('.nav-links')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const deltaX = e.clientX - centerX;
                    const deltaY = e.clientY - centerY;
                    
                    gsap.to(el, {
                        x: deltaX * 0.3,
                        y: deltaY * 0.3,
                        duration: 0.4,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                });
                
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: 'elastic.out(1, 0.3)',
                        overwrite: 'auto'
                    });
                });
            }
        });
    }

    // Initial attachment
    attachHoverListeners();

    // Re-attach after sections load (since they're dynamically injected)
    const observer = new MutationObserver(() => {
        attachHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
