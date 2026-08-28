'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import s from './Header.module.scss';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import MobileMenu from './MobileMenu';

export const NAV_LINKS = [
  { name: 'WORKS', targetId: 'section-works' },
  { name: 'STACKS', targetId: 'section-stacks' },
  { name: 'ABOUT', targetId: 'section-about' },
  { name: 'CONTACT', targetId: 'bottom' }, // 예외
];

export default function Header() {
  const pathname = usePathname();
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isActive, setIsActive] = useState(false);

  const lastScrollY = useRef(0);
  const isReady = useRef(false);

  useEffect(() => {
    const handleHeaderActive = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsActive(customEvent.detail);
    };

    window.addEventListener('header-active', handleHeaderActive);

    return () => {
      window.removeEventListener('header-active', handleHeaderActive);
    };
  }, []);

  useEffect(() => {
    const handleHeaderActive = (e: Event) => {
      if (pathname !== '/') return;

      const customEvent = e as CustomEvent;
      setIsActive(customEvent.detail);
    };

    window.addEventListener('header-active', handleHeaderActive);

    return () => {
      window.removeEventListener('header-active', handleHeaderActive);
    };
  }, [pathname]); // 의존성 배열 pathname 추가

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const timer = setTimeout(() => {
      isReady.current = true;
    }, 0);

    const handleScroll = () => {
      // 모달 열릴시 Header 로직 동결
      if (
        document.body.style.overflow === 'hidden' ||
        document.body.style.position === 'fixed'
      ) {
        return;
      }

      if (!isReady.current) {
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;

      // 모달 닫힐시 발생하는 튕김(오차) 무시
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) {
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const clearScrollMemory = () => {
    sessionStorage.removeItem('mainScrollY');
    sessionStorage.removeItem('worksScrollY');
  };

  return (
    <header
      className={`${s['header']} ${scrollDirection === 'down' ? s['down'] : ''} ${isActive ? s['active'] : ''}`}
    >
      <div className={s['header-wrap']}>
        <Container className={s['header-container']}>
          <div className={s['logo-wrap']}>
            <Link
              href="/"
              className={s['logo-link']}
              onClick={clearScrollMemory}
            >
              <div className={s['logo']}>
                <div className={s['logo-main']}>GANGSAN.YOU</div>
                <span className={s['logo-sub']}>FE DEV</span>
              </div>
            </Link>
          </div>

          <div className={s['function-wrap']}>
            <MobileMenu />
          </div>
        </Container>
      </div>
    </header>
  );
}
