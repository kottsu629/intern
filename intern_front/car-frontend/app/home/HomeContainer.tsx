// HomeContainer.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Car } from './types';
import { API_BASE, fetchJson } from './lib/api';
import { HomePresentation } from './HomePresentation';

const itemsPerPage = 2;

function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const cleaned = trimmed.replace(/,/g, '');
  const n = Number(cleaned);
  if (Number.isNaN(n)) return null;
  return n;
}

function toNumberOrZero(value: string): number {
  const n = parsePrice(value);
  return n === null ? 0 : n;
}

function formatPrice(n: number): string {
  return n.toLocaleString('ja-JP');
}

export function HomeContainer() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filter ui state
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  async function refetchCars() {
    const data = await fetchJson<Car[]>(`${API_BASE}/cars`);
    setCars(data);
  }

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        await refetchCars();
      } catch (e) {
        console.error(e);
        setError('データ取得に失敗しました（APIエラー）');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // filter behavior
  const increaseMin = () => setMinInput((prev) => formatPrice(toNumberOrZero(prev) + 100000));
  const decreaseMin = () => setMinInput((prev) => formatPrice(Math.max(0, toNumberOrZero(prev) - 100000)));
  const increaseMax = () => setMaxInput((prev) => formatPrice(toNumberOrZero(prev) + 100000));
  const decreaseMax = () => setMaxInput((prev) => formatPrice(Math.max(0, toNumberOrZero(prev) - 100000)));

  const handleSearch = () => {
    setMinPrice(minInput);
    setMaxPrice(maxInput);
  };

  const handleClear = () => {
    setMinInput('');
    setMaxInput('');
    setMinPrice('');
    setMaxPrice('');
  };

  // client-side filtering
  const filteredAndSortedCars = useMemo(() => {
    const min = parsePrice(minPrice);
    const max = parsePrice(maxPrice);

    const filtered = cars.filter((car) => {
      if (min !== null && car.price < min) return false;
      if (max !== null && car.price > max) return false;
      return true;
    });

    return [...filtered].sort((a, b) => a.id - b.id);
  }, [cars, minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedCars.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedCars = filteredAndSortedCars.slice(startIndex, startIndex + itemsPerPage);

  return (
    <HomePresentation
      loading={loading}
      error={error}
      pagedCars={pagedCars}
      totalPages={totalPages}
      currentPage={currentPage}
      minInput={minInput}
      maxInput={maxInput}
      onChangeMinInput={setMinInput}
      onChangeMaxInput={setMaxInput}
      onDecreaseMin={decreaseMin}
      onIncreaseMin={increaseMin}
      onDecreaseMax={decreaseMax}
      onIncreaseMax={increaseMax}
      onSearch={handleSearch}
      onClear={handleClear}
      onGoPage={setCurrentPage}
    />
  );
}
