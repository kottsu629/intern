'use client';

import { useBidFormViewAndModel } from './useBidFormViewAndModel';
import { BidFormView } from './BidFormView';

export function BidForm(props: { carId: number }) {
  const ViewAndModel = useBidFormViewAndModel(props.carId);
  return <BidFormView ViewAndModel={ViewAndModel} />;
}