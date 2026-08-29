'use client';

import React, { useRef, useEffect, useState } from 'react';
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
  const { nodes } = useGLTF('/models/torrus_optimized.glb') as any;
  const { viewport } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  const isDarkMode = useRef(false);
  const currentTransmission = useRef(0.9);

  // 💡 1. 3D(X, Y, Z) 회전 속도를 개별적으로 다루기 위한 상태
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

    // 💡 2. 시간에 따른 꿀렁임/부유 효과를 만들기 위한 시간 값
    const time = state.clock.elapsedTime;

    let targetTransmission = isDarkMode.current ? 0.2 : 0.9;

    // 기본 회전 속도 (X축)
    targetRotSpeed.set(0.02, 0, 0);
    // 기본 부유(Floating) 높이 설정
    let targetFloatY = 0;

    switch (currentSection) {
      case 0:
      case 1:
        targetPosition.set(0, 0, 0);
        targetScale.set(5, 5, 5);
        targetRotSpeed.set(0.05, 0, 0); // 기존: 약간 빠른 X축 회전
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 2:
        targetPosition.set(-viewport.width / 3.5, 0, 0);
        targetScale.set(2, 2, 2);
        // 💡 [새로운 움직임] X, Y축 동시 회전 및 위아래로 부유 (Floating)
        targetRotSpeed.set(0.01, 0.03, 0);
        targetFloatY = Math.sin(time * 2) * 0.3;
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 3:
        targetPosition.set(0, 0, 0);
        targetScale.set(4, 4, 4);
        // 💡 [새로운 움직임] 대각선(X, Y 반대 방향)으로 빠르게 회전
        targetRotSpeed.set(0.05, 0, 0);
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 4:
        targetPosition.set(0, 0, 0);
        targetScale.set(8, 8, 8);
        // 💡 [새로운 움직임] 거대한 상태에서 세 축으로 아주 미세하게 회전
        targetRotSpeed.set(0.002, 0, 0);
        targetTransmission = isDarkMode.current ? 1 : 1;
        break;
      case 5:
        targetPosition.set(-viewport.width / 3.5, -1, 0);
        targetScale.set(2, 2, 2);
        // 💡 [새로운 움직임] 시간에 따라 Z축으로 꿀렁거리는 회전
        // targetRotSpeed.set(0.03, 0, Math.sin(time) * 0.02);
        targetRotSpeed.set(0, 0.05, 0);
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
      case 6:
        targetPosition.set(viewport.width / 4, 0, 0);
        targetScale.set(4, 4, 4);
        // 💡 [새로운 움직임] 시계추처럼 Y축으로 왔다갔다 스윙
        targetRotSpeed.set(0.05, Math.cos(time) * 0.05, 0);
        targetTransmission = isDarkMode.current ? 1 : 0.9;
        break;
    }

    // 회전 속도 부드러운 전환 (Lerp)
    currentRotSpeed.current.lerp(targetRotSpeed, dt * 3);

    currentTransmission.current = THREE.MathUtils.lerp(
      currentTransmission.current,
      targetTransmission,
      dt * 3,
    );

    if (torusRef.current) {
      // 💡 3. 계산된 3축 속도를 실제 메쉬에 적용
      torusRef.current.rotation.x += currentRotSpeed.current.x;
      torusRef.current.rotation.y += currentRotSpeed.current.y;
      torusRef.current.rotation.z += currentRotSpeed.current.z;

      // 💡 4. 부유(Floating) 효과 부드러운 적용 (토러스 메쉬의 로컬 위치를 제어)
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
