/**
 * main.js
 * Entry point — initializes Lenis smooth scroll, wires GSAP ScrollTrigger,
 * loads HTML sections, then boots all modules.
 */
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initBackground } from './background.js';
import { initOrb } from './orb.js';
import { initModal } from './modal.js';
import { initSkillsPhysics } from './skills-physics.js';

// Catch errors and show them on screen
window.addEventListener('error', (e) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.background = 'red';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.innerText = `Error: ${e.message}\nAt: ${e.filename}:${e.lineno}`;
    document.body.appendChild(errorDiv);
});

window.addEventListener('unhandledrejection', (e) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '100px';
    errorDiv.style.left = '0';
    errorDiv.style.background = 'orange';
    errorDiv.style.color = 'black';
    errorDiv.style.padding = '10px';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.innerText = `Promise Rejection: ${e.reason}`;
    document.body.appendChild(errorDiv);
});

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

    // 2. Initialize Lenis smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
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

    // 4. Initialize all modules
    initCursor();
    initNavigation();
    initBackground();
    initOrb();
    initAnimations();
    initModal();
    initSkillsPhysics();
});
