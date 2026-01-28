'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Car = {
  id: number;
  model: string;
  year: number;
  price: number;
};

type Bid = {
  id: number;
  car_id: number;
  amount: number;
  bidder: string;
  request_id: string;
  created_at: string; // ISO文字列
};

const API_BASE = 'http://localhost:8080';

// request_id 用の簡易UUID
const generateRequestId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // フォールバック（簡易）
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export default function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const carId = useMemo(() => Number(params?.id ?? NaN), [params]);

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 入札一覧
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidsLoading, setBidsLoading] = useState<boolean>(true);
  const [bidsError, setBidsError] = useState<string | null>(null);

  // 入札フォーム
  const [bidder, setBidder] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [bidSubmitting, setBidSubmitting] = useState<boolean>(false);
  const [bidSubmitError, setBidSubmitError] = useState<string | null>(null);
  const [bidSubmitSuccess, setBidSubmitSuccess] = useState<string | null>(null);

  // 車両情報の取得
  useEffect(() => {
    if (Number.isNaN(carId)) {
      setError('ID が不正です');
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const res = await fetch(`${API_BASE}/cars`);
        if (!res.ok) {
          throw new Error('API error');
        }
        const cars: Car[] = await res.json();
        const found = cars.find((c) => c.id === carId) ?? null;
        setCar(found);
      } catch (e) {
        console.error(e);
        setError('データ取得に失敗しました（APIエラー）');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  // 入札一覧取得の共通関数
  const fetchBids = async () => {
    if (Number.isNaN(carId)) {
      setBidsError('ID が不正です');
      setBidsLoading(false);
      return;
    }

    try {
      setBidsLoading(true);
      setBidsError(null);

      const res = await fetch(`${API_BASE}/bids?item_id=${carId}`);
      if (!res.ok) {
        throw new Error('API error');
      }

      const raw = await res.json();
      // ★万一 null が返ってきても [] に変換
      const data: Bid[] = Array.isArray(raw) ? raw : [];

      setBids(data);
    } catch (e) {
      console.error(e);
      setBidsError('入札情報の取得に失敗しました（APIエラー）');
    } finally {
      setBidsLoading(false);
    }
  };

  // マウント時に入札一覧取得
  useEffect(() => {
    fetchBids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  // 入札送信
  const handleSubmitBid = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBidSubmitError(null);
    setBidSubmitSuccess(null);

    if (Number.isNaN(carId)) {
      setBidSubmitError('車両IDが不正です');
      return;
    }

    const parsedAmount = Number(amountInput.replace(/,/g, '').trim());
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setBidSubmitError('入札額は正の数で入力してください');
      return;
    }
    if (!bidder.trim()) {
      setBidSubmitError('入札者名を入力してください');
      return;
    }

    const payload = {
      car_id: carId,
      amount: parsedAmount,
      bidder: bidder.trim(),
      request_id: generateRequestId(),
    };

    try {
      setBidSubmitting(true);

      const res = await fetch(`${API_BASE}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('POST /bids error:', res.status, text);
        setBidSubmitError('入札の送信に失敗しました');
        return;
      }

      setBidSubmitSuccess('入札を受け付けました');
      setAmountInput('');
      // bidder は続けて入札できるよう保持

      // 最新の入札一覧を再取得
      await fetchBids();
    } catch (e) {
      console.error(e);
      setBidSubmitError('入札の送信中にエラーが発生しました');
    } finally {
      setBidSubmitting(false);
    }
  };

  // ------------------------ Loading ------------------------
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 text-lg" aria-live="polite">
          読み込み中...
        </p>
      </main>
    );
  }

  // ------------------------ Error ------------------------
  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-xl w-full border border-red-100">
          <h1 className="text-2xl font-bold mb-4" tabIndex={0}>
            車両詳細
          </h1>
          <p className="text-red-600 mb-6" aria-live="assertive">
            {error}
          </p>

          <Link
            href="/"
            aria-label="車両一覧ページに戻る"
            className="inline-block bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-900"
          >
            一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  // ------------------------ Not Found ------------------------
  if (!car) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-xl w-full border border-slate-100">
          <h1 className="text-2xl font-bold mb-4" tabIndex={0}>
            車両詳細
          </h1>

          <p className="text-slate-600 mb-6" aria-live="assertive">
            指定された ID の車が見つかりませんでした。
          </p>

          <Link
            href="/"
            aria-label="車両一覧ページに戻る"
            className="inline-block bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-900"
          >
            一覧に戻る
          </Link>
        </div>
      </main>
    );
  }

  // ------------------------ 正常表示 ------------------------
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-3xl w-full border border-slate-100">
        <h1 className="text-2xl font-bold mb-6" tabIndex={0}>
          車両詳細
        </h1>

        {/* 車両情報 */}
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
            <dd className="font-semibold">
              {car.price.toLocaleString()} 円
            </dd>
          </div>
        </dl>

        {/* 入札フォーム */}
        <section className="mt-8 border border-slate-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">この車に入札する</h2>

          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="bidder" className="text-sm text-slate-700">
                入札者名
              </label>
              <input
                id="bidder"
                type="text"
                value={bidder}
                onChange={(e) => setBidder(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例）山田太郎"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="amount" className="text-sm text-slate-700">
                入札額（円）
              </label>
              <input
                id="amount"
                type="text"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例）1,500,000"
              />
              <p className="text-xs text-slate-400">
                カンマ付きの数値でも入力できます（1,500,000 など）。
              </p>
            </div>

            {bidSubmitError && (
              <p className="text-sm text-red-600" aria-live="assertive">
                {bidSubmitError}
              </p>
            )}

            {bidSubmitSuccess && (
              <p className="text-sm text-emerald-600" aria-live="polite">
                {bidSubmitSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={bidSubmitting}
              className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {bidSubmitting ? '送信中...' : '入札を送信'}
            </button>
          </form>
        </section>

        {/* 入札一覧 */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">入札一覧</h2>

          {bidsLoading && (
            <p className="text-slate-600 text-sm" aria-live="polite">
              入札情報を読み込み中です…
            </p>
          )}

          {bidsError && (
            <p className="text-red-600 text-sm" aria-live="assertive">
              {bidsError}
            </p>
          )}

          {!bidsLoading && !bidsError && bids.length === 0 && (
            <p className="text-slate-600 text-sm">
              この車両への入札はまだありません。
            </p>
          )}

          {!bidsLoading && !bidsError && bids.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-600">
                      入札ID
                    </th>
                    <th className="px-3 py-2 text-left text-slate-600">
                      入札額
                    </th>
                    <th className="px-3 py-2 text-left text-slate-600">
                      入札者
                    </th>
                    <th className="px-3 py-2 text-left text-slate-600">
                      入札時刻
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid, index) => (
                    <tr
                      key={bid.id}
                      className={
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                      }
                    >
                      <td className="px-3 py-2">{bid.id}</td>
                      <td className="px-3 py-2">
                        {bid.amount.toLocaleString()} 円
                      </td>
                      <td className="px-3 py-2">{bid.bidder}</td>
                      <td className="px-3 py-2">
                        {new Date(bid.created_at).toLocaleString('ja-JP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-8 text-right">
          <Link
            href="/"
            aria-label="車両一覧ページに戻る"
            className="inline-block bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-900"
          >
            一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
