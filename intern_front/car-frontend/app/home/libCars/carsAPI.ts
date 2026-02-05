// lib/carsApi.ts
import type { BidCreateRequest, Car, CarCreateRequest } from '../types';
import { API_BASE, fetchJson } from '../lib/api';

export async function fetchCars(): Promise<Car[]> {
  return await fetchJson<Car[]>(`${API_BASE}/cars`);
}

export async function createCar(payload: CarCreateRequest): Promise<void> {
  await fetchJson(`${API_BASE}/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function createBid(payload: BidCreateRequest): Promise<void> {
  // ここを fetchJson に統一（混在解消）
  await fetchJson(`${API_BASE}/bids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
