'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import s from './not-found.module.scss';

export default function NotFound() {
  return (
    <main className={s['not-found-main']}>
      <section className={s['section-wrap']}>
        <Container>
          <div className={s['title-section']}>
            <div className={s['title-box']}>
              <h2 className={s['title']}>페이지를 찾을 수 없습니다</h2>
              <div className={s['text']}>
                이용에 불편을 드려 죄송합니다.
                <br />
                해당 페이지가 존재하지 않거나 삭제되었을 수 있습니다.
              </div>
            </div>

            <div className={s['button-wrap']}>
              <Link href="/" className={s['home-button']}>
                <button className={s['more-button']}>
                  <div className={s['button-arrow']}>
                    <div className={s['svg-box']}>←</div>
                  </div>
                  <div className={s['button-text-wrap']}>홈으로 돌아가기</div>
                </button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
