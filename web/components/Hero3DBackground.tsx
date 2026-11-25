'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // 1. Cena, Câmara e Renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 11;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentContainer.appendChild(renderer.domElement);

    // 2. Grupo Principal para Rotação
    const globeGroup = new THREE.Group();
    globeGroup.position.y = -0.2;
    scene.add(globeGroup);

    // Esfera Wireframe
    const sphereGeo = new THREE.SphereGeometry(3.2, 40, 40);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // Anel Exterior
    const ringGeo = new THREE.TorusGeometry(4.4, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.85,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    globeGroup.add(ring);

    // Partículas de Fundo
    const particlesGeo = new THREE.BufferGeometry();
    const count = 350;
    const posArray = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 35;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 3. Loop de Animação Forçado
    let animationId: number;
    const tick = () => {
      // Rotações contínuas em cada frame
      sphere.rotation.y += 0.0035;
      sphere.rotation.x += 0.0012;

      ring.rotation.z -= 0.0025;
      ring.rotation.y += 0.001;

      particlesMesh.rotation.y += 0.0004;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(tick);
    };

    tick();

    // 4. Redimensionamento de Janela
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // 5. Limpeza de Recursos ao Desmontar
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
      sphereGeo.dispose();
      sphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none bg-[#07030e]" />;
}