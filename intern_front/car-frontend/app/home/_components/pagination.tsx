export function Pagination({
  currentPage,
  totalPages,
  onGo,
}: {
  currentPage: number;
  totalPages: number;
  onGo: (p: number) => void;
}) {
  return (
    <nav className="mt-4 flex items-center justify-center gap-2">
      <button
        onClick={() => onGo(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="前のページへ"
        className="px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100"
      >
        前へ
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onGo(p)}
          aria-label={`ページ ${p} へ`}
          disabled={p === currentPage}
          className={`px-3 py-1.5 text-sm rounded-md border ${
            p === currentPage
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onGo(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="次のページへ"
        className="px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100"
      >
        次へ
      </button>
    </nav>
  );
}