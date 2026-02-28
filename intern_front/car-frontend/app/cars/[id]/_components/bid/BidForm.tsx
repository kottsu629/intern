'use client';

import { useBidFormVM } from './useBidFormVM';
import { BidFormView } from './BidFormView';

export function BidForm(props: { carId: number }) {
  const vm = useBidFormVM(props.carId);
  return <BidFormView vm={vm} />;
}