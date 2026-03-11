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

export function useCarCreateSubmit({ onSubmitted }: UseCarSubmitOptions = {}) {
  const [carCreateSubmitting, setCarCreateSubmitting] = useState(false);
  const [carCreateSubmitError, setCarCreateSubmitError] = useState<string | null>(null);
  const [carCreateSubmitSuccess, setCarCreateSubmitSuccess] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();

  const onSubmit = async (v: CarFormValues, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarCreateSubmitError(null);
    setCarCreateSubmitSuccess(null);

    const model = v.modelInput.trim();
    const year = parseInt(v.yearInput.trim(), 10);
    const price = parseAmount(v.priceInput.trim());

    if (!model) {
      setCarCreateSubmitError('車種を入力してください');
      return;
    }
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      setCarCreateSubmitError('正しい年式を入力してください');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setCarCreateSubmitError('正しい価格を入力してください');
      return;
    }

    setCarCreateSubmitting(true);
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
        setCarCreateSubmitError(text || '登録に失敗しました。もう一度お試しください。');
        return;
      }

      const data = await res.json();
      setCarCreateSubmitSuccess('車両を登録しました！');
      setResetKey((k) => k + 1);
      router.refresh();
      onSubmitted?.(data.id);
    } catch {
      setCarCreateSubmitError('サーバーに接続できませんでした。ネットワーク環境をご確認ください。');
    } finally {
      setCarCreateSubmitting(false);
    }
  };

  return { carCreateSubmitting, carCreateSubmitError, carCreateSubmitSuccess, resetKey, onSubmit };
}