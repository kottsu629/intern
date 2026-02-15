// HomePresentation.tsx
import type { Car } from './types';
import { PageState } from './components/PageState';
import { FilterBar } from './components/FilterBar';
import { CarTable } from './components/CarTable';
import { Pagination } from './components/Pagination';

export function HomePresentation(props: {
  loading: boolean;
  error: string | null;

  pagedCars: Car[];
  totalPages: number;
  currentPage: number;

  minInput: string;
  maxInput: string;
  onChangeMinInput: (v: string) => void;
  onChangeMaxInput: (v: string) => void;
  onDecreaseMin: () => void;
  onIncreaseMin: () => void;
  onDecreaseMax: () => void;
  onIncreaseMax: () => void;
  onSearch: () => void;
  onClear: () => void;
  onGoPage: (p: number) => void;
}) {
  const {
    loading,
    error,
    pagedCars,
    totalPages,
    currentPage,

    minInput,
    maxInput,
    onChangeMinInput,
    onChangeMaxInput,
    onDecreaseMin,
    onIncreaseMin,
    onDecreaseMax,
    onIncreaseMax,
    onSearch,
    onClear,
    onGoPage,
  } = props;

  return (
    <PageState loading={loading} error={error}>
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">入札対象車両一覧</h1>
          </header>

          <FilterBar
            minInput={minInput}
            maxInput={maxInput}
            onChangeMinInput={onChangeMinInput}
            onChangeMaxInput={onChangeMaxInput}
            onDecreaseMin={onDecreaseMin}
            onIncreaseMin={onIncreaseMin}
            onDecreaseMax={onDecreaseMax}
            onIncreaseMax={onIncreaseMax}
            onSearch={onSearch}
            onClear={onClear}
          />

          <CarTable cars={pagedCars} />

          <Pagination currentPage={currentPage} totalPages={totalPages} onGo={onGoPage} />
        </div>
      </main>
    </PageState>
  );
}
