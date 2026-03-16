type Props = {
  modelInput: string;
  onChangeModelInput: (v: string) => void;
  onSearchModel: () => void;
};

export function CarSearchBar(props: Props) {
  return (
    <section className="mb-4">
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <span>車種名：</span>
        <input
          type="text"
          aria-label="車種名を入力"
          placeholder="例）Prius"
          value={props.modelInput}
          onChange={(e) => props.onChangeModelInput(e.target.value)}
          className="w-40 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={props.onSearchModel}
          className="px-4 py-2 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
        >
          検索
        </button>
      </div>
    </section>
  );
}
