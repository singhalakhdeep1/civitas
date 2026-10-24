const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function request<T = unknown>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { token, headers: h, ...rest } = opts;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(h as Record<string, string>) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers, ...rest });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T = unknown>(path: string, token?: string) => request<T>(path, { token }),
  post: <T = unknown>(path: string, body: unknown, token?: string) => request<T>(path, { method: 'POST', body: JSON.stringify(body), token }),
  put: <T = unknown>(path: string, body: unknown, token?: string) => request<T>(path, { method: 'PUT', body: JSON.stringify(body), token }),
  patch: <T = unknown>(path: string, body: unknown, token?: string) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body), token }),
  delete: <T = unknown>(path: string, token?: string) => request<T>(path, { method: 'DELETE', token }),
};
