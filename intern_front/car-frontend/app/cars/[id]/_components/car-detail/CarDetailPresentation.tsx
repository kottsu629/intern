import Link from 'next/link';
import type React from 'react';
import type { Car, Bid } from '../../types';
import { PageState } from '../PageState';
import { CarInfo } from '../CarInfo';
import { BidList } from '../BidList';

export function CarDetailPresentation(props: {
  loading: boolean;
  error: string | null;
  car: Car | null;

  bids: Bid[];
  bidsLoading: boolean;
  bidsError: string | null;

  bidForm: React.ReactNode;
}) {
  const { loading, error, car, bids, bidsLoading, bidsError, bidForm } = props;

  return (
    <PageState
      title="車両詳細"
      loading={loading}
      error={error}
    >
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-3xl w-full border border-slate-100">
          <h1 className="text-2xl font-bold mb-6" tabIndex={0}>
            車両詳細
          </h1>

          {car ? <CarInfo car={car} /> : <p className="text-slate-600">車両情報がありません</p>}

          {bidForm}

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
