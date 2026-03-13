"use client";

import { useState } from "react";
import type { Car } from "../../_types/car";

export type SortKey = "price" | "id"　| "year";
export type SortOrder = "asc" | "desc";

export function useCarSort(cars: Car[]) {
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedCars = [...cars].sort((a, b) => {
    const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
    return sortOrder === "asc" ? diff : -diff;
  });

  const handleSortKeyChange = (key: SortKey) => setSortKey(key);
  const handleSortOrderChange = (order: SortOrder) => setSortOrder(order);

  return {
    sortedCars,
    sortKey,
    sortOrder,
    handleSortKeyChange,
    handleSortOrderChange,
  };
}
