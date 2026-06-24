/**
 * modal.js
 * Logic for opening/closing the skill popup modal.
 */
export function initModal() {
    const modal = document.getElementById('skill-modal');
    const closeBtn = document.getElementById('modal-close');
    const titleEl = document.getElementById('modal-skill-title');
    const descEl = document.getElementById('modal-skill-desc');
    const skillPills = document.querySelectorAll('.skill-pill');

    if (!modal) return;

    function openModal(skill, desc) {
        titleEl.textContent = skill;
        descEl.textContent = desc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        if (window.lenis) window.lenis.stop(); // Pause Lenis smooth scroll
    }

    // Expose globally for physics sandbox click detection
    window.openSkillModal = openModal;

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (window.lenis) window.lenis.start(); // Resume Lenis
    }

    skillPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const skill = pill.getAttribute('data-skill');
            const desc = pill.getAttribute('data-desc');
            if (skill && desc) {
                openModal(skill, desc);
            }
        });
        
        // Add cursor hover effect to pills since they are clickable
        pill.style.cursor = 'pointer';
    });

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
