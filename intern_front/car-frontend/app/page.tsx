'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';



export default function HomePage() {


  

 

 

 

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            入札対象車両一覧
          </h1>
        </header>

        

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
