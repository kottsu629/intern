'use client';

import { useState, useEffect, useCallback } from 'react';
import { Car } from '../types';

export function useFetchCars(id: string, onFetch: () => Promise<Car[]>) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onFetch();
      setCars(data);
    } catch {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [onFetch]);

  useEffect(() => {
    loadData();
  }, [loadData, id]);

  return { cars, loading, error };
}