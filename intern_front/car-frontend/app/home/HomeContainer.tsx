'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BidCreateRequest, Car, CarCreateRequest } from './types';
import { API_BASE, fetchJson } from './lib/api';
import { generateRequestId } from './lib/requestId';
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

  // create car
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carSubmitting, setCarSubmitting] = useState(false);
  const [carError, setCarError] = useState<string | null>(null);
  const [carSuccess, setCarSuccess] = useState<string | null>(null);

  // quick bid
  const [bidCarId, setBidCarId] = useState('');
  const [bidBidder, setBidBidder] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidSubmitting, setBidSubmitting] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<string | null>(null);

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

    if (!model) {
      setCarError('車種(model)を入力してください');
      return;
    }
    if (!Number.isFinite(yearN) || yearN <= 0) {
      setCarError('年式(year)は正の整数で入力してください');
      return;
    }
    if (!Number.isFinite(priceN) || priceN <= 0) {
      setCarError('価格(price)は正の数で入力してください');
      return;
    }

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
    } catch (e) {
      console.error(e);
      setCarError('車両登録に失敗しました（APIエラー）');
    } finally {
      setCarSubmitting(false);
    }
  };

  // submit bid (text response)
  const submitBid = async () => {
    setBidError(null);
    setBidSuccess(null);

    const carIdN = Number(bidCarId);
    const bidder = bidBidder.trim();
    const amountN = Number(bidAmount.trim().replace(/,/g, ''));

    if (!Number.isFinite(carIdN) || carIdN <= 0) {
      setBidError('対象車両を選択してください');
      return;
    }
    if (!bidder) {
      setBidError('入札者名を入力してください');
      return;
    }
    if (!Number.isFinite(amountN) || amountN <= 0) {
      setBidError('入札額は正の数で入力してください');
      return;
    }

    const payload: BidCreateRequest = {
      car_id: carIdN,
      amount: amountN,
      bidder,
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
        throw new Error(`POST /bids failed: ${res.status} ${text}`);
      }
      setBidSuccess('入札を送信しました');
      setBidAmount('');
    } catch (e) {
      console.error(e);
      setBidError('入札の送信に失敗しました（APIエラー）');
    } finally {
      setBidSubmitting(false);
    }
  };

  return (
    <HomePresentation
      loading={loading}
      error={error}
      carsForSelect={cars}
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
      bidCarId={bidCarId}
      bidBidder={bidBidder}
      bidAmount={bidAmount}
      bidSubmitting={bidSubmitting}
      bidError={bidError}
      bidSuccess={bidSuccess}
      onChangeBidCarId={setBidCarId}
      onChangeBidBidder={setBidBidder}
      onChangeBidAmount={setBidAmount}
      onSubmitBid={submitBid}
    />
  );
}