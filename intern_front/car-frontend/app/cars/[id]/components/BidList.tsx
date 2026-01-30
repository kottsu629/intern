import type { Bid } from '../types';

export function BidList(props: { bids: Bid[]; bidsLoading: boolean; bidsError: string | null }) {
  const { bids, bidsLoading, bidsError } = props;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">入札一覧</h2>

      {bidsLoading && (
        <p className="text-slate-600 text-sm" aria-live="polite">
          入札情報を読み込み中です…
        </p>
      )}

      {bidsError && (
        <p className="text-red-600 text-sm" aria-live="assertive">
          {bidsError}
        </p>
      )}

      {!bidsLoading && !bidsError && bids.length === 0 && (
        <p className="text-slate-600 text-sm">この車両への入札はまだありません。</p>
      )}

      {!bidsLoading && !bidsError && bids.length > 0 && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-left text-slate-600">入札ID</th>
                <th className="px-3 py-2 text-left text-slate-600">入札額</th>
                <th className="px-3 py-2 text-left text-slate-600">入札者</th>
                <th className="px-3 py-2 text-left text-slate-600">入札時刻</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, index) => (
                <tr key={bid.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="px-3 py-2">{bid.id}</td>
                  <td className="px-3 py-2">{bid.amount.toLocaleString()} 円</td>
                  <td className="px-3 py-2">{bid.bidder}</td>
                  <td className="px-3 py-2">{new Date(bid.created_at).toLocaleString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
