import { notFound } from 'next/navigation';
import { CarDetailContainer } from './_components/car-detail/CarDetailContainer';
import { API_BASE } from './_lib/api';
import type { Car } from './types';

type PageProps = {
  params: { id: string };
};

async function fetchCarOr404(idNum: number): Promise<Car> {
  
  const res = await fetch(`${API_BASE}/cars/${idNum}`, { cache: 'no-store' });

  if (res.status === 404) notFound();
  if (!res.ok) throw new Error('車両取得に失敗しました。');

  return res.json();
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const idNum = Number(id);
  if (Number.isNaN(idNum)) notFound();

  const car = await fetchCarOr404(idNum);
  return <CarDetailContainer id={id} initialCar={car} />;
}
