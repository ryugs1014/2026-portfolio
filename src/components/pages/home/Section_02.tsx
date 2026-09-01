'use client';

import React, {
  useState,
  useEffect,
  useRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import s from './Section_02.module.scss';
import { fetchPortfolios } from '@/api/portfolio';
import FadeInMain from '@/components/atoms/animation/FadeInMain';

import WorkDetailModal from '@/components/modal/WorkDetailModal';

import { ArrowDownIcon, ListViewIcon, ListOutlineIcon } from '@public/svg';

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
  scale?: number;
  [key: string]: any;
}

type ViewMode = 'list' | 'detail';
type SortOption = 'latest' | 'oldest' | 'scale';

const CATEGORY_KO_MAP: Record<string, string> = {
  'Mobile App': '모바일 앱',
  'Web Platform': '웹 플랫폼',
  'Responsive Web': '반응형 웹',
  'Landing Page': '랜딩 페이지',
};

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

const PortfolioDetailCard = memo(function PortfolioDetailCard({
  work,
  onClick,
}: {
  work: Portfolio;
  onClick: (id: string) => void;
}) {
  return (
    <FadeInMain>
      <div className={s['detail-card']} onClick={() => onClick(work.id)}>
        <div className={s['detail-card-wrap']}>
          <div className={s['detail-main']}>
            <div className={s['detail-image-box']}>
              <img src={work['sub-image']} alt={work['work-title']} />
            </div>

            <div className={s['detail-text-box']}>
              <div className={s['title-wrap']}>
                <h4 className={s['work-title']}>{work['work-title']}</h4>
              </div>

              <p className={s['work-explan']}>{work['short-work-explan']}</p>

              <div className={s['tags']}>
                {work['key-features']?.split(',').map((feature, idx) => (
                  <span key={idx} className={s['tag']}>
                    {feature.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={s['detail-info-box']}>
            <div className={s['detail-category']}>
              {CATEGORY_KO_MAP[work.category] || work.category} · {work.client}
            </div>

            <div className={s['detail-year']}>{work['work-start']}</div>
          </div>
        </div>
      </div>
    </FadeInMain>
  );
});

export default function Section_02() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortOption, setSortOption] = useState<SortOption>('scale');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeWork, setActiveWork] = useState<Portfolio | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(
    null,
  );

  const cursorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = (await fetchPortfolios()) as Portfolio[];
      setPortfolios(data);
    };
    loadData();
  }, []);

  const sortedPortfolios = useMemo(() => {
    return [...portfolios].sort((a, b) => {
      if (sortOption === 'latest') {
        // 날짜 기준 내림차순 (최신순)
        return (b['work-start'] || '').localeCompare(a['work-start'] || '');
      } else if (sortOption === 'oldest') {
        // 날짜 기준 오름차순 (오래된순)
        return (a['work-start'] || '').localeCompare(b['work-start'] || '');
      } else if (sortOption === 'scale') {
        // 중요도순 (scale 값이 클수록 우선, scale 값이 없으면 0으로 처리)
        const scaleA = a.scale || 0;
        const scaleB = b.scale || 0;
        return scaleB - scaleA;
      }
      return 0;
    });
  }, [portfolios, sortOption]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (
      !isMobile ||
      sortedPortfolios.length === 0 ||
      !listRef.current ||
      viewMode === 'detail'
    ) {
      if (!isMobile) setActiveWork(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            const id = entry.target.getAttribute('data-portfolio-id');
            setActiveWork((prev) => (prev?.id === id ? null : prev));
          }
        });
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-portfolio-id');
            const work = sortedPortfolios.find((p) => p.id === id);
            if (work) setActiveWork(work);
          }
        });
      },
      {
        rootMargin: '-50% 0px -49% 0px',
        threshold: 0,
      },
    );

    const items = listRef.current.querySelectorAll('[data-portfolio-id]');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [isMobile, sortedPortfolios, viewMode]);

  useEffect(() => {
    if (isMobile && cursorRef.current) {
      cursorRef.current.style.transform = 'translateX(-50%)';
    }
  }, [isMobile]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (cursorRef.current && !isMobile && viewMode === 'list') {
        cursorRef.current.style.transform = `translate(calc(${e.clientX}px + 20px), calc(${e.clientY}px - 50%))`;
      }
    },
    [isMobile, viewMode],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false); // 드롭다운을 닫는다!
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <section
        id="section-02"
        className={s['section-container']}
        onMouseMove={handleMouseMove}
      >
        <div className={s['section-wrap']}>
          <FadeInMain className={s['fade-wrap']}>
            <div className={s['title-section']}>
              <div className={s['text-section']}>
                <div className={s['section-title']}>프로젝트</div>
                <div className={s['section-text']}>
                  고객의 이야기를 가까이에서 듣고,
                  <br />
                  만족할 경험을 제공합니다.
                </div>
              </div>

              <div className={s['controls-wrapper']}>
                <div className={s['custom-select-container']} ref={dropdownRef}>
                  <button
                    className={s['select-trigger']}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {sortOption === 'scale' && '중요도 순'}
                    {sortOption === 'latest' && '최신 순'}
                    {sortOption === 'oldest' && '오래된 순'}
                    <span
                      className={`${s['arrow']} ${isDropdownOpen && s['active']}`}
                    >
                      <div className={s['svg-box']}>
                        <ArrowDownIcon
                          width={'100%'}
                          height={'100%'}
                          viewBox={'0 0 24 24'}
                          className={s['svg-icon']}
                        />
                      </div>
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <ul className={s['select-options']}>
                      <li
                        className={sortOption === 'scale' ? s['selected'] : ''}
                        onClick={() => {
                          setSortOption('scale');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span>중요도 순</span>
                      </li>
                      <li
                        className={sortOption === 'latest' ? s['selected'] : ''}
                        onClick={() => {
                          setSortOption('latest');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span>최신 순</span>
                      </li>
                      <li
                        className={sortOption === 'oldest' ? s['selected'] : ''}
                        onClick={() => {
                          setSortOption('oldest');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span>오래된 순</span>
                      </li>
                    </ul>
                  )}
                </div>

                <div className={s['line']} />

                <div className={s['toggle-container']}>
                  <button
                    className={`${s['toggle-btn']} ${viewMode === 'list' ? s['active'] : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <div className={s['svg-box']}>
                      <ListViewIcon
                        width={'100%'}
                        height={'100%'}
                        viewBox={'0 0 24 24'}
                        className={s['svg-icon']}
                      />
                    </div>
                  </button>
                  <button
                    className={`${s['toggle-btn']} ${viewMode === 'detail' ? s['active'] : ''}`}
                    onClick={() => setViewMode('detail')}
                  >
                    <div className={s['svg-box']}>
                      <ListOutlineIcon
                        width={'100%'}
                        height={'100%'}
                        viewBox={'0 0 24 24'}
                        className={s['svg-icon']}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </FadeInMain>

          <div className={s['works-wrap']}>
            <div className={s['category-group']}>
              {viewMode === 'list' ? (
                <ul
                  className={s['portfolio-list']}
                  ref={listRef}
                  onMouseLeave={() => !isMobile && setActiveWork(null)}
                >
                  <li className={`${s['portfolio-header']}`}>
                    <FadeInMain>
                      <div className={s['info-header']}>
                        <div className={s['header-text']}>YEAR</div>
                        <div className={s['header-text']}>PROJECT</div>
                        <div className={s['header-text']}>DETAIL</div>
                      </div>
                    </FadeInMain>
                  </li>

                  {sortedPortfolios.map((work) => (
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
              ) : (
                <div className={s['portfolio-detail-grid']}>
                  {sortedPortfolios.map((work) => (
                    <PortfolioDetailCard
                      key={work.id}
                      work={work}
                      onClick={(id) => setSelectedPortfolioId(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {viewMode === 'list' && isMobile && (
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

        {viewMode === 'list' && (
          <div
            ref={cursorRef}
            onClick={() => {
              if (activeWork) {
                setSelectedPortfolioId(activeWork.id);
              }
            }}
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
              cursor: 'pointer',
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
        )}
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
