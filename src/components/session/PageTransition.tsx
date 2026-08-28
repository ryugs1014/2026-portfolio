// components/PageTransition.tsx
'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import FrozenRouter from '@/components/session/FrozenRouter';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBackRef = useRef(false);

  // 현재 애니메이션이 실행 중인 상태를 나타내는 플래그
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('historyIdx')) {
      sessionStorage.setItem('historyIdx', '0');
    }

    if (window.history.state && window.history.state.idx === undefined) {
      window.history.replaceState(
        {
          ...window.history.state,
          idx: Number(sessionStorage.getItem('historyIdx')),
        },
        '',
      );
    }

    const handlePopState = (e: PopStateEvent) => {
      const currentIdx = Number(sessionStorage.getItem('historyIdx') || '0');
      const newIdx = e.state?.idx;

      if (newIdx !== undefined) {
        if (newIdx < currentIdx) {
          isBackRef.current = true;
        } else if (newIdx > currentIdx) {
          isBackRef.current = false;
        }
        sessionStorage.setItem('historyIdx', String(newIdx));
      }
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = function (
      state: any,
      unused: string,
      url?: string | URL | null,
    ) {
      const newIdx = Number(sessionStorage.getItem('historyIdx') || '0') + 1;
      const newState = { ...(state || {}), idx: newIdx };

      sessionStorage.setItem('historyIdx', String(newIdx));
      isBackRef.current = false;

      return originalPushState.call(this, newState, unused, url);
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function (
      state: any,
      unused: string,
      url?: string | URL | null,
    ) {
      const currentIdx = Number(sessionStorage.getItem('historyIdx') || '0');
      const newState = { ...(state || {}), idx: currentIdx };

      return originalReplaceState.call(this, newState, unused, url);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    isBackRef.current = false;
  }, [pathname]);

  const variants = {
    initial: (isBack: boolean) => ({
      x: isBack ? '-100%' : '100%',
    }),
    animate: {
      x: 0,
    },
    exit: (isBack: boolean) => ({
      x: isBack ? '100%' : '-100%',
    }),
  };

  return (
    <AnimatePresence custom={isBackRef.current} mode="popLayout">
      <motion.div
        key={pathname}
        custom={isBackRef.current}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: isAnimating ? 0 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="page-wrapper"
        onAnimationStart={() => {
          setIsAnimating(true);
          document.body.style.pointerEvents = 'none';
        }}
        onAnimationComplete={() => {
          setIsAnimating(false);
          document.body.style.pointerEvents = 'auto';
        }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
