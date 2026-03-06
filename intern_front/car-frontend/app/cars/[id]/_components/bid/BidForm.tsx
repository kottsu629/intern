'use client';

import { useBids } from '../../_hook/useBids';
import { useBidSubmit } from '../../_hook/useBidSubmit';
import { BidFormView } from './BidFormView';

export function BidForm(props: { carId: number }) {
  const { carId } = props;

  const { bids, bidsLoading, bidsError, refetchBids } = useBids(carId);
  const submit = useBidSubmit({ carId, onSubmitted: refetchBids });

  return (
    <BidFormView
      bids={bids}
      bidsLoading={bidsLoading}
      bidsError={bidsError}
      bidSubmitting={submit.bidSubmitting}
      bidSubmitError={submit.bidSubmitError}
      bidSubmitSuccess={submit.bidSubmitSuccess}
      onSubmit={submit.onSubmit}
      resetKey={submit.resetKey}
    />
  );
}