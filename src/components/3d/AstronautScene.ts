import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { VitalStatus } from '../../types/vitals';

// ============================================================================
// 🚀 3D MODEL CONFIGURATION: SWAP YOUR 3D MODEL URL HERE (GLTF / GLB)
// ============================================================================
// You can replace the URL below with any working public GLTF / GLB model URL.
// The loader will automatically download, scale, and center it in the scene.
// If the URL fails or is empty, the system automatically falls back to the
// high-fidelity NASA Biomechanical EVA Astronaut Twin built procedurally below!
export const DEFAULT_3D_MODEL_URL = 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';
// ============================================================================

export interface AstronautSceneInstance {
  updateStatus: (status: VitalStatus, heartRate: number) => void;
  setCameraTarget: (view: 'full' | 'visor' | 'chest' | 'plss') => void;
  loadCustomModel: (url: string) => Promise<boolean>;
  resetToProcedural: () => void;
  resize: () => void;
  dispose: () => void;
}

const STATUS_COLORS: Record<VitalStatus, { hex: number; hexStr: string }> = {
  normal: { hex: 0x00f0ff, hexStr: '#00f0ff' }, // Soft Cyan glow
  caffeine: { hex: 0x00e1ff, hexStr: '#00e1ff' }, // Safe Cyan / Blue
  stress: { hex: 0xf59e0b, hexStr: '#f59e0b' }, // Yellow glow
  emergency: { hex: 0xef4444, hexStr: '#ef4444' }, // Red glow
};

export function createAstronautScene(
  container: HTMLDivElement,
  initialStatus: VitalStatus = 'normal'
): AstronautSceneInstance {
  // Software WebGL detection per Three.js skill
  const isSoftwareGl = (() => {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  })();

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030712); // Deep cosmic void
  scene.fog = new THREE.FogExp2(0x030712, 0.04);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 1.4, 4.2);

  // Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Environment Map Reflection (PBR standard from skill)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  pmremGenerator.dispose();

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 1.2, 0);
  controls.minDistance = 1.2;
  controls.maxDistance = 10;
  controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't go deep beneath platform

  // Studio 3-Point Lighting Rig
  const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 0.8);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(3, 5, 4);
  keyLight.castShadow = !isSoftwareGl;
  if (!isSoftwareGl) {
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -2;
    keyLight.shadow.camera.right = 2;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -1;
  }
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.6);
  rimLight.position.set(-4, 3, -4);
  scene.add(rimLight);

  // Root Master Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // External GLTF Loaded Object holder
  let loadedModel: THREE.Object3D | null = null;
  const gltfLoader = new GLTFLoader();

  // Procedural Astronaut Group (High-tech digital twin)
  const astronautGroup = new THREE.Group();
  masterGroup.add(astronautGroup);

  // Reusable materials
  const suitFabricMat = new THREE.MeshStandardMaterial({
    color: 0xddddf0,
    roughness: 0.75,
    metalness: 0.1,
  });

  const suitJointMat = new THREE.MeshStandardMaterial({
    color: 0x222632,
    roughness: 0.45,
    metalness: 0.7,
  });

  const goldVisorMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    metalness: 0.96,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
  });

  const plssMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    metalness: 0.35,
    roughness: 0.3,
  });

  // Dynamic Vital Beacon Emissive Material (Heart rate pulse glow)
  const chestBeaconMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 2.2,
    roughness: 0.2,
    metalness: 0.8,
  });

  // Dynamic Holographic Ring Material
  const holoRingMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });

  // Assemble Composite 3-12 Part Procedural Astronaut
  // 1. Torso
  const torsoGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.75, 16);
  const torso = new THREE.Mesh(torsoGeo, suitFabricMat);
  torso.position.y = 1.35;
  torso.castShadow = !isSoftwareGl;
  torso.receiveShadow = !isSoftwareGl;
  astronautGroup.add(torso);

  // Chest Life-Support Module & Biometric Core
  const chestPlateGeo = new THREE.BoxGeometry(0.36, 0.32, 0.16);
  const chestPlate = new THREE.Mesh(chestPlateGeo, suitJointMat);
  chestPlate.position.set(0, 1.42, 0.26);
  astronautGroup.add(chestPlate);

  // Glowing Biometric Chest Heart Beacon
  const beaconGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
  beaconGeo.rotateX(Math.PI / 2);
  const chestBeacon = new THREE.Mesh(beaconGeo, chestBeaconMat);
  chestBeacon.position.set(0, 1.44, 0.35);
  astronautGroup.add(chestBeacon);

  // 2. Helmet & Visor
  const helmetGeo = new THREE.SphereGeometry(0.28, 24, 20);
  const helmet = new THREE.Mesh(helmetGeo, suitFabricMat);
  helmet.position.y = 1.95;
  helmet.castShadow = !isSoftwareGl;
  astronautGroup.add(helmet);

  const visorGeo = new THREE.SphereGeometry(0.22, 24, 20, 0, Math.PI, 0, Math.PI * 0.75);
  const visor = new THREE.Mesh(visorGeo, goldVisorMat);
  visor.rotation.x = -Math.PI / 8;
  visor.rotation.y = -Math.PI / 2;
  visor.position.set(0, 1.96, 0.1);
  astronautGroup.add(visor);

  // Helmet light torches (L & R)
  const torchGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12);
  const torchMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xdbeafe,
    emissiveIntensity: 1.5,
  });
  const torchL = new THREE.Mesh(torchGeo, torchMat);
  torchL.rotation.z = Math.PI / 2;
  torchL.position.set(-0.31, 1.98, 0.08);
  const torchR = torchL.clone();
  torchR.position.set(0.31, 1.98, 0.08);
  astronautGroup.add(torchL, torchR);

  // 3. PLSS Backpack (Portable Life Support System)
  const backpackGeo = new THREE.BoxGeometry(0.56, 0.72, 0.28);
  const backpack = new THREE.Mesh(backpackGeo, plssMat);
  backpack.position.set(0, 1.42, -0.28);
  backpack.castShadow = !isSoftwareGl;
  astronautGroup.add(backpack);

  // Oxygen Tanks on Backpack (2 Cylinders)
  const tankGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12);
  const tankL = new THREE.Mesh(tankGeo, suitJointMat);
  tankL.position.set(-0.16, 1.42, -0.42);
  const tankR = tankL.clone();
  tankR.position.set(0.16, 1.42, -0.42);
  astronautGroup.add(tankL, tankR);

  // 4. Arms & EVA Gloves
  const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.55, 12);
  const armL = new THREE.Mesh(armGeo, suitFabricMat);
  armL.position.set(-0.46, 1.35, 0.02);
  armL.rotation.z = 0.22;
  const armR = new THREE.Mesh(armGeo, suitFabricMat);
  armR.position.set(0.46, 1.35, 0.02);
  armR.rotation.z = -0.22;
  astronautGroup.add(armL, armR);

  // Forearms & Hands
  const forearmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.45, 12);
  const forearmL = new THREE.Mesh(forearmGeo, suitFabricMat);
  forearmL.position.set(-0.55, 0.95, 0.1);
  forearmL.rotation.x = -0.25;
  forearmL.rotation.z = 0.1;
  const forearmR = new THREE.Mesh(forearmGeo, suitFabricMat);
  forearmR.position.set(0.55, 0.95, 0.1);
  forearmR.rotation.x = -0.25;
  forearmR.rotation.z = -0.1;
  astronautGroup.add(forearmL, forearmR);

  // 5. Waist & Legs
  const waistGeo = new THREE.CylinderGeometry(0.31, 0.28, 0.22, 16);
  const waist = new THREE.Mesh(waistGeo, suitJointMat);
  waist.position.y = 0.92;
  astronautGroup.add(waist);

  const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.65, 12);
  const legL = new THREE.Mesh(legGeo, suitFabricMat);
  legL.position.set(-0.2, 0.52, 0);
  legL.castShadow = !isSoftwareGl;
  const legR = new THREE.Mesh(legGeo, suitFabricMat);
  legR.position.set(0.2, 0.52, 0);
  legR.castShadow = !isSoftwareGl;
  astronautGroup.add(legL, legR);

  // Boots
  const bootGeo = new THREE.BoxGeometry(0.18, 0.18, 0.32);
  const bootL = new THREE.Mesh(bootGeo, suitJointMat);
  bootL.position.set(-0.2, 0.1, 0.05);
  bootL.castShadow = !isSoftwareGl;
  const bootR = new THREE.Mesh(bootGeo, suitJointMat);
  bootR.position.set(0.2, 0.1, 0.05);
  bootR.castShadow = !isSoftwareGl;
  astronautGroup.add(bootL, bootR);

  // 6. Holographic Biometric Telemetry Rings
  const holoRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.008, 12, 48), holoRingMat);
  holoRing1.rotation.x = Math.PI / 2;
  holoRing1.position.y = 1.4;
  astronautGroup.add(holoRing1);

  const holoRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.006, 12, 48), holoRingMat);
  holoRing2.rotation.x = Math.PI / 3;
  holoRing2.position.y = 1.4;
  astronautGroup.add(holoRing2);

  // Ground Platform (Orbital EVA Grid Platform)
  const platformGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.12, 32);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.5,
    metalness: 0.8,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -0.06;
  platform.receiveShadow = !isSoftwareGl;
  scene.add(platform);

  // Circular Platform Border Ring
  const borderRingGeo = new THREE.RingGeometry(2.32, 2.38, 32);
  borderRingGeo.rotateX(-Math.PI / 2);
  const borderRingMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const borderRing = new THREE.Mesh(borderRingGeo, borderRingMat);
  borderRing.position.y = 0.01;
  scene.add(borderRing);

  // Soft Radial Contact Shadow Grounding
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.85,
  });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.005;
  scene.add(shadowPlane);

  // Starfield & Cosmic Dust
  const starCount = 600;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const r = 8 + Math.random() * 25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);

    // Subtle blue/white star tints
    const brightness = 0.6 + Math.random() * 0.4;
    starColors[i * 3] = brightness * 0.85;
    starColors[i * 3 + 1] = brightness * 0.95;
    starColors[i * 3 + 2] = brightness;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // Camera Target Interpolation Helper
  const targetCamPos = new THREE.Vector3().copy(camera.position);
  const targetControlsTarget = new THREE.Vector3().copy(controls.target);
  let isCameraTransitioning = false;

  const setCameraTarget = (view: 'full' | 'visor' | 'chest' | 'plss') => {
    isCameraTransitioning = true;
    if (view === 'full') {
      targetCamPos.set(0, 1.4, 4.2);
      targetControlsTarget.set(0, 1.2, 0);
    } else if (view === 'visor') {
      targetCamPos.set(0, 1.98, 1.05);
      targetControlsTarget.set(0, 1.95, 0.1);
    } else if (view === 'chest') {
      targetCamPos.set(0, 1.45, 1.3);
      targetControlsTarget.set(0, 1.42, 0.2);
    } else if (view === 'plss') {
      targetCamPos.set(0, 1.5, -2.2);
      targetControlsTarget.set(0, 1.4, -0.2);
    }
  };

  // State Management inside 3D
  let currentStatus: VitalStatus = initialStatus;
  let currentHeartRate: number = 72;
  let pulsePhase = 0;

  const updateStatus = (status: VitalStatus, heartRate: number) => {
    currentStatus = status;
    currentHeartRate = heartRate;

    const colorData = STATUS_COLORS[status];
    const targetColor = new THREE.Color(colorData.hex);

    chestBeaconMat.color.copy(targetColor);
    chestBeaconMat.emissive.copy(targetColor);
    holoRingMat.color.copy(targetColor);
    borderRingMat.color.copy(targetColor);
    rimLight.color.copy(targetColor);

    if (status === 'emergency') {
      chestBeaconMat.emissiveIntensity = 4.0;
    } else if (status === 'stress') {
      chestBeaconMat.emissiveIntensity = 2.6;
    } else {
      chestBeaconMat.emissiveIntensity = 2.0;
    }
  };

  // Model Loading API (Supports user swapping custom GLTF / GLB models)
  const loadCustomModel = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      gltfLoader.load(
        url,
        (gltf) => {
          if (loadedModel) {
            masterGroup.remove(loadedModel);
          }
          loadedModel = gltf.scene;

          // Scale and center model appropriately
          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.8 / (maxDim || 1);
          loadedModel.scale.setScalar(scale);

          box.setFromObject(loadedModel);
          const center = box.getCenter(new THREE.Vector3());
          loadedModel.position.sub(center);
          loadedModel.position.y += 1.0; // Place above platform

          // Enable shadows on children
          loadedModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = !isSoftwareGl;
              child.receiveShadow = !isSoftwareGl;
            }
          });

          // Dim procedural astronaut and display loaded model prominently
          astronautGroup.visible = false;
          masterGroup.add(loadedModel);
          resolve(true);
        },
        undefined,
        (error) => {
          console.warn('Could not load custom 3D model, maintaining procedural astronaut:', error);
          astronautGroup.visible = true;
          resolve(false);
        }
      );
    });
  };

  const resetToProcedural = () => {
    if (loadedModel) {
      masterGroup.remove(loadedModel);
      loadedModel = null;
    }
    astronautGroup.visible = true;
  };

  // Attempt initial load of default 3D model URL in background
  if (DEFAULT_3D_MODEL_URL) {
    loadCustomModel(DEFAULT_3D_MODEL_URL).catch(() => {
      // Fallback already kept visible
    });
  }

  // Animation Loop
  let frameId = 0;
  const clock = new THREE.Clock();

  function afterDraw(cb: () => void) {
    const gl = renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        frameId = window.setTimeout(poll, 5);
      } else {
        gl.deleteSync(sync);
        frameId = window.setTimeout(cb, 80);
      }
    };
    frameId = window.setTimeout(poll, 5);
  }

  const animate = () => {
    const dt = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Subtle gentle zero-gravity micro-floating sway for astronaut
    if (astronautGroup.visible) {
      astronautGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.025;
      astronautGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.06;
      
      // Rotate holographic telemetry rings
      const holoSpeed = currentStatus === 'emergency' ? 3.0 : currentStatus === 'caffeine' ? 2.0 : 1.0;
      holoRing1.rotation.z += dt * 0.5 * holoSpeed;
      holoRing2.rotation.z -= dt * 0.7 * holoSpeed;

      // Pulse heartbeat on chest beacon
      const bps = currentHeartRate / 60; // Beats per second
      pulsePhase += dt * bps * Math.PI * 2;
      const pulseWave = Math.pow((Math.sin(pulsePhase) + 1) / 2, 4); // Sharp cardiac spike
      const baseIntensity = currentStatus === 'emergency' ? 3.0 : 1.8;
      chestBeaconMat.emissiveIntensity = baseIntensity + pulseWave * 2.5;
    }

    if (loadedModel) {
      loadedModel.position.y = 1.0 + Math.sin(elapsedTime * 1.5) * 0.025;
      loadedModel.rotation.y += dt * 0.15;
    }

    // Slowly revolve cosmic dust
    starField.rotation.y += dt * 0.015;

    // Smooth camera damping towards target view
    if (isCameraTransitioning) {
      camera.position.lerp(targetCamPos, 0.06);
      controls.target.lerp(targetControlsTarget, 0.06);
      if (camera.position.distanceTo(targetCamPos) < 0.02 && controls.target.distanceTo(targetControlsTarget) < 0.02) {
        isCameraTransitioning = false;
      }
    }

    controls.update();
    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterDraw(animate);
    } else {
      frameId = requestAnimationFrame(animate);
    }
  };

  // Start loop
  if (isSoftwareGl) {
    afterDraw(animate);
  } else {
    frameId = requestAnimationFrame(animate);
  }

  const resize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  window.addEventListener('resize', resize);

  // Stop camera transition if user manually touches controls
  controls.addEventListener('start', () => {
    isCameraTransitioning = false;
  });

  const dispose = () => {
    window.removeEventListener('resize', resize);
    if (isSoftwareGl) {
      window.clearTimeout(frameId);
    } else {
      cancelAnimationFrame(frameId);
    }
    controls.dispose();
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };

  return {
    updateStatus,
    setCameraTarget,
    loadCustomModel,
    resetToProcedural,
    resize,
    dispose,
  };
}
