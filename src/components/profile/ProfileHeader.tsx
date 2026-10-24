'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { UserProfile } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);
  const isLightTheme = profile.theme === 'minimalist-light';

  const handleShare = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // 개인 공개 페이지 URL 결정: profile.username 경로 우선
    const url = profile.username
      ? `${origin}/${profile.username}`
      : typeof window !== 'undefined'
      ? window.location.href
      : '';

    const shareData = {
      title: `${profile.displayName} (@${profile.username}) - 마이링크`,
      text: profile.bio || `${profile.displayName}님의 마이링크 페이지입니다.`,
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error(err);
        }
      }
    }

    // Web Share 미지원 시 클립보드 복사
    if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 이니셜 추출 (예: '김민준' -> 'MJ' 또는 앞 2글자)
  const getInitials = (name: string) => {
    if (!name) return 'ML';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="relative w-full flex flex-col items-center text-center mb-7">
      {/* 상단 우측 공유 액션 버튼 */}
      <div className="absolute top-0 right-0 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className={cn(
            'rounded-full backdrop-blur-md shadow-sm gap-1.5 text-xs h-8 px-3 transition-colors',
            isLightTheme
              ? 'bg-white/80 hover:bg-white border-slate-300 text-slate-800'
              : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className={cn('font-medium', isLightTheme ? 'text-emerald-600' : 'text-emerald-300')}>복사됨!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>공유</span>
            </>
          )}
        </Button>
      </div>

      {/* 아바타 영역 (그라데이션 링 + 활성 뱃지) */}
      <div className="relative group mb-4 mt-2">
        {/* 그라데이션 빛 효과 링 */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 via-indigo-500 to-cyan-400 rounded-full blur-sm opacity-80 group-hover:opacity-100 transition duration-500" />

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

        {/* 우측 하단 온라인/활성 인디케이터 */}
        <div
          className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-lg"
          title="Active Creator"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      {/* 이름 & @username 핸들 뱃지 */}
      <h1 className={cn('text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2', isLightTheme ? 'text-slate-900' : 'text-white')}>
        <span>{profile.displayName}</span>
      </h1>

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

      {/* 한 줄 바이오 (소개글) */}
      {profile.bio && (
        <p className={cn('mt-3 text-sm sm:text-base font-normal max-w-sm whitespace-pre-line leading-relaxed', isLightTheme ? 'text-slate-700' : 'text-white/90')}>
          {profile.bio}
        </p>
      )}

      {/* 기술/관심사 태그 칩 */}
      {profile.tags && profile.tags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
          {profile.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                'text-[11px] font-medium rounded-full px-2.5 py-0.5 transition-opacity',
                isLightTheme
                  ? 'bg-slate-200/70 border-slate-300 text-slate-700 hover:bg-slate-300/80'
                  : 'bg-white/5 border-white/15 text-white/80 hover:opacity-100'
              )}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}
