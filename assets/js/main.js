/**
 * main.js
 * Entry point — initializes Lenis smooth scroll, wires GSAP ScrollTrigger,
 * loads HTML sections, then boots all modules.
 */
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initOrb } from './orb.js';
import { initModal } from './modal.js';

// Load HTML sections
async function loadSection(id, path) {
    try {
        const response = await fetch(path);
        const html = await response.text();
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading section ${path}:`, error);
    }
}

async function loadAllSections() {
    await Promise.all([
        loadSection('navbar-container', 'sections/navbar/navbar.html'),
        loadSection('hero-container', 'sections/hero/hero.html'),
        loadSection('about-container', 'sections/about/about.html'),
        loadSection('skills-container', 'sections/skills/skills.html'),
        loadSection('experience-container', 'sections/experience/experience.html'),
        loadSection('projects-container', 'sections/projects/projects.html'),
        loadSection('contact-container', 'sections/contact/contact.html'),
    ]);
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch and inject all HTML sections
    await loadAllSections();

    // 2. Initialize Lenis smooth scrolling — tuned for premium feel
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 1.5,
    });

    // 3. Wire Lenis ↔ GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Expose globally so modals can pause/resume scroll
    window.lenis = lenis;

    // 4. Smooth anchor scrolling via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') {
                lenis.scrollTo(0, { duration: 1.6 });
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target, { offset: -80, duration: 1.6 });
            }
        });
    });

    // 5. Initialize all modules
    initCursor();
    initNavigation();
    initOrb();
    initAnimations();
    initModal();

    // 6. Refresh ScrollTrigger after all content is loaded and painted
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });
});
