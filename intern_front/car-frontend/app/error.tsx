"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="py-16 flex flex-col items-center gap-4 text-center">
          <div className="text-4xl">⚠️</div>
          <p className="text-slate-700 font-semibold text-lg">
            データを取得できませんでした
          </p>
          <p className="text-slate-400 text-sm">{error.message}</p>
          <p className="text-slate-400 text-xs">
            問題が解決しない場合は、管理者にお問い合わせください。
          </p>
        </div>
      </div>
    </main>
  );
}
