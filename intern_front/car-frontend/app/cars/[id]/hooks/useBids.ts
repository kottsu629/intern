'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '../lib/api';
import type { Bid } from '../types';

export function useBids(carId: number) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [bidsError, setBidsError] = useState<string | null>(null);

  const seq = useRef(0);

  const refetchBids = useCallback(async () => {
    if (Number.isNaN(carId)) {
      setBidsError('ID が不正です');
      setBidsLoading(false);
      return;
    }

    const mySeq = ++seq.current;
    try {
      setBidsLoading(true);
      setBidsError(null);

      const res = await fetch(`${API_BASE}/bids?item_id=${carId}`);
      if (!res.ok) throw new Error('API error');

      const raw = await res.json();
      const data: Bid[] = Array.isArray(raw) ? raw : [];

      if (mySeq !== seq.current) return;
      setBids(data);
    } catch (e) {
      console.error(e);
      setBidsError('入札情報の取得に失敗しました（APIエラー）');
    } finally {
      if (mySeq === seq.current) setBidsLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    refetchBids();
  }, [refetchBids]);

  return { bids, bidsLoading, bidsError, refetchBids };
}