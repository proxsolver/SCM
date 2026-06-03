/**
 * Schneider Electric Supply Chain Presentation - Three.js 3D Background Engine
 * Morphing particle plexus with green-themed industrial aesthetics
 * Updated: 30-slide layout (was 20-slide)
 */

let scene, camera, renderer;
let particleCount = 200;
let particlesGeometry;
let particlesMesh;
let linesMesh;

let spherePositions = [];
let gridPositions = [];
let helixPositions = [];
let currentPositions = [];
let velocities = [];

let currentSection = 0;
let targetCameraZ = 200;
let targetCameraY = 0;
let targetRotationSpeed = 0.0015;
let currentRotationSpeed = 0.0015;

let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function initThree() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a06, 0.003);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 250;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    generatePositions();

    particlesGeometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const colorGreen = new THREE.Color('#3DCD58');
    const colorBlue = new THREE.Color('#00AAFF');
    const colorWhite = new THREE.Color('#88DDAA');

    for (let i = 0; i < particleCount; i++) {
        positionArray[i * 3] = spherePositions[i * 3];
        positionArray[i * 3 + 1] = spherePositions[i * 3 + 1];
        positionArray[i * 3 + 2] = spherePositions[i * 3 + 2];

        currentPositions.push({
            x: spherePositions[i * 3],
            y: spherePositions[i * 3 + 1],
            z: spherePositions[i * 3 + 2]
        });

        const chosenColor = (i % 3 === 0) ? colorGreen : (i % 3 === 1) ? colorBlue : colorWhite;
        colorArray[i * 3] = chosenColor.r;
        colorArray[i * 3 + 1] = chosenColor.g;
        colorArray[i * 3 + 2] = chosenColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const pMaterial = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particlesMesh = new THREE.Points(particlesGeometry, pMaterial);
    scene.add(particlesMesh);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x3DCD58,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
    });

    const lineGeometry = new THREE.BufferGeometry();
    linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x3DCD58, 0.6);
    dirLight.position.set(1, 1, 1).normalize();
    scene.add(dirLight);

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    animate();
}

function generatePositions() {
    for (let i = 0; i < particleCount; i++) {
        // Sphere
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        const radius = 100;
        spherePositions.push(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        // Grid / Wave
        const cols = 15;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const spacing = 18;
        const gridX = (col - cols / 2) * spacing;
        const gridZ = (row - (particleCount / cols) / 2) * spacing;
        const waveY = Math.sin(col * 0.4) * Math.cos(row * 0.4) * 24;
        gridPositions.push(gridX, waveY, gridZ);

        // Double Helix
        const helixRadius = 48;
        const angle = i * 0.25;
        const helixZ = (i - particleCount / 2) * 2;
        const isSecondStrand = (i % 2 === 0);
        const offsetAngle = isSecondStrand ? Math.PI : 0;
        helixPositions.push(
            helixRadius * Math.cos(angle + offsetAngle),
            helixRadius * Math.sin(angle + offsetAngle),
            helixZ
        );

        velocities.push({
            x: (Math.random() - 0.5) * 0.15,
            y: (Math.random() - 0.5) * 0.15,
            z: (Math.random() - 0.5) * 0.15
        });
    }
}

function onMouseMove(event) {
    targetMouseX = (event.clientX - window.innerWidth / 2) * 0.08;
    targetMouseY = (event.clientY - window.innerHeight / 2) * 0.08;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Slide-based morphing: 30 slides → 3 regions
//   Part 1 (1–10):  Sphere     — Intro, 가트너, 기업/시장, 규모
//   Part 2 (11–20): Wave Grid  — 공급망 계획·관리 (STP 사례)
//   Part 3 (21–30): Double Helix — 성과·결론
window.transitionThreeScene = function(slideIndex) {
    if (slideIndex <= 10) {
        currentSection = 0; // Sphere
        targetCameraZ = 230;
        targetCameraY = 0;
        targetRotationSpeed = 0.0018;
    } else if (slideIndex <= 20) {
        currentSection = 1; // Wave Grid
        targetCameraZ = 200;
        targetCameraY = 60;
        targetRotationSpeed = 0.0006;
    } else {
        currentSection = 2; // Double Helix
        targetCameraZ = 180;
        targetCameraY = -20;
        targetRotationSpeed = 0.0025;
    }
};

function animate() {
    requestAnimationFrame(animate);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x += (mouseX - camera.position.x) * 0.04;
    camera.position.y += ((targetCameraY - mouseY) - camera.position.y) * 0.04;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.04;
    camera.lookAt(scene.position);

    currentRotationSpeed += (targetRotationSpeed - currentRotationSpeed) * 0.05;
    particlesMesh.rotation.y += currentRotationSpeed;
    particlesMesh.rotation.x += currentRotationSpeed * 0.2;
    linesMesh.rotation.copy(particlesMesh.rotation);

    const positions = particlesGeometry.attributes.position.array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < particleCount; i++) {
        let targetX, targetY, targetZ;

        if (currentSection === 0) {
            targetX = spherePositions[i * 3];
            targetY = spherePositions[i * 3 + 1];
            targetZ = spherePositions[i * 3 + 2];
        } else if (currentSection === 1) {
            targetX = gridPositions[i * 3];
            const col = i % 15;
            const row = Math.floor(i / 15);
            targetY = gridPositions[i * 3 + 1] + Math.sin(col * 0.4 + time * 1.5) * Math.cos(row * 0.4 + time * 1.5) * 8;
            targetZ = gridPositions[i * 3 + 2];
        } else {
            targetX = helixPositions[i * 3];
            targetY = helixPositions[i * 3 + 1];
            targetZ = helixPositions[i * 3 + 2];
        }

        currentPositions[i].x += (targetX - currentPositions[i].x) * 0.06;
        currentPositions[i].y += (targetY - currentPositions[i].y) * 0.06;
        currentPositions[i].z += (targetZ - currentPositions[i].z) * 0.06;

        positions[i * 3] = currentPositions[i].x + Math.sin(time + i) * 1.2;
        positions[i * 3 + 1] = currentPositions[i].y + Math.cos(time + i) * 1.2;
        positions[i * 3 + 2] = currentPositions[i].z + Math.sin(time * 0.5 + i) * 1.2;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    const linePositions = [];
    const maxDistance = 40;

    for (let i = 0; i < particleCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];

            const dx = x1 - x2;
            const dy = y1 - y2;
            const dz = z1 - z2;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance) {
                linePositions.push(x1, y1, z1);
                linePositions.push(x2, y2, z2);
            }
        }
    }

    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesMesh.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        initThree();
    } else {
        console.warn("Three.js library not loaded yet.");
    }
});
