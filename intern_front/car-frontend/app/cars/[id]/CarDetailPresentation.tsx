import Link from 'next/link';
import type { Car, Bid } from './types';
import { PageState } from './components/PageState';
import { CarInfo } from './components/CarInfo';
import { BidForm } from './components/BidForm';
import { BidList } from './components/BidList';

export function CarDetailPresentation(props: {
  loading: boolean;
  error: string | null;
  car: Car | null;

  bids: Bid[];
  bidsLoading: boolean;
  bidsError: string | null;

  bidder: string;
  amountInput: string;
  bidSubmitting: boolean;
  bidSubmitError: string | null;
  bidSubmitSuccess: string | null;

  onChangeBidder: (v: string) => void;
  onChangeAmountInput: (v: string) => void;
  onSubmitBid: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const {
    loading,
    error,
    car,
    bids,
    bidsLoading,
    bidsError,
    bidder,
    amountInput,
    bidSubmitting,
    bidSubmitError,
    bidSubmitSuccess,
    onChangeBidder,
    onChangeAmountInput,
    onSubmitBid,
  } = props;

  return (
    <PageState
      title="車両詳細"
      loading={loading}
      error={error}
      notFound={!loading && !error && !car}
      notFoundMessage="指定された ID の車が見つかりませんでした。"
    >
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-3xl w-full border border-slate-100">
          <h1 className="text-2xl font-bold mb-6" tabIndex={0}>
            車両詳細
          </h1>

          <CarInfo car={car as Car} />

          <BidForm
            bidder={bidder}
            amountInput={amountInput}
            bidSubmitting={bidSubmitting}
            bidSubmitError={bidSubmitError}
            bidSubmitSuccess={bidSubmitSuccess}
            onChangeBidder={onChangeBidder}
            onChangeAmountInput={onChangeAmountInput}
            onSubmit={onSubmitBid}
          />

          <BidList bids={bids} bidsLoading={bidsLoading} bidsError={bidsError} />

          <div className="mt-8 text-right">
            <Link
              href="/"
              aria-label="車両一覧ページに戻る"
              className="inline-block bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-900"
            >
              一覧に戻る
            </Link>
          </div>
        </div>
      </main>
    </PageState>
  );
}