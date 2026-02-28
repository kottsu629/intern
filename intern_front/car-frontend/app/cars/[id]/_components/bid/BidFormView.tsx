'use client';

import { BidList } from './BidList';
import { BidSubmit } from './BidSubmit';
import type { BidFormVM } from './useBidFormVM';

export function BidFormView(props: { vm: BidFormVM }) {
    const { vm } = props;

    return (
    <section className="mt-8 space-y-8">
        <BidSubmit
        bidSubmitting={vm.submit.submitting}
        bidSubmitError={vm.submit.error}
        bidSubmitSuccess={vm.submit.success}
        onSubmit={vm.submit.onSubmit}
        resetKey={vm.submit.resetKey}
        />

        <BidList bids={vm.list.bids} bidsLoading={vm.list.loading} bidsError={vm.list.error} />
    </section>
    );
}