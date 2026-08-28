'use client';

import React, { useState, useEffect } from 'react';
import s from './ScrollToTop.module.scss';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtFooter, setIsAtFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤 시 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Footer 영역 도달 감지
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        // 버튼이 화면 하단에서 40px 떨어져 있다고 가정했을 때 (버튼 위치에 따라 숫자 조절 가능)
        // 뷰포트 높이(window.innerHeight) 안으로 Footer가 들어와 버튼과 겹치는 시점 계산
        if (footerRect.top <= window.innerHeight - 40) {
          setIsAtFooter(true);
        } else {
          setIsAtFooter(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={`${s['scroll-button']} ${isVisible ? s['show'] : ''} ${
        isAtFooter ? s['footer'] : ''
      }`}
      onClick={scrollToTop}
      aria-label="맨 위로 가기"
    >
      ↑
    </button>
  );
}
