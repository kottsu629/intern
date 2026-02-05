// components/SortBar.tsx

export type SortKey = 'id' | 'price';
export type SortOrder = 'asc' | 'desc';

export function SortBar(props: {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onChangeSortKey: (k: SortKey) => void;
  onToggleSortOrder: () => void;
}) {
  const { sortKey, sortOrder, onChangeSortKey, onToggleSortOrder } = props;

  return (
    <div className="flex items-center gap-1">
      <select
        value={sortKey}
        onChange={(e) => onChangeSortKey(e.target.value as SortKey)}
        className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm"
        aria-label="並び替えキー"
      >
        <option value="id">ID</option>
        <option value="price">価格</option>
      </select>

      <button
        type="button"
        onClick={onToggleSortOrder}
        className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm hover:bg-slate-100"
        title="並び順切替"
        aria-label="並び順切替"
      >
        {sortOrder === 'asc' ? '▲' : '▼'}
      </button>
    </div>
  );
}
