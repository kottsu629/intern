'use client';

import { useBidFormViewModel } from './useBidFormViewModel';
import { BidFormView } from './BidFormView';

export function BidForm(props: { carId: number }) {
  const ViewModel = useBidFormViewModel(props.carId);
  return <BidFormView ViewModel={ViewModel} />;
}