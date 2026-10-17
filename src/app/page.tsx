'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_PROFILES, DEFAULT_USER_PROFILE, THEME_PRESETS } from '@/data/dummy-data';
import { useMyLinkStore } from '@/store/useMyLinkStore';
import { ProfileView } from '@/components/profile/ProfileView';
import { AddLinkDialog } from '@/components/profile/AddLinkDialog';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Palette, Users, ExternalLink, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [selectedUser, setSelectedUser] = useState<string>('mlm577373');
  const storeTheme = useMyLinkStore((state) => state.profile.theme);
  const setTheme = useMyLinkStore((state) => state.setTheme);
  const resetToDefault = useMyLinkStore((state) => state.resetToDefault);

  // 이전에 로컬스토리지에 남아있던 추가 링크 정리 및 초기화
  React.useEffect(() => {
    resetToDefault();
    try {
      localStorage.removeItem('mylink-storage');
    } catch {
      // ignore
    }
  }, [resetToDefault]);

  const currentProfile = SAMPLE_PROFILES[selectedUser] || DEFAULT_USER_PROFILE;

  return (
    <div className="relative">
      {/* 상단 퀵 데모 바 (페르소나 전환 및 테마 즉시 변경 툴바) */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 text-xs text-white">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* 로고 & 안내 */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
              MyLink
            </span>
            <Badge variant="outline" className="text-[10px] bg-white/10 border-white/20 text-indigo-300">
              Demo Preview
            </Badge>
          </div>

          {/* 페르소나 셀렉터 */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-slate-400 flex items-center gap-1 mr-1">
              <Users className="w-3.5 h-3.5" />
              <span>프로필:</span>
            </span>
            {Object.keys(SAMPLE_PROFILES).map((username) => {
              const p = SAMPLE_PROFILES[username];
              const isSelected = selectedUser === username;
              return (
                <button
                  key={username}
                  onClick={() => setSelectedUser(username)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  {p.displayName.split(' ')[0]} (@{username})
                </button>
              );
            })}
          </div>

          {/* 테마 실시간 토글 (기본 유저일 때) */}
          {selectedUser === 'mlm577373' && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-slate-400 flex items-center gap-1 mr-1">
                <Palette className="w-3.5 h-3.5" />
                <span>테마:</span>
              </span>
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => setTheme(preset.key)}
                  title={preset.name}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                    storeTheme === preset.key
                      ? 'bg-pink-600 text-white'
                      : 'bg-white/5 hover:bg-white/15 text-slate-400'
                  }`}
                >
                  {preset.name.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2">
            {selectedUser === 'mlm577373' && (
              <AddLinkDialog
                trigger={
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-medium transition-all shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                    <span>링크 추가</span>
                  </button>
                }
              />
            )}

            {/* 독립 URL 링크 */}
            <Link
              href={`/${selectedUser}`}
              target="_blank"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'xs' }),
                'text-[11px] text-slate-300 hover:text-white'
              )}
            >
              <span>단독 링크</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* 링크 목록 메인 뷰 */}
      <ProfileView
        initialProfile={currentProfile}
        useLiveStore={selectedUser === 'mlm577373'}
      />
    </div>
  );
}
