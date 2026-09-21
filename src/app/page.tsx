export default function ProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <main className="w-full max-w-sm rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-all">
        {/* 아바타 영역 */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-3xl font-bold text-white shadow-lg shadow-blue-500/25">
          김
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          김민준
        </h1>

        {/* 자기소개 */}
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          저는 김민준이랍니다
        </p>

        {/* 구분선 및 태그 */}
        <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
            Welcome to my space ✨
          </span>
        </div>
      </main>
    </div>
  );
}
