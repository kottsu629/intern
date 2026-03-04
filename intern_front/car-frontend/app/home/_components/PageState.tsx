import type { ReactNode } from 'react';

export function PageState({ loading, error, children }: { loading: boolean; error: string | null; children: ReactNode }) {
  if (loading) return <div className="py-20 text-center text-slate-400 animate-pulse">読み込み中...</div>;
  if (error) return <div className="py-10 text-center text-red-500 font-bold">{error}</div>;
  return <>{children}</>;
}