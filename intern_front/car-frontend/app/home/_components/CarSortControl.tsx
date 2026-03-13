"use client";

import type { SortKey, SortOrder } from "../_hooks/useCarSort";

type Props = {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortKeyChange: (key: SortKey) => void;
  onSortOrderChange: (order: SortOrder) => void;
};

const SORT_KEYS: { value: SortKey; label: string }[] = [
  { value: "id", label: "ID" },
  { value: "price", label: "価格" },
];

const SORT_ORDERS: { value: SortOrder; label: string; icon: string }[] = [
  { value: "asc", label: "昇順", icon: "↑" },
  { value: "desc", label: "降順", icon: "↓" },
];

export function CarSortControl({
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderChange,
}: Props) {
  return (
    <div className="flex justify-end items-center gap-2 text-sm mb-2">
      <span className="text-slate-500 font-medium shrink-0">並び替え</span>

      <div className="flex items-center rounded-md border border-slate-200 overflow-hidden shadow-sm">
        {SORT_KEYS.map((key) => (
          <button
            key={key.value}
            onClick={() => onSortKeyChange(key.value)}
            className={`px-3 py-1.5 font-medium transition-colors ${
              sortKey === key.value
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {key.label}
          </button>
        ))}
      </div>

      <div className="flex items-center rounded-md border border-slate-200 overflow-hidden shadow-sm">
        {SORT_ORDERS.map((order) => (
          <button
            key={order.value}
            onClick={() => onSortOrderChange(order.value)}
            aria-label={order.label}
            className={`px-3 py-1.5 font-medium transition-colors ${
              sortOrder === order.value
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {order.icon} {order.label}
          </button>
        ))}
      </div>
    </div>
  );
}
