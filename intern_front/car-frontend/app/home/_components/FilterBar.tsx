type Props = {
  minInput: string; maxInput: string;
  onChangeMinInput: (v: string) => void; onChangeMaxInput: (v: string) => void;
  onDecreaseMin: () => void; onIncreaseMin: () => void;
  onDecreaseMax: () => void; onIncreaseMax: () => void;
  onSearch: () => void; onClear: () => void;
};

export function FilterBar(props: Props) {
  const inputBase = "w-28 border rounded-lg px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none";
  const btnStep = "w-10 h-10 bg-slate-100 rounded-lg hover:bg-slate-200 text-xs";

  return (
    <div className="mb-6 bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 items-end">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400">最小価格</label>
        <div className="flex items-center gap-2">
          <button onClick={props.onDecreaseMin} className={btnStep}>-10</button>
          <input type="text" value={props.minInput} onChange={(e) => props.onChangeMinInput(e.target.value)} className={inputBase} />
          <button onClick={props.onIncreaseMin} className={btnStep}>+10</button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400">最大価格</label>
        <div className="flex items-center gap-2">
          <button onClick={props.onDecreaseMax} className={btnStep}>-10</button>
          <input type="text" value={props.maxInput} onChange={(e) => props.onChangeMaxInput(e.target.value)} className={inputBase} />
          <button onClick={props.onIncreaseMax} className={btnStep}>+10</button>
        </div>
      </div>
      <div className="flex gap-2 flex-1">
        <button onClick={props.onSearch} className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-all">検索</button>
        <button onClick={props.onClear} className="px-4 border rounded-lg text-slate-500 hover:bg-slate-50">クリア</button>
      </div>
    </div>
  );
}