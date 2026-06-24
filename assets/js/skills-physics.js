/**
 * skills-physics.js
 * Matter.js 2D physics sandbox for skill pills.
 * Pills rain from the top in a staggered cascade, bounce off walls,
 * and stack naturally at the bottom. Draggable with mouse/touch.
 * Runner pauses when section is off-screen via IntersectionObserver.
 */
export function initSkillsPhysics() {
    const sandbox = document.getElementById('skills-sandbox');
    const dataSource = document.getElementById('skills-data-source');
    if (!sandbox || !dataSource || typeof Matter === 'undefined') return;

    let isInitialized = false;
    let physicsState = null;

    window.debugLog = function(msg) {
        let div = document.getElementById('debug-log-div');
        if (!div) {
            div = document.createElement('div');
            div.id = 'debug-log-div';
            div.style.position = 'fixed';
            div.style.top = '10px';
            div.style.right = '10px';
            div.style.background = 'rgba(0,0,0,0.8)';
            div.style.color = '#0f0';
            div.style.padding = '10px';
            div.style.zIndex = '999999';
            div.style.fontFamily = 'monospace';
            div.style.whiteSpace = 'pre';
            document.body.appendChild(div);
        }
        div.innerText += msg + '\n';
    };

    window.debugLog('initSkillsPhysics called');

    // IntersectionObserver — start on first visibility, pause/resume after
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!isInitialized) {
                    physicsState = startPhysics(sandbox, dataSource);
                    isInitialized = true;
                } else if (physicsState) {
                    physicsState.resume();
                }
            } else {
                if (physicsState) {
                    physicsState.pause();
                }
            }
        });
    }, { threshold: 0.05 });

    observer.observe(sandbox);
}


function startPhysics(sandbox, dataSource) {
    const { Engine, World, Bodies, Composite, Mouse, MouseConstraint, Runner, Body } = Matter;

    // 1. Read pills from SEO data source
    const rawPills = dataSource.querySelectorAll('.skill-pill');
    const pillsToSpawn = [];

    // Temporarily create hidden pills inside the sandbox to measure their size
    rawPills.forEach((rp) => {
        const el = document.createElement('span');
        el.className = rp.className;
        el.textContent = rp.textContent;
        el.setAttribute('data-skill', rp.getAttribute('data-skill') || '');
        el.setAttribute('data-desc', rp.getAttribute('data-desc') || '');
        el.style.visibility = 'hidden';
        sandbox.appendChild(el);

        const width = el.offsetWidth || 80;
        const height = el.offsetHeight || 30;

        pillsToSpawn.push({ element: el, width, height });
    });

    const sandboxW = sandbox.clientWidth || 800;
    const sandboxH = sandbox.clientHeight || 520;

    // 2. Physics engine
    const engine = Engine.create({
        gravity: { y: 0.8 },
    });
    const world = engine.world;

    // 3. Boundary walls (thick so nothing escapes)
    const wallT = 60;
    const ground  = Bodies.rectangle(sandboxW / 2, sandboxH + wallT / 2, sandboxW * 3, wallT, { isStatic: true, friction: 0.5 });
    const left    = Bodies.rectangle(-wallT / 2, sandboxH / 2, wallT, sandboxH * 3, { isStatic: true });
    const right   = Bodies.rectangle(sandboxW + wallT / 2, sandboxH / 2, wallT, sandboxH * 3, { isStatic: true });
    const ceiling = Bodies.rectangle(sandboxW / 2, -200, sandboxW * 3, wallT, { isStatic: true });
    Composite.add(world, [ground, left, right, ceiling]);

    // 4. Runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // 5. Mouse dragging
    const mouse = Mouse.create(sandbox);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            stiffness: 0.2,
            angularStiffness: 0.1,
            render: { visible: false },
        },
    });
    Composite.add(world, mouseConstraint);

    // Fix: prevent page scroll when dragging pills on mobile
    sandbox.addEventListener('touchmove', (e) => {
        if (mouseConstraint.body) e.preventDefault();
    }, { passive: false });

    // 6. Staggered spawning — pills rain from the top
    let delay = 0;

    pillsToSpawn.forEach((p, idx) => {
        setTimeout(() => {
            // Random horizontal spawn, slightly above the sandbox
            const x = sandboxW * 0.15 + Math.random() * sandboxW * 0.7;
            const y = -40 - idx * 8;

            const body = Bodies.rectangle(x, y, p.width, p.height, {
                restitution: 0.35,
                friction: 0.25,
                frictionAir: 0.012,
                density: 0.0012,
                chamfer: { radius: Math.min(p.height / 2, 6) },
                render: { visible: false },
            });

            // Slight random spin + nudge for organic stacking
            Body.setAngle(body, (Math.random() - 0.5) * 0.3);
            Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 2,
                y: Math.random() * 1.5 + 0.5,
            });

            p.body = body;
            p.element.style.visibility = 'visible';
            Composite.add(world, body);
        }, delay);
        delay += 50; // Staggered rain
    });

    // 7. DOM sync loop — position HTML elements to match physics bodies
    let isRunning = true;
    let rafId;

    function syncDOM() {
        if (!isRunning) return;
        pillsToSpawn.forEach((p) => {
            if (p.body) {
                p.element.style.left = `${p.body.position.x - p.width / 2}px`;
                p.element.style.top  = `${p.body.position.y - p.height / 2}px`;
                p.element.style.transform = `rotate(${p.body.angle}rad)`;
            }
        });
        rafId = requestAnimationFrame(syncDOM);
    }
    syncDOM();

    // 8. Resize — reposition walls
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newW = sandbox.clientWidth || 800;
            const newH = sandbox.clientHeight || 520;
            Body.setPosition(ground, { x: newW / 2, y: newH + wallT / 2 });
            Body.setPosition(right, { x: newW + wallT / 2, y: newH / 2 });
            Body.setPosition(ceiling, { x: newW / 2, y: -200 });

            // Pull bodies back if they're outside new bounds
            pillsToSpawn.forEach((p) => {
                if (!p.body) return;
                let nx = p.body.position.x;
                let ny = p.body.position.y;
                let moved = false;
                if (nx > newW - p.width / 2) { nx = newW - p.width / 2 - 10; moved = true; }
                if (nx < p.width / 2) { nx = p.width / 2 + 10; moved = true; }
                if (ny > newH - p.height / 2) { ny = newH - p.height / 2 - 10; moved = true; }
                if (moved) {
                    Body.setPosition(p.body, { x: nx, y: ny });
                    Body.setVelocity(p.body, { x: 0, y: 0 });
                }
            });
        }, 200);
    }, { passive: true });

    // 9. Click detection (distinguish from drag) → open modal
    let dragStart = null;
    let clickedPill = null;

    sandbox.addEventListener('mousedown', (e) => {
        const pill = e.target.closest('.skill-pill');
        if (pill) {
            dragStart = { x: e.clientX, y: e.clientY, time: Date.now() };
            clickedPill = pill;
        }
    });

    sandbox.addEventListener('mouseup', (e) => {
        if (dragStart && clickedPill) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const elapsed = Date.now() - dragStart.time;
            if (dist < 5 && elapsed < 250) {
                const skill = clickedPill.getAttribute('data-skill');
                const desc = clickedPill.getAttribute('data-desc');
                if (skill && desc && window.openSkillModal) {
                    window.openSkillModal(skill, desc);
                }
            }
        }
        dragStart = null;
        clickedPill = null;
    });

    // Touch equivalents
    sandbox.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        const pill = e.target.closest('.skill-pill');
        if (pill) {
            dragStart = { x: t.clientX, y: t.clientY, time: Date.now() };
            clickedPill = pill;
        }
    }, { passive: true });

    sandbox.addEventListener('touchend', (e) => {
        if (dragStart && clickedPill) {
            const t = e.changedTouches[0];
            const dx = t.clientX - dragStart.x;
            const dy = t.clientY - dragStart.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const elapsed = Date.now() - dragStart.time;
            if (dist < 5 && elapsed < 250) {
                const skill = clickedPill.getAttribute('data-skill');
                const desc = clickedPill.getAttribute('data-desc');
                if (skill && desc && window.openSkillModal) {
                    window.openSkillModal(skill, desc);
                }
            }
        }
        dragStart = null;
        clickedPill = null;
    }, { passive: true });

    // 10. Return pause/resume controls for IntersectionObserver
    return {
        pause() {
            isRunning = false;
            Runner.stop(runner);
            cancelAnimationFrame(rafId);
        },
        resume() {
            if (!isRunning) {
                isRunning = true;
                Runner.run(runner, engine);
                syncDOM();
            }
        },
    };
}
