import { generateRequestId } from './requestId';

export const API_BASE = 'http://localhost:8080';

export async function fetchJson<T>(url: string): Promise<T> {
  const headers = {
    'X-Request-ID': generateRequestId(),
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, { method: 'GET', headers }).catch(() => {
    
    console.error(`Network Error (X-Request-ID: ${headers['X-Request-ID']})`);
    throw new Error('サーバーに接続できませんでした。ネットワーク環境をご確認ください。');
  });

  if (!res.ok) {
    
    console.error(`API Error: ${res.status} (X-Request-ID: ${headers['X-Request-ID']})`);
    throw new Error('通信エラーが発生しました。しばらくしてから再度お試しください。');
  }

  return (await res.json()) as T;
}