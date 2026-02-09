import type React from 'react';

export function Modal(props: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { open, title, onClose, children } = props;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="閉じる"
      />
      <div className="relative z-10 w-[min(980px,92vw)] rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-10 py-7 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
        <div className="px-10 py-8">{children}</div>
      </div>
    </div>
  );
}
