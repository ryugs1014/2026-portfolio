'use client';

import React, { useEffect, useRef, useState } from 'react';
import s from './HomeClient.module.scss';
import SceneWrapper from '@/components/3d/SceneWrapper';

import Section_01 from '@/components/pages/home/Section_01';
import Section_02 from '@/components/pages/home/Section_02';
import Section_03 from '@/components/pages/home/Section_03';
import Section_04 from '@/components/pages/home/Section_04';
import Section_05 from '@/components/pages/home/Section_05';
import Section_06 from '@/components/pages/home/Section_06';

export default function HomeClient() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 💡 entry.target을 HTMLElement로 타입 캐스팅(단언) 해줍니다.
            const target = entry.target as HTMLElement;
            setActiveSection(Number(target.dataset.index));
          }
        });
      },
      {
        // 감지 영역 화면 정중앙 1px 라인
        rootMargin: '-50% 0px -49.9% 0px',
        threshold: 0,
      },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // 공통 적용 껍데기 스타일 (3D 위에 올라오게 설정)
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    <main className={s['main']} style={{ position: 'relative' }}>
      <div
        className={s['model']}
        style={{
          zIndex: [3, 4].includes(activeSection) ? 10 : 0,
          opacity: activeSection === 3 ? 1 : activeSection === 4 ? 0.2 : 0.5,
        }}
      >
        <SceneWrapper currentSection={activeSection} />
      </div>

      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        data-index={1}
        style={{ ...wrapperStyle, backgroundColor: 'transparent' }}
      >
        <Section_01 />
      </section>

      <section
        id="section-works"
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        data-index={2}
        style={{
          ...wrapperStyle,
          zIndex: 2,
        }}
      >
        <Section_02 />
      </section>

      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        data-index={3}
        style={{ ...wrapperStyle, backgroundColor: 'transparent' }}
      >
        <Section_03 />
      </section>

      <section
        id="section-stacks"
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        data-index={4}
        style={{ ...wrapperStyle, backgroundColor: 'transparent' }}
      >
        <Section_04 />
      </section>

      <section
        id="section-about"
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        data-index={5}
        style={{ ...wrapperStyle, backgroundColor: 'transparent' }}
      >
        <Section_05 />
      </section>

      <section
        ref={(el) => {
          sectionRefs.current[5] = el;
        }}
        data-index={6}
        style={{ ...wrapperStyle, backgroundColor: 'transparent' }}
      >
        <Section_06 />
      </section>
    </main>
  );
}
