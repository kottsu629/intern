'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types';

export function useFetchCars(onFetch: () => Promise<Car[]>) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await onFetch();
      setCars(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [onFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { cars, loading, error };
}