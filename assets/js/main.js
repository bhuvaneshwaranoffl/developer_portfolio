/**
 * main.js
 * Entry point for JavaScript logic.
 * Imports individual modules and initializes them.
 */
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initHeroAnimation } from './hero.js';
import { initAnimations } from './animations.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavigation();
    initHeroAnimation();
    initAnimations();
});
