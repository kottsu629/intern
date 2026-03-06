'use client';

import { useState } from 'react';
import { parsePrice } from './useFilterPrice';

export function useFilterApply() {
  const [appliedMin, setAppliedMin] = useState<number | null>(null);
  const [appliedMax, setAppliedMax] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const apply = (
    minInput: string,
    maxInput: string,
  ) => {
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
  };

  const reset = () => {
    setAppliedMin(null);
    setAppliedMax(null);
    setError(null);
  };

  return { appliedMin, appliedMax, error, clearError, apply, reset };
}