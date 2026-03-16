import type { Car } from "../../_types/car";
import { useFilterInput } from "./useFilterInput";
import { useFilterApply } from "./useFilterApply";
import { useCarSearchBar } from "./useCarSearchBar";

export function useFilter(cars: Car[]) {
  const {
    appliedMin,
    appliedMax,
    error,
    clearError,
    apply,
    reset: resetApply,
  } = useFilterApply();

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

  const {
    modelInput,
    appliedModel,
    normalizedModel,
    onChangeModelInput,
    onSearchModel,
    resetModel,
  } = useCarSearchBar();

  const filteredCars = cars.filter((c) => {
    const withinMin = appliedMin === null || c.price >= appliedMin;
    const withinMax = appliedMax === null || c.price <= appliedMax;
    const matchesModel =
      normalizedModel === null
        ? true
        : c.model.toLowerCase().includes(normalizedModel);

    return withinMin && withinMax && matchesModel;
  });

  return {
    minInput,
    maxInput,
    modelInput,
    appliedMin,
    appliedMax,
    appliedModel,
    filteredCars,
    error,
    onChangeMinInput,
    onChangeMaxInput,
    onDecreaseMin,
    onIncreaseMin,
    onDecreaseMax,
    onIncreaseMax,
    onChangeModelInput,
    onSearch: () => apply(minInput, maxInput),
    onSearchModel,
    onClear: () => {
      resetInputs();
      resetApply();
      resetModel();
    },
  };
}
