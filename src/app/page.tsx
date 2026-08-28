// app/page.tsx

import type { Metadata } from 'next';
import HomeClient from '@/components/pages/home/HomeClient';

export const metadata: Metadata = {
  title: '유강산 포트폴리오 | Front-end Developer',
  description: '새로운 변화 속에서 최선을 찾는 개발자 유강산 입니다.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Home() {
  return <HomeClient />;
}
