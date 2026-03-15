"use client";

import { useState } from "react";
import type { Car } from "../../_types/car";
import { useFilterInput } from "./useFilterInput";
import { useFilterApply } from "./useFilterApply";

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

  const [modelInput, setModelInput] = useState("");
  const [appliedModel, setAppliedModel] = useState<string | null>(null);

  const filteredCars = cars.filter((c) => {
    const withinMin = appliedMin === null || c.price >= appliedMin;
    const withinMax = appliedMax === null || c.price <= appliedMax;
    const matchesModel =
      appliedModel === null || appliedModel === ""
        ? true
        : c.model.toLowerCase().includes(appliedModel.toLowerCase());

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
    onChangeModelInput: (v: string) => {
      setModelInput(v);
    },
    onSearch: () => apply(minInput, maxInput),
    onSearchModel: () => {
      const trimmed = modelInput.trim();
      setAppliedModel(trimmed === "" ? null : trimmed);
    },
    onClear: () => {
      resetInputs();
      resetApply();
      setModelInput("");
      setAppliedModel(null);
    },
  };
}
