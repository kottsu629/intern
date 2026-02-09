export function CarCreateForm(props: {
  model: string;
  year: string;
  price: string;
  submitting: boolean;
  error: string | null;
  success: string | null;
  onChangeModel: (v: string) => void;
  onChangeYear: (v: string) => void;
  onChangePrice: (v: string) => void;
  onSubmit: () => void;
}) {
  const {
    model,
    year,
    price,
    submitting,
    error,
    success,
    onChangeModel,
    onChangeYear,
    onChangePrice,
    onSubmit,
  } = props;

  const input =
    'h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-8 py-7">
        

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-slate-700 font-semibold mb-2">車種</div>
            <input
              className={input}
              value={model}
              onChange={(e) => onChangeModel(e.target.value)}
              placeholder="例） Prius"
            />
          </div>

          <div>
            <div className="text-slate-700 font-semibold mb-2">年式</div>
            <input
              className={input}
              value={year}
              onChange={(e) => onChangeYear(e.target.value)}
              placeholder="例） 2019"
              inputMode="numeric"
            />
          </div>

          <div>
            <div className="text-slate-700 font-semibold mb-2">価格（円）</div>
            <input
              className={input}
              value={price}
              onChange={(e) => onChangePrice(e.target.value)}
              placeholder="例） 1500000"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="h-11 px-7 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-50 hover:bg-indigo-700"
          >
            {submitting ? '登録中...' : '車両登録'}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}
        </div>
      </div>
    </div>
  );
}
