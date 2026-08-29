'use client';

import React, { useRef, useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import s from './WorkDetail.module.scss';
import Image from 'next/image';
import FadeIn from '@/components/atoms/animation/FadeIn';
import SlideLeftArrow from '@public/svg/common/slide-left-arrow.svg';
import SlideRightArrow from '@public/svg/common/slide-right-arrow.svg';
import PlayIcon from '@public/svg/common/play.svg';
import PauseIcon from '@public/svg/common/pause.svg';
import CloseIcon from '@public/svg/layout/header/close.svg';
import ApkDownloadModal from '@/components/modal/ApkDownloadModal';
import LeftArrow from '@public/svg/common/left-arrow.svg';

export interface FeatureItem {
  title: string;
  description: string[];
  images?: string[];
}

export interface IssueItem {
  title: string;
  content: string;
  contentImages?: string[];
  cause: string;
  causeImages?: string[];
  solution: string;
  solutionImages?: string[];
  result: string;
  resultImages?: string[];
}

export interface Portfolio {
  id: string;
  'main-color': string;
  'sub-color': string;
  'color-theme': string;
  'main-image': string;
  'logo-image': string;
  'work-title': string;
  'full-work-title': string;
  'work-explan': string;
  client: string;
  category: string;
  'work-start': string;
  'work-end': string;
  'work-contribution': string;
  'key-features': string;
  'key-techs': string;
  github?: string;
  link: string;
  features?: FeatureItem[];
  issues?: IssueItem[];
  [key: string]: any;
}

const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  if (!images || images.length === 0) return null;

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));

  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - startX.current;

    if (
      (currentIndex === 0 && delta > 0) ||
      (currentIndex === images.length - 1 && delta < 0)
    ) {
      setDragOffset(delta * 0.3);
    } else {
      setDragOffset(delta);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;

    if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (dragOffset < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    setDragOffset(0);
  };

  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.pageX);
  const onMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.pageX);
  };
  const onMouseUp = handleDragEnd;
  const onMouseLeave = handleDragEnd;
  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].pageX);
  const onTouchMove = (e: React.TouchEvent) =>
    handleDragMove(e.touches[0].pageX);
  const onTouchEnd = handleDragEnd;

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === images.length - 1;

  return (
    <div className={s['image-slider-container']}>
      {images.length > 1 && (
        <div className={s['slider-controls']}>
          <span className={s['slide-counter']}>
            {currentIndex + 1} / {images.length}
          </span>
          <button
            className={`${s['arrow-btn']} ${isAtStart ? s['disabled'] : ''}`}
            onClick={handlePrev}
            disabled={isAtStart}
          >
            <div className={s['svg-box']}>
              <SlideLeftArrow width="20" height="20" viewBox="0 0 20 20" />
            </div>
          </button>
          <button
            className={`${s['arrow-btn']} ${isAtEnd ? s['disabled'] : ''}`}
            onClick={handleNext}
            disabled={isAtEnd}
          >
            <div className={s['svg-box']}>
              <SlideRightArrow width="20" height="20" viewBox="0 0 20 20" />
            </div>
          </button>
        </div>
      )}

      <div className={s['slider-wrapper']}>
        <div
          className={`${s['slider-track']} ${isDragging ? s['dragging'] : ''}`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {images.map((imgSrc, idx) => (
            <div key={idx} className={s['slide-image-item']}>
              <div className={s['image-ratio-box']}>
                <Image
                  src={imgSrc}
                  alt={`feature image ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface WorkDetailProps {
  data: Portfolio;
  onClose: () => void;
}

export default function WorkDetail({ data, onClose }: WorkDetailProps) {
  const scrollContainerRef = useRef<HTMLElement>(null);

  const [isUp, setIsUp] = useState(true);
  const mediaBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('info-section');

  const hasHoverContent = Boolean(data?.['main-contents']);
  const isVideo = hasHoverContent && data['main-contents']?.includes('/video/');
  const isScrollImage = hasHoverContent && !isVideo;

  const lastScrollY = useRef(0);

  // 모달 내부 스크롤 방향 감지 로직
  useEffect(() => {
    // article 태그 실제 스크롤 컨테이너(.modal-container) 찾기
    const container = scrollContainerRef.current?.parentElement;
    if (!container) return;

    lastScrollY.current = container.scrollTop;

    const handleDirection = () => {
      const currentScrollY = container.scrollTop;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsUp(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsUp(true);
      }
      lastScrollY.current = currentScrollY;
    };

    container.addEventListener('scroll', handleDirection, { passive: true });
    return () => container.removeEventListener('scroll', handleDirection);
  }, []);

  // 미디어 자동 재생용 화면 중앙 감지
  useEffect(() => {
    // window 대신, 모달 컨테이너 타겟팅
    const container = scrollContainerRef.current?.parentElement;
    if (!mediaBoxRef.current || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting);
        });
      },
      {
        root: container,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0,
      },
    );

    observer.observe(mediaBoxRef.current);
    return () => observer.disconnect();
  }, []);

  // 비디오 제어
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      if (isActive && !isPaused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isVideo, isPaused, isMediaLoaded]);

  // 사이드바 네비게이션 감지
  useEffect(() => {
    const container = scrollContainerRef.current?.parentElement;
    if (!container) return;

    const initObserver = setTimeout(() => {
      const sectionIds = ['info-section'];
      data.features?.forEach((_, idx) => sectionIds.push(`feature-${idx}`));
      data.issues?.forEach((_, idx) => sectionIds.push(`issue-${idx}`));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          root: container,
          rootMargin: '-150px 0px -50% 0px',
          threshold: 0,
        },
      );

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(initObserver);
  }, [data]);

  // 사이드바 메뉴 클릭 시 부드러운 스크롤
  const scrollToTarget = (id: string) => {
    const element = document.getElementById(id);
    // 실제 스크롤 부모 요소(.modal-container) 가져오기
    const container = scrollContainerRef.current?.parentElement;

    if (element && container) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const containerTop = container.getBoundingClientRect().top;

      // 컨테이너 내부에서의 정확한 타겟 위치 계산
      const offsetPosition =
        elementPosition - containerTop + container.scrollTop - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (data.category === 'Mobile App') {
      e.preventDefault();
      setIsApkModalOpen(true);
    }
  };

  if (!data) return null;

  return (
    <article
      className={s['detail-container']}
      ref={scrollContainerRef}
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className={s['close-button-wrap']}>
        <button className={s['closeBtn']} onClick={onClose}>
          <div className={s['close-wrap']}>
            <CloseIcon width="100%" height="100%" viewBox="0 0 24 24" />
          </div>
        </button>
      </div>

      <section className={s['hero-section']}>
        <div className={s['hero-header']}>
          <FadeIn>
            <h1 className={s['header-title']}>{data['work-title']}</h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className={s['action-links']}>
              <button
                onClick={onClose}
                className={`${s['back-button']}`}
                data-manual-routing="true"
              >
                <div className={s['svg-box']}>
                  <LeftArrow width="100%" height="100%" viewBox="0 0 36 36" />
                </div>
                <span>돌아가기</span>
              </button>

              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s['link-btn']} ${s['primary']}`}
                onClick={handleLinkClick}
              >
                {data.category === 'Mobile App'
                  ? 'APK 다운로드'
                  : '사이트 방문하기'}
              </a>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.6}>
          <div
            className={s['main-image-box']}
            ref={mediaBoxRef}
            style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              aspectRatio: '16 / 9',
            }}
            onClick={() => {
              if (hasHoverContent) setIsPaused(!isPaused);
            }}
          >
            {hasHoverContent && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className={s['control-button']}
              >
                {isPaused ? (
                  <div className={s['svg-box']}>
                    <PlayIcon width="100%" height="100%" viewBox="0 0 36 36" />
                  </div>
                ) : (
                  <div className={s['svg-box']}>
                    <PauseIcon width="100%" height="100%" viewBox="0 0 36 36" />
                  </div>
                )}
              </button>
            )}

            {!isMediaLoaded && <div className={s['image-skeleton']} />}

            {isVideo && (
              <video
                ref={videoRef}
                src={data['main-contents']}
                muted
                loop
                playsInline
                onLoadedData={() => setIsMediaLoaded(true)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                }}
              />
            )}

            {isScrollImage && (
              <Image
                src={data['main-contents']!}
                alt={`${data['work-title']} preview`}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', zIndex: 1 }}
                className={`${s['hover-image']} ${isActive ? s['scrolling'] : ''} ${isPaused ? s['paused'] : ''}`}
                onLoad={() => setIsMediaLoaded(true)}
                unoptimized={true}
              />
            )}

            {!hasHoverContent && (
              <Image
                src={data['main-image']}
                alt={data['work-title']}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', zIndex: 1 }}
                onLoad={() => setIsMediaLoaded(true)}
                unoptimized={true}
              />
            )}
          </div>
        </FadeIn>
      </section>

      {data.features?.length || data.issues?.length ? (
        <Container>
          <div className={s['content-with-sidebar']}>
            <aside className={`${s['sidebar']}`}>
              <nav className={s['sticky-nav']}>
                <button onClick={onClose} className={s['nav-back-btn']}>
                  <span>← 돌아가기</span>
                </button>

                <ul className={s['nav-list']}>
                  <li
                    className={`${s['nav-item']} ${activeSection === 'info-section' ? s['active'] : ''}`}
                  >
                    <button onClick={() => scrollToTarget('info-section')}>
                      프로젝트 개요
                    </button>
                  </li>
                  {data.features && data.features.length > 0 && (
                    <li className={s['nav-group']}>
                      <span className={s['nav-group-title']}>주요 기능</span>
                      <ul className={s['nav-sub-list']}>
                        {data.features.map((feature, idx) => {
                          const id = `feature-${idx}`;
                          return (
                            <li
                              key={`nav-feat-${idx}`}
                              className={`${s['nav-sub-item']} ${activeSection === id ? s['active'] : ''}`}
                            >
                              <button
                                onClick={() => scrollToTarget(`feature-${idx}`)}
                              >
                                {feature.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  )}
                  {data.issues && data.issues.length > 0 && (
                    <li className={s['nav-group']}>
                      <span className={s['nav-group-title']}>주요 이슈</span>
                      <ul className={s['nav-sub-list']}>
                        {data.issues.map((issue, idx) => {
                          const id = `issue-${idx}`;
                          return (
                            <li
                              key={`nav-issue-${idx}`}
                              className={`${s['nav-sub-item']} ${activeSection === id ? s['active'] : ''}`}
                            >
                              <button
                                onClick={() => scrollToTarget(`issue-${idx}`)}
                              >
                                {issue.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  )}
                </ul>
              </nav>
            </aside>
            <div className={s['main-content']}>
              <section id="info-section" className={s['info-section']}>
                <div className={s['info-grid']}>
                  <div className={s['grid-wrap']}>
                    <div className={s['info-title']}>
                      <span className={s['value']}>
                        {data['full-work-title']}
                      </span>
                    </div>
                    <div className={s['info-wrap']}>
                      {data.client && (
                        <div className={s['info-item']}>
                          <span className={s['label']}>클라이언트</span>
                          <span className={s['value']}>{data.client}</span>
                        </div>
                      )}
                      <div className={s['info-item']}>
                        <span className={s['label']}>카테고리</span>
                        <span className={s['value']}>
                          {data.category.toUpperCase()}
                        </span>
                      </div>
                      <div className={s['info-item']}>
                        <span className={s['label']}>진행 기간</span>
                        <span className={s['value']}>
                          {data['work-start']} ~ {data['work-end']}
                        </span>
                      </div>
                      <div className={s['info-item']}>
                        <span className={s['label']}>주요 역할</span>
                        <span className={s['value']}>
                          {data['work-contribution']}
                        </span>
                      </div>
                      <div className={s['info-item']}>
                        <span className={s['label']}>주요 기능</span>
                        <div className={s['tags']}>{data['key-features']}</div>
                      </div>
                      <div className={s['info-item']}>
                        <span className={s['label']}>주요 기술</span>
                        <div className={s['tags']}>
                          {data['key-techs']?.split(',').map((feature, idx) => (
                            <span key={idx} className={s['tag']}>
                              {feature.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={s['grid-wrap']}>
                    <p className={s['explan']}>{data['work-explan']}</p>
                  </div>
                  <div className={s['button-wrap']}>
                    {data.github ? (
                      <a
                        href={data.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s['out-link']}
                      >
                        GitHub ↗
                      </a>
                    ) : (
                      ''
                    )}

                    <a
                      href={data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s['site-link']}
                      onClick={handleLinkClick}
                    >
                      {data.category === 'Mobile App'
                        ? '앱 다운로드 ↗'
                        : '사이트 방문하기 ↗'}
                    </a>
                  </div>
                </div>
              </section>

              {data.features && data.features.length > 0 && (
                <section className={s['feature-list-section']}>
                  <FadeIn threshold={0}>
                    <h2 className={s['section-main-title']}>주요 기능</h2>
                  </FadeIn>
                  <div className={s['feature-list-wrapper']}>
                    {data.features.map((feature, idx) => (
                      <FadeIn key={idx} threshold={0}>
                        <div
                          id={`feature-${idx}`}
                          className={s['feature-block']}
                        >
                          <div className={s['text-area']}>
                            <h3 className={s['feature-title']}>
                              {idx + 1}. {feature.title}
                            </h3>
                            <div className={s['feature-explan-group']}>
                              {feature.description.map((desc, descIdx) => (
                                <p
                                  key={descIdx}
                                  className={s['feature-explan']}
                                >
                                  {desc}
                                </p>
                              ))}
                            </div>
                          </div>
                          {feature.images && feature.images.length > 0 && (
                            <ImageSlider images={feature.images} />
                          )}
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </section>
              )}

              {data.issues && data.issues.length > 0 && (
                <section className={s['issue-list-section']}>
                  <FadeIn threshold={0}>
                    <h2 className={s['section-main-title']}>주요 이슈</h2>
                  </FadeIn>
                  <div className={s['issue-list-wrapper']}>
                    {data.issues.map((issue, idx) => (
                      <FadeIn key={idx} threshold={0}>
                        <div id={`issue-${idx}`} className={s['issue-block']}>
                          <div className={s['issue-row']}>
                            <h3 className={s['issue-title']}>{issue.title}</h3>
                            <p className={s['issue-content']}>
                              {issue.content}
                            </p>
                            {issue.contentImages &&
                              issue.contentImages.length > 0 && (
                                <div className={s['issue-sequential-images']}>
                                  {issue.contentImages.map((imgSrc, i) => (
                                    <div
                                      key={i}
                                      className={s['sequential-image-box']}
                                    >
                                      <Image
                                        src={imgSrc}
                                        alt={`content image ${i + 1}`}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{
                                          width: '100%',
                                          height: 'auto',
                                          display: 'block',
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                          <div className={s['issue-details-box']}>
                            <div className={s['issue-row']}>
                              <h4 className={s['issue-label']}>이슈 원인</h4>
                              <p className={s['issue-desc']}>{issue.cause}</p>
                              {issue.causeImages &&
                                issue.causeImages.length > 0 && (
                                  <div className={s['issue-sequential-images']}>
                                    {issue.causeImages.map((imgSrc, i) => (
                                      <div
                                        key={i}
                                        className={s['sequential-image-box']}
                                      >
                                        <Image
                                          src={imgSrc}
                                          alt={`cause image ${i + 1}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                            <div className={s['issue-row']}>
                              <h4 className={s['issue-label']}>해결 과정</h4>
                              <p className={s['issue-desc']}>
                                {issue.solution}
                              </p>
                              {issue.solutionImages &&
                                issue.solutionImages.length > 0 && (
                                  <div className={s['issue-sequential-images']}>
                                    {issue.solutionImages.map((imgSrc, i) => (
                                      <div
                                        key={i}
                                        className={s['sequential-image-box']}
                                      >
                                        <Image
                                          src={imgSrc}
                                          alt={`solution image ${i + 1}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                            <div className={s['issue-row']}>
                              <h4 className={s['issue-label']}>결과</h4>
                              <p className={s['issue-desc']}>{issue.result}</p>
                              {issue.resultImages &&
                                issue.resultImages.length > 0 && (
                                  <div className={s['issue-sequential-images']}>
                                    {issue.resultImages.map((imgSrc, i) => (
                                      <div
                                        key={i}
                                        className={s['sequential-image-box']}
                                      >
                                        <Image
                                          src={imgSrc}
                                          alt={`result image ${i + 1}`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block',
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </Container>
      ) : null}

      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        apkUrl={data.link}
      />
    </article>
  );
}
