"use client";

import { useState } from "react";

interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  badge?: string;
  color: string;
}

const LINKS: LinkItem[] = [
  {
    id: "github",
    title: "GitHub",
    description: "@mlm577373 • 소스 코드 및 오픈소스 프로젝트",
    url: "https://github.com/mlm577373",
    icon: "github",
    badge: "Official",
    color: "from-gray-700 to-zinc-900",
  },
  {
    id: "email",
    title: "이메일 문의",
    description: "mlm577373@gmail.com • 언제든 연락 주세요",
    url: "mailto:mlm577373@gmail.com",
    icon: "mail",
    badge: "Contact",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: "project",
    title: "마이링크 (MyLink) 레포지토리",
    description: "Next.js 16 + TypeScript로 제작된 프로젝트",
    url: "https://github.com/mlm577373/my-link",
    icon: "link",
    badge: "Featured",
    color: "from-violet-600 to-purple-800",
  },
  {
    id: "tech-stack",
    title: "기술 스택 & 관심사",
    description: "Next.js, TypeScript, React, Tailwind CSS, Vibe Coding",
    url: "#tech",
    icon: "code",
    color: "from-emerald-600 to-teal-800",
  },
  {
    id: "blog",
    title: "개발 블로그 / 기술 노트",
    description: "배운 것을 기록하고 나누는 공간 (준비 중)",
    url: "#blog",
    icon: "book",
    badge: "Soon",
    color: "from-amber-600 to-orange-700",
  },
];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyPageUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 px-4 py-12 sm:py-16 selection:bg-indigo-500 selection:text-white">
      {/* 배경 은은한 빛 효과 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 중앙 컨테이너 */}
      <main className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center">
        {/* 상단 프로필 영역 */}
        <section className="flex flex-col items-center text-center mb-8">
          {/* 아바타 */}
          <div className="relative group mb-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-tilt" />
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/30 bg-slate-800 shadow-2xl flex items-center justify-center">
              {/* 기본 멋진 이니셜/아바타 */}
              <span className="text-3xl font-black bg-gradient-to-tr from-indigo-300 to-pink-300 bg-clip-text text-transparent">
                MJ
              </span>
            </div>
            {/* 상태 뱃지 */}
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-lg" title="Active">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* 이름 및 핸들 */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            김민준
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              @mlm577373
            </span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium max-w-xs">
            아이디어를 현실로 만드는 개발 공간 🚀
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Next.js • TypeScript • Creative Developer
          </p>

          {/* 소셜 공유 버튼 */}
          <button
            onClick={copyPageUrl}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 transition backdrop-blur-md border border-white/15 text-slate-200"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>링크 복사 완료!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>프로필 링크 공유하기</span>
              </>
            )}
          </button>
        </section>

        {/* 링크 카드 리스트 */}
        <section className="w-full space-y-3.5">
          {LINKS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.url.startsWith("http") ? "_blank" : undefined}
              rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group relative flex items-center justify-between p-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* 아이콘 컨테이너 */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform duration-300 shrink-0`}>
                  {renderIcon(item.icon)}
                </div>

                {/* 텍스트 내용 */}
                <div className="text-left truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300/80 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* 오른쪽 화살표 */}
              <div className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all pl-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </section>

        {/* 한 줄 메시지 / 카드 */}
        <div className="mt-8 w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 text-center">
          <p className="text-xs text-slate-300">
            💬 편하게 둘러보시고 언제든 교류를 환영합니다!
          </p>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="relative z-10 mt-12 text-center text-xs text-slate-500">
        <p>© 2026 김민준 (mlm577373) • Crafted with Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}

function renderIcon(icon: string) {
  switch (icon) {
    case "github":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case "mail":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "link":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
    case "code":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case "book":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
}
