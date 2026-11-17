# 🔗 마이링크 (MyLink)

<div align="center">

![MyLink Logo](https://img.shields.io/badge/MyLink-v2.0-ec4899?style=for-the-badge&logo=linktree&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase_v13-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

<br />

**나의 모든 콘텐츠와 활동을 감각적인 단 하나의 링크로 모으는 올인원 바이오 링크(Bio-Link) 플랫폼**

[✨ 데모 둘러보기](http://localhost:3000) • [🚀 기능 소개](#-핵심-기능) • [🛠️ 기술 스택](#-기술-스택) • [📦 빠른 시작](#-빠른-시작)

</div>

---

## 📖 프로젝트 소개

**MyLink(마이링크)**는 크리에이터, 개발자, 프리랜서가 자신의 소셜 미디어(유튜브, 인스타그램, 깃허브 등), 포트폴리오, 블로그, 후원 링크를 하나의 감성적인 프로필 페이지로 모아 손쉽게 공유할 수 있는 **차세대 바이오 링크 서비스**입니다.

복잡한 가입 절차 없이 **Google 계정 하나로 1초 만에 시작**할 수 있으며, 실시간 클라우드 동기화와 다채로운 인터랙티브 테마, 실시간 클릭수 통계 분석, 그리고 카카오톡/슬랙 맞춤형 **동적 오픈 그래프(OG) 이미지**를 지원합니다.

---

## ✨ 핵심 기능

### 1. 📱 반응형 인터랙티브 랜딩 페이지
- **실시간 테마 스마트폰 목업**: 아이폰 프레임 내부에서 4가지 테마(*Modern Dark*, *Minimalist Light*, *Aurora Dream*, *Cyber Neon*)를 실시간으로 전환하며 체험 가능.
- **클릭 피드백 마이크로 인터랙션**: 링크 카드 클릭 시 `+1 클릭!` 팝업과 함께 실시간 카운트 증가.
- **Bento Grid 쇼케이스**: 실시간 트래픽 상승률 차트, 고유 URL 복사, 플랫폼 자동 감지, 버튼 스타일 탭 스위처 탑재.
- **10초 라이브 시뮬레이터**: 이름, 한 줄 소개, 링크를 입력하면 우측 글래스 카드에 즉시 반영되는 인터랙티브 위젯.
- **아코디언 토글 FAQ**: 비용, 링크 개수, 통계, 공유 방법 등 궁금증을 즉시 해결.

### 2. 🎨 감성 테마 & 글래스모피즘 커스텀
- **6가지 감각적인 테마 프리셋**:
  - `Aurora Dream`: 몽환적인 핑크-퍼플 그라데이션
  - `Modern Dark`: 깊이 있는 딥 네이비 & 인디고 글래스모피즘
  - `Minimalist Light`: 깔끔하고 단정한 화이트 & 라이트 그레이
  - `Cyber Neon`: 미래지향적 네온 그린 & 블랙 콘트라스트
  - `Sunset Warm`: 따뜻한 오렌지-코랄 노을 감성
  - `Forest Sage`: 차분하고 안정적인 세이지 그린 & 틸
- **버튼 스타일 쉐이프**: `Pill(캡슐형)`, `Rounded(박스형)`, `Soft Glass(블러 글래스)` 형태 자유 선택.

### 3. 🔗 스마트 링크 & 소셜 채널 관리
- **URL 자동 플랫폼 인식**: GitHub, YouTube, Instagram, Velog, X(Twitter), Email 등 입력한 주소에 맞는 브랜드 로고와 컬러 자동 매칭.
- **실시간 노출 제어**: 활성/비활성 토글 스위치로 준비 중인 링크를 손쉽게 숨김 처리.
- **커스텀 배지 태그**: `Featured`, `Hot`, `Official`, `New`, `Soon` 등 강조 뱃지 지원.

### 4. 📊 실시간 클릭수 & 통계 대시보드 (`/stats`)
- **실시간 트래픽 추이 그래프**: Recharts 기반 인터랙티브 차트로 주간/월간 클릭 동향 분석.
- **인기 링크 TOP 3 랭킹**: 유입량이 가장 높은 핵심 콘텐츠 식별.
- **플랫폼별 유입 분포**: 소셜 채널별 방문자 기여도 파악.

### 5. 👤 고유 핸들 프로필 공유 (`/[displayName]`)
- `mylink.io/@김민준` 형태의 직관적인 사용자 고유 URL 제공.
- Firebase Firestore 실시간 리스너(`onSnapshot`)를 통해 실시간 데이터 동기화 (`users/{userId}/links`).

### 6. 🖼️ Next.js 파일 시스템 기반 동적 오픈 그래프 (OG Image)
- **일반 경로 (`/opengraph-image`)**: 브랜드 헤드라인과 서비스 가치를 담은 1200×630 고해상도 OG 이미지.
- **동적 프로필 경로 (`/[displayName]/opengraph-image`)**: 사용자의 프로필 사진, 닉네임, 핸들, 소개글, 태그, 등록된 링크 수를 실시간으로 합성한 맞춤형 OG 이미지 생성.
- **배포 환경 최적화**: `metadataBase` 동적 감지(`VERCEL_URL`, `NEXT_PUBLIC_SITE_URL`) 및 Base64 이미지 변환 안전장치(Graceful Fallback) 내장.

---

## 🛠️ 기술 스택

| 분류 | 기술 스택 | 설명 |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (Turbopack)** | 최신 App Router 아키텍처 및 고성능 서버 컴포넌트 |
| **Language** | **TypeScript 5** / **React 19** | 강력한 정적 타입 검증 및 모던 리액트 훅 |
| **Styling** | **Tailwind CSS v4** | 최신 유틸리티 CSS 엔진 & OKLCH 컬러 시스템 |
| **Design System** | **Glassmorphism**, **Base UI** | 세련된 블러 효과, 다크 네온 조명, 반응형 모바일 퍼스트 |
| **Icons & Charts** | **Lucide React**, **Recharts** | 직관적인 벡터 아이콘 및 실시간 인터랙티브 데이터 차트 |
| **State Management**| **Zustand** | 가볍고 직관적인 클라이언트 전역 상태 관리 |
| **Backend / DB** | **Firebase v13 (Auth & Firestore)** | Google OAuth 소셜 로그인 및 실시간 클라우드 DB 동기화 |
| **OG Generation** | **next/og (ImageResponse)** | Edge/NodeJS 런타임 기반 Satori 동적 이미지 렌더링 |

---

## 📁 프로젝트 폴더 구조

```text
my-link/
├── public/                     # 정적 에셋 및 파비콘
├── src/
│   ├── app/
│   │   ├── [displayName]/      # 👤 동적 사용자 프로필 페이지
│   │   │   ├── opengraph-image.tsx  # 🖼️ 사용자 맞춤 동적 OG 이미지
│   │   │   └── page.tsx        # 공개 프로필 뷰 및 메타데이터 생성
│   │   ├── stats/              # 📊 실시간 클릭 통계 대시보드
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css         # Tailwind CSS v4 테마 및 OKLCH 변수
│   │   ├── layout.tsx          # 전역 레이아웃 & metadataBase 설정
│   │   ├── opengraph-image.tsx # 🖼️ 서비스 기본 메인 OG 이미지
│   │   └── page.tsx            # 메인 홈 (랜딩 페이지 / 개인화 관리 화면)
│   ├── components/
│   │   ├── common/             # 공통 헤더, 로그인 모달, 플랫폼 아이콘
│   │   │   ├── Header.tsx
│   │   │   ├── LoginPrompt.tsx
│   │   │   └── PlatformIcon.tsx
│   │   ├── landing/            # 🚀 신규 인터랙티브 랜딩 페이지 컴포넌트
│   │   │   ├── BentoFeatures.tsx          # 벤토 그리드 기능 쇼케이스
│   │   │   ├── FaqSection.tsx             # 아코디언 토글 FAQ
│   │   │   ├── InteractivePhoneMockup.tsx # 실시간 테마 스마트폰 목업
│   │   │   ├── InteractivePlayground.tsx  # 10초 라이브 시뮬레이터
│   │   │   └── LandingPage.tsx            # 메인 랜딩 통합 페이지
│   │   ├── profile/            # 프로필 및 링크 관리 UI
│   │   │   ├── AddLinkDialog.tsx
│   │   │   ├── EditProfileDialog.tsx
│   │   │   ├── LinkCard.tsx
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── PublicProfileView.tsx
│   │   │   ├── SocialBar.tsx
│   │   │   └── UserPersonalView.tsx
│   │   └── ui/                 # 버튼, 카드, 뱃지, 다이얼로그 등 공용 UI
│   ├── contexts/
│   │   └── AuthContext.tsx     # Firebase Auth 인증 컨텍스트
│   ├── data/
│   │   └── dummy-data.ts       # 테마 프리셋 및 데모 프로필 데이터
│   ├── lib/
│   │   ├── auth.ts             # Google 로그인/로그아웃 헬퍼
│   │   ├── firebase.ts         # Firebase 앱 인스턴스 초기화
│   │   ├── firestore.ts        # Firestore CRUD 및 실시간 구독 함수
│   │   ├── site.ts             # 배포 절대 도메인 자동 감지 유틸리티
│   │   └── utils.ts            # 스타일 병합 유틸리티 (cn)
│   ├── store/
│   │   └── useMyLinkStore.ts   # Zustand 전역 스토어
│   └── types/
│       ├── index.ts            # 프로필 및 테마 타입 정의
│       └── link.ts             # 링크 아이템 인터페이스
├── firestore.rules             # Firestore 데이터 격리 보안 규칙
├── next.config.ts              # Next.js 설정 (원격 이미지 허용 등)
├── package.json
└── tsconfig.json
```

---

## 🚀 빠른 시작

### 1. 리포지토리 클론 및 의존성 설치

```bash
# 리포지토리 복제
git clone https://github.com/mlm577373/my-link.git

# 프로젝트 폴더로 이동
cd my-link

# 패키지 설치
npm install
```

### 2. 환경 변수 설정 (`.env.local`)

루트 디렉터리에 `.env.local` 파일을 생성하고 Firebase 및 사이트 환경 변수를 설정합니다:

```env
# Firebase 클라우드 설정
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# (선택) 커스텀 프로덕션 도메인
NEXT_PUBLIC_SITE_URL=https://my-link.vercel.app
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 바로 확인하세요!

---

## 🔒 보안 규칙 (Firestore Security Rules)

MyLink는 사용자의 소중한 링크 데이터를 보호하기 위해 사용자 UID 기반의 엄격한 보안 규칙을 적용하고 있습니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 공개 프로필 및 링크는 누구나 읽기 가능, 수정은 소유자 본인만 가능
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      
      match /links/{linkId} {
        allow read: if true;
        // 클릭수 증가(increment)는 익명 방문자도 허용
        allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['clicks']);
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

## 👤 제작자 및 라이선스

- **개발자**: 김민준 ([@mlm577373](https://github.com/mlm577373))
- **이메일**: mlm577373@gmail.com
- **GitHub**: [https://github.com/mlm577373/my-link](https://github.com/mlm577373/my-link)
- **라이선스**: 본 프로젝트는 MIT 라이선스를 따릅니다.
