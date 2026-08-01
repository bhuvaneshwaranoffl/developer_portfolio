/**
 * modal.js
 * Logic for opening/closing the skill popup modal.
 */
export function initModal() {
    const modal = document.getElementById('skill-modal');
    const closeBtn = document.getElementById('modal-close');
    const titleEl = document.getElementById('modal-skill-title');
    const descEl = document.getElementById('modal-skill-desc');

    if (!modal || !closeBtn || !titleEl || !descEl) return;

    function openModal(skill, desc) {
        titleEl.textContent = skill;
        descEl.textContent = desc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (window.lenis) window.lenis.stop();
    }

    // Expose globally for any click handler
    window.openSkillModal = openModal;

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start();
    }

    // Attach click handlers to all skill pills (including dynamically loaded ones)
    function attachPillListeners() {
        document.querySelectorAll('.skill-pill').forEach(pill => {
            if (pill.dataset.modalAttached) return;
            pill.dataset.modalAttached = 'true';
            pill.style.cursor = 'pointer';
            pill.addEventListener('click', () => {
                const skill = pill.getAttribute('data-skill');
                const desc = pill.getAttribute('data-desc');
                if (skill && desc) {
                    openModal(skill, desc);
                }
            });
        });
    }

    // Initial attachment
    attachPillListeners();

    // Re-attach after sections load
    const observer = new MutationObserver(() => {
        attachPillListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
