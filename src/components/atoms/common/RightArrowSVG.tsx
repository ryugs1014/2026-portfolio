import React from 'react';
import s from './RightArrowSVG.module.scss';
import RightArrow from '@public/svg/common/right-arrow.svg';

interface RightArrowProps {
  className?: string;
  responsivSize?: boolean;
}

export default function RightArrowSVG({
  className = '',
  responsivSize = false,
}: RightArrowProps) {
  return (
    <div
      className={`${s['svg-box']} ${className} ${responsivSize && s['responsive-size']}`}
    >
      <RightArrow width="36" height="36" viewBox="0 0 36 36" />
    </div>
  );
}
