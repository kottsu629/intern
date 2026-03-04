'use client';

import { useState, useMemo } from 'react';
import { Car } from '../types';

const parsePrice = (v: string) => {
  const n = Number(v.trim().replace(/,/g, ''));
  return isNaN(n) || v.trim() === '' ? null : n;
};
const formatPrice = (n: number) => n.toLocaleString('ja-JP');

export function useFilter(cars: Car[]) {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [appliedMin, setAppliedMin] = useState('');
  const [appliedMax, setAppliedMax] = useState('');

  const filteredCars = useMemo(() => {
    const min = parsePrice(appliedMin);
    const max = parsePrice(appliedMax);
    return cars
      .filter(c => (min === null || c.price >= min) && (max === null || c.price <= max))
      .sort((a, b) => a.id - b.id);
  }, [cars, appliedMin, appliedMax]);

  return {
    minInput, onChangeMinInput: setMinInput, maxInput, onChangeMaxInput: setMaxInput, appliedMin, appliedMax, filteredCars,
    onDecreaseMin: () => setMinInput(p => formatPrice(Math.max(0, (parsePrice(p) ?? 0) - 100000))),
    onIncreaseMin: () => setMinInput(p => formatPrice((parsePrice(p) ?? 0) + 100000)),
    onDecreaseMax: () => setMaxInput(p => formatPrice(Math.max(0, (parsePrice(p) ?? 0) - 100000))),
    onIncreaseMax: () => setMaxInput(p => formatPrice((parsePrice(p) ?? 0) + 100000)),
    onSearch: () => { setAppliedMin(minInput); setAppliedMax(maxInput); },
    onClear: () => { setMinInput(''); setMaxInput(''); setAppliedMin(''); setAppliedMax(''); },
  };
}