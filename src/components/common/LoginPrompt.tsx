'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Sparkles, Layers, ArrowRight, Loader2, Link2 } from 'lucide-react';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
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

export function LoginPrompt() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('로그인 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-50px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-950 via-indigo-950/60 to-slate-950 text-white overflow-hidden">
      {/* 배경 조명 효과 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 중앙 메인 카드 */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        {/* 아이콘 배지 */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 animate-bounce duration-1000">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Link2 className="w-7 h-7 text-indigo-400" />
          </div>
        </div>

        {/* 타이틀 및 안내 문구 */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            마이링크(MyLink) 서비스 안내
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            로그인 후에 <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              나만의 링크 페이지
            </span>
            를 사용해보세요
          </h1>
          <p className="text-sm text-slate-300/90 leading-relaxed max-w-sm mx-auto">
            본 서비스는 개인화된 링크 관리를 제공합니다.
            <br />
            구글 계정으로 로그인하시면 <span className="font-mono text-indigo-300 text-xs bg-white/5 px-1.5 py-0.5 rounded">users/{'{user.uid}'}/links</span> 경로에 안전하게 개인 데이터가 저장되고 관리됩니다.
          </p>
        </div>

        {/* 구글 로그인 유도 버튼 */}
        <div className="pt-2">
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                <span>로그인 처리 중...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                <span>Google 계정으로 계속하기</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-60" />
              </>
            )}
          </Button>
          <p className="text-[11px] text-slate-400 mt-2">
            별도의 회원가입 없이 구글 계정으로 즉시 시작할 수 있습니다.
          </p>
        </div>

        {/* 기능 안내 그리드 */}
        <div className="pt-6 grid grid-cols-1 gap-2.5 text-left">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">안전한 개인 클라우드 동기화</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                로그인한 계정의 전용 Firestore 경로에 링크가 암호화되어 안전하게 보관됩니다.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">실시간 프로필 & 링크 카드 관리</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                원하는 소셜 미디어, 깃허브, 블로그 링크를 간편하게 추가하고 커스터마이징하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
