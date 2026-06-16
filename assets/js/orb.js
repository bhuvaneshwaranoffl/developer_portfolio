/**
 * orb.js
 * 3D wireframe sphere rendered on canvas
 * with mouse-interactive rotation and
 * floating tech labels on the surface.
 */
export function initOrb() {
    const orbCanvas = document.getElementById('orb-canvas');
    if (!orbCanvas) return;

    const ctx = orbCanvas.getContext('2d');
    let oW, oH;

    function resizeOrb() {
        oW = orbCanvas.width = orbCanvas.offsetWidth;
        oH = orbCanvas.height = orbCanvas.offsetHeight;
    }
    resizeOrb();
    window.addEventListener('resize', resizeOrb);

    let orbAngleX = 0, orbAngleY = 0;
    let mouseInfluenceX = 0, mouseInfluenceY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseInfluenceX = (e.clientX / window.innerWidth - 0.5) * 0.3;
        mouseInfluenceY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    });

    function project3D(x, y, z, cx, cy, fov) {
        const scale = fov / (fov + z);
        return { x: cx + x * scale, y: cy + y * scale, scale };
    }

    function rotateX(pt, a) {
        return {
            x: pt.x,
            y: pt.y * Math.cos(a) - pt.z * Math.sin(a),
            z: pt.y * Math.sin(a) + pt.z * Math.cos(a)
        };
    }

    function rotateY(pt, a) {
        return {
            x: pt.x * Math.cos(a) + pt.z * Math.sin(a),
            y: pt.y,
            z: -pt.x * Math.sin(a) + pt.z * Math.cos(a)
        };
    }

    function drawOrb() {
        ctx.clearRect(0, 0, oW, oH);
        const cx = oW / 2, cy = oH / 2;
        const R = Math.min(oW, oH) * 0.38;
        const fov = 500;
        const rings = 14, segments = 14;

        orbAngleY += 0.005 + mouseInfluenceX * 0.02;
        orbAngleX += mouseInfluenceY * 0.01;

        // Glow
        const grd = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.1);
        grd.addColorStop(0, 'rgba(124,58,237,0.18)');
        grd.addColorStop(0.5, 'rgba(124,58,237,0.06)');
        grd.addColorStop(1, 'rgba(124,58,237,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(cx - R * 1.2, cy - R * 1.2, R * 2.4, R * 2.4);

        // Draw horizontal rings
        for (let ri = 0; ri <= rings; ri++) {
            const phi = Math.PI * ri / rings;
            const pts = [];
            for (let si = 0; si <= segments; si++) {
                const theta = 2 * Math.PI * si / segments;
                let p = {
                    x: R * Math.sin(phi) * Math.cos(theta),
                    y: R * Math.sin(phi) * Math.sin(theta),
                    z: R * Math.cos(phi)
                };
                p = rotateY(p, orbAngleY);
                p = rotateX(p, orbAngleX + 0.3);
                const proj = project3D(p.x, p.y, p.z, cx, cy, fov);
                pts.push({ ...proj, z: p.z });
            }
            for (let si = 0; si < segments; si++) {
                const a = pts[si], b = pts[si + 1];
                const depth = (a.z + b.z) / (2 * R);
                const alpha = Math.max(0.04, Math.min(0.55, (depth + 1) / 2));
                ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
                ctx.lineWidth = depth > 0 ? 0.8 : 0.3;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        // Draw vertical lines
        for (let si = 0; si <= segments; si++) {
            const theta = 2 * Math.PI * si / segments;
            const pts = [];
            for (let ri = 0; ri <= rings; ri++) {
                const phi = Math.PI * ri / rings;
                let p = {
                    x: R * Math.sin(phi) * Math.cos(theta),
                    y: R * Math.sin(phi) * Math.sin(theta),
                    z: R * Math.cos(phi)
                };
                p = rotateY(p, orbAngleY);
                p = rotateX(p, orbAngleX + 0.3);
                const proj = project3D(p.x, p.y, p.z, cx, cy, fov);
                pts.push({ ...proj, z: p.z });
            }
            for (let ri = 0; ri < rings; ri++) {
                const a = pts[ri], b = pts[ri + 1];
                const depth = (a.z + b.z) / (2 * R);
                const alpha = Math.max(0.04, Math.min(0.45, (depth + 1) / 2));
                ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
                ctx.lineWidth = 0.4;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
        }

        // Floating tech labels on sphere surface
        const dotPositions = [
            { phi: Math.PI / 4, theta: Math.PI / 3, label: 'Flutter' },
            { phi: Math.PI / 2, theta: Math.PI, label: 'BLoC' },
            { phi: 2 * Math.PI / 3, theta: 5 * Math.PI / 3, label: 'Fintech' },
            { phi: Math.PI / 3, theta: 4 * Math.PI / 3, label: 'Clean Arch' },
            { phi: 3 * Math.PI / 4, theta: 2 * Math.PI / 3, label: 'Riverpod' },
        ];

        dotPositions.forEach(dp => {
            let p = {
                x: R * Math.sin(dp.phi) * Math.cos(dp.theta + orbAngleY * 1.2),
                y: R * Math.sin(dp.phi) * Math.sin(dp.theta + orbAngleY * 1.2),
                z: R * Math.cos(dp.phi)
            };
            p = rotateY(p, orbAngleY);
            p = rotateX(p, orbAngleX + 0.3);

            if (p.z > -R * 0.2) {
                const proj = project3D(p.x, p.y, p.z, cx, cy, fov);
                const alpha = Math.max(0.2, (p.z + R) / (2 * R));

                ctx.beginPath();
                ctx.arc(proj.x, proj.y, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(167,139,250,${alpha})`;
                ctx.fill();

                ctx.fillStyle = `rgba(240,238,248,${alpha * 0.85})`;
                ctx.font = `500 ${Math.floor(10 * proj.scale)}px 'JetBrains Mono', monospace`;
                ctx.fillText(dp.label, proj.x + 8, proj.y + 4);
            }
        });

        requestAnimationFrame(drawOrb);
    }
    drawOrb();
}
