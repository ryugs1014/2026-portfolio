'use client';

import React from 'react';
import s from './Section_01.module.scss';

export default function Section_01() {
  return (
    <section className={s['section-container']}>
      <div className={s['section-wrap']}>
        <div className={s['title-section']}>
          <div className={s['section-title']}>
            creative
            <br />
            developer and
            <br />
            problem solver.
          </div>
        </div>

        <div className={s['text-section']}>
          <div className={s['section-text']}>
            단순히 주어진 화면을 코드로 옮기는 것을 넘어, 디자이너의 의도를
            파악하고 기획의 빈틈을 채워가는 프론트엔드 개발자입니다.
            <br />
            <br />
            지난 3년간 스타트업 환경에서 사용자 웹부터 사내 관리자 페이지까지 전
            과정을 주도하며, PC와 모바일을 아우르는 섬세한 인터랙션과 레이아웃을
            다듬어왔습니다. 복잡한 기술적 한계에 부딪힐 때면 누구나 이해할 수
            있는 쉬운 언어로 동료들과 소통하며 최적의 해결책을 찾아냅니다.
            <br />
            <br />
            디자인 툴을 직접 다루며 업무 효율을 높이고, 유연한 소통과 끈기 있는
            책임감으로 사용자에게는 편안함을, 팀에게는 든든한 신뢰를 주는
            서비스를 만들어가겠습니다.
          </div>
        </div>
      </div>
    </section>
  );
}
