'use client';

import { useState } from 'react';
import { Car } from '../types';

const parsePrice = (v: string) => {
  const n = Number(v.trim().replace(/,/g, ''));
  return isNaN(n) || v.trim() === '' ? null : n;
};

const formatPrice = (n: number) => n.toLocaleString('ja-JP');

export function useFilter(cars: Car[]) {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [appliedMin, setAppliedMin] = useState<number | null>(null);
  const [appliedMax, setAppliedMax] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredCars = cars
    .filter(c =>
      (appliedMin === null || c.price >= appliedMin) &&
      (appliedMax === null || c.price <= appliedMax)
    )
    .sort((a, b) => a.id - b.id);

  return {
    minInput,
    onChangeMinInput: (v: string) => {
      setMinInput(v);
      setError(null);
    },

    maxInput,
    onChangeMaxInput: (v: string) => {
      setMaxInput(v);
      setError(null);
    },

    appliedMin,
    appliedMax,
    filteredCars,
    error,

    onDecreaseMin: () =>
      setMinInput(p => formatPrice(Math.max(0, (parsePrice(p) ?? 0) - 100000))),

    onIncreaseMin: () =>
      setMinInput(p => formatPrice((parsePrice(p) ?? 0) + 100000)),

    onDecreaseMax: () =>
      setMaxInput(p => formatPrice(Math.max(0, (parsePrice(p) ?? 0) - 100000))),

    onIncreaseMax: () =>
      setMaxInput(p => formatPrice((parsePrice(p) ?? 0) + 100000)),

    onSearch: () => {
      if (minInput.trim() !== '' && parsePrice(minInput) === null) {
        setError('最低価格は数字で入力してください');
        return;
      }

      if (maxInput.trim() !== '' && parsePrice(maxInput) === null) {
        setError('最高価格は数字で入力してください');
        return;
      }

      const min = parsePrice(minInput);
      const max = parsePrice(maxInput);

      if (min !== null && max !== null && min > max) {
        setError('最低価格は最高価格以下にしてください');
        return;
      }

      setError(null);

      setAppliedMin(min);
      setAppliedMax(max);
    },

    onClear: () => {
      setMinInput('');
      setMaxInput('');
      setAppliedMin(null);
      setAppliedMax(null);
      setError(null);
    }
  };
}