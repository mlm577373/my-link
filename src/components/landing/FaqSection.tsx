'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  {
    q: '마이링크(MyLink) 서비스는 정말 무료인가요?',
    a: '네, 현재 제공되는 모든 기본 기능(무제한 링크 추가, 6종 이상의 테마 변경, 실시간 클릭수 통계, 고유 프로필 주소 생성)은 완전 무료로 제공됩니다.',
  },
  {
    q: '등록할 수 있는 링크 개수나 종류에 제한이 있나요?',
    a: '제한이 없습니다! 포트폴리오 사이트, 유튜브, 인스타그램, 깃허브, 벨로그, 브런치, 후원 링크, 오픈채팅방 등 웹 URL 형식이라면 어떤 링크든 자유롭게 추가하고 순서를 바꿀 수 있습니다.',
  },
  {
    q: '방문자 통계와 클릭 수는 어디서 확인하나요?',
    a: 'Google 계정으로 로그인하시면 상단 메뉴의 "통계 (Stats)" 탭에서 내 링크들의 누적 클릭 수, 인기 링크 TOP 3, 플랫폼별 유입 비율을 차트로 손쉽게 확인할 수 있습니다.',
  },
  {
    q: '내 프로필 링크는 어떻게 다른 사람에게 공유하나요?',
    a: '로그인 후 생성된 고유 닉네임 기준 `mylink.io/@내이름` 주소를 복사하여 인스타그램 바이오, 트위터/X, 카카오톡, 명함 등에 자유롭게 등록하고 공유할 수 있습니다.',
  },
  {
    q: '데이터는 안전하게 저장되나요?',
    a: 'Firebase Cloud Firestore의 계정별 격리된 보안 규칙을 통해 안전하게 저장되며, 본인 계정으로 로그인한 상태에서만 링크 추가/수정/삭제 권한이 부여됩니다.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          궁금한 점이 있으신가요?
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          자주 묻는 질문 (FAQ)
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          마이링크를 이용하기 전 가장 많이 질문해주시는 내용을 모았습니다.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="rounded-2xl bg-slate-900/60 border border-white/10 overflow-hidden backdrop-blur-md transition-colors hover:border-white/20"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-white leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300',
                    isOpen && 'rotate-180 text-indigo-400'
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
