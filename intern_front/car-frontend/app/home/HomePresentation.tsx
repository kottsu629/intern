// HomePresentation.tsx
import { useState } from 'react';

import type { Car } from './types';
import { PageState } from './components/PageState';
import { CarCreateForm } from './components/CarCreateForm';
import { QuickBidForm } from './components/QuickBidForm';
import { FilterBar } from './components/FilterBar';
import { CarTable } from './components/CarTable';
import { Pagination } from './components/Pagination';
import { SortBar, type SortKey, type SortOrder } from './components/SortBar';

export function HomePresentation(props: {
  loading: boolean;
  error: string | null;

  carsForSelect: Car[];
  pagedCars: Car[];
  totalPages: number;
  currentPage: number;

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
  onGoPage: (p: number) => void;

  carModel: string;
  carYear: string;
  carPrice: string;
  carSubmitting: boolean;
  carError: string | null;
  carSuccess: string | null;
  onChangeCarModel: (v: string) => void;
  onChangeCarYear: (v: string) => void;
  onChangeCarPrice: (v: string) => void;
  onSubmitCar: () => void;

  bidCarId: string;
  bidBidder: string;
  bidAmount: string;
  bidSubmitting: boolean;
  bidError: string | null;
  bidSuccess: string | null;
  onChangeBidCarId: (v: string) => void;
  onChangeBidBidder: (v: string) => void;
  onChangeBidAmount: (v: string) => void;
  onSubmitBid: () => void;

  // sort
  sortKey: SortKey;
  sortOrder: SortOrder;
  onChangeSortKey: (k: SortKey) => void;
  onToggleSortOrder: () => void;
}) {
  const {
    loading,
    error,
    carsForSelect,
    pagedCars,
    totalPages,
    currentPage,

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
    onGoPage,

    carModel,
    carYear,
    carPrice,
    carSubmitting,
    carError,
    carSuccess,
    onChangeCarModel,
    onChangeCarYear,
    onChangeCarPrice,
    onSubmitCar,

    bidCarId,
    bidBidder,
    bidAmount,
    bidSubmitting,
    bidError,
    bidSuccess,
    onChangeBidCarId,
    onChangeBidBidder,
    onChangeBidAmount,
    onSubmitBid,

    sortKey,
    sortOrder,
    onChangeSortKey,
    onToggleSortOrder,
  } = props;

  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  return (
    <PageState loading={loading} error={error}>
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">入札対象車両一覧</h1>

            <div className="flex items-center gap-2">
              {/* 小型ソートUI（右上） */}
              <SortBar
                sortKey={sortKey}
                sortOrder={sortOrder}
                onChangeSortKey={onChangeSortKey}
                onToggleSortOrder={onToggleSortOrder}
              />

              <button
                type="button"
                onClick={() => setIsCarModalOpen(true)}
                className="inline-flex items-center px-3 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                車両登録
              </button>

              <button
                type="button"
                onClick={() => setIsBidModalOpen(true)}
                className="inline-flex items-center px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-800 text-sm font-medium hover:bg-slate-100"
              >
                クイック入札
              </button>
            </div>
          </header>

          <FilterBar
            minInput={minInput}
            maxInput={maxInput}
            onChangeMinInput={onChangeMinInput}
            onChangeMaxInput={onChangeMaxInput}
            onDecreaseMin={onDecreaseMin}
            onIncreaseMin={onIncreaseMin}
            onDecreaseMax={onDecreaseMax}
            onIncreaseMax={onIncreaseMax}
            onSearch={onSearch}
            onClear={onClear}
          />

          <CarTable cars={pagedCars} />

          <Pagination currentPage={currentPage} totalPages={totalPages} onGo={onGoPage} />

          {/* 車両登録モーダル */}
          {isCarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsCarModalOpen(false)}
                aria-label="閉じる"
              />
              <div className="relative z-10 w-[min(720px,92vw)] rounded-xl bg-white shadow-xl border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold">車両登録</h2>
                  <button
                    type="button"
                    onClick={() => setIsCarModalOpen(false)}
                    className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
                    aria-label="閉じる"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-6 py-5">
                  <CarCreateForm
                    model={carModel}
                    year={carYear}
                    price={carPrice}
                    submitting={carSubmitting}
                    error={carError}
                    success={carSuccess}
                    onChangeModel={onChangeCarModel}
                    onChangeYear={onChangeCarYear}
                    onChangePrice={onChangeCarPrice}
                    onSubmit={onSubmitCar}
                  />
                </div>
              </div>
            </div>
          )}

          {/* クイック入札モーダル */}
          {isBidModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsBidModalOpen(false)}
                aria-label="閉じる"
              />
              <div className="relative z-10 w-[min(720px,92vw)] rounded-xl bg-white shadow-xl border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <h2 className="text-lg font-semibold">クイック入札</h2>
                  <button
                    type="button"
                    onClick={() => setIsBidModalOpen(false)}
                    className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
                    aria-label="閉じる"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-6 py-5">
                  <QuickBidForm
                    cars={carsForSelect}
                    carId={bidCarId}
                    bidder={bidBidder}
                    amount={bidAmount}
                    submitting={bidSubmitting}
                    error={bidError}
                    success={bidSuccess}
                    onChangeCarId={onChangeBidCarId}
                    onChangeBidder={onChangeBidBidder}
                    onChangeAmount={onChangeBidAmount}
                    onSubmit={onSubmitBid}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </PageState>
  );
}
