import Link from 'next/link';
import type { ReactNode } from 'react';

export function PageState(props: {
  title: string;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  notFoundMessage: string;
  children: ReactNode;
}) {
  const { title, loading, error, notFound, notFoundMessage, children } = props;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 text-lg" aria-live="polite">
          読み込み中...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-xl w-full border border-red-100">
          <h1 className="text-2xl font-bold mb-4" tabIndex={0}>
            {title}
          </h1>
          <p className="text-red-600 mb-6" aria-live="assertive">
            {error}
          </p>

          <Link
            href="/"
            aria-label="車両一覧ページに戻る"
            className="inline-block bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-900"
          >
            一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-xl w-full border border-slate-100">
          <h1 className="text-2xl font-bold mb-4" tabIndex={0}>
            {title}
          </h1>

          <p className="text-slate-600 mb-6" aria-live="assertive">
            {notFoundMessage}
          </p>

          <Link
            href="/"
            aria-label="車両一覧ページに戻る"
            className="inline-block bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-900"
          >
            一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
