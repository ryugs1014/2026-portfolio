'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import s from './FadeIn.module.scss';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  threshold = 0.1,
}: FadeInProps) {
  const { ref, inView } = useInView({
    triggerOnce: true, // true면 한 번만 실행, false면 스크롤 올렸다 내릴 때마다 실행
    threshold: threshold,
  });

  return (
    <div
      ref={ref}
      className={`${s['fade-wrapper']} ${inView ? s['is-visible'] : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
