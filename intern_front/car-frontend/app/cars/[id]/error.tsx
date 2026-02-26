'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">エラーが発生しました</h2>
        <p className="text-sm text-slate-600 mb-4">
            {error.message}
        </p>
        <button
            onClick={() => reset()}
            className="px-4 py-2 bg-slate-800 text-white rounded"
        >
            再試行
        </button>
        </div>
    </main>
    );
}