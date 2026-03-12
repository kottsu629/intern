'use client';

import { useState } from 'react';
import { useCarCreateSubmit, type CarFormValues } from './useCarCreateSubmit';

export function useCarCreateModal() {
  const [open, setOpen] = useState(false);

  const { carCreateSubmitting, carCreateSubmitError, carCreateSubmitSuccess, resetKey, onSubmit } =
    useCarCreateSubmit({
      onSubmitted: () => {},
    });

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSubmit = (v: CarFormValues, e: React.FormEvent<HTMLFormElement>) => {
    onSubmit(v, e);
  };

  return {
    open,
    carCreateSubmitting,
    carCreateSubmitError,
    carCreateSubmitSuccess,
    resetKey,
    handleOpen,
    handleClose,
    handleSubmit,
  };
}