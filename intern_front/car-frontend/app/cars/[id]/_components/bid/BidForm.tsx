'use client';

import { useBids } from '../../_hooks/useBids';
import { BidList } from './BidList';
import { BidSubmitContainer } from './BidSubmitContainer';

export function BidForm(props: { carId: number }) {
  const { carId } = props;

  const { bids, bidsLoading, bidsError, refetchBids } = useBids(carId);

  return (
    <section className="mt-8">
      <BidSubmitContainer carId={carId} onSubmitted={refetchBids} />
      <BidList bids={bids} bidsLoading={bidsLoading} bidsError={bidsError} />
    </section>
  );
}