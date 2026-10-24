# 구글 소셜 로그인 및 Firestore 개인화 작업 현황

- **생성 일시**: 2026-10-24
- **목표**: 
  1. 헤더에 구글 소셜 로그인/로그아웃 기능 추가
  2. Firestore 경로를 `users/{user.uid}/links`로 개인화하고 유저 정보 및 링크 화면에 렌더링
  3. 로그인 여부에 따른 화면 분기 (비로그인 시 사용 안내 문구 및 로그인 유도 UI 제공)

---

## 📌 태스크 진행 상황

- [x] **Task 0**: 작업 계획 수립 및 태스크 파일(`docs/task.md`) 생성
- [x] **Task 1**: Firebase Auth 모듈 및 `AuthContext` 구현
  - [x] `src/lib/auth.ts`: GoogleAuthProvider 로그인/로그아웃 헬퍼 구현
  - [x] `src/contexts/AuthContext.tsx`: 전역 인증 상태 제공자(Provider) 및 `useAuth` 훅 작성
  - [x] `src/app/layout.tsx`: `AuthProvider` 감싸기
- [x] **Task 2**: Firestore 경로 개인화 (`users/{userId}/links`)
  - [x] `src/lib/firestore.ts`: `userId` 매개변수 적용 (추가, 조회, 수정, 삭제, 실시간 구독)
  - [x] 사용자 프로필 문서(`users/{userId}`) 생성 및 조회 함수 추가
- [x] **Task 3**: 헤더(Header) 구글 소셜 로그인 UI 구현
  - [x] `src/components/common/Header.tsx`: 상단 반응형 헤더 구현
  - [x] 비로그인 시: 구글 로그인 버튼 (Google 컬러 SVG 로고 및 로딩 상태)
  - [x] 로그인 시: 유저 프로필 사진, 닉네임/이메일, 링크 추가 버튼, 로그아웃 버튼
- [x] **Task 4**: 로그인 여부에 따른 화면 분기 및 미로그인 안내 UI 구현
  - [x] 비로그인 시: `src/components/common/LoginPrompt.tsx` (안내 문구, 구글 로그인 버튼, 기능 안내 카드)
  - [x] 로그인 시: `src/components/profile/UserPersonalView.tsx` (Firestore `users/{user.uid}/links` 실시간 동기화 및 유저 정보 렌더링)
- [x] **Task 5**: 링크 추가/수정 연동 (`AddLinkDialog.tsx`)
  - [x] `users/{user.uid}/links`로 새 링크 저장 처리 및 콜백/스토어 동기화
- [x] **Task 6**: 빌드 및 타입/린트 테스트 검증
  - [x] TypeScript 컴파일 검사 (`npx tsc --noEmit`) 100% 정상 통과
  - [x] ESLint 검사 통과 (0 errors)
  - [x] 전체 기능 흐름 및 요구사항 반영 완료

---

## 📝 변경 기록 (Work Log)
- **2026-10-24**: 태스크 파일 생성 및 작업 시작
- **2026-10-24**: Firebase Auth 및 AuthContext 작성 (`src/lib/auth.ts`, `src/contexts/AuthContext.tsx`, `src/app/layout.tsx`)
- **2026-10-24**: Firestore `users/{userId}/links` 개인화 CRUD 및 프로필 초기화 구현 (`src/lib/firestore.ts`)
- **2026-10-24**: 공통 헤더에 구글 로그인/로그아웃/프로필 UI 구현 (`src/components/common/Header.tsx`)
- **2026-10-24**: 미로그인 안내 화면(`src/components/common/LoginPrompt.tsx`) 및 로그인 후 개인화 대시보드(`src/components/profile/UserPersonalView.tsx`) 구현
- **2026-10-24**: `AddLinkDialog`에서 `users/{user.uid}/links` 경로로 저장되도록 수정 완료
- **2026-10-24**: TypeScript 및 ESLint 검증 통과 (타입 에러 0건, 린트 에러 0건)
- **2026-10-24**: Google 프로필 이미지 도메인(`lh3.googleusercontent.com`) 호스트 미허용 런타임 오류 해결
  - `next.config.ts`에 `images.remotePatterns` 등록 (*.googleusercontent.com 등)
  - `Header.tsx`의 유저 아바타를 안전한 반응형 렌더링으로 개선하여 서버 재시작 여부와 관계없이 즉시 표시 가능하도록 보완
- **2026-10-24**: 개인 공개 페이지 공유 링크 복사 및 공개 뷰 연동 완료
  - `ProfileHeader.tsx`: 공유 버튼 클릭 시 `origin` 대신 `origin/{username}` 경로를 복사하도록 수정
  - `src/app/[username]/page.tsx`: Firestore `users` 및 `users/{uid}/links` 실제 데이터를 조회하여 누구나 링크 페이지를 볼 수 있도록 구현
  - `UserPersonalView.tsx`: 로그인 화면 상단에 "내 공개 공유 페이지 링크(`/{username}`)" 전용 복사 및 새 탭 바로가기 카드 추가
  - `LinkCard.tsx`: 공개 페이지 열람 시 방문자에게 수정/삭제 버튼이 보이지 않도록 `readOnly` 처리
- **2026-10-24**: Next.js Server Component 직렬화 에러 해결 (Only plain objects can be passed...)
  - `src/lib/firestore.ts`: Firestore의 `Timestamp` 객체(`createdAt`, `updatedAt` 등)를 Plain ISO String으로 자동 직렬화하는 `sanitizeFirestoreData` 헬퍼 함수 구현 및 적용
  - `src/app/[username]/page.tsx`: Server Component에서 Client Component(`ProfileView`)로 전달되는 프로필 데이터를 `sanitizeFirestoreData`로 래핑하여 RSC 직렬화 경고/오류 원천 차단
