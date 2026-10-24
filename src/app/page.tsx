'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/common/Header';
import { LoginPrompt } from '@/components/common/LoginPrompt';
import { UserPersonalView } from '@/components/profile/UserPersonalView';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* 상단 통합 헤더 (구글 소셜 로그인 / 사용자 프로필 / 로그아웃) */}
      <Header />

      {/* 본문 화면: 로딩 중 / 미로그인(안내 화면) / 로그인 완료(개인화 링크 화면) */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white gap-3 py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-sm text-slate-300">인증 상태 확인 중...</p>
        </div>
      ) : !user ? (
        /* 미로그인 상태: 로그인 안내 문구 및 로그인 유도 UI */
        <LoginPrompt />
      ) : (
        /* 로그인 상태: users/{user.uid}/links Firestore 개인화 화면 */
        <UserPersonalView user={user} />
      )}
    </div>
  );
}
