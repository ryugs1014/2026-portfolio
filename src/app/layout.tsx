import type { Metadata } from 'next';
import '@/styles/globals.scss';
import localFont from 'next/font/local';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/atoms/buttons/ScrollToTop';
import InitialLoader from '@/components/session/InitialLoader';
import SmoothScroll from '@/components/atoms/animation/SmoothScroll';
import PageExitEffect from '@/components/atoms/animation/PageExitEffect';
import AccessLog from '@/components/atoms/common/AccessLog';

import { Analytics } from '@vercel/analytics/react';

const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-color-scheme', 'light');
      }
    } catch (e) {}
  })();
`;

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gangsanyou.com'),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body>
        <SmoothScroll />
        <InitialLoader />
        <PageExitEffect />
        <AccessLog />

        <div className="app-wrapper">
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </div>

        <Analytics />
      </body>
    </html>
  );
}
