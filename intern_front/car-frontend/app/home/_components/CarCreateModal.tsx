"use client";

import { CarSubmit } from "./CarCreateSubmit";
import { useCarCreateModal } from "../_hooks/useCarCreateModal";

export function CarCreateModal() {
  const {
    open,
    carCreateSubmitting,
    carCreateSubmitError,
    carCreateSubmitSuccess,
    resetKey,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useCarCreateModal();

  return (
    <>
      <button
        onClick={handleOpen}
        className="
          fixed top-16 right-4 z-40
          flex items-center gap-2
          bg-indigo-600 hover:bg-indigo-700 active:scale-95
          text-white text-sm font-semibold
          px-4 py-2 rounded-full shadow-lg
          transition-all duration-150
        "
        aria-label="車両登録フォームを開く"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        車両登録
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-hidden={!open}
        inert={!open}
        aria-label="車両登録フォーム"
        className={`
          fixed top-0 right-0 z-50 h-full w-full max-w-sm
          bg-white shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">車両登録フォーム</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <CarSubmit
            carSubmitting={carCreateSubmitting}
            carSubmitError={carCreateSubmitError}
            carSubmitSuccess={carCreateSubmitSuccess}
            onSubmit={handleSubmit}
            resetKey={resetKey}
          />
        </div>
      </aside>
    </>
  );
}
