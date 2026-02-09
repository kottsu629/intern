'use client';

import { useMemo, useState } from 'react';
import { API_BASE } from './lib/api';
import { generateRequestId } from './lib/requestId';
import { useCar } from './hooks/useCar';
import { useBids } from './hooks/useBids';
import { CarDetailPresentation } from './CarDetailPresentation';

function parseAmount(input: string): number {
  return Number(input.replace(/,/g, '').trim());
}

export function CarDetailContainer({ id }: { id: string }) {
  const carId = useMemo(() => Number(id ?? NaN), [id]);

  const { car, loading, error } = useCar(carId);
  const { bids, bidsLoading, bidsError, refetchBids } = useBids(carId);

  const [bidder, setBidder] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidSubmitError, setBidSubmitError] = useState<string | null>(null);
  const [bidSubmitSuccess, setBidSubmitSuccess] = useState<string | null>(null);

  const handleSubmitBid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBidSubmitError(null);
    setBidSubmitSuccess(null);

    if (Number.isNaN(carId)) {
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
      await refetchBids();
    } catch (err) {
      console.error(err);
      setBidSubmitError('入札の送信中にエラーが発生しました');
    } finally {
      setBidSubmitting(false);
    }
  };

  return (
    <CarDetailPresentation
      loading={loading}
      error={error}
      car={car}
      bids={bids}
      bidsLoading={bidsLoading}
      bidsError={bidsError}
      bidder={bidder}
      amountInput={amountInput}
      bidSubmitting={bidSubmitting}
      bidSubmitError={bidSubmitError}
      bidSubmitSuccess={bidSubmitSuccess}
      onChangeBidder={setBidder}
      onChangeAmountInput={setAmountInput}
      onSubmitBid={handleSubmitBid}
    />
  );
}