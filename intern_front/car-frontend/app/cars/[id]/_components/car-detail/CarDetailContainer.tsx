import type { Car } from "../../../../_types/car";
import { CarDetailPresentation } from "./CarDetailPresentation";
import { notFound } from "next/navigation";
import { API_BASE } from "../../../../_lib/api";

export async function CarDetailContainer(props: { id: string }) {
  const { id } = props;
  const carId = Number(id);
  if (Number.isNaN(carId)) notFound();

  async function fetchCarOr404(idNum: number): Promise<Car> {
    const res = await fetch(`${API_BASE}/cars/${idNum}`, { cache: "no-store" });

    if (res.status === 404) notFound();
    if (!res.ok) throw new Error("車両取得に失敗しました。");

    return res.json();
  }

  const car = await fetchCarOr404(carId);

  return <CarDetailPresentation carId={carId} car={car} />;
}
