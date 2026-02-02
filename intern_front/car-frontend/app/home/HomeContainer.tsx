// HomeContainer.tsx
'use client';

import { useState } from 'react';
import type { BidCreateRequest, CarCreateRequest } from './types';
import { generateRequestId } from './lib/requestId';
import { HomePresentation } from './HomePresentation';
import type { SortKey, SortOrder } from './components/SortBar';

import { formatPrice, parsePositiveNumber, toNumberOrZero } from './libCars/price';
import { createBid, createCar } from './libCars/carsAPI';
import { useCars } from './hooks/useCars';
import { useCarsView } from './hooks/useCarsView';

const ITEMS_PER_PAGE = 10;

export function HomeContainer() {
  // cars fetch state
  const { cars, loading, error, refetch } = useCars();

  // filter ui state
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // sort ui state
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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

  // filter behavior
  const increaseMin = () => setMinInput((prev) => formatPrice(toNumberOrZero(prev) + 100000));
  const decreaseMin = () =>
    setMinInput((prev) => formatPrice(Math.max(0, toNumberOrZero(prev) - 100000)));
  const increaseMax = () => setMaxInput((prev) => formatPrice(toNumberOrZero(prev) + 100000));
  const decreaseMax = () =>
    setMaxInput((prev) => formatPrice(Math.max(0, toNumberOrZero(prev) - 100000)));

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

  // derived view data (filter + sort + paging)
  const { pagedCars, totalPages } = useCarsView({
    cars,
    minPrice,
    maxPrice,
    sortKey,
    sortOrder,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    onResetPage: () => setCurrentPage(1),
  });

  // submit car
  const submitCar = async () => {
    setCarError(null);
    setCarSuccess(null);

    const model = carModel.trim();
    const yearN = Number(carYear.trim());
    const priceN = parsePositiveNumber(carPrice);

    if (!model) {
      setCarError('車種(model)を入力してください');
      return;
    }
    if (!Number.isFinite(yearN) || yearN <= 0) {
      setCarError('年式(year)は正の整数で入力してください');
      return;
    }
    if (priceN === null) {
      setCarError('価格(price)は正の数で入力してください');
      return;
    }

    const payload: CarCreateRequest = { model, year: yearN, price: priceN };

    try {
      setCarSubmitting(true);
      await createCar(payload);

      setCarSuccess('車両を登録しました');
      setCarModel('');
      setCarYear('');
      setCarPrice('');
      await refetch();
    } catch (e) {
      console.error(e);
      setCarError('車両登録に失敗しました（APIエラー）');
    } finally {
      setCarSubmitting(false);
    }
  };

  // submit bid
  const submitBid = async () => {
    setBidError(null);
    setBidSuccess(null);

    const carIdN = Number(bidCarId);
    const bidder = bidBidder.trim();
    const amountN = parsePositiveNumber(bidAmount);

    if (!Number.isFinite(carIdN) || carIdN <= 0) {
      setBidError('対象車両を選択してください');
      return;
    }
    if (!bidder) {
      setBidError('入札者名を入力してください');
      return;
    }
    if (amountN === null) {
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
      await createBid(payload);

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
      sortKey={sortKey}
      sortOrder={sortOrder}
      onChangeSortKey={setSortKey}
      onToggleSortOrder={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
    />
  );
}
