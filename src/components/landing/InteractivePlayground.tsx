'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Link2, User, Globe, Check, Wand2 } from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';

export function InteractivePlayground() {
  const { signInWithGoogle } = useAuth();
  const [name, setName] = useState('크리에이터 민준');
  const [bio, setBio] = useState('개발과 일상을 기록하는 공간 ✨');
  const [linkTitle, setLinkTitle] = useState('내 포트폴리오 구경하기');
  const [linkUrl, setLinkUrl] = useState('https://my-work.dev');
  const [isCopied, setIsCopied] = useState(false);

  const handleStart = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-white/10 p-6 sm:p-12 overflow-hidden backdrop-blur-xl">
        {/* 장식용 배경 광원 */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* 좌측: 직접 입력해보기 폼 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/20">
                <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                10초 라이브 시뮬레이터
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                내 링크는 어떤 느낌일까? <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                  직접 정보를 입력해보세요
                </span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                닉네임과 첫 번째 링크를 입력하면 오른쪽 카드에 실시간으로 반영됩니다. 마음에 들면 단 1초 만에 그대로 내 계정에 저장할 수 있어요.
              </p>
            </div>

            {/* 입력 인풋들 */}
            <div className="space-y-4 bg-slate-950/60 p-4 sm:p-6 rounded-2xl border border-white/10">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  이름 / 닉네임
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 김민준"
                  maxLength={25}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  한 줄 소개 (Bio)
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="예: 아이디어를 현실로 만드는 공간"
                  maxLength={60}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                    링크 제목
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="예: 유튜브 채널 구독"
                    maxLength={30}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    연결 URL
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 시작 CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>이 프로필로 내 페이지 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-slate-400">
                무료 Google 로그인으로 즉시 생성됩니다.
              </p>
            </div>
          </div>

          {/* 우측: 실시간 렌더링되는 시뮬레이터 카드 */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-violet-950/80 via-purple-900/60 to-slate-950/80 border border-white/20 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center space-y-4">
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  실시간 미리보기
                </span>
              </div>

              {/* 가상 아바타 */}
              <div className="pt-4 flex justify-center">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-indigo-400 to-amber-300 shadow-xl">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/20">
                    {name ? name.slice(0, 1) : 'M'}
                  </div>
                </div>
              </div>

              {/* 닉네임 & 바이오 */}
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {name || '이름을 입력하세요'}
                </h3>
                <p className="text-xs text-slate-300/90 leading-relaxed px-2">
                  {bio || '한 줄 소개를 입력해보세요'}
                </p>
              </div>

              {/* 가상 소셜 아이콘 바 */}
              <div className="flex justify-center gap-2 py-1">
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                  <PlatformIcon name="github" className="w-3.5 h-3.5" />
                </span>
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-red-400">
                  <PlatformIcon name="youtube" className="w-3.5 h-3.5" />
                </span>
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-pink-400">
                  <PlatformIcon name="instagram" className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* 실시간 렌더링 링크 카드 */}
              <div className="pt-2">
                <div className="p-3.5 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md shadow-lg text-left flex items-center justify-between group hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {linkTitle || '링크 제목'}
                      </p>
                      <p className="text-[10px] text-slate-300 font-mono truncate">
                        {linkUrl || 'https://...'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/60 shrink-0" />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-1">
                mylink.io/@{encodeURIComponent(name || 'user')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
