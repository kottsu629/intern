'use client';

import { useState } from 'react';
import { API_BASE } from '../_lib/api';
import { generateRequestId } from '../_lib/requestId';
import { parseAmount } from '../_lib/ParseAmount';

export function useBidSubmit(props: { carId: number; onSubmitted: () => Promise<void> | void }) {
    const { carId, onSubmitted } = props;

    const [bidSubmitting, setBidSubmitting] = useState(false);
    const [bidSubmitError, setBidSubmitError] = useState<string | null>(null);
    const [bidSubmitSuccess, setBidSubmitSuccess] = useState<string | null>(null);
    const [resetKey, setResetKey] = useState(0);

    const onSubmit = async (
    v: { bidder: string; amountInput: string },
    e: React.FormEvent<HTMLFormElement>
    ) => {
    e.preventDefault();
    if (bidSubmitting) return;

    setBidSubmitError(null);
    setBidSubmitSuccess(null);

    const parsedAmount = parseAmount(v.amountInput);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        setBidSubmitError('入札額は正の数で入力してください');
        return;
    }

    const trimmedBidder = v.bidder.trim();
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
        await onSubmitted();
        setResetKey((k) => k + 1);
    } catch (err) {
        console.error(err);
        setBidSubmitError('入札の送信中にエラーが発生しました');
    } finally {
        setBidSubmitting(false);
    }
    };

    return { bidSubmitting, bidSubmitError, bidSubmitSuccess, resetKey, onSubmit };
}