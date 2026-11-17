'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { InteractivePhoneMockup } from './InteractivePhoneMockup';
import { BentoFeatures } from './BentoFeatures';
import { InteractivePlayground } from './InteractivePlayground';
import { FaqSection } from './FaqSection';
import {
  Sparkles,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Users,
  MousePointer2,
  Layers,
  Heart,
} from 'lucide-react';

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

export function LandingPage() {
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
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-pink-500 selection:text-white overflow-hidden">
      {/* 전역 배경 오로라 앰비언트 글로우 */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[1400px] left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. Hero 섹션 */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* 좌측: 헤드라인, 혜택, 로그인 CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* 상태 뱃지 */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-ping" />
              <span>차세대 올인원 프로필 링크 • MyLink v2.0</span>
            </div>

            {/* 메인 타이틀 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              나의 모든 것을 <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                단 하나의 감각적인 링크
              </span>
              로 모으세요.
            </h1>

            {/* 서브 카피 */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              인스타그램 바이오, 포트폴리오, 유튜브, 깃허브, 블로그를 나만의 테마로 완성하세요. 별도 회원가입 없이 Google 계정으로 1초 만에 즉시 시작할 수 있습니다.
            </p>

            {/* 주요 특징 체크 불릿 */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                평생 완전 무료
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                무제한 링크 & 클릭수 통계
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                6종의 감성 테마 프리셋
              </span>
            </div>

            {/* 원클릭 구글 로그인 CTA */}
            <div className="pt-2 max-w-md mx-auto lg:mx-0 space-y-2.5">
              <Button
                size="lg"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-base shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/40 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                    <span>Google 로그인 연결 중...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5" />
                    <span>Google 계정으로 무료 시작하기</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>안전한 Firebase 클라우드에 자동 동기화됩니다.</span>
              </div>
            </div>

            {/* 사용자 지표 미니 배너 */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 border-t border-white/10">
              <div>
                <p className="text-xl font-black text-white font-mono">10,000+</p>
                <p className="text-[11px] text-slate-400">활성 링크 페이지</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <p className="text-xl font-black text-white font-mono">100%</p>
                <p className="text-[11px] text-slate-400">반응형 모바일 지원</p>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div>
                <p className="text-xl font-black text-white font-mono">0원</p>
                <p className="text-[11px] text-slate-400">평생 무료 이용</p>
              </div>
            </div>
          </div>

          {/* 우측: 재미있는 인터랙티브 폰 목업 & 테마 스위처 */}
          <div className="lg:col-span-5 flex justify-center">
            <InteractivePhoneMockup />
          </div>
        </div>
      </section>

      {/* 2. Bento Grid 기능 쇼케이스 */}
      <BentoFeatures />

      {/* 3. 라이브 시뮬레이터 인터랙티브 플레이그라운드 */}
      <InteractivePlayground />

      {/* 4. 자주 묻는 질문 FAQ */}
      <FaqSection />

      {/* 5. 바텀 파이널 CTA */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative rounded-3xl p-8 sm:p-14 text-center bg-gradient-to-tr from-indigo-900/50 via-purple-900/40 to-pink-900/50 border border-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden space-y-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-pink-300 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              시작하는 데 1분도 걸리지 않습니다
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              지금 당신만의 프로필 링크를 <br />
              무료로 시작해보세요.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              복잡한 설정 없이 Google 로그인 한 번으로 바로 나만의 프로필과 링크를 만들고 공유할 수 있습니다.
            </p>
          </div>

          <div className="relative z-10 max-w-sm mx-auto pt-2">
            <Button
              size="lg"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-13 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5" />
                  <span>Google 계정으로 지금 시작하기</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* 6. 푸터 (Footer) */}
      <footer className="border-t border-white/10 py-10 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              MyLink
            </span>
            <span>• 나만의 올인원 프로필 링크</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 MyLink. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
