'use client';

import { useState } from 'react';
import { API_BASE } from '../../_lib/api';
import { generateRequestId } from '../../_lib/requestId';
import { useRouter } from 'next/navigation';
import { parseAmount } from '../../_components/ParseAmount';
type UseCarSubmitOptions = {
  onSubmitted?: (newCarId: number) => void;
};

export type CarFormValues = {
  modelInput: string;
  yearInput: string;
  priceInput: string;
};

export function useCarSubmit({ onSubmitted }: UseCarSubmitOptions = {}) {
  const [carSubmitting, setCarSubmitting] = useState(false);
  const [carSubmitError, setCarSubmitError] = useState<string | null>(null);
  const [carSubmitSuccess, setCarSubmitSuccess] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();

  const onSubmit = async (v: CarFormValues, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarSubmitError(null);
    setCarSubmitSuccess(null);

    const model = v.modelInput.trim();
    const year = parseInt(v.yearInput.trim(), 10);
    const price = parseAmount(v.priceInput.trim());

    if (!model) {
      setCarSubmitError('車種を入力してください');
      return;
    }
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      setCarSubmitError('正しい年式を入力してください');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setCarSubmitError('正しい価格を入力してください');
      return;
    }

    setCarSubmitting(true);
    try {
      const requestId = generateRequestId();
      const res = await fetch(`${API_BASE}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
        },
        body: JSON.stringify({ model, year, price }),
      });

      if (!res.ok) {
        const text = await res.text();
        setCarSubmitError(text || '登録に失敗しました。もう一度お試しください。');
        return;
      }

      const data = await res.json();
      setCarSubmitSuccess('車両を登録しました！');
      setResetKey((k) => k + 1);
      router.refresh();
      onSubmitted?.(data.id);
    } catch {
      setCarSubmitError('サーバーに接続できませんでした。ネットワーク環境をご確認ください。');
    } finally {
      setCarSubmitting(false);
    }
  };

  return { carSubmitting, carSubmitError, carSubmitSuccess, resetKey, onSubmit };
}