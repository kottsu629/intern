'use client';

import { BidList } from './BidList';
import { BidSubmit } from './BidSubmit';
import type { BidFormViewModel} from './useBidFormViewModel';

export function BidFormView(props: { ViewModel: BidFormViewModel }) {
    const { ViewModel } = props;

    return (
    <section className="mt-8 space-y-8">
        <BidSubmit
        bidSubmitting={ViewModel.submit.submitting}
        bidSubmitError={ViewModel.submit.error}
        bidSubmitSuccess={ViewModel.submit.success}
        onSubmit={ViewModel.submit.onSubmit}
        resetKey={ViewModel.submit.resetKey}
        />

        <BidList bids={ViewModel.list.bids} bidsLoading={ViewModel.list.loading} bidsError={ViewModel.list.error} />
    </section>
    );
}