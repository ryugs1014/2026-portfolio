'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageExitEffect() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  // 1. 페이지 이동 완료 시 덮개 초기화
  useEffect(() => {
    setIsExiting(false);
  }, [pathname]);

  // 2. 커스텀 함수(뒤로가기 등)에서 수동으로 애니메이션을 켤 수 있도록 이벤트 수신
  useEffect(() => {
    const handleExit = () => setIsExiting(true);
    window.addEventListener('trigger-page-exit', handleExit);
    return () => window.removeEventListener('trigger-page-exit', handleExit);
  }, []);

  // 3. 글로벌 <Link> 클릭 가로채기
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest('a');
      if (!target) return;

      // 만약 'data-manual-routing' 속성이 있는 링크라면,
      // 이 전역 함수가 가로채지 않고 무시 (커스텀 함수가 처리하도록 둠)
      if (target.hasAttribute('data-manual-routing')) return;

      const href = target.getAttribute('href');

      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        target.target === '_blank'
      ) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const targetUrl = new URL(href, window.location.origin);
      if (targetUrl.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();

      sessionStorage.removeItem('mainScrollY');
      sessionStorage.removeItem('worksScrollY');

      setIsExiting(true);
      setTimeout(() => {
        router.push(href);
      }, 600);
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () =>
      document.removeEventListener('click', handleGlobalClick, {
        capture: true,
      });
  }, [router]);

  return (
    <AnimatePresence>
      {isExiting ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-bg-normal)',
            zIndex: 999997,
            pointerEvents: 'auto',
          }}
        />
      ) : (
        (null as any)
      )}
    </AnimatePresence>
  );
}
