'use client';

import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import s from './Section_02.module.scss';
import { fetchPortfolios } from '@/api/portfolio';
import FadeInMain from '@/components/atoms/animation/FadeInMain';

import WorkDetailModal from '@/components/modal/WorkDetailModal';

interface Portfolio {
  id: string;
  'logo-icons': string;
  'logo-icons-dark': string;
  'main-image': string;
  'sub-image': string;
  'main-contents'?: string;
  'main-contents-optimized'?: string;
  'font-theme': string;
  category: string;
  'work-title': string;
  'work-title-short': string;
  'work-title-eng': string;
  'work-explan': string;
  'key-features': string;
  'work-start': string;
  github: string;
  link: string;
  [key: string]: any;
}

const PortfolioItemCard = memo(function PortfolioItemCard({
  work,
  isMobile,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  work: Portfolio;
  isMobile: boolean;
  onHoverStart: (work: Portfolio, e: React.MouseEvent) => void;
  onHoverEnd: () => void;
  onClick: (id: string) => void;
}) {
  const formattedYear = work['work-start']
    ? `'${work['work-start'].substring(2, 4)}`
    : '';

  return (
    <li
      className={s['portfolio-item']}
      style={{ cursor: 'pointer' }}
      onMouseEnter={(e) => !isMobile && onHoverStart(work, e)}
      onMouseLeave={() => !isMobile && onHoverEnd()}
      onClick={() => onClick(work.id)}
    >
      <FadeInMain>
        <div className={s['item-button']}>
          <div
            className={`${s['work-info']} ${work['font-theme'] === 'dark' ? s['dark'] : ''}`}
          >
            <div className={s['info-header']}>
              <div className={s['work-year']}>{formattedYear}</div>
              <div className={s['work-title']}>{work['work-title-short']}</div>
              <div className={s['text-info']}>
                <div className={s['work-title-text']}>{work['work-title']}</div>
              </div>
            </div>
          </div>
        </div>
      </FadeInMain>
    </li>
  );
});

export default function Section_02() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [activeWork, setActiveWork] = useState<Portfolio | null>(null);

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(
    null,
  );

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = (await fetchPortfolios()) as Portfolio[];
      setPortfolios(data);
    };
    loadData();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (cursorRef.current && !isMobile) {
        cursorRef.current.style.transform = `translate(calc(${e.clientX}px + 20px), calc(${e.clientY}px - 50%))`;
      }
    },
    [isMobile],
  );

  return (
    <>
      <section
        id="section-02"
        className={s['section-container']}
        onMouseMove={handleMouseMove}
      >
        <div className={s['section-wrap']}>
          <FadeInMain>
            <div className={s['title-section']}>
              <div className={s['text-section']}>
                <div className={s['section-title']}>프로젝트</div>
                <div className={s['section-text']}>
                  고객의 이야기를 가장 가까이에서 듣고,
                  <br />
                  만족을 넘어서는 경험을 제공합니다.
                </div>
              </div>
            </div>
          </FadeInMain>

          <div className={s['works-wrap']}>
            <div className={s['category-group']}>
              <ul
                className={s['portfolio-list']}
                onMouseLeave={() => setActiveWork(null)}
              >
                {portfolios.map((work) => (
                  <PortfolioItemCard
                    key={work.id}
                    work={work}
                    isMobile={isMobile}
                    onHoverStart={(workData, e) => {
                      if (cursorRef.current && !isMobile) {
                        cursorRef.current.style.transform = `translate(calc(${e.clientX}px + 20px), calc(${e.clientY}px - 50%))`;
                      }
                      setActiveWork(workData); // 위치 잡은 후 상태 업데이트
                    }}
                    onHoverEnd={() => setActiveWork(null)}
                    onClick={(id) => setSelectedPortfolioId(id)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {!isMobile && (
          <div
            ref={cursorRef}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '360px',
              aspectRatio: '12 / 9',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 100,
              opacity: activeWork ? 1 : 0,
              visibility: activeWork ? 'visible' : 'hidden',
              transition: 'opacity 0.3s ease, visibility 0.3s ease',
              willChange: 'transform, opacity',
            }}
          >
            {activeWork && (
              <img
                src={activeWork['main-image']}
                alt="portfolio preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>
        )}
      </section>

      {/* selectedPortfolioId 값 존재시 모달 컴포넌트 렌더링 */}
      {selectedPortfolioId && (
        <WorkDetailModal
          id={selectedPortfolioId}
          onClose={() => setSelectedPortfolioId(null)}
        />
      )}
    </>
  );
}
