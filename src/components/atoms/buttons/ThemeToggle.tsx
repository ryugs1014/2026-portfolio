'use client';

import { useEffect, useState } from 'react';
import s from './ThemeToggle.module.scss';

import DarkIcon from '@public/svg/layout/header/dark-theme.svg';
import LightIcon from '@public/svg/layout/header/light-theme.svg';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // 1. 커스텀 이벤트 리스너 등록: 다른 컴포넌트에서 테마를 변경했는지 감지
    const syncTheme = (e: Event) => {
      const customEvent = e as CustomEvent;
      setTheme(customEvent.detail); // 전달받은 새 테마로 내 상태도 업데이트
    };

    window.addEventListener('theme-change', syncTheme);

    return () => {
      window.removeEventListener('theme-change', syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-color-scheme', newTheme);

    // 2. 테마 변경 알림 발송: 내 상태를 바꾼 후, 다른 <ThemeToggle /> 들에게도 알림
    window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
  };

  if (!mounted) return null;

  return (
    <button className={s['theme-button']} onClick={toggleTheme}>
      {theme === 'light' ? (
        <DarkIcon width="32" height="32" viewBox="0 0 32 32" />
      ) : (
        <LightIcon width="32" height="32" viewBox="0 0 32 32" />
      )}
    </button>
  );
}
