'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const targetPosition = new THREE.Vector3(0, 0, 0);
const targetScale = new THREE.Vector3(1, 1, 1);

// 역회전 팽이 방지용: 최단 거리로 각도를 부드럽게 0으로 돌려놓는 수학 함수
const lerpAngle = (start: number, end: number, t: number) => {
  const PI2 = Math.PI * 2;
  let short = (((end - start) % PI2) + PI2) % PI2;
  if (short > Math.PI) short -= PI2;
  return start + short * t;
};

export default function Model({
  currentSection = 0,
}: {
  currentSection?: number;
}) {
  const { nodes } = useGLTF('/models/torrus_optimized.glb') as any;
  const { viewport } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const isDarkMode = useRef(false);
  const currentTransmission = useRef(0.9);

  const currentRotSpeed = useRef(new THREE.Vector3(0.02, 0, 0));
  const targetRotSpeed = new THREE.Vector3(0.02, 0, 0);

  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new Event('model-loaded'));

    const isStandardMobile = /Mobi|Android|iPhone|iPad/i.test(
      navigator.userAgent,
    );
    const isMacWithTouch =
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 2 &&
      /Macintosh/.test(navigator.userAgent);

    if (isStandardMobile || isMacWithTouch) {
      setIsLowPerformanceDevice(true);
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    isDarkMode.current = savedTheme === 'dark';

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      isDarkMode.current = customEvent.detail === 'dark';
    };

    window.addEventListener('theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const time = state.clock.elapsedTime;

    let targetTransmission = isDarkMode.current ? 0.2 : 0.9;
    targetRotSpeed.set(0.02, 0, 0);
    let targetFloatY = 0;

    switch (currentSection) {
      case 0:
      case 1:
        targetPosition.set(0, 0, 0);
        targetScale.set(5, 5, 5);
        targetRotSpeed.set(0.05, 0, 0);
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 2:
        targetPosition.set(-viewport.width / 3.5, 0, 0);
        targetScale.set(2, 2, 2);
        targetRotSpeed.set(0.01, 0.03, 0);
        targetFloatY = Math.sin(time * 2) * 0.3;
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 3:
        targetPosition.set(0, 0, 0);
        targetScale.set(4, 4, 4);
        targetRotSpeed.set(0.05, 0, 0);
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 4:
        targetPosition.set(0, 0, 0);
        targetScale.set(8, 8, 8);
        targetRotSpeed.set(0.002, 0, 0);
        targetTransmission = isDarkMode.current ? 1 : 1;
        break;
      case 5:
        targetPosition.set(-viewport.width / 3.5, -1, 0);
        targetScale.set(2, 2, 2);
        targetRotSpeed.set(0, 0.05, 0);
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 6:
        targetPosition.set(viewport.width / 4, 0, 0);
        targetScale.set(4, 4, 4);
        targetRotSpeed.set(0.05, Math.cos(time) * 0.05, 0);
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
    }

    currentRotSpeed.current.lerp(targetRotSpeed, dt * 3);

    currentTransmission.current = THREE.MathUtils.lerp(
      currentTransmission.current,
      targetTransmission,
      dt * 3,
    );

    if (torusRef.current) {
      if (currentSection === 0 || currentSection === 1) {
        torusRef.current.rotation.y = lerpAngle(
          torusRef.current.rotation.y,
          0,
          dt * 3,
        );
        torusRef.current.rotation.z = lerpAngle(
          torusRef.current.rotation.z,
          0,
          dt * 3,
        );

        torusRef.current.rotation.x += currentRotSpeed.current.x;
      } else {
        torusRef.current.rotation.x += currentRotSpeed.current.x;
        torusRef.current.rotation.y += currentRotSpeed.current.y;
        torusRef.current.rotation.z += currentRotSpeed.current.z;
      }

      torusRef.current.position.y = THREE.MathUtils.lerp(
        torusRef.current.position.y,
        targetFloatY,
        dt * 3,
      );
    }

    if (groupRef.current) {
      groupRef.current.position.lerp(targetPosition, dt * 3);
      groupRef.current.scale.lerp(targetScale, dt * 3);
    }

    if (materialRef.current) {
      materialRef.current.transmission = currentTransmission.current;
      materialRef.current._transmission = currentTransmission.current;

      if (materialRef.current.uniforms?._transmission) {
        materialRef.current.uniforms._transmission.value =
          currentTransmission.current;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={torusRef} geometry={nodes.Torus002?.geometry}>
        <MeshTransmissionMaterial
          ref={materialRef}
          thickness={0.2}
          roughness={0.05}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.1}
          backside={true}
          resolution={isLowPerformanceDevice ? 64 : 256}
          samples={4}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/torrus_optimized.glb');
