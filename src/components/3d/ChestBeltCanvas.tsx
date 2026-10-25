import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { VitalStatus } from '../../types/vitals';

// ============================================================================
// 🚀 SWAP YOUR 3D CHEST BELT MODEL HERE (.GLB / .GLTF)
// ============================================================================
// To replace this procedural 3D model with your custom 3D model:
// 1. Place your .glb file in the public folder (e.g. /models/astro_belt.glb)
// 2. Set CHEST_BELT_GLB_URL = '/models/astro_belt.glb' (or a public URL)
// 3. The loader below will automatically load and center your model!
export const CHEST_BELT_GLB_URL: string = ''; // Leave empty to use stylized procedural model
// ============================================================================

interface ChestBeltCanvasProps {
  status: VitalStatus;
  isEmergency: boolean;
}

export const ChestBeltCanvas: React.FC<ChestBeltCanvasProps> = ({ status, isEmergency }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<VitalStatus>(status);
  const isEmergencyRef = useRef<boolean>(isEmergency);

  statusRef.current = status;
  isEmergencyRef.current = isEmergency;

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
    scene.background = null; // transparent to blend with glassmorphism

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 3.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Studio Environment map reflection
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.5;
    controls.maxDistance = 6.0;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    rimLight.position.set(-3, -2, -3);
    scene.add(rimLight);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // =========================================================================
    // Check if external .glb is configured
    // =========================================================================
    if (CHEST_BELT_GLB_URL && CHEST_BELT_GLB_URL.trim() !== '') {
      const loader = new GLTFLoader();
      loader.load(
        CHEST_BELT_GLB_URL,
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
          console.warn('Failed to load custom belt GLB, falling back to procedural:', err);
        }
      );
    }

    // =========================================================================
    // Stylized Procedural Astro-EMS Chest Belt
    // =========================================================================
    const proceduralBelt = new THREE.Group();
    masterGroup.add(proceduralBelt);

    // 1. Belt Strap (Elliptical Torus / Flattened Ring)
    const strapCurve = new THREE.EllipseCurve(0, 0, 1.1, 0.75, 0, 2 * Math.PI, false, 0);
    const strapPoints = strapCurve.getPoints(64);
    const strapShape = new THREE.Shape();
    strapShape.moveTo(-0.02, -0.09);
    strapShape.lineTo(0.02, -0.09);
    strapShape.lineTo(0.02, 0.09);
    strapShape.lineTo(-0.02, 0.09);
    strapShape.closePath();

    // Belt Ring using Cylinder slice
    const strapGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.22, 48, 1, true);
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x1e2638,
      roughness: 0.65,
      metalness: 0.35,
      side: THREE.DoubleSide,
    });
    const strap = new THREE.Mesh(strapGeo, strapMat);
    strap.scale.set(1.0, 1.0, 0.7); // oval shape to fit chest anatomy
    proceduralBelt.add(strap);

    // Inner elastic bio-conductive comfort mesh
    const innerGeo = new THREE.CylinderGeometry(1.03, 1.03, 0.18, 48, 1, true);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.8,
      metalness: 0.1,
      wireframe: true,
      side: THREE.DoubleSide,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.scale.set(1.0, 1.0, 0.7);
    proceduralBelt.add(innerMesh);

    // 2. Central Astro-EMS Telemetry Core Module (Front of chest)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.85,
    });
    const coreGeo = new THREE.BoxGeometry(0.38, 0.26, 0.14);
    const coreModule = new THREE.Mesh(coreGeo, coreMat);
    coreModule.position.set(0, 0, 0.72);
    proceduralBelt.add(coreModule);

    // Core Face Bezel (Titanium)
    const bezelGeo = new THREE.BoxGeometry(0.34, 0.22, 0.02);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.9,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 0, 0.795);
    proceduralBelt.add(bezel);

    // Glowing Heart Pulse Status Emitter
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.8,
      roughness: 0.1,
    });
    const beaconGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.02, 24);
    beaconGeo.rotateX(Math.PI / 2);
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 0, 0.81);
    proceduralBelt.add(beacon);

    // 3. Multi-Lead ECG Sensor Pods (Left & Right ribs)
    const podGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16);
    podGeo.rotateZ(Math.PI / 2);
    const podMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.25,
    });

    const podL = new THREE.Mesh(podGeo, podMat);
    podL.position.set(-0.85, 0, 0.35);
    podL.rotation.y = 0.55;

    const podR = new THREE.Mesh(podGeo, podMat);
    podR.position.set(0.85, 0, 0.35);
    podR.rotation.y = -0.55;

    proceduralBelt.add(podL, podR);

    // 4. Magnetic Quick-Release Buckle (Back)
    const buckleGeo = new THREE.BoxGeometry(0.24, 0.2, 0.08);
    const buckleMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.8,
    });
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, 0, -0.72);
    proceduralBelt.add(buckle);

    // 5. Orbiting Biometric Holographic Ring
    const holoRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const holoRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.01, 8, 48), holoRingMat);
    holoRing.rotation.x = Math.PI / 2.3;
    proceduralBelt.add(holoRing);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Slow bobbing animation
      proceduralBelt.position.y = Math.sin(time * 1.8) * 0.04;
      holoRing.rotation.z += dt * 0.8;

      // React to status / emergency
      if (isEmergencyRef.current) {
        // Red flashing emergency
        const flash = Math.sin(time * 12) > 0;
        const color = flash ? 0xef4444 : 0x7f1d1d;
        beaconMat.color.setHex(color);
        beaconMat.emissive.setHex(color);
        beaconMat.emissiveIntensity = flash ? 4.5 : 1.0;
        holoRingMat.color.setHex(0xef4444);
        rimLight.color.setHex(0xef4444);
      } else {
        const cyanColor = 0x00f0ff;
        beaconMat.color.setHex(cyanColor);
        beaconMat.emissive.setHex(cyanColor);
        const pulse = 1.8 + Math.pow((Math.sin(time * 3.5) + 1) / 2, 4) * 2.2;
        beaconMat.emissiveIntensity = pulse;
        holoRingMat.color.setHex(cyanColor);
        rimLight.color.setHex(cyanColor);
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
