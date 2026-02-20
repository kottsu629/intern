'use client';

import { useMemo } from 'react';
import { useCar } from '../../_hooks/useCar';
import { useBids } from '../../_hooks/useBids';
import { CarDetailPresentation } from './CarDetailPresentation';
import { BidFormContainer } from '../bid/bidFormContainer';
import type { Car } from '../../types';

export function CarDetailContainer({ id, initialCar }: { id: string; initialCar: Car }) {
  const carId = useMemo(() => Number(id ?? NaN), [id]);

  const { car, loading, error } = useCar(carId, initialCar);
  const { bids, bidsLoading, bidsError, refetchBids } = useBids(carId);

  return (
    <CarDetailPresentation
      loading={loading}
      error={error}
      car={car}
      bids={bids}
      bidsLoading={bidsLoading}
      bidsError={bidsError}
      bidForm={<BidFormContainer carId={carId} onSubmitted={refetchBids} />}
    />
  );
}
