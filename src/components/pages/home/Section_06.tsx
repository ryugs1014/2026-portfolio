'use client';

import React, { useState } from 'react';
import s from './Section_06.module.scss';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import RightArrowSVG from '@/components/atoms/common/RightArrowSVG';
import FadeInMain from '@/components/atoms/animation/FadeInMain';
import ContactModal from '@/components/modal/ContactModal';

export default function Section_06() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const getEmail = () => {
    return 'ryugs1014@gmail.com';
  };

  return (
    <section id="section-06" className={s['section-container']}>
      <FadeInMain>
        <Container>
          <div className={s['section-wrap']}>
            <div className={s['title-section']}>
              <div className={s['text-section']}>
                <div className={s['section-title']}>문의하기</div>
                <div className={s['section-text']}>
                  함께 일할 사람을 찾고 계신가요?
                </div>
              </div>
            </div>

            <ul className={s['content-section']}>
              <li>
                <div className={s['contact-mail']}>contact.</div>
              </li>
              <li className={s['button-list-section']}>
                <div className={s['contact-buttons']}>
                  <Link
                    href={'https://github.com/ryugs1014'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className={s['link-button']}>
                      <span>GitHub</span>

                      <RightArrowSVG
                        className={s['link']}
                        responsivSize={true}
                      />
                    </button>
                  </Link>

                  <button
                    className={s['link-button']}
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    <span>메일 작성</span>

                    <RightArrowSVG responsivSize={true} />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </Container>
      </FadeInMain>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
}
