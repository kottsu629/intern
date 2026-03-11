'use client';

import { useEffect, useState } from 'react';

export type CarFormValues = {
  modelInput: string;
  yearInput: string;
  priceInput: string;
};

export function CarSubmit(props: {
  carSubmitting: boolean;
  carSubmitError: string | null;
  carSubmitSuccess: string | null;
  onSubmit: (v: CarFormValues, e: React.FormEvent<HTMLFormElement>) => void;
  resetKey?: number;
}) {
  const { carSubmitting, carSubmitError, carSubmitSuccess, onSubmit, resetKey } = props;

  const [modelInput, setModelInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    if (resetKey === undefined) return;
    setModelInput('');
    setYearInput('');
    setPriceInput('');
  }, [resetKey]);

  return (
    <section className="border border-slate-200 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3">車両情報を入力</h2>

      <form onSubmit={(e) => onSubmit({ modelInput, yearInput, priceInput }, e)} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="car-model" className="text-sm text-slate-700">
            車種
          </label>
          <input
            id="car-model"
            type="text"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例）Toyota Prius"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="car-year" className="text-sm text-slate-700">
            年式
          </label>
          <input
            id="car-year"
            type="text"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            inputMode="numeric"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例）2022"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="car-price" className="text-sm text-slate-700">
            価格（円）
          </label>
          <input
            id="car-price"
            type="text"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            inputMode="numeric"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="例）2,500,000"
          />
          <p className="text-xs text-slate-400">カンマ付きの数値でも入力できます（2,500,000 など）。</p>
        </div>

        {carSubmitError && (
          <p className="text-sm text-red-600" aria-live="assertive">
            {carSubmitError}
          </p>
        )}

        {carSubmitSuccess && (
          <p className="text-sm text-emerald-600" aria-live="polite">
            {carSubmitSuccess}
          </p>
        )}

        <button
          type="submit"
          disabled={carSubmitting}
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {carSubmitting ? '登録中...' : '車両を登録'}
        </button>
      </form>
    </section>
  );
}