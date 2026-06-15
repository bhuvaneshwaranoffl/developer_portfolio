/**
 * hero.js
 * Handles the cinematic hero entrance —
 * blur-in title reveal and orb fade-in.
 */
export function initHeroAnimation() {
    // Trigger the blur-reveal animation on the hero title
    const heading = document.getElementById('animated-heading');
    if (heading) {
        // Small delay so the page settles before animating
        requestAnimationFrame(() => {
            heading.classList.add('hero-reveal');
        });
    }

    // Fade in the wireframe orb after title finishes
    setTimeout(() => {
        const heroOrb = document.getElementById('hero-orb');
        if (heroOrb) heroOrb.classList.add('loaded');
    }, 1800);
}
