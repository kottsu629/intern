import type { Car } from '../types';

export function CarInfo({ car }: { car: Car }) {
  return (
    <dl className="space-y-4">
      <div className="flex justify-between">
        <dt className="text-slate-500">ID</dt>
        <dd className="font-semibold">{car.id}</dd>
      </div>

      <div className="flex justify-between">
        <dt className="text-slate-500">車種</dt>
        <dd className="font-semibold">{car.model}</dd>
      </div>

      <div className="flex justify-between">
        <dt className="text-slate-500">年式</dt>
        <dd className="font-semibold">{car.year}</dd>
      </div>

      <div className="flex justify-between">
        <dt className="text-slate-500">価格</dt>
        <dd className="font-semibold">{car.price.toLocaleString()} 円</dd>
      </div>
    </dl>
  );
}