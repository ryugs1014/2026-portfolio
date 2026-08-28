// components/3d/Scene.tsx
'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';

export default function Scene({
  currentSection = 0,
}: {
  currentSection?: number;
}) {
  return (
    // pointerEvents: 'auto' 시 3D 영역 내 다시 마우스 인터랙션이 가능(선택)
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'default' }}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 10], fov: 35 }}
    >
      <Model currentSection={currentSection} />
      <directionalLight intensity={2} position={[0, 2, 3]} />
      <Environment preset="city" resolution={256} />
    </Canvas>
  );
}
