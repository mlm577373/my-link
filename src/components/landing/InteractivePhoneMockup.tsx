'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { THEME_PRESETS, DEFAULT_USER_PROFILE } from '@/data/dummy-data';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { Sparkles, ExternalLink, MousePointerClick, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InteractivePhoneMockup() {
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>('aurora-dream');
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({
    'link-1': 342,
    'link-2': 528,
    'link-4': 215,
  });
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  const currentTheme = THEME_PRESETS.find((t) => t.key === selectedThemeKey) || THEME_PRESETS[2];

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setClickCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setLastClickedId(id);
    setTimeout(() => {
      setLastClickedId(null);
    }, 1200);
  };

  const previewLinks = [
    {
      id: 'link-2',
      title: '포트폴리오 웹사이트',
      subtitle: '최신 프로젝트 & 작업물 모음',
      icon: 'globe' as const,
      badge: 'Featured',
    },
    {
      id: 'link-1',
      title: 'GitHub 프로필',
      subtitle: '@mlm577373 • 오픈소스 프로젝트',
      icon: 'github' as const,
      badge: 'Code',
    },
    {
      id: 'link-4',
      title: '유튜브 채널 구독',
      subtitle: '실전 코딩 강좌와 테크 브이로그 📺',
      icon: 'youtube' as const,
      badge: 'Hot',
    },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto">
      {/* 1. 상단 테마 퀵 체인저 바 */}
      <div className="w-full mb-4 px-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '4s' }} />
            실시간 테마 적용해보기
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {currentTheme.name}
          </span>
        </div>

        {/* 테마 프리셋 선택 알약 버튼들 */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
          {THEME_PRESETS.slice(0, 4).map((theme) => {
            const isSelected = selectedThemeKey === theme.key;
            return (
              <button
                key={theme.key}
                type="button"
                onClick={() => setSelectedThemeKey(theme.key)}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'bg-white/15 text-white font-bold shadow-md shadow-indigo-500/20 border border-white/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full mb-1 border border-white/30 transition-transform"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <span className="truncate max-w-[65px]">{theme.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 아이폰 스타일 프레임 목업 */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/18.5] rounded-[48px] p-3.5 bg-slate-900 border-[7px] border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.2)] transition-all duration-500 ring-1 ring-white/10">
        {/* 상단 다이내믹 아일랜드 / 카메라 노치 */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2 gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* 볼륨 버튼 & 전원 버튼 장식 */}
        <div className="absolute -left-[10px] top-24 w-[3px] h-8 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[10px] top-36 w-[3px] h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[10px] top-28 w-[3px] h-14 bg-slate-700 rounded-r-md" />

        {/* 내부 스크린 화면 */}
        <div
          className={cn(
            'relative w-full h-full rounded-[38px] overflow-hidden flex flex-col transition-all duration-500 pt-10 px-4 pb-6 select-none',
            currentTheme.bgClass,
            currentTheme.textClass
          )}
        >
          {/* 스크린 내부 배경 조명 */}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* 프로필 정보 */}
          <div className="relative z-10 flex flex-col items-center text-center mt-2">
            <div className="relative group">
              <div className="w-18 h-18 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-indigo-400 to-amber-300 shadow-lg">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white/20">
                  <Image
                    src={DEFAULT_USER_PROFILE.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={DEFAULT_USER_PROFILE.displayName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>

            <h3 className="mt-2.5 text-base font-extrabold tracking-tight flex items-center gap-1">
              <span>{DEFAULT_USER_PROFILE.displayName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-normal">
                Pro
              </span>
            </h3>
            <p className="text-xs opacity-70 font-mono mt-0.5">@{DEFAULT_USER_PROFILE.username}</p>
            <p className="text-[11px] opacity-85 mt-2 max-w-[240px] leading-snug line-clamp-2">
              Next.js와 TypeScript로 감각적인 링크 공간을 만듭니다 🚀
            </p>

            {/* 태그 배지들 */}
            <div className="flex flex-wrap items-center justify-center gap-1 mt-2.5">
              {['Frontend', 'Next.js', 'Creative'].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 backdrop-blur-sm border border-white/15"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 소셜 아이콘 바 */}
            <div className="flex items-center gap-2 mt-3 p-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <span className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <PlatformIcon name="github" className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <PlatformIcon name="youtube" className="w-3.5 h-3.5 text-red-400" />
              </span>
              <span className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <PlatformIcon name="instagram" className="w-3.5 h-3.5 text-pink-400" />
              </span>
              <span className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <PlatformIcon name="mail" className="w-3.5 h-3.5 text-amber-300" />
              </span>
            </div>
          </div>

          {/* 링크 카드 리스트 (클릭 시 카운트 증가 & 마이크로 인터랙션) */}
          <div className="relative z-10 w-full space-y-2 mt-4 flex-1">
            {previewLinks.map((link) => {
              const isClicked = lastClickedId === link.id;
              const count = clickCounts[link.id] || 0;

              return (
                <div
                  key={link.id}
                  onClick={(e) => handleCardClick(link.id, e)}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'group relative w-full p-2.5 rounded-2xl flex items-center justify-between border cursor-pointer transition-all duration-200 select-none shadow-sm',
                    currentTheme.cardClass,
                    isClicked ? 'scale-95 ring-2 ring-indigo-400' : 'hover:scale-[1.02]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                      <PlatformIcon name={link.icon} className="w-4 h-4" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold truncate leading-tight">{link.title}</p>
                        {link.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-semibold">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] opacity-70 truncate mt-0.5">{link.subtitle}</p>
                    </div>
                  </div>

                  {/* 우측 클릭수 & 화살표 */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    <span className="text-[10px] font-mono opacity-80 bg-black/20 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <MousePointerClick className="w-2.5 h-2.5 text-indigo-300" />
                      {count}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* 클릭 시 피드백 애니메이션 팝업 */}
                  {isClicked && (
                    <span className="absolute -top-2 right-4 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce flex items-center gap-1 z-20">
                      <Check className="w-2.5 h-2.5" /> +1 클릭!
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 브랜드 워터마크 */}
          <div className="relative z-10 text-center pt-2">
            <span className="text-[10px] font-semibold opacity-50 tracking-wider uppercase">
              Powered by MyLink
            </span>
          </div>

          {/* 홈 인디케이터 바 */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* 목업 하단 힌트 캡션 */}
      <p className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
        <MousePointerClick className="w-3.5 h-3.5 text-indigo-400" />
        카드 클릭 시 실시간 카운트 증가와 테마 반응을 직접 체험해보세요.
      </p>
    </div>
  );
}
