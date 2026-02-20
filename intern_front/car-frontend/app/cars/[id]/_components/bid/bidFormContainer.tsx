'use client';

import { useState } from 'react';
import { API_BASE } from '../../_lib/api';
import { generateRequestId } from '../../_lib/requestId';
import { BidForm } from '../BidForm';

function parseAmount(input: string): number {
  return Number(input.replace(/,/g, '').trim());
}

export function BidFormContainer(props: {
  carId: number;
  onSubmitted: () => Promise<void> | void; 
}) {
  const { carId, onSubmitted } = props;

  const [bidder, setBidder] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidSubmitError, setBidSubmitError] = useState<string | null>(null);
  const [bidSubmitSuccess, setBidSubmitSuccess] = useState<string | null>(null);

  const handleSubmitBid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBidSubmitError(null);
    setBidSubmitSuccess(null);

    if (!Number.isFinite(carId)) {
      setBidSubmitError('車両IDが不正です');
      return;
    }

    const parsedAmount = parseAmount(amountInput);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setBidSubmitError('入札額は正の数で入力してください');
      return;
    }

    const trimmedBidder = bidder.trim();
    if (!trimmedBidder) {
      setBidSubmitError('入札者名を入力してください');
      return;
    }

    const payload = {
      car_id: carId,
      amount: parsedAmount,
      bidder: trimmedBidder,
      request_id: generateRequestId(),
    };

    try {
      setBidSubmitting(true);

      const res = await fetch(`${API_BASE}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('POST /bids error:', res.status, text);
        setBidSubmitError('入札の送信に失敗しました');
        return;
      }

      setBidSubmitSuccess('入札を受け付けました');
      setAmountInput('');
      await onSubmitted(); 
    } catch (err) {
      console.error(err);
      setBidSubmitError('入札の送信中にエラーが発生しました');
    } finally {
      setBidSubmitting(false);
    }
  };

  return (
    <BidForm
      bidder={bidder}
      amountInput={amountInput}
      bidSubmitting={bidSubmitting}
      bidSubmitError={bidSubmitError}
      bidSubmitSuccess={bidSubmitSuccess}
      onChangeBidder={setBidder}
      onChangeAmountInput={setAmountInput}
      onSubmit={handleSubmitBid}
    />
  );
}
