'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import {
  subscribeLinksFromFirestore,
  ensureUserProfile,
  updateLinkInFirestore,
  saveUserProfileToFirestore,
} from '@/lib/firestore';
import { LinkItem, UserProfile, ThemeKey } from '@/types';
import { THEME_PRESETS } from '@/data/dummy-data';
import { ProfileHeader } from './ProfileHeader';
import { LinkCard } from './LinkCard';
import { SocialBar } from './SocialBar';
import { AddLinkDialog } from './AddLinkDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Palette,
  Plus,
  Loader2,
  Database,
  Layers,
  Share2,
  Check,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserPersonalViewProps {
  user: User;
}

export function UserPersonalView({ user }: UserPersonalViewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. 유저 프로필 초기화 및 조회
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const userProf = await ensureUserProfile(user);
        if (isMounted) {
          setProfile(userProf);
        }
      } catch (err) {
        console.error('프로필 로드 에러:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // 2. users/{user.uid}/links 실시간 구독
  useEffect(() => {
    const unsubscribe = subscribeLinksFromFirestore(
      user.uid,
      (fetchedLinks) => {
        setLinks(fetchedLinks);
      },
      (error) => {
        console.error('링크 구독 실패:', error);
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  // 테마 변경 핸들러
  const handleThemeChange = async (themeKey: ThemeKey) => {
    if (!profile) return;
    const updated = { ...profile, theme: themeKey };
    setProfile(updated);
    try {
      await saveUserProfileToFirestore(user.uid, { theme: themeKey });
    } catch (e) {
      console.error('테마 저장 실패:', e);
    }
  };

  // 링크 클릭 수 증가 핸들러
  const handleLinkClick = async (linkId: string) => {
    const targetLink = links.find((l) => l.id === linkId);
    if (!targetLink) return;

    const nextClicks = (targetLink.clicks || 0) + 1;
    // UI 낙관적 업데이트
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, clicks: nextClicks } : l))
    );

    try {
      await updateLinkInFirestore(user.uid, linkId, { clicks: nextClicks });
    } catch (e) {
      console.error('클릭 수 업데이트 실패:', e);
    }
  };

  const currentThemeKey = profile?.theme || 'aurora-dream';
  const currentTheme =
    THEME_PRESETS.find((t) => t.key === currentThemeKey) || THEME_PRESETS[2];

  const activeLinks = [...links]
    .filter((l) => l.isActive)
    .sort((a, b) => a.order - b.order);

  // 프로필 정보 결합 (Firestore 프로필과 구글 유저 정보)
  const fullProfile: UserProfile = {
    username: profile?.username || user.email?.split('@')[0] || user.uid.slice(0, 8),
    displayName: user.displayName || profile?.displayName || '마이링크 유저',
    bio: profile?.bio || '구글 로그인으로 연동된 마이링크 페이지입니다.',
    avatarUrl: user.photoURL || profile?.avatarUrl,
    tags: profile?.tags || ['Google 로그인', 'MyLink'],
    theme: currentThemeKey,
    buttonStyle: profile?.buttonStyle || { shape: 'rounded', variant: 'soft-glass' },
    links: links,
    socialLinks: profile?.socialLinks || [],
  };

  // 공개 공유 URL
  const sharePath = fullProfile.username;
  const shareFullUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${sharePath}`
      : `/${sharePath}`;

  const handleCopyShareLink = async () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareFullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-50px)] flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="text-sm text-slate-300">내 링크 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative min-h-[calc(100vh-50px)] flex flex-col items-center justify-between overflow-x-hidden selection:bg-pink-500 selection:text-white transition-colors duration-500',
        currentTheme.bgClass,
        currentTheme.textClass
      )}
    >
      {/* 배경 장식 글로우 조명 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 중앙 모바일 퍼스트 컨테이너 (최대 480px) */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
        {/* 1. 내 공개 마이링크 공유 카드 */}
        <div className="w-full mb-4 p-3 rounded-2xl bg-indigo-950/60 backdrop-blur-md border border-indigo-500/30 shadow-lg flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              내 공개 공유 페이지 링크
            </span>
            <span className="text-[10px] text-slate-400">누구나 열람 가능</span>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-xl border border-white/10">
            <span className="text-xs font-mono text-slate-300 truncate flex-1 px-1">
              /{sharePath}
            </span>
            <Button
              size="xs"
              variant="outline"
              onClick={handleCopyShareLink}
              className="h-7 px-2.5 text-xs bg-white/10 hover:bg-white/20 border-white/20 text-white shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400 mr-1" />
                  <span className="text-emerald-300 font-semibold">복사됨!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3 h-3 mr-1 text-slate-300" />
                  <span>주소 복사</span>
                </>
              )}
            </Button>
            <Link
              href={`/${sharePath}`}
              target="_blank"
              className="inline-flex items-center justify-center h-7 px-2 text-xs rounded-md bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="새 탭에서 내 공개 페이지 확인"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Firestore 개인화 경로 안내 배너 */}
        <div className="w-full mb-5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Firestore 개인 데이터 연동
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 border-emerald-400/30 text-emerald-300">
              실시간 동기화
            </Badge>
          </div>
          <p className="text-[11px] font-mono text-slate-300 truncate">
            저장 경로: <span className="text-white font-medium">users/{user.uid}/links</span>
          </p>
          <p className="text-[10px] text-slate-400">
            계정: {user.email || '익명'} ({user.displayName || '이름 없음'})
          </p>
        </div>

        {/* 3. 테마 실시간 변경 바 */}
        <div className="w-full mb-6 flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-x-auto">
          <span className="text-xs text-slate-300 flex items-center gap-1 pl-1">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[11px]">테마:</span>
          </span>
          <div className="flex items-center gap-1">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => handleThemeChange(preset.key)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                  currentThemeKey === preset.key
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/15 text-slate-400'
                }`}
              >
                {preset.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 4. 프로필 헤더 (상단 공유 버튼 포함) */}
        <ProfileHeader profile={fullProfile} />

        {/* 5. 링크 카드 리스트 */}
        <section className="w-full space-y-3.5 my-3" aria-label="개인 링크 목록">
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                buttonStyle={fullProfile.buttonStyle}
                cardThemeClass={currentTheme.cardClass}
                onLinkClick={handleLinkClick}
              />
            ))
          ) : (
            <div className="py-10 px-4 text-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm my-2">
              <div className="w-10 h-10 rounded-full bg-white/10 mx-auto flex items-center justify-center text-indigo-300 mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                등록된 링크가 아직 없습니다
              </p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                아래 버튼을 눌러 첫 번째 링크 카드를 추가해보세요!
              </p>
              <AddLinkDialog
                userId={user.uid}
                trigger={
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-xs font-semibold shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    첫 링크 등록하기
                  </Button>
                }
              />
            </div>
          )}

          {/* 링크 추가 버튼 */}
          <div className="pt-2">
            <AddLinkDialog
              userId={user.uid}
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
        </section>

        {/* 6. 소셜 아이콘 바 */}
        <SocialBar
          socialLinks={fullProfile.socialLinks}
          isLightTheme={currentThemeKey === 'minimalist-light'}
        />
      </main>

      {/* 푸터 */}
      <footer className="relative z-10 py-6 text-center text-xs opacity-50">
        <p>© 2026 MyLink • Firestore users/{user.uid.slice(0, 6)}.../links 동기화됨</p>
      </footer>
    </div>
  );
}
