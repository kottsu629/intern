'use client';

import { useState } from 'react';
import { parsePrice, formatPrice } from './useFilterPrice';

export function useFilterInput(onErrorClear: () => void) {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  return {
    minInput,
    maxInput,

    onChangeMinInput: (v: string) => {
      setMinInput(v);
      onErrorClear();
    },

    onChangeMaxInput: (v: string) => {
      setMaxInput(v);
      onErrorClear();
    },

    onDecreaseMin: () => {
      setMinInput(p => formatPrice(Math.max(0, (parsePrice(p) ?? 0) - 100000)));
      onErrorClear();
    },
    onIncreaseMin: () => {
      setMinInput(p => formatPrice((parsePrice(p) ?? 0) + 100000));
      onErrorClear();
    },
    onDecreaseMax: () => {
      setMaxInput(p => formatPrice(Math.max(0, (parsePrice(p) ?? 0) - 100000)));
      onErrorClear();
    },
    onIncreaseMax: () => {
      setMaxInput(p => formatPrice((parsePrice(p) ?? 0) + 100000));
      onErrorClear();
    },

    resetInputs: () => {
      setMinInput('');
      setMaxInput('');
    },
  };
}