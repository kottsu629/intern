import { generateRequestId } from './requestId';

export const API_BASE = 'http://localhost:8080';

export async function fetchJson<T>(url: string): Promise<T> {
  const headers = {
    'X-Request-ID': generateRequestId(),
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  if (!res.ok) throw new Error(`API Error: ${res.status} (ID: ${headers['X-Request-ID']})`);
  
  return (await res.json()) as T;
}