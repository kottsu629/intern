import type { ReactNode } from 'react';

export function PageState(props: { loading: boolean; error: string | null; children: ReactNode }) {
  const { loading, error, children } = props;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">読み込み中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-6 border border-red-100">
          <h1 className="text-xl font-semibold mb-4">入札対象車両一覧</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            aria-label="ページを再読み込み"
            className="inline-flex items-center px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}