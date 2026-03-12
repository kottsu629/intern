import { API_BASE } from "../_lib/api";
import { HomePresentation } from "./HomePresentation";
import type { Car } from "../_types/car";
import { generateRequestId } from "../_lib/requestId";

export async function fetchJson<T>(url: string): Promise<T> {
  const headers = {
    "X-Request-ID": generateRequestId(),
    "Content-Type": "application/json",
  };

  const res = await fetch(url, { method: "GET", headers }).catch(() => {
    console.error(`Network Error (X-Request-ID: ${headers["X-Request-ID"]})`);
    throw new Error(
      "サーバーに接続できませんでした。ネットワーク環境をご確認ください。",
    );
  });

  if (!res.ok) {
    console.error(
      `API Error: ${res.status} (X-Request-ID: ${headers["X-Request-ID"]})`,
    );
    throw new Error(
      "通信エラーが発生しました。しばらくしてから再度お試しください。",
    );
  }

  return (await res.json()) as T;
}

export async function HomeContainer() {
  const cars = await fetchJson<Car[]>(`${API_BASE}/cars`);
  return <HomePresentation cars={cars} />;
}
