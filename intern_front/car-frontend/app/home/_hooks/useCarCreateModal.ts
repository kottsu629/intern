'use client';

import { useState } from 'react';
import { useCarSubmit } from './useCarCreateSubmit';
import type { CarFormValues } from '../_components/CarCreateSubmit';

export function useCarCreateModal() {
  const [open, setOpen] = useState(false);

  const { carSubmitting, carSubmitError, carSubmitSuccess, resetKey, onSubmit } =
    useCarSubmit({
      onSubmitted: () => {},
    });

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleSubmit = (v: CarFormValues, e: React.FormEvent<HTMLFormElement>) => {
    onSubmit(v, e);
  };

  return {
    open,
    carSubmitting,
    carSubmitError,
    carSubmitSuccess,
    resetKey,
    handleOpen,
    handleClose,
    handleSubmit,
  };
}