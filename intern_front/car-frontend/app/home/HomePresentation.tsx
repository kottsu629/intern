import type { Car } from './types';
import { PageState } from './components/PageState';
import { FilterBar } from './components/FilterBar';
import { CarTable } from './components/CarTable';
import { Pagination } from './components/Pagination';
import { Modal } from './components/Modal';
import { CarCreateForm } from './components/forms/CarCreateForm';

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

  // car modal + form（追加）
  isCarModalOpen: boolean;
  onOpenCarModal: () => void;
  onCloseCarModal: () => void;

  carModel: string;
  carYear: string;
  carPrice: string;
  carSubmitting: boolean;
  carError: string | null;
  carSuccess: string | null;
  onChangeCarModel: (v: string) => void;
  onChangeCarYear: (v: string) => void;
  onChangeCarPrice: (v: string) => void;
  onSubmitCar: () => void;
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

    isCarModalOpen,
    onOpenCarModal,
    onCloseCarModal,

    carModel,
    carYear,
    carPrice,
    carSubmitting,
    carError,
    carSuccess,
    onChangeCarModel,
    onChangeCarYear,
    onChangeCarPrice,
    onSubmitCar,
  } = props;

  return (
    <PageState loading={loading} error={error}>
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">入札対象車両一覧</h1>

            <button
              type="button"
              onClick={onOpenCarModal}
              className="h-11 px-6 rounded-lg bg-indigo-600 text-white text-base font-semibold hover:bg-indigo-700"
            >
              車両登録
            </button>
          </header>

          <div className="mt-8">
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
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4">
              <CarTable cars={pagedCars} />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onGo={onGoPage} />
          </div>

          <Modal open={isCarModalOpen} title="車両登録" onClose={onCloseCarModal}>
            <CarCreateForm
              model={carModel}
              year={carYear}
              price={carPrice}
              submitting={carSubmitting}
              error={carError}
              success={carSuccess}
              onChangeModel={onChangeCarModel}
              onChangeYear={onChangeCarYear}
              onChangePrice={onChangeCarPrice}
              onSubmit={onSubmitCar}
            />
          </Modal>
        </div>
      </main>
    </PageState>
  );
}
