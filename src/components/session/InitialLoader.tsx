'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useProgress } from '@react-three/drei'; // 💡 1. 3D 실제 진행률을 가져오는 훅 추가
import s from './InitialLoader.module.scss';

export default function InitialLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(pathname === '/');

  const [displayProgress, setDisplayProgress] = useState(0);
  const hasRunRef = useRef(false);

  //  R3F에서 제공하는 다운로드 진행률 (0 ~ 100)
  const { progress: realProgress } = useProgress();

  // 스크롤 방지 로직
  useEffect(() => {
    const preventScroll = (e: Event) => e.preventDefault();

    if (isLoading) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('wheel', preventScroll, { passive: false });
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
    };
  }, [isLoading]);

  // 진행률(realProgress) 로직
  useEffect(() => {
    if (hasRunRef.current || pathname !== '/') {
      setIsLoading(false);
      hasRunRef.current = true;
      return;
    }

    let animationFrameId: number;

    const updateProgress = () => {
      setDisplayProgress((prev) => {
        // 실제 다운로드율(realProgress)과 현재 보여지는 숫자(prev)의 차이를 좁힘
        // (모델이 이미 캐싱되어 0%에서 100%로 순식간에 점프하더라도, 숫자는 스르륵 올라가게 보정)
        const step = (realProgress - prev) * 0.1;
        const next = prev + step;

        // 99.5% 이상 도달 시 100으로 고정
        if (realProgress === 100 && next >= 99.5) {
          return 100;
        }

        return next;
      });

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [realProgress, pathname]);

  // 100%에 도달 로딩창 닫기
  useEffect(() => {
    if (Math.round(displayProgress) >= 100 && !hasRunRef.current) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        hasRunRef.current = true;
      }, 500); // 100을 0.5초 동안 보여주고 페이드아웃
      return () => clearTimeout(timer);
    }
  }, [displayProgress]);

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999999,
            backgroundColor: 'var(--color-bg-normal)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className={s['number']}>{Math.round(displayProgress)}</div>
        </motion.div>
      ) : (
        (null as any)
      )}
    </AnimatePresence>
  );
}
