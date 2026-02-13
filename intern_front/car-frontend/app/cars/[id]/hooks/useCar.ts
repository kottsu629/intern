'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '../lib/api';
import type { Car } from '../types';

export function useCar(carId: number) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(carId)) {
      setError('ID が不正です');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchCar = async () => {
      try {
        const res = await fetch(`${API_BASE}/cars/${carId}`, { signal: controller.signal });
        if (!res.ok) throw new Error('API error');

        const found: Car = await res.json();
        setCar(found);

      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        console.error(e);
        setError('データ取得に失敗しました（APIエラー）');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
    return () => controller.abort();
  }, [carId]);

  return { car, loading, error };
}