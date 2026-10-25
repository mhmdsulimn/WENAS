import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { VitalStatus } from '../../types/vitals';

// ============================================================================
// 🚀 SWAP YOUR 3D SMART BRACELET MODEL HERE (.GLB / .GLTF)
// ============================================================================
// To replace this procedural 3D model with your custom 3D model:
// 1. Place your .glb file in the public folder (e.g. /models/smart_bracelet.glb)
// 2. Set BRACELET_GLB_URL = '/models/smart_bracelet.glb' (or a public URL)
// 3. The loader below will automatically load and center your model!
export const BRACELET_GLB_URL: string = ''; // Leave empty to use stylized procedural model
// ============================================================================

interface SmartBraceletCanvasProps {
  status: VitalStatus;
  isCaffeine: boolean;
  isStress: boolean;
}

export const SmartBraceletCanvas: React.FC<SmartBraceletCanvasProps> = ({
  status,
  isCaffeine,
  isStress,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<VitalStatus>(status);
  const isCaffeineRef = useRef<boolean>(isCaffeine);
  const isStressRef = useRef<boolean>(isStress);

  statusRef.current = status;
  isCaffeineRef.current = isCaffeine;
  isStressRef.current = isStress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 3.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio Environment map reflection
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.4;
    controls.maxDistance = 5.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Check if external GLB is provided
    if (BRACELET_GLB_URL && BRACELET_GLB_URL.trim() !== '') {
      const loader = new GLTFLoader();
      loader.load(
        BRACELET_GLB_URL,
        (gltf) => {
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          model.scale.setScalar(1.8 / (maxDim || 1));
          box.setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          masterGroup.add(model);
        },
        undefined,
        (err) => {
          console.warn('Failed to load custom bracelet GLB, using procedural:', err);
        }
      );
    }

    // =========================================================================
    // Stylized Procedural Smart Bracelet
    // =========================================================================
    const proceduralBracelet = new THREE.Group();
    masterGroup.add(proceduralBracelet);

    // 1. Wristband Torus (Curved Ergonomic Strap)
    const bandGeo = new THREE.TorusGeometry(0.85, 0.16, 24, 64);
    const bandMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.5,
      metalness: 0.4,
    });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.rotation.x = Math.PI / 2;
    band.scale.set(1.0, 0.72, 1.0); // oval wrist profile
    proceduralBracelet.add(band);

    // 2. Main Curved OLED Biometric Screen Housing
    const screenGeo = new THREE.BoxGeometry(0.55, 0.18, 0.32);
    const screenCaseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9,
    });
    const screenCase = new THREE.Mesh(screenGeo, screenCaseMat);
    screenCase.position.set(0, 0.65, 0);
    proceduralBracelet.add(screenCase);

    // OLED Curved Display Face
    const displayGeo = new THREE.BoxGeometry(0.48, 0.04, 0.26);
    const displayMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.1,
      metalness: 0.95,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
    });
    const display = new THREE.Mesh(displayGeo, displayMat);
    display.position.set(0, 0.75, 0);
    proceduralBracelet.add(display);

    // Glowing Display Pulse Bar
    const pulseBarGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.38, 16);
    pulseBarGeo.rotateZ(Math.PI / 2);
    const pulseBarMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.0,
    });
    const pulseBar = new THREE.Mesh(pulseBarGeo, pulseBarMat);
    pulseBar.position.set(0, 0.775, 0);
    proceduralBracelet.add(pulseBar);

    // 3. Sweat Microfluidic Sensor Intake Array (Bottom/Inner wrist)
    const sensorGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 16);
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.5,
      roughness: 0.3,
      metalness: 0.8,
    });
    const sensorL = new THREE.Mesh(sensorGeo, sensorMat);
    sensorL.position.set(-0.25, 0.64, 0.18);
    sensorL.rotation.x = Math.PI / 4;

    const sensorR = new THREE.Mesh(sensorGeo, sensorMat);
    sensorR.position.set(0.25, 0.64, 0.18);
    sensorR.rotation.x = Math.PI / 4;

    proceduralBracelet.add(sensorL, sensorR);

    // 4. Aromatherapy Mint Micro-Diffuser Nozzle (Side of case)
    const nozzleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.08, 12);
    nozzleGeo.rotateZ(Math.PI / 2);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.2,
      metalness: 0.9,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.set(0.28, 0.65, 0);
    proceduralBracelet.add(nozzle);

    // 5. Orbiting Biochemical Telemetry Ring
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const bioRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.008, 8, 48), ringMat);
    bioRing.rotation.x = Math.PI / 3;
    proceduralBracelet.add(bioRing);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle floating sway
      proceduralBracelet.position.y = Math.sin(time * 1.6) * 0.04;
      bioRing.rotation.z += dt * 0.9;

      // Status-reactive colors
      if (isStressRef.current) {
        // Yellow glow for stress
        const yellow = 0xf59e0b;
        pulseBarMat.color.setHex(yellow);
        pulseBarMat.emissive.setHex(yellow);
        displayMat.emissive.setHex(yellow);
        ringMat.color.setHex(yellow);
        rimLight.color.setHex(yellow);
        nozzleMat.emissiveIntensity = 3.5; // active mint diffuser
      } else if (isCaffeineRef.current) {
        // High-energy cyan/blue for caffeine
        const cyan = 0x00e1ff;
        pulseBarMat.color.setHex(cyan);
        pulseBarMat.emissive.setHex(cyan);
        displayMat.emissive.setHex(cyan);
        ringMat.color.setHex(cyan);
        rimLight.color.setHex(cyan);
        nozzleMat.emissiveIntensity = 1.0;
      } else {
        // Calm cyan
        const normalCyan = 0x00f0ff;
        pulseBarMat.color.setHex(normalCyan);
        pulseBarMat.emissive.setHex(normalCyan);
        displayMat.emissive.setHex(normalCyan);
        ringMat.color.setHex(normalCyan);
        rimLight.color.setHex(normalCyan);
        nozzleMat.emissiveIntensity = 0.8;
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden bg-transparent border-0 shadow-none select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
