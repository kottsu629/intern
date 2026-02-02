// hooks/useCarsView.ts
'use client';

import { useEffect, useMemo } from 'react';
import type { Car } from '../types';
import { parsePrice } from '../libCars/price';
import type { SortKey, SortOrder } from '../components/SortBar';

export function useCarsView(args: {
  cars: Car[];
  minPrice: string;
  maxPrice: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
  currentPage: number;
  itemsPerPage: number;
  onResetPage: () => void; // 条件変更時に 1 に戻す
}) {
  const { cars, minPrice, maxPrice, sortKey, sortOrder, currentPage, itemsPerPage, onResetPage } = args;

  const filteredCars = useMemo(() => {
    const min = parsePrice(minPrice);
    const max = parsePrice(maxPrice);

    const filtered = cars.filter((car) => {
      if (min !== null && car.price < min) return false;
      if (max !== null && car.price > max) return false;
      return true;
    });

    const dir = sortOrder === 'asc' ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sortKey === 'price') {
        if (a.price !== b.price) return (a.price - b.price) * dir;
        return (a.id - b.id) * dir; // tie-break
      }
      return (a.id - b.id) * dir;
    });
  }, [cars, minPrice, maxPrice, sortKey, sortOrder]);

  useEffect(() => {
    onResetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedCars = filteredCars.slice(startIndex, startIndex + itemsPerPage);

  return { filteredCars, pagedCars, totalPages };
}
