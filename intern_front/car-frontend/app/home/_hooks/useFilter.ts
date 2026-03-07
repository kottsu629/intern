'use client';

import type { Car } from '../../_types/car';
import { useFilterInput } from './useFilterInput';
import { useFilterApply } from './useFilterApply';

export function useFilter(cars: Car[]) {
  const { appliedMin, appliedMax, error, clearError, apply, reset: resetApply } = useFilterApply();

  const {
    minInput,
    maxInput,
    onChangeMinInput,
    onChangeMaxInput,
    onDecreaseMin,
    onIncreaseMin,
    onDecreaseMax,
    onIncreaseMax,
    resetInputs,
  } = useFilterInput(clearError);

  const filteredCars = cars
    .filter(
      c =>
        (appliedMin === null || c.price >= appliedMin) &&
        (appliedMax === null || c.price <= appliedMax),
    )
    .sort((a, b) => a.id - b.id);

  return {
    minInput,
    maxInput,
    appliedMin,
    appliedMax,
    filteredCars,
    error,
    onChangeMinInput,
    onChangeMaxInput,
    onDecreaseMin,
    onIncreaseMin,
    onDecreaseMax,
    onIncreaseMax,
    onSearch: () => apply(minInput, maxInput),
    onClear: () => {
      resetInputs();
      resetApply();
    },
  };
}