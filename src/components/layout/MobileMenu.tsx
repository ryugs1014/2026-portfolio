'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './Header.module.scss';
import Link from 'next/link';
import { NAV_LINKS } from './Header';
import ThemeToggle from '@/components/atoms/buttons/ThemeToggle';
import ContactModal from '@/components/modal/ContactModal';

import MailIcon from '@public/svg/layout/header/mail.svg';
import MenuIcon from '@public/svg/layout/header/menu.svg';
import CloseIcon from '@public/svg/layout/header/close.svg';
import RightArrow from '@public/svg/layout/header/right-menu-arrow.svg';
import RotateArrow from '@public/svg/layout/header/rotate-arrow.svg';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  // 모달이 열려있을 때 배경 스크롤 방지
  useEffect(() => {
    const lenis = (window as any).lenisInstance;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = 'unset';
      if (lenis) lenis.start();
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (lenis) lenis.start();
    };
  }, [isOpen]);

  const openContactModal = () => {
    closeMenu();
    setIsContactModalOpen(true);
  };

  const handleMenuClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();

    closeMenu();

    setTimeout(() => {
      const lenis = (window as any).lenisInstance;

      if (targetId === 'bottom') {
        if (lenis) {
          lenis.scrollTo('bottom', { duration: 1.2 });
        } else {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        }
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          if (lenis) {
            lenis.scrollTo(element, { duration: 1.2 });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }, 100);
  };

  return (
    <>
      <div className={s['mobile-menu-wrapper']}>
        <button
          className={s['menu-button']}
          onClick={openMenu}
          aria-label="Menu"
        >
          <div className={s['menu-wrap']}>
            <MenuIcon width="24" height="24" viewBox="0 0 24 24" />
          </div>
        </button>
      </div>

      {mounted &&
        createPortal(
          <>
            <div
              className={`${s['mobile-fullscreen']} ${isOpen ? s.open : ''}`}
            >
              <div className={s['mobile-header']}>
                <div className={s['mobile-actions']}>
                  <button
                    onClick={openContactModal}
                    className={s['button-wrap']}
                  >
                    <div className={s['lang-wrap']}>
                      <MailIcon width="32" height="32" viewBox="0 0 32 32" />
                    </div>
                  </button>

                  <div className={s['button-wrap']}>
                    <div className={s['theme-wrap']}>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                <button
                  className={s['close-button']}
                  onClick={closeMenu}
                  aria-label="Close"
                >
                  <div className={s['close-wrap']}>
                    <CloseIcon width="24" height="24" viewBox="0 0 24 24" />
                  </div>
                </button>
              </div>

              <nav className={s['mobile-nav']}>
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.name}
                    className={s['mobile-nav-link']}
                    onClick={(e) => handleMenuClick(e, link.targetId)}
                  >
                    <span> {link.name}</span>

                    <div className={s['svg-box']}>
                      <RightArrow width="36" height="36" viewBox="0 0 36 36" />
                    </div>
                  </button>
                ))}
              </nav>

              <ul className={s['mobile-footer-wrap']}>
                <li className={s['menu-item']}>
                  <a
                    href="mailto:ryugs1014@gmail.com"
                    className={s['menu-link']}
                  >
                    <span>ryugs1014@gmail.com</span>

                    <div className={s['svg-box']}>
                      <RotateArrow width="24" height="24" viewBox="0 0 36 36" />
                    </div>
                  </a>
                </li>

                <li className={s['menu-item']}>
                  <Link
                    href={'https://github.com/ryugs1014'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s['menu-link']}
                  >
                    <span>GitHub</span>

                    <div className={s['svg-box']}>
                      <RotateArrow width="24" height="24" viewBox="0 0 36 36" />
                    </div>
                  </Link>
                </li>

                <li className={s['copyright']}>
                  GANGSAN.YOU, ALL RIGHTS RESERVED
                </li>
              </ul>
            </div>

            <div
              className={`${s['close-bg']} ${isOpen ? s.open : ''}`}
              onClick={closeMenu}
            />
          </>,
          document.body,
        )}

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
