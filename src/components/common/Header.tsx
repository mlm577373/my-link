'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { AddLinkDialog } from '@/components/profile/AddLinkDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Loader2 } from 'lucide-react';

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function Header() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('로그인 에러:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 text-xs text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* 좌측: 로고 및 상태 배지 */}
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              MyLink
            </span>
          </Link>

          {user ? (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex text-[10px] bg-emerald-500/10 border-emerald-500/30 text-emerald-300 gap-1 font-mono"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              users/{user.uid.slice(0, 5)}.../links
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex text-[10px] bg-white/10 border-white/20 text-slate-300"
            >
              로그인 필요
            </Badge>
          )}
        </div>

        {/* 우측: 인증 상태 및 액션 버튼들 */}
        <div className="flex items-center gap-2.5">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-1 px-3">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>확인 중...</span>
            </div>
          ) : user ? (
            <>
              {/* 링크 추가 버튼 */}
              <AddLinkDialog
                userId={user.uid}
                trigger={
                  <Button
                    size="sm"
                    className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 font-medium transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">새 링크 추가</span>
                    <span className="sm:hidden">추가</span>
                  </Button>
                }
              />

              {/* 유저 프로필 요약 정보 */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={22}
                    height={22}
                    className="rounded-full ring-1 ring-white/20 object-cover w-[22px] h-[22px]"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="font-medium text-slate-200 max-w-[100px] sm:max-w-[140px] truncate text-xs">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>

              {/* 로그아웃 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-8 px-2.5 text-xs text-slate-400 hover:text-white hover:bg-white/10"
                title="로그아웃"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-1">
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">로그아웃</span>
                  </div>
                )}
              </Button>
            </>
          ) : (
            /* 구글 소셜 로그인 버튼 */
            <Button
              size="sm"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="h-8 px-3.5 text-xs bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Google 로그인</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
