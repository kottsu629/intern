'use client';

import type { Bid } from '../../types';
import { useBids } from '../../_hooks/useBids';
import { useBidSubmit } from './useBidSubmit';

export type BidFormVM = {
    list: {
    bids: Bid[];
    loading: boolean;
    error: string | null;
    };
    submit: {
    submitting: boolean;
    error: string | null;
    success: string | null;
    resetKey: number;
    onSubmit: (
        v: { bidder: string; amountInput: string },
        e: React.FormEvent<HTMLFormElement>
    ) => void;
    };
};

export function useBidFormVM(carId: number): BidFormVM {
    const { bids, bidsLoading, bidsError, refetchBids } = useBids(carId);

    const submit = useBidSubmit({ carId, onSubmitted: refetchBids });

    return {
        list: { bids, loading: bidsLoading, error: bidsError },
        
        submit: {
        submitting: submit.bidSubmitting,
        error: submit.bidSubmitError,
        success: submit.bidSubmitSuccess,
        resetKey: submit.resetKey,
        onSubmit: submit.onSubmit,
        }
    };
}