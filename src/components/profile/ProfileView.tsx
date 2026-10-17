'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Plus } from 'lucide-react';
import { UserProfile } from '@/types';
import { THEME_PRESETS } from '@/data/dummy-data';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { ProfileHeader } from './ProfileHeader';
import { LinkCard } from './LinkCard';
import { SocialBar } from './SocialBar';
import { AddLinkDialog } from './AddLinkDialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileViewProps {
  initialProfile?: UserProfile;
  /** 스토어 실시간 동기화 모드 (기본 true) */
  useLiveStore?: boolean;
}

export function ProfileView({
  initialProfile,
  useLiveStore = true,
}: ProfileViewProps) {
  const storeProfile = useMyLinkStore((state) => state.profile);
  const incrementClick = useMyLinkStore((state) => state.incrementClick);

  // 실시간 스토어와 props 중 우선순위 적용
  const profile = useLiveStore && (!initialProfile || initialProfile.username === storeProfile.username)
    ? storeProfile
    : initialProfile || storeProfile;

  // 현재 테마 프리셋 검색
  const currentTheme = THEME_PRESETS.find((t) => t.key === profile.theme) || THEME_PRESETS[2]; // fallback aurora-dream

  // 활성화된 링크만 정렬하여 표시
  const activeLinks = [...(profile.links || [])]
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order);

  const handleLinkClick = (id: string) => {
    incrementClick(id);
  };

  return (
    <div
      className={cn(
        'relative min-h-screen flex flex-col items-center justify-between overflow-x-hidden selection:bg-pink-500 selection:text-white transition-colors duration-500',
        currentTheme.bgClass,
        currentTheme.textClass
      )}
    >
      {/* 배경 장식용 은은한 조명 글로우 효과 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 중앙 모바일 퍼스트 컨테이너 (최대 480px) */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col items-center">
        {/* 1. 프로필 헤더 (아바타, 이름, 핸들, 바이오, 태그, 공유) */}
        <ProfileHeader profile={profile} />

        {/* 2. 링크 카드 리스트 (와이어프레임 6번) */}
        <section className="w-full space-y-3.5 my-3" aria-label="링크 목록">
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                buttonStyle={profile.buttonStyle}
                cardThemeClass={currentTheme.cardClass}
                onLinkClick={handleLinkClick}
              />
            ))
          ) : (
            <div className="py-8 text-center opacity-60 text-sm">
              등록된 공개 링크가 없습니다.
            </div>
          )}

          {/* + 새 링크 추가 다이얼로그 트리거 버튼 */}
          {useLiveStore && (
            <div className="pt-2">
              <AddLinkDialog
                trigger={
                  <button
                    type="button"
                    className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] backdrop-blur-sm shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-indigo-300" />
                    <span>+ 새 링크 추가하기</span>
                  </button>
                }
              />
            </div>
          )}
        </section>

        {/* 3. 퀵 소셜 아이콘 바 (와이어프레임 7번) */}
        <SocialBar socialLinks={profile.socialLinks} />

        {/* 4. 바이럴 유도 배너 (와이어프레임 8번) */}
        <div className="mt-6 w-full">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-full h-auto py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border-white/20 text-white backdrop-blur-md shadow-md flex items-center justify-between group transition-all duration-300'
            )}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-300 group-hover:rotate-12 transition-transform" />
              <span className="text-xs sm:text-sm font-semibold tracking-tight">
                나만의 마이링크 30초 만에 만들기
              </span>
            </div>
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* 5. 푸터 (와이어프레임 9번) */}
      <footer className="relative z-10 py-6 text-center text-xs opacity-50">
        <p>© 2026 MyLink • Powered by Next.js 16 & shadcn/ui</p>
      </footer>
    </div>
  );
}
