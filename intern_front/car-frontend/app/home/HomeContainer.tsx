'use client';

import { API_BASE, fetchJson } from './_lib/api';
import { HomePresentation } from './HomePresentation';
import type { Car } from './types';
import { useCallback } from 'react';

export function HomeContainer() {
  const fetchAction = useCallback(() => fetchJson<Car[]>(`${API_BASE}/cars`), []);
  return <HomePresentation onFetch={fetchAction} />;
}