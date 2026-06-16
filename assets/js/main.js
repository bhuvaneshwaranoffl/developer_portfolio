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

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavigation();
    initBackground();
    initOrb();
    initAnimations();
    initModal();
});
