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

  return (
    <section className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h2 className="text-lg font-semibold mb-3">車両登録（一覧画面から）</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700">車種</label>
          <input
            value={model}
            onChange={(e) => onChangeModel(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="例）Prius"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700">年式</label>
          <input
            value={year}
            onChange={(e) => onChangeYear(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="例）2019"
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700">価格（円）</label>
          <input
            value={price}
            onChange={(e) => onChangePrice(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="例）1500000"
            inputMode="numeric"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600" aria-live="assertive">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-3 text-sm text-emerald-600" aria-live="polite">
          {success}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-3 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? '登録中...' : '車両登録'}
      </button>
    </section>
  );
}
