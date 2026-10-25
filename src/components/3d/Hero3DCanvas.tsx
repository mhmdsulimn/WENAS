import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ============================================================================
// 🚀 SWAP YOUR 3D ASTRONAUT MODEL HERE (.GLB / .GLTF)
// ============================================================================
// To replace this procedural 3D astronaut with your custom 3D model:
// 1. Place your .glb file in the public folder (e.g. /models/astronaut.glb)
// 2. Set HERO_ASTRONAUT_GLB_URL = '/models/astronaut.glb' (or a public URL)
// 3. The loader will automatically load, scale, and center your model!
export const HERO_ASTRONAUT_GLB_URL: string = ''; // Leave empty to use stylized procedural astronaut
// ============================================================================

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

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

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = null; // transparent to merge with hero glassmorphism

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 3.8);

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

    // Studio Environment map reflection (PBR standards)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // OrbitControls: allow full rotation, pitch, and zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.15, 0);
    controls.minDistance = 1.6;
    controls.maxDistance = 6.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = true;

    // Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 1.2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.4);
    rimLight.position.set(-4, 2, -4);
    scene.add(rimLight);

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // External GLTF Loader if user configures custom .glb
    let customModel: THREE.Object3D | null = null;
    if (HERO_ASTRONAUT_GLB_URL && HERO_ASTRONAUT_GLB_URL.trim() !== '') {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        HERO_ASTRONAUT_GLB_URL,
        (gltf) => {
          customModel = gltf.scene;
          const box = new THREE.Box3().setFromObject(customModel);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          customModel.scale.setScalar(2.0 / (maxDim || 1));
          box.setFromObject(customModel);
          const center = box.getCenter(new THREE.Vector3());
          customModel.position.sub(center);
          customModel.position.y += 1.0;
          masterGroup.add(customModel);
          proceduralAstronaut.visible = false;
        },
        undefined,
        (err) => {
          console.warn('Could not load custom astronaut GLB, using procedural twin:', err);
        }
      );
    }

    // =========================================================================
    // High-Fidelity 3D Astronaut Digital Twin (Procedural Composite Model)
    // =========================================================================
    const proceduralAstronaut = new THREE.Group();
    masterGroup.add(proceduralAstronaut);

    // PBR Materials
    const suitFabricMat = new THREE.MeshStandardMaterial({
      color: 0xdedee8,
      roughness: 0.7,
      metalness: 0.15,
    });

    const suitJointMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.45,
      metalness: 0.75,
    });

    const goldVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      metalness: 0.98,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
    });

    const plssMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.4,
      roughness: 0.25,
    });

    const beaconEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.8,
      roughness: 0.1,
      metalness: 0.9,
    });

    // 1. Torso (Main pressurized spacesuit body)
    const torsoGeo = new THREE.CylinderGeometry(0.36, 0.3, 0.72, 20);
    const torso = new THREE.Mesh(torsoGeo, suitFabricMat);
    torso.position.y = 1.35;
    proceduralAstronaut.add(torso);

    // Chest Life-Support Module & Biometric Core
    const chestPackGeo = new THREE.BoxGeometry(0.34, 0.3, 0.16);
    const chestPack = new THREE.Mesh(chestPackGeo, suitJointMat);
    chestPack.position.set(0, 1.4, 0.25);
    proceduralAstronaut.add(chestPack);

    // Glowing Chest WENAS Biometric Pulse Beacon
    const beaconGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.03, 20);
    beaconGeo.rotateX(Math.PI / 2);
    const beacon = new THREE.Mesh(beaconGeo, beaconEmissiveMat);
    beacon.position.set(0, 1.42, 0.34);
    proceduralAstronaut.add(beacon);

    // 2. Helmet & Gold Visor
    const helmetGeo = new THREE.SphereGeometry(0.27, 28, 24);
    const helmet = new THREE.Mesh(helmetGeo, suitFabricMat);
    helmet.position.y = 1.94;
    proceduralAstronaut.add(helmet);

    // Reflective Gold Visor
    const visorGeo = new THREE.SphereGeometry(0.22, 28, 24, 0, Math.PI, 0, Math.PI * 0.75);
    const visor = new THREE.Mesh(visorGeo, goldVisorMat);
    visor.rotation.x = -Math.PI / 8;
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 1.95, 0.09);
    proceduralAstronaut.add(visor);

    // Helmet Side Torches (Left & Right)
    const torchGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.07, 12);
    const torchMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xdbeafe,
      emissiveIntensity: 2.0,
    });
    const torchL = new THREE.Mesh(torchGeo, torchMat);
    torchL.rotation.z = Math.PI / 2;
    torchL.position.set(-0.3, 1.96, 0.08);

    const torchR = torchL.clone();
    torchR.position.set(0.3, 1.96, 0.08);
    proceduralAstronaut.add(torchL, torchR);

    // 3. PLSS Backpack (Portable Life Support System)
    const backpackGeo = new THREE.BoxGeometry(0.54, 0.7, 0.28);
    const backpack = new THREE.Mesh(backpackGeo, plssMat);
    backpack.position.set(0, 1.4, -0.28);
    proceduralAstronaut.add(backpack);

    // Twin Oxygen Tanks
    const tankGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.58, 16);
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.3,
    });
    const tankL = new THREE.Mesh(tankGeo, tankMat);
    tankL.position.set(-0.15, 1.4, -0.42);
    const tankR = tankL.clone();
    tankR.position.set(0.15, 1.4, -0.42);
    proceduralAstronaut.add(tankL, tankR);

    // 4. Arms & EVA Pressurized Gloves
    const armGeo = new THREE.CylinderGeometry(0.095, 0.085, 0.5, 16);
    const armL = new THREE.Mesh(armGeo, suitFabricMat);
    armL.position.set(-0.45, 1.35, 0.02);
    armL.rotation.z = 0.28;

    const armR = new THREE.Mesh(armGeo, suitFabricMat);
    armR.position.set(0.45, 1.35, 0.02);
    armR.rotation.z = -0.28;
    proceduralAstronaut.add(armL, armR);

    const forearmGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.42, 16);
    const forearmL = new THREE.Mesh(forearmGeo, suitFabricMat);
    forearmL.position.set(-0.54, 0.96, 0.08);
    forearmL.rotation.x = -0.3;
    forearmL.rotation.z = 0.12;

    const forearmR = new THREE.Mesh(forearmGeo, suitFabricMat);
    forearmR.position.set(0.54, 0.96, 0.08);
    forearmR.rotation.x = -0.3;
    forearmR.rotation.z = -0.12;
    proceduralAstronaut.add(forearmL, forearmR);

    // EVA Gloves
    const gloveGeo = new THREE.BoxGeometry(0.1, 0.14, 0.12);
    const gloveL = new THREE.Mesh(gloveGeo, suitJointMat);
    gloveL.position.set(-0.6, 0.72, 0.2);
    const gloveR = new THREE.Mesh(gloveGeo, suitJointMat);
    gloveR.position.set(0.6, 0.72, 0.2);
    proceduralAstronaut.add(gloveL, gloveR);

    // 5. Waist & Legs
    const waistGeo = new THREE.CylinderGeometry(0.3, 0.27, 0.2, 20);
    const waist = new THREE.Mesh(waistGeo, suitJointMat);
    waist.position.y = 0.94;
    proceduralAstronaut.add(waist);

    const legGeo = new THREE.CylinderGeometry(0.11, 0.095, 0.62, 16);
    const legL = new THREE.Mesh(legGeo, suitFabricMat);
    legL.position.set(-0.19, 0.55, 0.02);
    const legR = new THREE.Mesh(legGeo, suitFabricMat);
    legR.position.set(0.19, 0.55, 0.02);
    proceduralAstronaut.add(legL, legR);

    // Magnetic EVA Boots
    const bootGeo = new THREE.BoxGeometry(0.17, 0.16, 0.3);
    const bootL = new THREE.Mesh(bootGeo, suitJointMat);
    bootL.position.set(-0.19, 0.14, 0.06);
    const bootR = new THREE.Mesh(bootGeo, suitJointMat);
    bootR.position.set(0.19, 0.14, 0.06);
    proceduralAstronaut.add(bootL, bootR);

    // 6. Holographic Biometric Telemetry Rings
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const holoRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.007, 12, 48), ring1Mat);
    holoRing1.rotation.x = Math.PI / 2.2;
    holoRing1.position.y = 1.4;
    proceduralAstronaut.add(holoRing1);

    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const holoRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.005, 12, 48), ring2Mat);
    holoRing2.rotation.x = Math.PI / 3.2;
    holoRing2.position.y = 1.4;
    proceduralAstronaut.add(holoRing2);

    // 7. Ambient Cosmic Particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 2.5 + Math.random() * 6.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Zero-Gravity floating breathing animation
      if (proceduralAstronaut.visible) {
        proceduralAstronaut.position.y = Math.sin(time * 1.5) * 0.04;
        proceduralAstronaut.rotation.y = Math.sin(time * 0.5) * 0.08;

        holoRing1.rotation.z += dt * 0.6;
        holoRing2.rotation.z -= dt * 0.8;

        // Pulse cardiac beacon
        const pulse = 1.8 + Math.pow((Math.sin(time * 3.5) + 1) / 2, 4) * 2.5;
        beaconEmissiveMat.emissiveIntensity = pulse;
      }

      if (customModel) {
        customModel.position.y = 1.0 + Math.sin(time * 1.5) * 0.04;
        customModel.rotation.y += dt * 0.15;
      }

      stars.rotation.y += dt * 0.02;

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 500;
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
    <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />
  );
};
