import type { ReactNode } from 'react';

export function PageState({
  loading,
  error,
  children,
}: {
  loading: boolean;
  error: string | null;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 animate-pulse">
        読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 flex flex-col items-center gap-4 text-center">
        <div className="text-4xl">⚠️</div>
        <p className="text-slate-700 font-semibold text-lg">データを取得できませんでした</p>
        <p className="text-slate-400 text-sm">{error}</p>
        <p className="text-slate-400 text-xs">
          問題が解決しない場合は、管理者にお問い合わせください。
        </p>
      </div>
    );
  }

  return <>{children}</>;
}