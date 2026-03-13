"use client";

import type { Car } from "../_types/car";
import { FilterBar } from "./_components/FilterBar";
import { CarsTable } from "./_components/CarsTable";
import { Pagination } from "./_components/Pagination";
import { useFilter } from "./_hooks/useFilter";
import { usePagination } from "./_hooks/usePagination";
import { BidModal } from "./_components/BidModal";
import { CarCreateModal } from "./_components/CarCreateModal";
import { CarSortControl } from "./_components/CarSortControl";
import { useCarSort } from "./_hooks/useCarSort";

type Props = { cars: Car[] };

export function HomePresentation({ cars }: Props) {
  const {
    sortedCars,
    sortKey,
    sortOrder,
    handleSortKeyChange,
    handleSortOrderChange,
  } = useCarSort(cars);
  const filter = useFilter(sortedCars);
  const resetKey = `${filter.appliedMin ?? "null"}-${filter.appliedMax ?? "null"}`;
  const itemsPerPage = 10;
  const { currentPage, setCurrentPage, totalPages, pagedItems } = usePagination(
    filter.filteredCars,
    itemsPerPage,
    resetKey,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6">
          車両オークション一覧
        </h1>
        <BidModal cars={cars} />
        <CarCreateModal />
        <FilterBar {...filter} />
        <CarSortControl
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSortKeyChange={handleSortKeyChange}
          onSortOrderChange={handleSortOrderChange}
        />
        <CarsTable cars={pagedItems} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onGo={setCurrentPage}
        />
      </div>
    </main>
  );
}
