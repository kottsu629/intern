export function FilterBar(props: {
  minInput: string;
  maxInput: string;
  onChangeMinInput: (v: string) => void;
  onChangeMaxInput: (v: string) => void;
  onDecreaseMin: () => void;
  onIncreaseMin: () => void;
  onDecreaseMax: () => void;
  onIncreaseMax: () => void;
  onSearch: () => void;
  onClear: () => void;
}) {
  const {
    minInput,
    maxInput,
    onChangeMinInput,
    onChangeMaxInput,
    onDecreaseMin,
    onIncreaseMin,
    onDecreaseMax,
    onIncreaseMax,
    onSearch,
    onClear,
  } = props;

  return (
    <section className="mb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <span>最低価格：</span>
          <button type="button" onClick={onDecreaseMin} className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300">
            -10万
          </button>
          <input
            type="text"
            aria-label="最低価格を入力"
            placeholder="例）1,000,000"
            value={minInput}
            onChange={(e) => onChangeMinInput(e.target.value)}
            className="w-32 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button type="button" onClick={onIncreaseMin} className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300">
            +10万
          </button>
          <span>円以上</span>
        </div>

        <div className="flex items-center gap-2">
          <span>最高価格：</span>
          <button type="button" onClick={onDecreaseMax} className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300">
            -10万
          </button>
          <input
            type="text"
            aria-label="最高価格を入力"
            placeholder="例）3,000,000"
            value={maxInput}
            onChange={(e) => onChangeMaxInput(e.target.value)}
            className="w-32 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button type="button" onClick={onIncreaseMax} className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300">
            +10万
          </button>
          <span>円以下</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
          >
            検索
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-xs"
          >
            条件クリア
          </button>
        </div>
      </div>
    </section>
  );
}