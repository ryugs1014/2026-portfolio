'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import WorkDetail, { Portfolio } from '../pages/works/WorkDetail';
import { fetchPortfolioById } from '@/api/portfolio';
import s from './WorkDetailModal.module.scss';
import Spinner from '@/components/atoms/loading/Spinner';

interface WorkDetailModalProps {
  id: string;
  onClose: () => void;
}

export default function WorkDetailModal({ id, onClose }: WorkDetailModalProps) {
  const [data, setData] = useState<Portfolio | null>(null);

  // 브라우저(Client) 환경 확인
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const lenis = (window as any).lenisInstance;

    const currentScrollY = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.left = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    if (lenis) lenis.stop();

    const loadData = async () => {
      const res = (await fetchPortfolioById(id)) as Portfolio;
      setData(res);
    };
    loadData();

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = 'unset';

      window.scrollTo(0, currentScrollY);

      if (lenis) lenis.start();
    };
  }, [id]);

  // SSR 단계 Portal 렌더링 방지(SSR 단계에서 사용불가)
  if (!mounted) return null;

  const modalContent = (
    <div className={s['overlay']} onClick={onClose}>
      <div
        className={s['modal-container']}
        onClick={(e) => e.stopPropagation()} // 클릭 전파 차단
        onWheel={(e) => e.stopPropagation()} // 휠 이벤트 전파 차단
        onTouchMove={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {!data ? (
          // 로딩 화면
          <div className={s['loading-overlay']}>
            <Spinner color={'white'} size={48} floating />
          </div>
        ) : (
          <WorkDetail data={data} onClose={onClose} />
        )}
      </div>
    </div>
  );

  // createPortal 이용 document.body 위치 렌더링
  return createPortal(modalContent, document.body);
}
