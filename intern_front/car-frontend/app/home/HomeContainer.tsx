'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Car, CarCreateRequest } from './types';
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

  // car modal
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);

  // create car
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carSubmitting, setCarSubmitting] = useState(false);
  const [carError, setCarError] = useState<string | null>(null);
  const [carSuccess, setCarSuccess] = useState<string | null>(null);

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

  // submit car
  const submitCar = async () => {
    setCarError(null);
    setCarSuccess(null);

    const model = carModel.trim();
    const yearN = Number(carYear.trim());
    const priceN = Number(carPrice.trim().replace(/,/g, ''));

    if (!model) return setCarError('車種を入力してください');
    if (!Number.isFinite(yearN) || yearN <= 0) return setCarError('年式は正の整数で入力してください');
    if (!Number.isFinite(priceN) || priceN <= 0) return setCarError('価格は正の数で入力してください');

    const payload: CarCreateRequest = { model, year: yearN, price: priceN };

    try {
      setCarSubmitting(true);
      await fetchJson(`${API_BASE}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setCarSuccess('車両を登録しました');
      setCarModel('');
      setCarYear('');
      setCarPrice('');
      await refetchCars();
      setIsCarModalOpen(false);
    } catch (e) {
      console.error(e);
      setCarError('車両登録に失敗しました（APIエラー）');
    } finally {
      setCarSubmitting(false);
    }
  };

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
      isCarModalOpen={isCarModalOpen}
      onOpenCarModal={() => setIsCarModalOpen(true)}
      onCloseCarModal={() => setIsCarModalOpen(false)}
      carModel={carModel}
      carYear={carYear}
      carPrice={carPrice}
      carSubmitting={carSubmitting}
      carError={carError}
      carSuccess={carSuccess}
      onChangeCarModel={setCarModel}
      onChangeCarYear={setCarYear}
      onChangeCarPrice={setCarPrice}
      onSubmitCar={submitCar}
    />
  );
}
