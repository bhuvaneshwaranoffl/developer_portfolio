/**
 * background.js
 * Three.js WebGL particle field — B&W theme.
 * Replaces the Canvas2D O(n²) particle system with a GPU-accelerated
 * 3D point cloud. Depth-based parallax, mouse-reactive camera tilt,
 * soft glow particles. IntersectionObserver pauses rendering off-screen.
 */
export function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // — Setup —
    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, W / H, 1, 600);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,     // Not needed for points
        powerPreference: 'low-power',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // — Particle count adapts to device —
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const COUNT = isMobile ? 180 : 400;
    const SPREAD = 350;

    // — Geometry —
    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const opacities = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        positions[i3]     = (Math.random() - 0.5) * SPREAD;       // x
        positions[i3 + 1] = (Math.random() - 0.5) * SPREAD;       // y
        positions[i3 + 2] = (Math.random() - 0.5) * SPREAD * 0.8; // z (shallower depth)
        sizes[i] = Math.random() * 3 + 1;
        opacities[i] = Math.random() * 0.4 + 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    // — Soft glow dot texture (canvas-generated) —
    const texCanvas = document.createElement('canvas');
    texCanvas.width = texCanvas.height = 64;
    const tctx = texCanvas.getContext('2d');
    const grad = tctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(0,0,0,0.9)');
    grad.addColorStop(0.4, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    tctx.fillStyle = grad;
    tctx.fillRect(0, 0, 64, 64);
    const dotTexture = new THREE.CanvasTexture(texCanvas);

    // — Custom ShaderMaterial for per-particle opacity & size —
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: dotTexture },
            uPixelRatio: { value: renderer.getPixelRatio() },
        },
        vertexShader: `
            attribute float aSize;
            attribute float aOpacity;
            varying float vOpacity;
            uniform float uPixelRatio;
            void main() {
                vOpacity = aOpacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = aSize * uPixelRatio * (200.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D uTexture;
            varying float vOpacity;
            void main() {
                vec4 tex = texture2D(uTexture, gl_PointCoord);
                gl_FragColor = vec4(0.0, 0.0, 0.0, tex.a * vOpacity);
            }
        `,
        transparent: true,
        depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // — Subtle grid plane (like the original) —
    const gridHelper = new THREE.GridHelper(600, 30, 0x000000, 0x000000);
    gridHelper.position.y = -120;
    gridHelper.material.opacity = 0.035;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // — Mouse tracking —
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / W - 0.5) * 2;
        mouseY = (e.clientY / H - 0.5) * 2;
    }, { passive: true });

    // — Resize —
    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    }, { passive: true });

    // — Animation loop with IntersectionObserver pause —
    let isVisible = true;
    let rafId;

    function animate() {
        if (!isVisible) return;

        // Slow drift rotation
        points.rotation.y += 0.0003;
        points.rotation.x += 0.0001;

        // Mouse-reactive camera parallax (eased)
        camera.position.x += (mouseX * 15 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 15 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
    }

    // The canvas is position:fixed so it's always "visible" in terms of layout,
    // but we still hook up an observer to handle edge cases (e.g. page hidden).
    const observer = new IntersectionObserver((entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !isVisible) {
            isVisible = true;
            animate();
        } else if (!visible) {
            isVisible = false;
            cancelAnimationFrame(rafId);
        }
    }, { threshold: 0 });
    observer.observe(canvas);

    // Also pause on page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isVisible = false;
            cancelAnimationFrame(rafId);
        } else {
            isVisible = true;
            animate();
        }
    });

    animate();
}
