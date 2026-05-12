import { apiRequest } from '../../../api/httpClient';

const MOCK_USERS = {
  Teacher: {
    password: '12345',
    user: {
      first_name: 'Александр',
      middle_name: 'Александрович',
      last_name: 'Преподаватель',
      group: '',
      roles: ['TEACHER'],
    },
  },
  Student: {
    password: '12345',
    user: {
      first_name: 'Иван',
      middle_name: 'Иванович',
      last_name: 'Студент',
      group: 'ИВТ-101',
      roles: ['STUDENT'],
    },
  },
};

/**
 * @param {string} seed
 */
function mockToken(seed) {
  // Not a real JWT; just a stable placeholder for client-side storage.
  return `mock.${btoa(unescape(encodeURIComponent(seed)))}.${Date.now()}`;
}

/**
 * POST /api/auth/login
 * @param {{ login: string, password: string }} body
 * @param {{ signal?: AbortSignal }} [options]
 */
export function login(body, options = {}) {
  const useMock = import.meta.env.VITE_API_MOCK === '1';
  if (useMock) {
    const loginValue = body?.login ?? '';
    const passwordValue = body?.password ?? '';

    const record = MOCK_USERS[loginValue];
    const ok = Boolean(record && String(record.password) === String(passwordValue));

    if (!ok) {
      return Promise.resolve({
        access_token: '',
        refresh_token: '',
        user: null,
        success: false,
        error_description: 'Неверный логин или пароль',
      });
    }

    return Promise.resolve({
      access_token: mockToken(`${loginValue}:access`),
      refresh_token: mockToken(`${loginValue}:refresh`),
      user: record.user,
      success: true,
      error_description: '',
    });
  }

  return apiRequest({
    method: 'POST',
    path: '/api/auth/login',
    body,
    signal: options.signal,
  });
}
