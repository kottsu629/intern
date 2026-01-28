'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Car = {
  id: number;
  model: string;
  year: number;
  price: number;
};

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');

  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;

  const parsePrice = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const cleaned = trimmed.replace(/,/g, '');
    const n = Number(cleaned);
    if (Number.isNaN(n)) return null;
    return n;
  };

  const formatPrice = (n: number): string => {
    return n.toLocaleString('ja-JP');
  };

  const toNumberOrZero = (value: string): number => {
    const n = parsePrice(value);
    return n === null ? 0 : n;
  };

  const increaseMin = () => {
    setMinInput((prev) => {
      const base = toNumberOrZero(prev);
      return formatPrice(base + 100000);
    });
  };

  const decreaseMin = () => {
    setMinInput((prev) => {
      const base = toNumberOrZero(prev);
      const next = Math.max(0, base - 100000);
      return formatPrice(next);
    });
  };

  const increaseMax = () => {
    setMaxInput((prev) => {
      const base = toNumberOrZero(prev);
      return formatPrice(base + 100000);
    });
  };

  const decreaseMax = () => {
    setMaxInput((prev) => {
      const base = toNumberOrZero(prev);
      const next = Math.max(0, base - 100000);
      return formatPrice(next);
    });
  };

  const handleSearch = () => {
    setMinPrice(minInput);
    setMaxPrice(maxInput);
  };

  const handleClear = () => {
    setMinInput('');
    setMaxInput('');
    setMinPrice('');
    setMaxPrice('');
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('http://localhost:8080/cars');
        if (!res.ok) {
          throw new Error('API error');
        }
        const data: Car[] = await res.json();
        setCars(data);
      } catch (e) {
        console.error(e);
        setError('データ取得に失敗しました（APIエラー）');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredAndSortedCars = useMemo(() => {
    const min = parsePrice(minPrice);
    const max = parsePrice(maxPrice);

    const filtered = cars.filter((car) => {
      if (min !== null && car.price < min) return false;
      if (max !== null && car.price > max) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => a.id - b.id);
    return sorted;
  }, [cars, minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedCars.length / itemsPerPage),
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedCars = filteredAndSortedCars.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">読み込み中...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-6 border border-red-100">
          <h1 className="text-xl font-semibold mb-4">
            入札対象車両一覧（APIから取得）
          </h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            aria-label="ページを再読み込み"
            className="inline-flex items-center px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            入札対象車両一覧
          </h1>
        </header>

        {/* 価格帯フィルタ（アクセシビリティ対応） */}
        <section className="mb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 text-sm text-slate-700">
            {/* 最低価格 */}
            <div className="flex items-center gap-2">
              <label htmlFor="min-price" className="sr-only">
                最低価格
              </label>

              <span>最低価格：</span>

              <button
                type="button"
                onClick={decreaseMin}
                aria-label="最低価格を10万円減らす"
                className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
              >
                -10万
              </button>

              <input
                id="min-price"
                type="text"
                aria-label="最低価格を入力"
                placeholder="例）1,000,000"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                className="w-32 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={increaseMin}
                aria-label="最低価格を10万円増やす"
                className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
              >
                +10万
              </button>

              <span>円以上</span>
            </div>

            {/* 最高価格 */}
            <div className="flex items-center gap-2">
              <label htmlFor="max-price" className="sr-only">
                最高価格
              </label>

              <span>最高価格：</span>

              <button
                type="button"
                onClick={decreaseMax}
                aria-label="最高価格を10万円減らす"
                className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
              >
                -10万
              </button>

              <input
                id="max-price"
                type="text"
                aria-label="最高価格を入力"
                placeholder="例）3,000,000"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="w-32 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={increaseMax}
                aria-label="最高価格を10万円増やす"
                className="px-2 py-1 bg-slate-200 rounded hover:bg-slate-300"
              >
                +10万
              </button>

              <span>円以下</span>
            </div>

            {/* 検索 / クリア */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSearch}
                aria-label="指定した価格帯で検索"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
              >
                検索
              </button>

              <button
                type="button"
                onClick={handleClear}
                aria-label="検索条件をクリア"
                className="px-4 py-2 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-xs"
              >
                条件クリア
              </button>
            </div>
          </div>
        </section>

        {/* 一覧テーブル */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-slate-600 font-semibold"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-slate-600 font-semibold"
                >
                  車種
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-slate-600 font-semibold"
                >
                  年式
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-slate-600 font-semibold"
                >
                  価格
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-slate-600 font-semibold"
                >
                  詳細
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedCars.map((car, index) => (
                <tr
                  key={car.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                >
                  <td className="px-4 py-2">{car.id}</td>
                  <td className="px-4 py-2">{car.model}</td>
                  <td className="px-4 py-2">{car.year}</td>
                  <td className="px-4 py-2">
                    {car.price.toLocaleString()} 円
                  </td>
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

              {pagedCars.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    対象の車両がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ページネーション */}
        <nav className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="前のページへ"
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100"
          >
            前へ
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              aria-label={`ページ ${page} へ`}
              disabled={page === currentPage}
              className={`px-3 py-1.5 text-sm rounded-md border ${
                page === currentPage
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="次のページへ"
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100"
          >
            次へ
          </button>
        </nav>
      </div>
    </main>
  );
}
