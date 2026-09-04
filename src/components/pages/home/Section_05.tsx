'use client';

import React, { useEffect, useState, useRef } from 'react';
import s from './Section_05.module.scss';
import { fetchStacks } from '@/api/stack';
import FadeInMain from '@/components/atoms/animation/FadeInMain';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import {
  AboutIcon,
  ExperienceIcon,
  CertificationIcon,
  EducationIcon,
  StacksIcon,
} from '@public/svg';
// import Image from 'next/image'; // Image 컴포넌트는 더 이상 사용하지 않으므로 제거 또는 주석 처리

interface Stack {
  stack: string;
}

export default function Section_05() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [isUp, setIsUp] = useState(true);
  const lastScrollY = useRef(0);
  const isReady = useRef(false);

  // 첫 번째 항목 'ABOUT' 기본 오픈
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {
      ABOUT: true,
    },
  );

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStacks();
      setStacks(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const timer = setTimeout(() => {
      isReady.current = true;
    }, 0);

    const handleDirection = () => {
      if (!isReady.current) {
        lastScrollY.current = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsUp(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsUp(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleDirection, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleDirection);
    };
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const accordionData = [
    {
      id: 'ABOUT',
      title: 'ABOUT',
      // 문자열 경로 대신 리액트 컴포넌트를 직접 렌더링합니다. (필요 시 className 부여 가능)
      icon: (
        <AboutIcon
          width={'100%'}
          height={'100%'}
          viewBox={'0 0 48 48'}
          className={s['svg-icon']}
        />
      ),
      content: (
        <div className={s['about-content']}>
          <div className={s['about-title']}>
            <span className={s['main-title']}>유강산</span>
            <span className={s['sub-title']}>1991.10.14</span>
          </div>

          <div className={s['about-title']}>
            <span className={s['main-title']}>WEB FRONTEND 4년차</span>
          </div>

          <div className={s['content-text']}>
            안녕하세요, 책임감 있게 완성도 높은 서비스를 구현하는 프론트엔드
            개발자 유강산입니다.
            <br />
            저는 지난 3년간 스타트업 환경에서 Next.js와 React를 사용해 서비스를
            만들고 운영해 왔습니다. 소규모 팀에서 서비스가 처음 기획되고
            구축되어 운영되는 과정에 함께하며, 사용자가 직접 만나는 웹 화면부터
            내부에서 사용하는 관리자 페이지까지 다양한 프론트엔드 업무를
            경험했습니다. 주어진 기능을 구현하는 것에 그치지 않고, 제가 맡은
            일은 끝까지 책임진다는 자세로 서비스를 바라보며 개발해 왔습니다.
            이러한 경험을 통해 개별 기능뿐만 아니라 서비스 전체의 흐름을
            생각하며 개발하는 습관을 갖게 되었습니다.
            <br /> <br />
            저의 가장 큰 장점은 개발뿐만 아니라 디자인에 대한 이해를 바탕으로 더
            완성도 높은 화면을 구현할 수 있다는 점입니다. 디자인을 단순히
            전달받아 그대로 구현하는 것에 그치지 않고, 실제 개발 과정에서 필요한
            부분은 Figma를 직접 확인하고 디자인 의도를 파악하며 작업해 왔습니다.
            이를 통해 디자이너와 구현 방법을 빠르게 맞춰갈 수 있었고, 화면의
            디테일을 놓치지 않으면서도 개발 과정에서 발생하는 여러 상황에
            유연하게 대응할 수 있었습니다. 특히 소규모 팀에서 디자이너와 가까이
            협업하며, 서로의 관점을 이해하고 더 나은 결과물을 만들어가는 경험을
            많이 쌓았습니다.
            <br /> <br />
            또한 개발 과정에서 기술적으로 복잡하거나 구현하기 어려운 상황이
            생겼을 때, 이를 개발에 익숙하지 않은 동료도 이해할 수 있도록 쉽게
            설명하려고 노력해 왔습니다. 단순히 “기술적으로 어렵다”라고
            이야기하기보다 현재 상황과 선택할 수 있는 방법, 각각의 장단점을 함께
            설명하며 합리적인 방향을 찾아가는 것을 중요하게 생각합니다.
            <br /> <br />
            꼼꼼하게 코드를 작성하는 기본기를 바탕으로, 디자인과 사용자 경험까지
            함께 고민하고 동료들과 편하게 의견을 나누며 더 좋은 서비스를
            만들어가는 프론트엔드 개발자가 되겠습니다.
          </div>
        </div>
      ),
    },
    {
      id: 'EDUCATION',
      title: 'EDUCATION',
      icon: (
        <EducationIcon
          width={'100%'}
          height={'100%'}
          viewBox={'0 0 48 48'}
          className={s['svg-icon']}
        />
      ),
      content: (
        <ol className={s['about-content-list']}>
          <li>
            <div className={s['list-time']}>2010.03 - 2018.02</div>
            <div className={s['flex-box']}>
              <div className={s['list-title']}>국립창원대학교(4년제)</div>
              <div className={s['list-sub']}>일어일문학과</div>
            </div>
          </li>
          <li>
            <div className={s['list-time']}>2016.04 - 2017.02</div>
            <div className={s['flex-box']}>
              <div className={s['list-title']}>규슈대학(九州大学) 교환학생</div>
              <div className={s['list-sub']}>윤리학부</div>
            </div>
          </li>
          <li>
            <div className={s['list-time']}>2021.03 - 2021.07</div>
            <div className={s['flex-box']}>
              <div className={s['list-title']}>더조은컴퓨터학원</div>
              <div className={s['list-sub']}>프론트엔드 실무자 양성</div>
            </div>
          </li>
        </ol>
      ),
    },
    {
      id: 'CERTIFICATE',
      title: 'CERTIFICATE',
      icon: (
        <CertificationIcon
          width={'100%'}
          height={'100%'}
          viewBox={'0 0 48 48'}
          className={s['svg-icon']}
        />
      ),
      content: (
        <ol className={s['about-content-list']}>
          <li>
            <div className={s['list-time']}>2009.07</div>
            <div className={s['flex-box']}>
              <div className={s['list-title']}>컴퓨터그래픽스운용기능사</div>
              <div className={s['list-sub']}>최종합격</div>
            </div>
          </li>
          <li>
            <div className={s['list-time']}>2017.01</div>
            <div className={s['flex-box']}>
              <div className={s['list-title']}>JLPT 일본어능력시험</div>
              <div className={s['list-sub']}>N1 PASS</div>
            </div>
          </li>
        </ol>
      ),
    },
    {
      id: 'EXPERIENCE',
      title: 'EXPERIENCE',
      icon: (
        <ExperienceIcon
          width={'100%'}
          height={'100%'}
          viewBox={'0 0 48 48'}
          className={s['svg-icon']}
        />
      ),
      content: (
        <ol className={s['about-content-list']}>
          <li>
            <div className={s['list-time']}>2022.06 - 2024.08</div>
            <div className={s['flex-box']}>
              <div className={s['list-title']}>㈜비아이벤처스</div>
              <div className={s['list-sub']}>개발팀 · 프로</div>
            </div>
          </li>
          <li>
            <div className={s['list-time']}>2024.08 - 2026.03</div>
            <div className={s['flex-box']}>
              <div className={s['list-title']}>
                ㈜글리처파트너스 <span className={s['list-title-bar']}>| </span>
                <span className={s['list-title-sub']}>
                  구 ㈜엔피프틴파트너스
                </span>
              </div>
              <div className={s['list-sub']}>DX팀 · Project Leader</div>
            </div>
          </li>
        </ol>
      ),
    },
    {
      id: 'STACKS & TOOLS',
      title: 'STACKS & TOOLS',
      icon: (
        <StacksIcon
          width={'100%'}
          height={'100%'}
          viewBox={'0 0 48 48'}
          className={s['svg-icon']}
        />
      ),
      content: (
        <div className={s['about-block-list']}>
          {stacks.map((item, idx) => (
            <span key={idx} className={s['about-block']}>
              {item.stack}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="section-03" className={s['section-container']}>
      <FadeInMain>
        <div className={s['section-wrap']}>
          <div className={`${s['title-section']} ${isUp ? s['up'] : ''}`}>
            <div className={s['text-section']}>
              <div className={s['section-title']}>소개</div>
              <div className={s['section-text']}>
                되는 방법을 찾고, 나은 결과를 내는
                <br />
                프론트엔드 개발자 유강산입니다.
              </div>
            </div>
          </div>

          <ul className={s['accordion-wrap']}>
            {accordionData.map((item) => {
              const isOpen = openCategories[item.id];

              return (
                <li
                  key={item.id}
                  className={`${s['accordion-item']} ${isOpen ? s['active'] : ''}`}
                >
                  <div
                    className={s['accordion-header']}
                    onClick={() => toggleCategory(item.id)}
                  >
                    <div className={s['header-left']}>
                      <span className={s['toggle-indicator']}>
                        {isOpen ? (
                          <IconMinus size={32} />
                        ) : (
                          <IconPlus size={32} />
                        )}
                      </span>
                      <div className={s['category-title-group']}>
                        <h2 className={s['category-title']}>{item.title}</h2>

                        {/* Image 태그 대신 배열에 담아둔 item.icon(React Node)을 바로 렌더링합니다 */}
                        <div className={s['icon-box']}>{item.icon}</div>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className={s['accordion-content-wrapper']}
                      >
                        {item.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </FadeInMain>
    </section>
  );
}
