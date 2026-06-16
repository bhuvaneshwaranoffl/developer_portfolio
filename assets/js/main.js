/**
 * main.js
 * Entry point for JavaScript logic.
 * Imports individual modules and initializes them.
 */
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initBackground } from './background.js';
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
    
    // 2. Initialize logic AFTER DOM is fully constructed
    initCursor();
    initNavigation();
    initBackground();
    initOrb();
    initAnimations();
    initModal();
});
