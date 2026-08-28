// components/3d/Scene.tsx
'use client';

import React, { useEffect } from 'react';
import { Canvas, invalidate } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';

function FpsLimiter({ limit = 60 }) {
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const loop = (time: number) => {
      const delta = time - lastTime;
      const interval = 1000 / limit;

      // 지정한 프레임 간격(interval)이 지났을 때만 R3F에 렌더링을 요청(invalidate)합니다.
      if (delta >= interval) {
        invalidate();
        lastTime = time - (delta % interval); // 오차 보정
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [limit]);

  return null;
}

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
      frameloop="demand"
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 10], fov: 35 }}
    >
      <Model currentSection={currentSection} />
      <directionalLight intensity={2} position={[0, 2, 3]} />
      <ambientLight intensity={0.5} />
      <Environment preset="city" resolution={32} />
      <FpsLimiter limit={60} />
    </Canvas>
  );
}
