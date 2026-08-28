'use client';

import React, { useEffect, useState, useRef } from 'react';
import s from './Section_05.module.scss';
import { fetchStacks } from '@/api/stack';
import FadeInMain from '@/components/atoms/animation/FadeInMain';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPlus, IconMinus } from '@tabler/icons-react';
import Image from 'next/image';

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
      icon: '/svg/icons/about-icons/about.svg',
      content: (
        <div className={s['about-content']}>
          안녕하세요, 책임감 있게 완성도 높은 서비스를 구현하는 프론트엔드
          개발자 유강산입니다.
          <br />
          저는 지난 3년간 스타트업 환경에서 Next.js와 React를 사용해 서비스를
          만들고 운영해 왔습니다. 소규모 팀에서의 경험으로 사용자가 직접 만나는
          웹 화면부터 내부 직원들이 쓰는 관리자 페이지까지, 프론트엔드의 거의
          모든 영역을 직접 부딪치며 경험했습니다. 특히 PC와 모바일을 아우르는
          세밀한 반응형 레이아웃을 다듬고, 사용자가 편안함을 느낄 수 있는
          자연스러운 화면 인터랙션을 고민하며 웹페이지에 생동감을 불어넣는
          작업을 꾸준히 해왔습니다. 서비스가 처음 기획되어 구축되고 운영되는
          전체 과정을 함께하며, 제가 맡은 일은 끝까지 책임지는 끈기와 서비스
          전체를 바라보는 넓은 시야를 가지게 되었습니다.
          <br /> <br />
          저의 가장 큰 장점은 개발을 하면서 디자인도 깊이 이해하고 다룰 줄
          안다는 것입니다. 단순히 전달받은 화면을 코드로 똑같이 만드는 데 그치지
          않고, 개발에 필요한 부분은 직접 피그마(Figma)를 열어 다듬고 정리해서
          작업할 수 있습니다. 디자이너의 의도를 파악할 수 있기 때문에, 일일이
          묻고 답을 기다리는 시간을 크게 줄일 수 있었습니다. 덕분에 화면의 예쁜
          디테일은 그대로 살리면서도 팀 전체가 더 빠르게 일할 수 있도록 돕고
          있습니다. 또한 기획자, 디자이너, 운영팀 등 다양한 동료들과 가깝게
          대화하며 일해온 덕분에 편안하게 소통하는 방법을 잘 알고 있습니다.
          <br /> <br />
          일을 하다 보면 기술적으로 구현하기 어렵거나 복잡한 상황이 생기곤
          하는데, 저는 이런 문제들을 개발을 모르는 동료들도 쉽게 이해할 수
          있도록 일상적인 언어로 풀어서 설명하는 데 익숙합니다. 언제나 꼼꼼하게
          코드를 작성하는 기본기를 바탕으로, 동료들과 부드럽게 소통하며 더 좋은
          서비스를 함께 만들어 가는 개발자가 되겠습니다.
        </div>
      ),
    },
    {
      id: 'EDUCATION',
      title: 'EDUCATION',
      icon: '/svg/icons/about-icons/education.svg',
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
      icon: '/svg/icons/about-icons/certification.svg',
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
      icon: '/svg/icons/about-icons/experience.svg',
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
      icon: '/svg/icons/about-icons/stacks.svg',
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

                        <div className={s['icon-box']}>
                          <Image
                            src={item.icon}
                            alt={`${item.title} icon`}
                            fill
                            sizes="(max-width: 768px) 20vw, 10vw"
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
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
