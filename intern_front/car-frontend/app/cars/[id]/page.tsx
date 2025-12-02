'use client';

import { useEffect, useState, useMemo, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Car = {
  id: number;
  model: string;
  year: number;
  price: number;
};

export default function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const carId = useMemo(() => Number(params?.id ?? NaN), [params]);

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ====== 入札フォーム用の状態 ======
  const [bidderName, setBidderName] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Number.isNaN(carId)) {
      setError('ID が不正です');
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const res = await fetch('http://localhost:8080/cars');
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

  // request_id 用の簡易 UUID 生成（ブラウザが crypto.randomUUID をサポートしていればそれを使う）
  const generateRequestId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return 'req-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  };

  // ====== 入札 POST 処理 ======
  const handleSubmitBid = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitError(null);
    setSubmitSuccess(null);

    if (!car) {
      setSubmitError('車両情報が読み込まれていません');
      return;
    }

    const amountNumber = Number(bidAmount);
    if (!bidderName.trim()) {
      setSubmitError('入札者名を入力してください');
      return;
    }
    if (!bidAmount.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setSubmitError('正しい入札金額を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        car_id: car.id,
        amount: amountNumber,
        bidder: bidderName.trim(),
        request_id: generateRequestId(),
      };

      const res = await fetch('http://localhost:8080/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // request_id が重複した場合などもここに入る
        const text = await res.text().catch(() => '');
        console.error('POST /bids error:', res.status, text);
        setSubmitError('入札に失敗しました。時間をおいて再度お試しください。');
        return;
      }

      setSubmitSuccess('入札が完了しました。');
      // フォームの値をリセット
      setBidAmount('');
      // 名前はそのまま残しておく
    } catch (err) {
      console.error(err);
      setSubmitError('ネットワークエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------
  // Loading（読み上げ対応）
  // ------------------------
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 text-lg" aria-live="polite">
          読み込み中...
        </p>
      </main>
    );
  }

  // ------------------------
  // Error（読み上げ強め）
  // ------------------------
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

  // ------------------------
  // Not Found
  // ------------------------
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

  // ------------------------
  // 正常表示（入札フォーム付き）
  // ------------------------
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-xl w-full border border-slate-100">
        <h1 className="text-2xl font-bold mb-6" tabIndex={0}>
          車両詳細
        </h1>

        {/* 車両情報 */}
        <dl className="space-y-4 mb-8">
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
        <section aria-label="この車への入札フォーム" className="mb-8">
          <h2 className="text-lg font-semibold mb-3">この車に入札する</h2>

          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div>
              <label
                htmlFor="bidder-name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                入札者名
              </label>
              <input
                id="bidder-name"
                type="text"
                value={bidderName}
                onChange={(e) => setBidderName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例）山田太郎"
                required
              />
            </div>

            <div>
              <label
                htmlFor="bid-amount"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                入札金額（円）
              </label>
              <input
                id="bid-amount"
                type="number"
                min={1}
                step={1}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例）1500000"
                required
              />
            </div>

            {submitError && (
              <p
                className="text-sm text-red-600"
                aria-live="assertive"
              >
                {submitError}
              </p>
            )}

            {submitSuccess && (
              <p
                className="text-sm text-emerald-600"
                aria-live="polite"
              >
                {submitSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="この車両に入札する"
            >
              {isSubmitting ? '送信中...' : '入札を送信'}
            </button>
          </form>
        </section>

        <div className="mt-4 text-right">
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
