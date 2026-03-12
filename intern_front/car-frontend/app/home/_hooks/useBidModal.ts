"use client";

import { useState } from "react";
import { useBidSubmit } from "../../_hooks/useBidSubmit";
import type { BidFormValues } from "../../_components/BidSubmit";

export function useBidModal() {
  const [open, setOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [carError, setCarError] = useState<string | null>(null);

  const {
    bidSubmitting,
    bidSubmitError,
    bidSubmitSuccess,
    resetKey,
    onSubmit,
  } = useBidSubmit({
    carId: selectedCarId ?? 0,
    onSubmitted: () => {},
  });

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleCarChange = (id: number | null) => {
    setSelectedCarId(id);
    setCarError(null);
  };

  const handleSubmit = (
    v: BidFormValues,
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    if (!selectedCarId) {
      e.preventDefault();
      setCarError("車両を選択してください");
      return;
    }
    setCarError(null);
    onSubmit(v, e);
  };

  return {
    open,
    selectedCarId,
    carError,
    bidSubmitting,
    bidSubmitError,
    bidSubmitSuccess,
    resetKey,
    handleOpen,
    handleClose,
    handleCarChange,
    handleSubmit,
  };
}
