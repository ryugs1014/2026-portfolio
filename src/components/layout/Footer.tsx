'use client';

// components/layout/Footer.tsx
import React from 'react';
import s from './Footer.module.scss';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={`${s['footer']}`}>
      <div className={s['footer-container']}>
        <div className={s['logo-wrap']}>
          <Link href="/" className={s['logo-link']}>
            <div className={s['logo']}>
              <div className={s['logo-main']}>GANGSAN.YOU</div>
              <span className={s['logo-sub']}>FE DEV</span>
            </div>
          </Link>
        </div>

        <ul className={s['footer-wrap']}>
          <li className={s['menu-item']}>
            <a href="mailto:ryugs1014@gmail.com" className={s['menu-link']}>
              ryugs1014@gmail.com ↗
            </a>
          </li>

          <li className={s['menu-item']}>
            <Link
              href={'https://github.com/ryugs1014'}
              target="_blank"
              rel="noopener noreferrer"
              className={s['menu-link']}
            >
              GitHub ↗
            </Link>
          </li>

          <li className={s['copyright']}>GANGSAN.YOU, ALL RIGHTS RESERVED</li>
        </ul>
      </div>
    </footer>
  );
}
