import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const PHRASE = 'Hello world';

const canvas = document.getElementById('stage');
const captions = document.getElementById('captions');
const captionsFull = captions.querySelector('.captions-full');
const captionsWord = captions.querySelector('.captions-word');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b16);
scene.fog = new THREE.Fog(0x070b16, 4.5, 12);

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
camera.position.set(0, 0.12, 3.1);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2.2;
controls.maxDistance = 4.5;
controls.target.set(0, 0.05, 0);
controls.maxPolarAngle = Math.PI * 0.62;
controls.minPolarAngle = Math.PI * 0.35;

const hemi = new THREE.HemisphereLight(0xb7d0ff, 0x2a1a12, 1.15);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xfff1e0, 2.1);
key.position.set(2.4, 3.2, 2.8);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);

const rim = new THREE.DirectionalLight(0x7aa2ff, 1.1);
rim.position.set(-2.5, 1.2, -2.2);
scene.add(rim);

const fill = new THREE.PointLight(0xffc9a8, 0.55, 8);
fill.position.set(-1.4, 0.2, 1.8);
scene.add(fill);

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(3.2, 64),
  new THREE.MeshStandardMaterial({ color: 0x10182b, roughness: 0.9, metalness: 0.05 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.15;
ground.receiveShadow = true;
scene.add(ground);

const skinMat = new THREE.MeshStandardMaterial({
  color: 0xd9b39a,
  roughness: 0.42,
  metalness: 0.05,
});
const darkSkinMat = skinMat.clone();
darkSkinMat.color = new THREE.Color(0xc79a80);

const hairMat = new THREE.MeshStandardMaterial({
  color: 0x1a1210,
  roughness: 0.78,
  metalness: 0.08,
});

const scleraMat = new THREE.MeshStandardMaterial({
  color: 0xf4f6fb,
  roughness: 0.25,
  metalness: 0.0,
});

const irisMat = new THREE.MeshStandardMaterial({
  color: 0x3a5f8a,
  roughness: 0.35,
  metalness: 0.15,
});

const pupilMat = new THREE.MeshStandardMaterial({
  color: 0x0a0a0c,
  roughness: 0.4,
  metalness: 0.0,
});

const lipMat = new THREE.MeshStandardMaterial({
  color: 0xb5696a,
  roughness: 0.35,
  metalness: 0.05,
});

const avatar = new THREE.Group();
scene.add(avatar);

const head = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), skinMat);
head.scale.set(0.92, 1.05, 0.88);
head.castShadow = true;
head.receiveShadow = true;
avatar.add(head);

const hair = new THREE.Mesh(new THREE.SphereGeometry(1.02, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
hair.position.y = 0.18;
hair.scale.set(0.98, 0.95, 0.95);
hair.castShadow = true;
avatar.add(hair);

const browGeo = new THREE.TorusGeometry(0.18, 0.025, 10, 24, Math.PI);
function makeBrow(x, rotZ) {
  const brow = new THREE.Mesh(browGeo, hairMat);
  brow.position.set(x, 0.28, 0.78);
  brow.rotation.set(0.15, 0, rotZ);
  brow.scale.set(1, 0.7, 1);
  avatar.add(brow);
}
makeBrow(-0.28, 0.25);
makeBrow(0.28, -0.25);

function makeEye(x) {
  const eye = new THREE.Group();
  const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 18), scleraMat);
  const iris = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 16), irisMat);
  iris.position.z = 0.08;
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), pupilMat);
  pupil.position.z = 0.12;
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.018, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4, roughness: 0.2 })
  );
  highlight.position.set(0.03, 0.03, 0.14);
  eye.add(sclera, iris, pupil, highlight);
  eye.position.set(x, 0.12, 0.78);
  avatar.add(eye);
  return eye;
}
makeEye(-0.28);
makeEye(0.28);

const nose = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 16), darkSkinMat);
nose.position.set(0, -0.05, 0.9);
nose.rotation.x = Math.PI;
nose.castShadow = true;
avatar.add(nose);

function makeEar(x) {
  const ear = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 16), darkSkinMat);
  ear.scale.set(0.45, 0.75, 0.35);
  ear.position.set(x, 0.0, 0.05);
  ear.castShadow = true;
  avatar.add(ear);
}
makeEar(-0.92);
makeEar(0.92);

const jaw = new THREE.Group();
jaw.position.set(0, -0.42, 0.55);
avatar.add(jaw);

const upperLip = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 12, 32, Math.PI), lipMat);
upperLip.rotation.x = Math.PI;
upperLip.position.set(0, 0.05, 0.18);
jaw.add(upperLip);

const lowerLip = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.038, 12, 32, Math.PI), lipMat);
lowerLip.position.set(0, -0.02, 0.18);
jaw.add(lowerLip);

const mouthInterior = new THREE.Mesh(
  new THREE.CircleGeometry(0.14, 24),
  new THREE.MeshStandardMaterial({ color: 0x3a1518, roughness: 0.7, metalness: 0.0, side: THREE.DoubleSide })
);
mouthInterior.position.set(0, 0.01, 0.12);
jaw.add(mouthInterior);

const chin = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 18), skinMat);
chin.scale.set(0.85, 0.55, 0.7);
chin.position.set(0, -0.22, 0.05);
jaw.add(chin);

let speaking = false;
let mouthOpen = 0;
let mouthTarget = 0;
let idleT = 0;
let pointerDown = null;

function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function setCaptions(full, word = '') {
  captionsFull.textContent = full || '';
  captionsWord.textContent = word || '';
  captions.classList.toggle('active', Boolean(full || word));
}

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return (
    voices.find((v) => /en(-|_|$)/i.test(v.lang) && /google|neural|premium|natural/i.test(v.name)) ||
    voices.find((v) => /en(-|_|$)/i.test(v.lang)) ||
    voices[0] ||
    null
  );
}

function speakHello() {
  if (!window.speechSynthesis) {
    setCaptions(PHRASE, '(TTS unavailable in this browser)');
    speaking = true;
    mouthTarget = 0.55;
    setTimeout(() => {
      speaking = false;
      mouthTarget = 0;
      setCaptions('', '');
    }, 1600);
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(PHRASE);
  utter.rate = 0.95;
  utter.pitch = 1.0;
  const voice = pickVoice();
  if (voice) utter.voice = voice;

  speaking = true;
  mouthTarget = 0.35;
  setCaptions(PHRASE, '');

  utter.onboundary = (event) => {
    if (event.name === 'word' || event.charIndex != null) {
      const rest = PHRASE.slice(event.charIndex);
      const word = rest.split(/\s+/)[0] || '';
      setCaptions(PHRASE, word);
      mouthTarget = 0.75;
      window.setTimeout(() => {
        if (speaking) mouthTarget = 0.28;
      }, 90);
    }
  };

  utter.onend = () => {
    speaking = false;
    mouthTarget = 0;
    setCaptions(PHRASE, '');
    window.setTimeout(() => setCaptions('', ''), 900);
  };

  utter.onerror = () => {
    speaking = false;
    mouthTarget = 0;
    setCaptions(PHRASE, '(speech error)');
  };

  // Some browsers populate voices asynchronously.
  const start = () => window.speechSynthesis.speak(utter);
  if ((window.speechSynthesis.getVoices() || []).length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', start, { once: true });
    window.setTimeout(start, 250);
  } else {
    start();
  }
}

canvas.addEventListener('pointerdown', (e) => {
  pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
});

canvas.addEventListener('pointerup', (e) => {
  if (!pointerDown) return;
  const dx = e.clientX - pointerDown.x;
  const dy = e.clientY - pointerDown.y;
  const dt = performance.now() - pointerDown.t;
  pointerDown = null;
  if (dt < 450 && dx * dx + dy * dy < 100) {
    speakHello();
  }
});

function animate() {
  requestAnimationFrame(animate);
  idleT += 0.016;

  avatar.rotation.y = Math.sin(idleT * 0.35) * 0.08;
  avatar.position.y = Math.sin(idleT * 0.9) * 0.02;

  if (speaking) {
    const chatter = 0.22 + Math.abs(Math.sin(idleT * 14)) * 0.55;
    mouthTarget = Math.max(mouthTarget, chatter * 0.85);
  }

  mouthOpen += (mouthTarget - mouthOpen) * 0.28;
  jaw.position.y = -0.42 - mouthOpen * 0.12;
  jaw.rotation.x = mouthOpen * 0.35;
  lowerLip.position.y = -0.02 - mouthOpen * 0.05;
  mouthInterior.scale.set(1, 0.35 + mouthOpen * 1.4, 1);

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Warm voices list early where supported.
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
}
