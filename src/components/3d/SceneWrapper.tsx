// components/3d/SceneWrapper.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

// 기존 홈 화면 에러 방지용 currentSection을 선택(optional) 설정
export default function SceneWrapper({
  currentSection = 0,
}: {
  currentSection?: number;
}) {
  return <Scene currentSection={currentSection} />;
}
