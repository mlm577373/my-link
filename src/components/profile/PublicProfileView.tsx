'use client';

import React from 'react';
import { UserProfile, LinkItem } from '@/types';
import { THEME_PRESETS } from '@/data/dummy-data';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { ExternalLink, Sparkles } from 'lucide-react';
import { updateLinkInFirestore } from '@/lib/firestore';
import { cn } from '@/lib/utils';

interface PublicProfileViewProps {
  profile: UserProfile;
  userId?: string;
}

export function PublicProfileView({ profile, userId }: PublicProfileViewProps) {
  const currentTheme =
    THEME_PRESETS.find((t) => t.key === profile.theme) || THEME_PRESETS[2]; // 기본 aurora-dream
  const isLightTheme = profile.theme === 'minimalist-light';

  const activeLinks = [...(profile.links || [])]
    .filter((l) => l.isActive)
    .sort((a, b) => a.order - b.order);

  const getInitials = (name: string) => {
    if (!name) return 'ML';
    return name.slice(0, 2).toUpperCase();
  };

  // 링크 클릭 시 Firestore 카운트 증가 처리
  const handleLinkClick = async (link: LinkItem) => {
    if (userId) {
      try {
        await updateLinkInFirestore(userId, link.id, {
          clicks: (link.clicks || 0) + 1,
        });
      } catch (err) {
        console.warn('링크 클릭 수 업데이트 실패:', err);
      }
    }
  };

  return (
    <div
      className={cn(
        'relative min-h-screen flex flex-col items-center justify-between overflow-x-hidden selection:bg-pink-500 selection:text-white transition-colors duration-500',
        currentTheme.bgClass,
        currentTheme.textClass
      )}
    >
      {/* 배경 조명 효과 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 중앙 모바일 퍼스트 컨테이너 (최대 480px) */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col items-center">
        {/* =========================================
            1. 상단: 프로필 카드 (이름, 소개글, 아바타)
            ========================================= */}
        <section className="relative w-full flex flex-col items-center text-center mb-8">
          {/* 아바타 영역 */}
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 via-indigo-500 to-cyan-400 rounded-full blur-sm opacity-80" />
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-pink-500 via-indigo-500 to-cyan-400">
              <Avatar size="xl" className="border-2 border-white/40 shadow-2xl bg-slate-900">
                {profile.avatarUrl && (
                  <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
                )}
                <AvatarFallback className="text-2xl font-black bg-gradient-to-tr from-indigo-300 to-pink-300 bg-clip-text text-transparent">
                  {getInitials(profile.displayName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* 이름 (displayName) */}
          <h1
            className={cn(
              'text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2',
              isLightTheme ? 'text-slate-900' : 'text-white'
            )}
          >
            {profile.displayName}
          </h1>

          {/* 사용자 태그/핸들 */}
          {profile.username && (
            <div className="mt-1.5">
              <Badge
                variant="outline"
                className={cn(
                  'rounded-full font-medium px-2.5 py-0.5 text-xs backdrop-blur-sm',
                  isLightTheme
                    ? 'bg-slate-200/80 border-slate-300 text-slate-700'
                    : 'bg-white/10 border-white/20 text-white/90'
                )}
              >
                @{profile.username}
              </Badge>
            </div>
          )}

          {/* 한 줄 소개글 (Bio) */}
          {profile.bio && (
            <p
              className={cn(
                'mt-3.5 text-sm sm:text-base font-normal max-w-sm whitespace-pre-line leading-relaxed',
                isLightTheme ? 'text-slate-700' : 'text-white/90'
              )}
            >
              {profile.bio}
            </p>
          )}

          {/* 관심사 태그 */}
          {profile.tags && profile.tags.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
              {profile.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn(
                    'text-[11px] font-medium rounded-full px-2.5 py-0.5',
                    isLightTheme
                      ? 'bg-slate-200/70 border-slate-300 text-slate-700'
                      : 'bg-white/5 border-white/15 text-white/80'
                  )}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </section>

        {/* =========================================
            2. 하단: 링크 목록 (클릭 시 새 탭)
            ========================================= */}
        <section className="w-full space-y-3.5" aria-label="링크 목록">
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className={cn(
                  'group relative flex items-center justify-between w-full p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 text-left shadow-md hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]',
                  isLightTheme
                    ? 'bg-white/80 hover:bg-white border-slate-200/80 text-slate-900 hover:border-slate-300'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white hover:border-white/30'
                )}
              >
                {/* 좌측: 아이콘 및 타이틀 */}
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110',
                      isLightTheme
                        ? 'bg-slate-100 border-slate-200 text-slate-800'
                        : 'bg-white/10 border-white/20 text-white'
                    )}
                  >
                    <PlatformIcon name={link.icon} className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm sm:text-base leading-snug truncate">
                      {link.title}
                    </span>
                    {link.subtitle && (
                      <span
                        className={cn(
                          'text-xs mt-0.5 truncate',
                          isLightTheme ? 'text-slate-500' : 'text-slate-300'
                        )}
                      >
                        {link.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* 우측: 배지 및 새 탭 외부 링크 아이콘 */}
                <div className="flex items-center gap-2 shrink-0">
                  {link.badge && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
                    >
                      {link.badge}
                    </Badge>
                  )}
                  <div
                    className={cn(
                      'p-1.5 rounded-lg transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                      isLightTheme ? 'text-slate-400 group-hover:text-slate-700' : 'text-slate-400 group-hover:text-white'
                    )}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div
              className={cn(
                'w-full py-12 px-6 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 backdrop-blur-md',
                isLightTheme
                  ? 'bg-white/40 border-slate-200 text-slate-600'
                  : 'bg-white/5 border-white/10 text-slate-400'
              )}
            >
              <Sparkles className="w-6 h-6 text-indigo-400 opacity-60 mb-1" />
              <p className="text-sm font-medium">등록된 공개 링크가 없습니다.</p>
              <p className="text-xs opacity-75">곧 새로운 링크가 추가될 예정입니다.</p>
            </div>
          )}
        </section>
      </main>

      {/* 푸터 워터마크 */}
      <footer className="relative z-10 w-full py-6 text-center text-xs opacity-60">
        <p>Powered by MyLink</p>
      </footer>
    </div>
  );
}
