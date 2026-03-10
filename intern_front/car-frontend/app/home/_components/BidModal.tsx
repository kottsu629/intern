'use client';

import { useState } from 'react';
import type { Car } from '../../_types/car';
import { BidSubmit } from '../../_components/BidSubmit';
import { useBidSubmit } from '../../_hooks/useBidSubmit';


function BidModalForm({ car }: { car: Car }) {
  const { bidSubmitting, bidSubmitError, bidSubmitSuccess, resetKey, onSubmit } =
    useBidSubmit({
      carId: car.id,
      onSubmitted: () => {
      },
    });

  return (
    <BidSubmit
      bidSubmitting={bidSubmitting}
      bidSubmitError={bidSubmitError}
      bidSubmitSuccess={bidSubmitSuccess}
      onSubmit={onSubmit}
      resetKey={resetKey}
    />
  );
}
type Props = { cars: Car[] };

export function BidModal({ cars }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  const selectedCar = cars.find((c) => c.id === selectedCarId) ?? null;

  const handleClose = () => {
    setOpen(false);
    setSelectedCarId(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed top-4 right-4 z-40
          flex items-center gap-2
          bg-indigo-600 hover:bg-indigo-700 active:scale-95
          text-white text-sm font-semibold
          px-4 py-2 rounded-full shadow-lg
          transition-all duration-150
        "
        aria-label="入札フォームを開く"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        入札する
      </button>

      
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="入札フォーム"
        className={`
          fixed top-0 right-0 z-50 h-full w-full max-w-sm
          bg-white shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">入札フォーム</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>


        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="car-select" className="text-sm font-medium text-slate-700">
              入札する車両を選択
            </label>
            <select
              id="car-select"
              value={selectedCarId ?? ''}
              onChange={(e) =>
                setSelectedCarId(e.target.value === '' ? null : Number(e.target.value))
              }
              className="
                rounded-md border border-slate-300 px-3 py-2 text-sm bg-white
                shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              "
            >
              <option value="">-- 車両を選んでください --</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
    
                  {car.model ?? `車両ID: ${car.id}`}
                </option>
              ))}
            </select>
          </div>

          
          {selectedCar ? (

            <BidModalForm key={selectedCar.id} car={selectedCar} />
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              車両を選択するとフォームが表示されます
            </p>
          )}
        </div>
      </aside>
    </>
  );
}