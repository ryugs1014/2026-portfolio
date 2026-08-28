'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import s from './FadeInPortfolio.module.scss';

interface FadeInPortfolioProps {
  children: React.ReactNode;
}

export default function FadeInPortfolio({ children }: FadeInPortfolioProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 20%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.2, 1]);
  const y = useTransform(smoothProgress, [0, 1], [500, 0]);

  return (
    <motion.div
      ref={ref}
      className={s['fade-wrapper']}

      // 모바일 전용 속성 (데스크탑일 땐 undefined로 처리되어 무시됨)
      initial={isMobile ? { opacity: 0, y: 300 } : undefined}
      whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
      viewport={isMobile ? { once: true, margin: '-10%' } : undefined}
      transition={
        isMobile ? { duration: 0.8, ease: [0.25, 1, 0.5, 1] } : undefined
      }
      style={{
        position: 'relative', // 이전의 경고 제거용
        willChange: 'opacity, transform', // GPU 하드웨어 가속 켜기
        ...(!isMobile ? { opacity, y } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}
