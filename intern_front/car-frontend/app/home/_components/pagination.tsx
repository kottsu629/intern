export function Pagination({ currentPage, totalPages, onGo }: { currentPage: number; totalPages: number; onGo: (p: number) => void }) {
  const btn = "w-10 h-10 flex items-center justify-center rounded-lg border font-bold transition-all";
  return (
    <div className="mt-8 flex justify-center gap-2">
      <button onClick={() => onGo(currentPage - 1)} disabled={currentPage === 1} className={`${btn} disabled:opacity-20`}>&larr;</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onGo(p)} className={`${btn} ${p === currentPage ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:border-indigo-400'}`}>{p}</button>
      ))}
      <button onClick={() => onGo(currentPage + 1)} disabled={currentPage === totalPages} className={`${btn} disabled:opacity-20`}>&rarr;</button>
    </div>
  );
}