'use client';

import React from 'react';
import styledComponents from 'styled-components';
import { CgSpinner } from 'react-icons/cg';

const Wrap = styledComponents.i<{ speed?: number }>`
    display:flex;
    align-items: center;
    justify-content:center;
    pointer-events:none;
    // opacity:0;
    animation: rotate ${(props) => props.speed}s linear infinite !important;
    
    &.floating{
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
    }
    
    @keyframes rotate {
      from{transform:translate(-50%,-50%)rotate(0);}
      to{transform:translate(-50%,-50%)rotate(360deg);}
    }
  `;
interface PropsInterface {
  style?: {
    width?: string;
    height?: string;
    color?: string;
  };
  speed?: number;
  floating?: boolean;
  className?: string;
  color?: string;
  size?: number;
}
const Spinner = ({
  style,
  size,
  color,
  speed = 0.6,
  floating,
  className,
  ...props
}: PropsInterface) => {
  const s = {
    ...style,
    width: size || style?.width || '20',
    height: size || style?.height || '20',
    color: color || style?.color || 'var(--color-gray-1000)',
  };

  return (
    <Wrap
      className={`${className || ''} ${floating ? 'floating' : ''}`}
      speed={speed}
      {...props}
    >
      <CgSpinner style={s} />
    </Wrap>
  );
};

export default Spinner;
