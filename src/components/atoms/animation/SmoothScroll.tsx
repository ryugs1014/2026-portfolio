'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const lenis = new Lenis({
      duration: 0.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
    });

    (window as any).lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    const wrapper = document.querySelector('.app-wrapper') || document.body;
    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
      lenis.destroy();
      (window as any).lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    const lenis = (window as any).lenisInstance as Lenis | undefined;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
