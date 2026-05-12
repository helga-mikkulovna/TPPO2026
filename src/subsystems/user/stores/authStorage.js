const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const USER_KEY = 'auth.user';

/**
 * @typedef {{
 *  first_name?: string,
 *  middle_name?: string,
 *  last_name?: string,
 *  group?: string,
 *  roles?: string[],
 * }} AuthUser
 */

/**
 * @typedef {{
 *  access_token?: string,
 *  refresh_token?: string,
 *  user?: AuthUser,
 * }} AuthResponse
 */

export function saveAuth(data) {
  /** @type {AuthResponse} */
  const payload = data || {};

  if (typeof payload.access_token === 'string') {
    localStorage.setItem(ACCESS_TOKEN_KEY, payload.access_token);
  }

  if (typeof payload.refresh_token === 'string') {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh_token);
  }

  if (payload.user && typeof payload.user === 'object') {
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  }
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/** @returns {AuthUser | null} */
export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}
