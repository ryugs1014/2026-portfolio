'use client';

import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import s from './FadeInMain.module.scss';

interface FadeInPortfolioProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
}

export default function FadeInMain({
  children,
  delay = 0,
  threshold = 0,
}: FadeInPortfolioProps) {
  // inView 상태를 직접 쓰지 않고, 별도의 상태로 관리합니다.
  const [isVisible, setIsVisible] = useState(false);

  const { ref } = useInView({
    threshold: threshold,
    onChange: (inView, entry) => {
      if (inView) {
        // 1 & 4. 스크롤을 내려서 화면에 요소가 나타나면 무조건 실행
        setIsVisible(true);
      } else {
        // 화면에서 요소가 벗어났을 때 방향 체크
        // entry.boundingClientRect.top이 양수(> 0)라는 것은 요소가 화면 아래에 있다는 뜻입니다.
        if (entry.boundingClientRect.top > 0) {
          // 3. 스크롤을 올려서 요소가 화면 아래로 사라졌을 때만 초기화(숨김) 처리
          setIsVisible(false);
        }
        // 2. 스크롤을 더 내려서 요소가 화면 위로 지나갔을 때 (top < 0)는
        // setIsVisible(false)를 호출하지 않으므로 상태가 그대로 유지(고정)됩니다.
      }
    },
  });

  return (
    <div
      ref={ref}
      className={`${s['fade-wrapper']} ${isVisible ? s['is-visible'] : ''}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
