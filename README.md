## 2026 포트폴리오 (2026 GANGSAN.YOU PORTFOLIO)

2026 개인 포트폴리오 웹사이트입니다. 반응형 UI와 인터랙션에 **Three.js 기반의 3D 렌더링**을 새롭게 도입하였으며, Next.js 16 및 React 19 환경으로 구축했습니다.

### 핵심 기능

- **3D 인터랙티브 렌더링 (Three.js & R3F):** `@react-three/fiber`와 `@react-three/drei`를 활용해 웹 브라우저 상에 3D 오브젝트를 렌더링하고, 스크롤 및 마우스 움직임에 반응하는 인터랙션을 구현했습니다.
- **스무스 스크롤 & 애니메이션:** `@studio-freight/lenis`를 통한 커스텀 스무스 스크롤과 `Framer Motion`을 결합하여, 자연스러운 화면 전환 및 페이드인 효과를 적용했습니다.
- **문의하기 (Contact Form):** `nodemailer` 및 Next.js API Route(`/api/contact`)를 활용하여 사이트 내에서 직접 문의 메일을 보낼 수 있습니다. 작동에 필요한 Gmail 및 Discord 관련 인증 키값은 **Vercel 환경 변수(Environment Variables)**로 분리하여 관리합니다.
- **동적 포트폴리오 렌더링 (Dynamic Routing):** 로컬 JSON 데이터를 기반으로 포트폴리오 목록과 상세 페이지(`works/[id]`)를 동적으로 생성 및 제공합니다.
- **다크/라이트 모드 (Theme Toggle):** 사용자의 시스템 설정 및 취향에 맞춰 테마를 전환할 수 있는 기능을 지원합니다.
- **반응형 웹 디자인:** PC, 태블릿, 모바일 환경에 대응하는 레이아웃을 SCSS 기반으로 구현했습니다.

### 기술 스택

- **Framework & Language:** Next.js 16.3.3 (App Router), React 19.2.8, TypeScript
- **3D & Animation:** Three.js, React Three Fiber, React Three Drei, Framer Motion (v13), Lenis
- **Styling:** SCSS (CSS Modules), Tailwind CSS (v4), Mixins, Variables
- **Backend / Utils:** Next.js Route Handlers, Nodemailer
- **Deployment:** Vercel

### 프로젝트 구조

프로젝트는 유지보수성과 컴포넌트 재사용성을 고려하여 `src` 폴더 내에 분리하여 구성했습니다.

```text
src/
├── api/               # 데이터 패칭 및 API 호출 관련 로직
├── app/               # Next.js App Router 기반의 페이지 및 API 라우팅 디렉토리
│   ├── api/contact/   # 이메일 전송 API
│   ├── about/         # 소개 페이지
│   ├── contact/       # 문의 페이지
│   ├── stacks/        # 기술 스택 페이지
│   ├── works/         # 포트폴리오 목록 및 상세([id]) 페이지
│   └── layout.tsx / page.tsx # 글로벌 레이아웃 및 메인 페이지
├── components/        # 재사용 가능한 UI 컴포넌트 (Atomic Design 유사 구조)
│   ├── 3d/            # Three.js (R3F) 관련 3D 모델 및 Scene 컴포넌트 
│   ├── atoms/         # 애니메이션, 버튼, 공통 모달 및 아이콘 컴포넌트
│   ├── layout/        # Header, Footer, MobileMenu, Container
│   ├── pages/         # 각 페이지를 구성하는 개별 Section 컴포넌트
│   └── session/       # InitialLoader, 라우팅 관련 전역 UI
├── data/              # 정적 콘텐츠 데이터 세트
│   ├── portfolios.json# 포트폴리오 상세 데이터
│   └── stacks.json    # 기술 스택 데이터
└── styles/            # 전역 스타일시트 및 믹스인
    ├── _rem.scss / _reset.scss / _variables.scss
    ├── globals.scss   # 글로벌 스타일
    └── mixins/        # 레이아웃, 타이포그래피, SVG 등 SCSS