import React from 'react';
import s from './PageTitle.module.scss';
import Container from '@/components/layout/Container';

interface PageTitleProps {
  children: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export default function PageTitle({
  children,
  description,
  className = '',
}: PageTitleProps) {
  return (
    <Container>
      <div className={`${s['title-wrapper']} ${className}`}>
        <h2 className={s['title']}>{children}</h2>

        {description && <p className={s['description']}>{description}</p>}
      </div>
    </Container>
  );
}
