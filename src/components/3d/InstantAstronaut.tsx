import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const InstantAstronaut: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL to ensure smooth rendering on all devices
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
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = null; // transparent to blend seamlessly with glassmorphic container

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 3.8);

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

    // Studio Environment map reflection (gives authentic metallic visor reflections)
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // OrbitControls: smooth interactive rotation and zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.15, 0);
    controls.minDistance = 1.6;
    controls.maxDistance = 6.0;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;
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

    // Master Astronaut Group
    const astronautGroup = new THREE.Group();
    scene.add(astronautGroup);

    // High-Quality PBR Materials
    const suitFabricMat = new THREE.MeshStandardMaterial({
      color: 0xe2e4ee,
      roughness: 0.65,
      metalness: 0.12,
    });

    const suitJointMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.7,
    });

    // Mirrored Gold PBR Visor
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
      metalness: 0.35,
      roughness: 0.28,
    });

    const chestCoreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.6,
      roughness: 0.1,
      metalness: 0.9,
    });

    // 1. Torso (Sculpted Spacesuit Chest & Abdomen)
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.74, 24);
    const torso = new THREE.Mesh(torsoGeo, suitFabricMat);
    torso.position.y = 1.36;
    astronautGroup.add(torso);

    // Chest Life-Support Module
    const chestPackGeo = new THREE.BoxGeometry(0.36, 0.32, 0.16);
    const chestPack = new THREE.Mesh(chestPackGeo, suitJointMat);
    chestPack.position.set(0, 1.42, 0.26);
    astronautGroup.add(chestPack);

    // Glowing Chest Pulse Core
    const coreBeaconGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.03, 20);
    coreBeaconGeo.rotateX(Math.PI / 2);
    const coreBeacon = new THREE.Mesh(coreBeaconGeo, chestCoreMat);
    coreBeacon.position.set(0, 1.44, 0.35);
    astronautGroup.add(coreBeacon);

    // 2. Helmet & Visor
    const helmetGeo = new THREE.SphereGeometry(0.28, 32, 28);
    const helmet = new THREE.Mesh(helmetGeo, suitFabricMat);
    helmet.position.y = 1.96;
    astronautGroup.add(helmet);

    // Curved Gold Visor
    const visorGeo = new THREE.SphereGeometry(0.23, 32, 28, 0, Math.PI, 0, Math.PI * 0.75);
    const visor = new THREE.Mesh(visorGeo, goldVisorMat);
    visor.rotation.x = -Math.PI / 8;
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 1.97, 0.1);
    astronautGroup.add(visor);

    // Helmet Torches (Left & Right)
    const torchGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.08, 12);
    const torchMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xdbeafe,
      emissiveIntensity: 2.0,
    });
    const torchL = new THREE.Mesh(torchGeo, torchMat);
    torchL.rotation.z = Math.PI / 2;
    torchL.position.set(-0.31, 1.98, 0.08);
    const torchR = torchL.clone();
    torchR.position.set(0.31, 1.98, 0.08);
    astronautGroup.add(torchL, torchR);

    // 3. PLSS Backpack (Portable Life Support System)
    const backpackGeo = new THREE.BoxGeometry(0.56, 0.74, 0.28);
    const backpack = new THREE.Mesh(backpackGeo, plssMat);
    backpack.position.set(0, 1.42, -0.28);
    astronautGroup.add(backpack);

    // Twin High-Pressure Oxygen Cylinders
    const tankGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.62, 16);
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const tankL = new THREE.Mesh(tankGeo, tankMat);
    tankL.position.set(-0.16, 1.42, -0.42);
    const tankR = tankL.clone();
    tankR.position.set(0.16, 1.42, -0.42);
    astronautGroup.add(tankL, tankR);

    // 4. Arms & EVA Gloves
    const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.52, 16);
    const armL = new THREE.Mesh(armGeo, suitFabricMat);
    armL.position.set(-0.48, 1.36, 0.02);
    armL.rotation.z = 0.25;

    const armR = new THREE.Mesh(armGeo, suitFabricMat);
    armR.position.set(0.48, 1.36, 0.02);
    armR.rotation.z = -0.25;
    astronautGroup.add(armL, armR);

    const forearmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.44, 16);
    const forearmL = new THREE.Mesh(forearmGeo, suitFabricMat);
    forearmL.position.set(-0.56, 0.96, 0.08);
    forearmL.rotation.x = -0.3;
    forearmL.rotation.z = 0.12;

    const forearmR = new THREE.Mesh(forearmGeo, suitFabricMat);
    forearmR.position.set(0.56, 0.96, 0.08);
    forearmR.rotation.x = -0.3;
    forearmR.rotation.z = -0.12;
    astronautGroup.add(forearmL, forearmR);

    // EVA Gloves
    const gloveGeo = new THREE.BoxGeometry(0.1, 0.14, 0.12);
    const gloveL = new THREE.Mesh(gloveGeo, suitJointMat);
    gloveL.position.set(-0.62, 0.72, 0.2);
    const gloveR = new THREE.Mesh(gloveGeo, suitJointMat);
    gloveR.position.set(0.62, 0.72, 0.2);
    astronautGroup.add(gloveL, gloveR);

    // 5. Waist, Legs & Boots
    const waistGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.22, 20);
    const waist = new THREE.Mesh(waistGeo, suitJointMat);
    waist.position.y = 0.94;
    astronautGroup.add(waist);

    const legGeo = new THREE.CylinderGeometry(0.115, 0.1, 0.64, 16);
    const legL = new THREE.Mesh(legGeo, suitFabricMat);
    legL.position.set(-0.2, 0.54, 0.02);
    const legR = new THREE.Mesh(legGeo, suitFabricMat);
    legR.position.set(0.2, 0.54, 0.02);
    astronautGroup.add(legL, legR);

    // Heavy EVA Lunar Boots
    const bootGeo = new THREE.BoxGeometry(0.18, 0.18, 0.32);
    const bootL = new THREE.Mesh(bootGeo, suitJointMat);
    bootL.position.set(-0.2, 0.12, 0.06);
    const bootR = new THREE.Mesh(bootGeo, suitJointMat);
    bootR.position.set(0.2, 0.12, 0.06);
    astronautGroup.add(bootL, bootR);

    // 6. Holographic Biometric Telemetry Rings
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const holoRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.007, 12, 48), ring1Mat);
    holoRing1.rotation.x = Math.PI / 2.2;
    holoRing1.position.y = 1.4;
    astronautGroup.add(holoRing1);

    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const holoRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.005, 12, 48), ring2Mat);
    holoRing2.rotation.x = Math.PI / 3.2;
    holoRing2.position.y = 1.4;
    astronautGroup.add(holoRing2);

    // Animation Loop (Zero-G Floating Motion)
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Zero-Gravity floating breathing sway
      astronautGroup.position.y = Math.sin(time * 1.5) * 0.04;
      astronautGroup.rotation.y = Math.sin(time * 0.45) * 0.06;

      holoRing1.rotation.z += dt * 0.6;
      holoRing2.rotation.z -= dt * 0.8;

      // Pulse chest beacon
      const pulse = 1.8 + Math.pow((Math.sin(time * 3.5) + 1) / 2, 4) * 2.5;
      chestCoreMat.emissiveIntensity = pulse;

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = container.clientWidth || 400;
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
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
    />
  );
};
