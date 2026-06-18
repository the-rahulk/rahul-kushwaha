// Three.js Ambient Background Particles System
import * as THREE from 'three';

let scene, camera, renderer, particleSystem;
let isInitialized = false;
let animationFrameId = null;
let lastFrameTime = 0;
const targetFPS = 30;
const frameInterval = 1000 / targetFPS;

export function initParticles() {
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Do not initialize Three.js on mobile or if reduced motion is preferred
  if (isMobile || prefersReducedMotion) {
    cleanupParticles();
    return;
  }

  if (isInitialized) return;

  const container = document.getElementById('canvas-container');
  if (!container) return;

  // Create Scene
  scene = new THREE.Scene();

  // Create Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 100;

  // Create WebGL Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Generate Particle Geometry
  const particleCount = 80;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200;     // X: Spread wide
    positions[i + 1] = (Math.random() - 0.5) * 200; // Y: Spread high
    positions[i + 2] = (Math.random() - 0.5) * 100; // Z: Depth
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Circular texture creation for particles (to make them look like soft dots instead of squares)
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 16);
  const texture = new THREE.CanvasTexture(canvas);

  // Create Particle Material
  const material = new THREE.PointsMaterial({
    size: 2.2,
    map: texture,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  // Create Points
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  isInitialized = true;

  // Handle Window Resize
  window.addEventListener('resize', onWindowResize);

  // Start rendering
  lastFrameTime = performance.now();
  animate();
}

function animate(currentTime) {
  if (!isInitialized) return;

  animationFrameId = requestAnimationFrame(animate);

  if (!currentTime) currentTime = performance.now();
  const elapsed = currentTime - lastFrameTime;

  // Throttle frame rate to 30fps to save mobile CPU/battery
  if (elapsed >= frameInterval) {
    lastFrameTime = currentTime - (elapsed % frameInterval);

    // Drifting motion
    const positions = particleSystem.geometry.attributes.position.array;
    const count = positions.length;

    for (let i = 1; i < count; i += 3) {
      positions[i] += 0.08; // Move upward slowly (Y axis)
      
      // Reset position if it moves off-screen
      if (positions[i] > 100) {
        positions[i] = -100;
        positions[i - 1] = (Math.random() - 0.5) * 200; // Re-randomize X
      }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  if (!isInitialized) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function cleanupParticles() {
  if (!isInitialized) return;

  isInitialized = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  window.removeEventListener('resize', onWindowResize);

  const container = document.getElementById('canvas-container');
  if (container && renderer && renderer.domElement) {
    container.innerHTML = '';
  }

  if (particleSystem) {
    particleSystem.geometry.dispose();
    particleSystem.material.dispose();
  }

  if (renderer) {
    renderer.dispose();
  }

  scene = null;
  camera = null;
  renderer = null;
  particleSystem = null;
}

// React to viewport scale changes dynamically (e.g. rotating phone)
window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMobile || prefersReducedMotion) {
    cleanupParticles();
  } else {
    initParticles();
  }
});
