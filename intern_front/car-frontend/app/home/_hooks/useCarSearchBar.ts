"use client";

import { useState } from "react";

export function useVehicleSearch() {
  const [modelInput, setModelInput] = useState("");
  const [appliedModel, setAppliedModel] = useState<string | null>(null);

  const normalizedModel =
    appliedModel !== null ? appliedModel.toLowerCase() : null;

  const onChangeModelInput = (v: string) => {
    setModelInput(v);
  };

  const onSearchModel = () => {
    const trimmed = modelInput.trim();
    setAppliedModel(trimmed === "" ? null : trimmed);
  };

  const resetModel = () => {
    setModelInput("");
    setAppliedModel(null);
  };

  return {
    modelInput,
    appliedModel,
    normalizedModel,
    onChangeModelInput,
    onSearchModel,
    resetModel,
  };
}
