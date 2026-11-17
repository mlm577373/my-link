'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Palette,
  Share2,
  Sparkles,
  Link2,
  Copy,
  Check,
  TrendingUp,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PlatformIcon } from '@/components/common/PlatformIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BentoFeatures() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pill' | 'rounded' | 'glass'>('pill');

  const handleCopy = () => {
    navigator.clipboard?.writeText('https://mylink.io/@김민준');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
      {/* 섹션 헤더 */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          올인원 올인플레이스 기능
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          단순한 링크 모음이 아닌, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            나를 표현하는 인터랙티브 허브
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          MyLink는 크리에이터와 개발자가 자신의 모든 콘텐츠를 가장 돋보이게 전달할 수 있도록 필요한 모든 기능을 지원합니다.
        </p>
      </div>

      {/* 벤토 그리드 컨테이너 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* 카드 1 (2칸 차지): 실시간 통계 & 클릭수 분석 */}
        <div className="md:col-span-2 relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <BarChart3 className="w-3.5 h-3.5" />
                스마트 애널리틱스
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                어떤 링크가 가장 뜨거운 반응을 얻었을까요?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                각 링크의 실시간 클릭 수와 누적 트래픽을 한눈에 파악하세요. 복잡한 분석 도구 없이도 내 콘텐츠의 인기도를 바로 측정할 수 있습니다.
              </p>
            </div>

            {/* 미니 차트 & 통계 비주얼 */}
            <div className="bg-slate-950/70 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  이번 주 인기 링크 트래픽
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  +138.4% 상승
                </span>
              </div>

              {/* 막대 그래프 시각화 */}
              <div className="space-y-2.5">
                {[
                  { name: '포트폴리오 웹사이트', clicks: 528, percent: 92, color: 'bg-indigo-500' },
                  { name: 'GitHub 프로필', clicks: 342, percent: 65, color: 'bg-pink-500' },
                  { name: '유튜브 채널', clicks: 215, percent: 42, color: 'bg-amber-400' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="text-slate-400 font-mono">{item.clicks.toLocaleString()} clicks</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-1000', item.color)}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 카드 2: 나만의 고유 커스텀 URL & 1초 공유 */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden group hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-pink-500/20 transition-all" />

          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 text-xs font-semibold">
              <Share2 className="w-3.5 h-3.5" />
              고유 핸들 URL
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              기억하기 쉬운 단 하나의 주소
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              SNS 프로필 바이오에 깔끔하게 넣을 수 있는 나만의 주소를 만드세요.
            </p>
          </div>

          {/* 주소 복사 인터랙티브 카드 */}
          <div className="relative z-10 mt-6 pt-2">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Link2 className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="text-xs font-mono text-slate-200 truncate">
                  mylink.io/@김민준
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 px-2.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg shrink-0 gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-300">복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">복사</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              인스타그램, 트위터, 유튜브 소개란에 바로 붙여넣기하세요.
            </p>
          </div>
        </div>

        {/* 카드 3: 스마트 플랫폼 자동 감지 */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              스마트 플랫폼 감지
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              URL만 넣으면 아이콘 자동 매칭
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              아이콘을 따로 찾을 필요 없이 링크 주소만 입력하면 브랜드 로고와 톤이 자동으로 반영됩니다.
            </p>
          </div>

          {/* 소셜 플랫폼 아이콘 그리드 */}
          <div className="relative z-10 grid grid-cols-4 gap-2 mt-6">
            {[
              { p: 'github', label: 'GitHub' },
              { p: 'youtube', label: 'YouTube' },
              { p: 'instagram', label: 'Instagram' },
              { p: 'blog', label: 'Blog' },
            ].map(({ p, label }) => (
              <div
                key={p}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <PlatformIcon name={p} className="w-5 h-5 mb-1" />
                <span className="text-[10px] text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 카드 4 (2칸 차지): 버튼 쉐이프 & 글래스모피즘 스타일링 */}
        <div className="md:col-span-2 relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-semibold">
                <Palette className="w-3.5 h-3.5" />
                자유로운 스타일 커스텀
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                원하는 버튼 모양과 글래스 질감 선택
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                단정하고 모던한 Pill 스타일, 부드러운 라운디드, 깊이감 있는 소프트 글래스까지 내 브랜드 무드에 맞게 손쉽게 변경할 수 있습니다.
              </p>
            </div>

            {/* 인터랙티브 버튼 스타일 미리보기 탭 */}
            <div className="w-full md:w-auto flex flex-col gap-2 min-w-[260px]">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                {(['pill', 'rounded', 'glass'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-center font-medium capitalize transition-all cursor-pointer',
                      activeTab === tab
                        ? 'bg-white/20 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* 활성화된 스타일 카드 데모 */}
              <div
                className={cn(
                  'p-4 text-center transition-all duration-300 border',
                  activeTab === 'pill' &&
                    'rounded-full bg-white/15 border-white/30 text-white shadow-lg',
                  activeTab === 'rounded' &&
                    'rounded-xl bg-indigo-900/60 border-indigo-500/50 text-indigo-100 shadow-lg',
                  activeTab === 'glass' &&
                    'rounded-2xl bg-white/5 border-white/20 backdrop-blur-xl text-pink-200 shadow-2xl'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold">
                    {activeTab === 'pill' && 'Pill Capsule Shape'}
                    {activeTab === 'rounded' && 'Modern Rounded Box'}
                    {activeTab === 'glass' && 'Ultra Soft Glassmorphism'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
