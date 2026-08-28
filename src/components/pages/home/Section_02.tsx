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
  isActive,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  work: Portfolio;
  isMobile: boolean;
  isActive: boolean;
  onHoverStart: (work: Portfolio, e: React.MouseEvent) => void;
  onHoverEnd: () => void;
  onClick: (id: string) => void;
}) {
  const formattedYear = work['work-start']
    ? `'${work['work-start'].substring(2, 4)}`
    : '';

  return (
    <li
      className={`${s['portfolio-item']} ${isActive ? s['active'] : ''}`}
      data-portfolio-id={work.id}
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
  const listRef = useRef<HTMLUListElement>(null); // 💡 리스트 컨테이너 참조

  // 1. 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      const data = (await fetchPortfolios()) as Portfolio[];
      setPortfolios(data);
    };
    loadData();
  }, []);

  // 모바일(768px 이하) 감지 로직
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // 초기 확인
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 모바일 스크롤 중앙선 감지 (Intersection Observer)
  useEffect(() => {
    if (!isMobile || portfolios.length === 0 || !listRef.current) {
      if (!isMobile) setActiveWork(null); // PC로 돌아가면 초기화
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면을 벗어나는 요소 먼저 처리 (잔상 방지)
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            const id = entry.target.getAttribute('data-portfolio-id');
            setActiveWork((prev) => (prev?.id === id ? null : prev));
          }
        });
        // 화면 중앙 선에 닿은 요소 처리
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-portfolio-id');
            const work = portfolios.find((p) => p.id === id);
            if (work) setActiveWork(work);
          }
        });
      },
      {
        // 화면 상단 50%, 하단 49%를 버려서 '가운데 1px'의 가상 선
        rootMargin: '-50% 0px -49% 0px',
        threshold: 0,
      },
    );

    const items = listRef.current.querySelectorAll('[data-portfolio-id]');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [isMobile, portfolios]);

  // PC -> 모바일 전환 시 PC용 커서 트랜스폼 잔재 지우기
  useEffect(() => {
    if (isMobile && cursorRef.current) {
      cursorRef.current.style.transform = 'translateX(-50%)';
    }
  }, [isMobile]);

  // PC용 마우스 이동 로직
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
                ref={listRef} // 💡 ref 연결
                onMouseLeave={() => !isMobile && setActiveWork(null)}
              >
                {portfolios.map((work) => (
                  <PortfolioItemCard
                    key={work.id}
                    work={work}
                    isMobile={isMobile}
                    isActive={activeWork?.id === work.id}
                    onHoverStart={(workData, e) => {
                      if (cursorRef.current && !isMobile) {
                        cursorRef.current.style.transform = `translate(calc(${e.clientX}px + 20px), calc(${e.clientY}px - 50%))`;
                      }
                      setActiveWork(workData);
                    }}
                    onHoverEnd={() => setActiveWork(null)}
                    onClick={(id) => setSelectedPortfolioId(id)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {isMobile && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: 0,
              width: '100%',
              height: '1px',
              opacity: 0.3,
              zIndex: 50,
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          ref={cursorRef}
          style={{
            position: 'fixed',
            top: isMobile ? 'auto' : 0,
            bottom: isMobile ? '40px' : 'auto',
            left: isMobile ? '50%' : 0,
            transform: isMobile ? 'translateX(-50%)' : 'none',
            width: isMobile ? '65%' : '360px',
            maxWidth: '300px',
            aspectRatio: '12 / 9',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 9999,
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
      </section>

      {selectedPortfolioId && (
        <WorkDetailModal
          id={selectedPortfolioId}
          onClose={() => setSelectedPortfolioId(null)}
        />
      )}
    </>
  );
}
