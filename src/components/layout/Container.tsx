// components/layout/Container.tsx

import { ReactNode } from 'react';
import s from './Container.module.scss';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'small' | 'none';
}

export default function Container({
  children,
  className = '',
  size = 'none',
}: ContainerProps) {
  return (
    <div className={`${s['container']} ${s[size]} ${className}`.trim()}>
      {children}
    </div>
  );
}
