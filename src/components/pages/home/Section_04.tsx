'use client';

import React, { useState, useEffect, useMemo } from 'react';
import s from './Section_04.module.scss';
import Image from 'next/image';
import { fetchStacks } from '@/api/stack';
import FadeInMain from '@/components/atoms/animation/FadeInMain';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPlus, IconMinus } from '@tabler/icons-react';

interface Stack {
  category: string;
  stack: string;
  detail: string;
  'icon-image': string;
  'icon-image-dark'?: string;
  [key: string]: any;
}

// 카테고리별 설명 매핑 객체
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Frontend:
    '사용자 경험을 좌우하는 직관적이고 인터랙티브한 웹/앱 화면을 구현합니다.',
  'Backend & DevOps':
    '안정적인 데이터 처리와 효율적인 배포 자동화 환경을 구축합니다.',
  'Tools & Collaboration':
    '효율적인 커뮤니케이션과 체계적인 버전 관리를 통해 팀의 생산성을 높입니다.',
  'Collaboration Tools':
    '효율적인 커뮤니케이션과 체계적인 버전 관리를 통해 팀의 생산성을 높입니다.',
  Design:
    '사용자 중심의 기획을 바탕으로 심미적이고 논리적인 UI/UX를 설계합니다.',
  '3D Modeling':
    '웹 환경에 최적화된 3D 그래픽을 제작하여 몰입감 있는 시각적 경험을 제공합니다.',
};

export default function Section_04() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchStacks();
      setStacks(data);
    };
    loadData();
  }, []);

  const groupedStacks = useMemo(() => {
    return stacks.reduce(
      (acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = [];
        }
        acc[curr.category].push(curr);
        return acc;
      },
      {} as Record<string, Stack[]>,
    );
  }, [stacks]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <section id="section-05" className={s['section-container']}>
      <FadeInMain>
        <div className={s['section-wrap']}>
          <div className={s['title-section']}>
            <div className={s['text-section']}>
              <div className={s['section-title']}>기술 · 스택</div>
              <div className={s['section-text']}>
                트렌드를 유연하게 받아들이고,
                <br />
                완성도 높은 결과물로 다듬어냅니다.
              </div>
            </div>
          </div>

          <ul className={s['accordion-wrap']}>
            {Object.entries(groupedStacks).map(([category, items]) => {
              const isOpen = openCategories[category];
              // 매핑 설명 가져오기 (없을 경우 빈 문자열)
              const description = CATEGORY_DESCRIPTIONS[category] || '';

              return (
                <li
                  key={category}
                  className={`${s['accordion-item']} ${isOpen ? s['active'] : ''}`}
                >
                  <div
                    className={s['accordion-header']}
                    onClick={() => toggleCategory(category)}
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
                        <h2 className={s['category-title']}>{category}</h2>
                        {description && (
                          <p className={s['category-desc']}>{description}</p>
                        )}
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
                        <ul className={s['stack-list']}>
                          {items.map((item, idx) => (
                            <li key={idx} className={s['stack-item']}>
                              <div className={s['stack-info']}>
                                <div className={s['icon-box']}>
                                  <Image
                                    src={item['icon-image']}
                                    alt={`${item.stack} icon`}
                                    fill
                                    sizes="(max-width: 768px) 20vw, 10vw"
                                    style={{ objectFit: 'contain' }}
                                  />
                                </div>
                                <h3 className={s['stack-name']}>
                                  {item.stack}
                                </h3>
                                <p className={s['stack-detail']}>
                                  {item.detail}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
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
