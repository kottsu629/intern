import type React from 'react';

export function BidForm(props: {
  bidder: string;
  amountInput: string;
  bidSubmitting: boolean;
  bidSubmitError: string | null;
  bidSubmitSuccess: string | null;
  onChangeBidder: (v: string) => void;
  onChangeAmountInput: (v: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const {
    bidder,
    amountInput,
    bidSubmitting,
    bidSubmitError,
    bidSubmitSuccess,
    onChangeBidder,
    onChangeAmountInput,
    onSubmit,
  } = props;

  return (
    <section className="mt-8 border border-slate-200 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3">この車に入札する</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="bidder" className="text-sm text-slate-700">
            入札者名
          </label>
          <input
            id="bidder"
            type="text"
            value={bidder}
            onChange={(e) => onChangeBidder(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例）山田太郎"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm text-slate-700">
            入札額（円）
          </label>
          <input
            id="amount"
            type="text"
            value={amountInput}
            onChange={(e) => onChangeAmountInput(e.target.value)}
            inputMode="numeric"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例）1,500,000"
          />
          <p className="text-xs text-slate-400">カンマ付きの数値でも入力できます（1,500,000 など）。</p>
        </div>

        {bidSubmitError && (
          <p className="text-sm text-red-600" aria-live="assertive">
            {bidSubmitError}
          </p>
        )}

        {bidSubmitSuccess && (
          <p className="text-sm text-emerald-600" aria-live="polite">
            {bidSubmitSuccess}
          </p>
        )}

        <button
          type="submit"
          disabled={bidSubmitting}
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {bidSubmitting ? '送信中...' : '入札を送信'}
        </button>
      </form>
    </section>
  );
}