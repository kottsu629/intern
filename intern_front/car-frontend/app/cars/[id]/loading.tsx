export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-xl w-full border border-slate-100">
        <h1 className="text-2xl font-bold mb-4">車両詳細</h1>
        <p className="text-slate-600 text-lg" aria-live="polite">
          読み込み中...
        </p>
      </div>
    </main>
  );
}
