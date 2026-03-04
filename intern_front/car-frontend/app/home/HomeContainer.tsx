'use client';

import { API_BASE, fetchJson } from './_lib/api';
import { HomePresentation } from './HomePresentation';
import { Car } from './types';

export function HomeContainer({ id }: { id: string }) {
  const fetchAction = () => fetchJson<Car[]>(`${API_BASE}/cars`);
  return <HomePresentation id={id} onFetch={fetchAction} />;
}