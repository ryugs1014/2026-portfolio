'use client';

import React, { useRef, useEffect } from 'react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 렌더링 시 반복 생성 불가, 컴포넌트 분리 (메모리 최적화)
const targetPosition = new THREE.Vector3(0, 0, 0);
const targetScale = new THREE.Vector3(1, 1, 1);

export default function Model({
  currentSection = 0,
}: {
  currentSection?: number;
}) {
  const { nodes } = useGLTF('/models/torrus.glb') as any;
  const { viewport } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const isDarkMode = useRef(false);
  const currentSpeed = useRef(0.02);
  const currentTransmission = useRef(0.9);

  useEffect(() => {
    window.dispatchEvent(new Event('model-loaded'));

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
    // delta 값 커지는 것 방지 (애니메이션 튐 현상 제어)
    const dt = Math.min(delta, 0.1);

    let targetSpeed = 0.02;
    let targetTransmission = isDarkMode.current ? 0.2 : 0.9;

    switch (currentSection) {
      case 0:
      case 1:
        targetPosition.set(0, 0, 0);
        targetScale.set(5, 5, 5);
        targetSpeed = 0.05;
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 2:
        targetPosition.set(-viewport.width / 3.5, 0, 0);
        targetScale.set(2, 2, 2);
        targetSpeed = 0.01;
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 3:
        targetPosition.set(0, 0, 0);
        targetScale.set(4, 4, 4);
        targetSpeed = 0.05;
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 4:
        targetPosition.set(0, 0, 0);
        targetScale.set(8, 8, 8);
        targetSpeed = 0.001;
        targetTransmission = isDarkMode.current ? 1 : 1;
        break;
      case 5:
        targetPosition.set(-viewport.width / 3.5, -1, 0);
        targetScale.set(2, 2, 2);
        targetSpeed = 0.03;
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 6:
        targetPosition.set(viewport.width / 4, 0, 0);
        targetScale.set(4, 4, 4);
        targetSpeed = 0.05;
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
    }

    // delta 대신 dt 적용
    currentSpeed.current = THREE.MathUtils.lerp(
      currentSpeed.current,
      targetSpeed,
      dt * 3,
    );

    currentTransmission.current = THREE.MathUtils.lerp(
      currentTransmission.current,
      targetTransmission,
      dt * 3,
    );

    if (torusRef.current) {
      torusRef.current.rotation.x += currentSpeed.current;
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
    <group ref={groupRef} scale={viewport.width / 3.75}>
      <mesh ref={torusRef} geometry={nodes.Torus002?.geometry}>
        <MeshTransmissionMaterial
          ref={materialRef}
          thickness={0.2}
          roughness={0}
          transmission={1}
          ior={1.3}
          chromaticAberration={0.1}
          backside={true}
          resolution={512}
          samples={4}
        />
      </mesh>
    </group>
  );
}

// 초기 렌더링 지연 방지 및 자원 관리 프리로드
useGLTF.preload('/models/torrus.glb');
