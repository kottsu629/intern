'use client';

import { BidList } from './BidList';
import { BidSubmit } from './BidSubmit';
import type { BidFormViewAndModel} from './useBidFormViewAndModel';

export function BidFormView(props: { ViewAndModel: BidFormViewAndModel }) {
    const { ViewAndModel } = props;

    return (
    <section className="mt-8 space-y-8">
        <BidSubmit
        bidSubmitting={ViewAndModel.submit.submitting}
        bidSubmitError={ViewAndModel.submit.error}
        bidSubmitSuccess={ViewAndModel.submit.success}
        onSubmit={ViewAndModel.submit.onSubmit}
        resetKey={ViewAndModel.submit.resetKey}
        />

        <BidList bids={ViewAndModel.list.bids} bidsLoading={ViewAndModel.list.loading} bidsError={ViewAndModel.list.error} />
    </section>
    );
}