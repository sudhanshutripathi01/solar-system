import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0);
scene.add(light);

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planets = [
    { name: 'Mercury', size: 0.5, color: 0xaaaaaa, distance: 8, speed: 0.01 },
    { name: 'Venus', size: 1, color: 0xffaa00, distance: 12, speed: 0.008 },
    { name: 'Earth', size: 1.1, color: 0x0033ff, distance: 16, speed: 0.007 },
    { name: 'Mars', size: 0.9, color: 0xff3300, distance: 20, speed: 0.005 },
    { name: 'Jupiter', size: 2.5, color: 0xaa5500, distance: 28, speed: 0.003 },
    { name: 'Saturn', size: 2, color: 0xcccc99, distance: 35, speed: 0.002 },
    { name: 'Uranus', size: 1.5, color: 0x66ccff, distance: 40, speed: 0.001 },
    { name: 'Neptune', size: 1.4, color: 0x3366ff, distance: 45, speed: 0.0008 }
];

const planetMeshes = planets.map(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(planet.distance, 0, 0);
    scene.add(mesh);
    return { mesh, speed: planet.speed, distance: planet.distance };
});

let isPaused = false;
function animate() {
    if (!isPaused) {
        requestAnimationFrame(animate);
        planetMeshes.forEach((planet, i) => {
            const angle = performance.now() * planet.speed * 0.001;
            planet.mesh.position.set(
                planet.distance * Math.cos(angle),
                0,
                planet.distance * Math.sin(angle)
            );
        });
        renderer.render(scene, camera);
    }
}

camera.position.z = 50;

const speedControls = document.getElementById('speedControls');
planets.forEach((planet, index) => {
    const label = document.createElement('label');
    label.innerText = planet.name;

    const input = document.createElement('input');
    input.type = 'range';
    input.min = '0.0001';
    input.max = '0.02';
    input.step = '0.0001';
    input.value = planet.speed;

    input.oninput = (e) => {
        planetMeshes[index].speed = parseFloat(e.target.value);
    };

    speedControls.appendChild(label);
    speedControls.appendChild(input);
    speedControls.appendChild(document.createElement('br'));
});


document.getElementById('pauseResume').addEventListener('click', () => {
    isPaused = !isPaused;
    if (!isPaused) animate();
});

animate();