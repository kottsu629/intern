'use client';

import type { Car } from './types';
import { FilterBar } from './_components/FilterBar';
import { CarsTable } from './_components/CarsTable';
import { Pagination } from './_components/Pagination';
import { PageState } from './_components/PageState';
import { useFilter } from './_lib/useFilter';
import { usePagination } from './_lib/usePagination';
import { useFetchCars } from './_lib/useFetchCars';

type Props = { onFetch: () => Promise<Car[]> };

export function HomePresentation({ onFetch }: Props) {
  const { cars, loading, error } = useFetchCars(onFetch);

  const filter = useFilter(cars);

  const resetKey = `${filter.appliedMin ?? 'null'}-${filter.appliedMax ?? 'null'}`;
  const itemsPerPage = 10;
  const { currentPage, setCurrentPage, totalPages, pagedItems } = usePagination(
    filter.filteredCars,
    itemsPerPage,
    resetKey
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900 mb-6">車両オークション一覧</h1>
        <PageState loading={loading} error={error}>
          <FilterBar {...filter} />
          <CarsTable cars={pagedItems} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onGo={setCurrentPage} />
        </PageState>
      </div>
    </main>
  );
}