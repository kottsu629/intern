'use client';

import { API_BASE, fetchJson } from './_lib/api';
import { HomePresentation } from './HomePresentation';
import type { Car } from './types';

export function HomeContainer() {
  const fetchAction = () => fetchJson<Car[]>(`${API_BASE}/cars`);
  return <HomePresentation onFetch={fetchAction} />;
}