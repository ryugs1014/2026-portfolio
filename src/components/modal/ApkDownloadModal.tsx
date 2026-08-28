'use client';

import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import s from './ApkDownloadModal.module.scss';
import CloseIcon from '@public/svg/layout/header/close.svg';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  apkUrl: string;
}

export default function ApkDownloadModal({
  isOpen,
  onClose,
  apkUrl,
}: ApkDownloadModalProps) {
  // 모달이 열렸을 때 배경(body) 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isConfirmed = window.confirm(
      'Android Apk 파일을 직접 다운로드하시겠습니까?',
    );

    if (!isConfirmed) {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s['overlay']} onClick={onClose}>
      <div className={s['modal']} onClick={(e) => e.stopPropagation()}>
        <div className={s['modal-wrap']}>
          <div className={s['button-wrap']}>
            <button className={s['closeBtn']} onClick={onClose}>
              <div className={s['close-wrap']}>
                <CloseIcon width="24" height="24" viewBox="0 0 24 24" />
              </div>
            </button>
          </div>

          <h2 className={s['title']}>Android APK 다운로드</h2>
          <p className={s['desc']}>
            스마트폰 카메라로 아래 QR 코드를 스캔하거나,
            <br />
            PC에서 직접 파일을 다운로드할 수 있습니다.
          </p>

          <div className={s['qrWrapper']}>
            <QRCodeSVG value={apkUrl} size={160} />
          </div>

          <div className={s['guide']}>
            <strong>안드로이드 설치 안내</strong>
            <ol>
              <li>다운로드 완료 후 다운로드된 APK 파일을 열어주세요.</li>
              <li>
                '출처를 알 수 없는 앱 설치' 경고창 발생 시 <b>[설정]</b>을
                클릭하세요.
              </li>
              <li>
                <b>'이 출처 허용'</b>을 켜신 후 설치를 진행하시면 됩니다.
              </li>
            </ol>
          </div>

          <div className={s['actionWrapper']}>
            <a
              href={apkUrl}
              download="application_dongle_diary_v1.0.0.apk"
              className={s['downloadBtn']}
              onClick={handleDownloadClick}
            >
              Apk 파일 다운로드
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
