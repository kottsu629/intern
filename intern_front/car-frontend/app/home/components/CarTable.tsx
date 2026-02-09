import Link from 'next/link';
import type { Car } from '../types';

export function CarTable(props: { cars: Car[] }) {
  const { cars } = props;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-2 text-left text-slate-600 font-semibold">ID</th>
            <th className="px-4 py-2 text-left text-slate-600 font-semibold">車種</th>
            <th className="px-4 py-2 text-left text-slate-600 font-semibold">年式</th>
            <th className="px-4 py-2 text-left text-slate-600 font-semibold">価格</th>
            <th className="px-4 py-2 text-left text-slate-600 font-semibold">詳細</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr key={car.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
              <td className="px-4 py-2">{car.id}</td>
              <td className="px-4 py-2">{car.model}</td>
              <td className="px-4 py-2">{car.year}</td>
              <td className="px-4 py-2">{car.price.toLocaleString()} 円</td>
              <td className="px-4 py-2">
                <Link
                  href={`/cars/${car.id}`}
                  aria-label={`ID ${car.id} の詳細を見る`}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  詳細を見る
                </Link>
              </td>
            </tr>
          ))}

          {cars.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                対象の車両がありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}