import Link from "next/link";
import type { Car } from "../../../../_types/car";
import { CarInfo } from "../CarInfo";
import { BidForm } from "../bid/BidForm";

export function CarDetailPresentation(props: { carId: number; car: Car }) {
  const { carId, car } = props;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white shadow-lg rounded-xl px-8 py-6 max-w-3xl w-full border border-slate-100">
        <h1 className="text-2xl font-bold mb-6" tabIndex={0}>
          車両詳細
        </h1>

        <CarInfo car={car} />

        <BidForm carId={carId} />

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
