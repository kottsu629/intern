// hooks/useCars.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Car } from '../types';
import { fetchCars } from '../libCars/carsAPI';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    const data = await fetchCars();
    setCars(data);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        await refetch();
      } catch (e) {
        console.error(e);
        setError('データ取得に失敗しました（APIエラー）');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [refetch]);

  return { cars, loading, error, refetch, setError };
}
