import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DottedSurfaceProps {
  theme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
}

export function DottedSurface({ theme = 'dark', className, style }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    // Limit pixel ratio for better performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // Create particles
    const positions: number[] = [];
    const colors: number[] = [];
    const targetPositions: number[] = []; // For smooth lerping

    // Create geometry for all particles
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

        positions.push(x, y, z);
        targetPositions.push(x, y, z);
        if (theme === 'dark') {
          colors.push(200, 200, 200);
        } else {
          colors.push(0, 0, 0);
        }
      }
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Create material
    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    // Create points object
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number;
    let lastTime = performance.now();

    // Animation function with delta time for smooth animation
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      const positionAttribute = geometry.attributes.position;
      const positionsArray = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;

          // Calculate target Y position with sine waves (slower, smoother)
          const targetY =
            Math.sin((ix + count) * 0.2) * 40 +
            Math.sin((iy + count) * 0.3) * 40;

          // Smooth lerp towards target (smoother movement)
          positionsArray[index + 1] += (targetY - positionsArray[index + 1]) * 0.08;

          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      
      // Slower count increment for smoother waves
      count += deltaTime * 1.5;
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles: [points],
      animationId,
      count,
    };

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        // Clean up Three.js objects
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        sceneRef.current.renderer.dispose();

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        ...style,
      }}
    />
  );
}

export default DottedSurface;
