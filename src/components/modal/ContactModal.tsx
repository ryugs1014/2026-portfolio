'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import s from './ContactModal.module.scss';
import Section_Form from '@/components/pages/contact/Section_Form';
import FadeIn from '@/components/atoms/animation/FadeIn';
import CloseIcon from '@public/svg/layout/header/close.svg';
import Container from '@/components/layout/Container';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 스크롤 차단
  useEffect(() => {
    if (!isOpen) return;

    const lenis = (window as any).lenisInstance;
    const currentScrollY = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.left = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    if (lenis) lenis.stop();

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = 'unset';

      window.scrollTo(0, currentScrollY);
      if (lenis) lenis.start();
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className={s['overlay']} onClick={onClose}>
      <div
        className={s['modal-container']}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        <div className={s['close-button-wrap']}>
          <button className={s['closeBtn']} onClick={onClose}>
            <div className={s['close-wrap']}>
              <CloseIcon width="100%" height="100%" viewBox="0 0 24 24" />
            </div>
          </button>
        </div>

        <div className={s['modal-content-wrap']}>
          <FadeIn>
            <Container size={'small'}>
              <div className={s['title-section']}>
                <div className={s['text-section']}>
                  <div className={s['section-title']}>문의하기</div>
                  <div className={s['section-text']}>
                    함께 작업하기를 희망 하시거나,
                    <br />
                    다른 문의가 있으신가요?
                  </div>
                </div>
              </div>
            </Container>
          </FadeIn>

          <div className={s['form-wrap']}>
            <Section_Form />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
