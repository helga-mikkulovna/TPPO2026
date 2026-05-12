import { ApiError } from './ApiError';

/**
 * @typedef {Record<string, string | number | boolean | null | undefined>} Query
 */

/**
 * @param {string} baseUrl
 * @param {string} path
 * @param {Query | undefined} query
 */
function buildUrl(baseUrl, path, query) {
  const normalizedBase = baseUrl?.replace(/\/$/, '') || '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${normalizedBase}${normalizedPath}`, window.location.origin);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  // If baseUrl is absolute, URL() uses it as-is.
  // If baseUrl is empty (""), URL() will resolve against window.location.origin.
  return url.toString();
}

/**
 * @param {Response} res
 */
async function parseResponseBody(res) {
  const contentType = res.headers.get('content-type') || '';
  if (res.status === 204) return null;

  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  try {
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * @template T
 * @param {object} args
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} args.method
 * @param {string} args.path
 * @param {Query} [args.query]
 * @param {unknown} [args.body]
 * @param {AbortSignal} [args.signal]
 * @returns {Promise<T>}
 */
export async function apiRequest({ method, path, query, body, signal }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const url = buildUrl(baseUrl, path, query);

  let accessToken = null;
  try {
    accessToken = localStorage.getItem('auth.accessToken');
  } catch {
    accessToken = null;
  }

  /** @type {RequestInit} */
  const init = {
    method,
    headers: {
      Accept: 'application/json',
    },
    signal,
  };

  if (accessToken) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  if (body !== undefined) {
    init.headers = {
      ...init.headers,
      'Content-Type': 'application/json',
    };
    init.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, init);
  } catch {
    throw new ApiError('Не удалось выполнить запрос к серверу', { url });
  }

  const data = await parseResponseBody(res);

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' && data.message) ||
      `Ошибка запроса (${res.status})`;
    throw new ApiError(message, { status: res.status, data, url });
  }

  return /** @type {T} */ (data);
}

/**
 * @template T
 * @param {string} path
 * @param {Query} [query]
 * @param {AbortSignal} [signal]
 */
export function apiGet(path, query, signal) {
  return apiRequest({ method: 'GET', path, query, signal });
}
