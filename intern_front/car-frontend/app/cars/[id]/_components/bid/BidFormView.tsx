"use client";

import { BidList } from "./BidList";
import { BidSubmit } from "../../../../_components/BidSubmit";
import type { Bid } from "../../../../_types/bid";

export function BidFormView(props: {
  bids: Bid[];
  bidsLoading: boolean;
  bidsError: string | null;

  bidSubmitting: boolean;
  bidSubmitError: string | null;
  bidSubmitSuccess: string | null;
  resetKey: number;
  onSubmit: (
    v: { bidder: string; amountInput: string },
    e: React.FormEvent<HTMLFormElement>,
  ) => void;
}) {
  const {
    bids,
    bidsLoading,
    bidsError,
    bidSubmitting,
    bidSubmitError,
    bidSubmitSuccess,
    onSubmit,
    resetKey,
  } = props;

  return (
    <section className="mt-8 space-y-8">
      <BidSubmit
        bidSubmitting={bidSubmitting}
        bidSubmitError={bidSubmitError}
        bidSubmitSuccess={bidSubmitSuccess}
        onSubmit={onSubmit}
        resetKey={resetKey}
      />

      <BidList bids={bids} bidsLoading={bidsLoading} bidsError={bidsError} />
    </section>
  );
}
