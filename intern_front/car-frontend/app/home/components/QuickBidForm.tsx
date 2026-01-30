import type { Car } from '../types';

export function QuickBidForm(props: {
  cars: Car[];
  carId: string;
  bidder: string;
  amount: string;
  submitting: boolean;
  error: string | null;
  success: string | null;
  onChangeCarId: (v: string) => void;
  onChangeBidder: (v: string) => void;
  onChangeAmount: (v: string) => void;
  onSubmit: () => void;
}) {
  const {
    cars,
    carId,
    bidder,
    amount,
    submitting,
    error,
    success,
    onChangeCarId,
    onChangeBidder,
    onChangeAmount,
    onSubmit,
  } = props;

  return (
    <section className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h2 className="text-lg font-semibold mb-3">クイック入札（一覧画面から）</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700">対象車両</label>
          <select
            value={carId}
            onChange={(e) => onChangeCarId(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
          >
            <option value="">選択してください</option>
            {cars.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.id} / {c.model} / {c.year} / {c.price.toLocaleString()}円
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700">入札者名</label>
          <input
            value={bidder}
            onChange={(e) => onChangeBidder(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="例）山田太郎"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700">入札額（円）</label>
          <input
            value={amount}
            onChange={(e) => onChangeAmount(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="例）1600000"
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
        {submitting ? '送信中...' : '入札する'}
      </button>
    </section>
  );
}
