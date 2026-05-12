import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { login as loginRequest } from '../subsystems/user/api/auth';
import { clearAuth, isAuthenticated, saveAuth } from '../subsystems/user/stores/authStorage';
import { getHomePathByRoles } from '../subsystems/user/utils/homePath';
import { ApiError } from '../api/ApiError';

const LOGIN_ERROR_TEXT = 'Неверный логин или пароль';

function EyeIcon({ crossed }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {crossed ? (
        <>
          <path
            d="M3 3L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10.73 5.08C11.14 5.03 11.56 5 12 5C18 5 22 12 22 12C21.17 13.45 20.12 14.75 18.9 15.83"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6.1 8.17C4.25 9.78 3 12 3 12C3 12 7 19 12 19C13.44 19 14.78 18.62 16 17.98"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.88 9.88C9.34 10.42 9 11.17 9 12C9 13.66 10.34 15 12 15C12.83 15 13.58 14.66 14.12 14.12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14.47 9.53C14.17 8.67 13.33 8 12.3 8C11.27 8 10.43 8.67 10.13 9.53"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M2 12C2 12 6 5 12 5C18 5 22 12 22 12C22 12 18 19 12 19C6 19 2 12 2 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [hasAuthError, setHasAuthError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const homePath = useMemo(() => {
    try {
      return getHomePathByRoles(JSON.parse(localStorage.getItem('auth.user') || 'null')?.roles);
    } catch {
      return getHomePathByRoles(undefined);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(homePath, { replace: true });
    }
  }, [homePath, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setHasAuthError(false);
    setErrorText('');

    try {
      const data = await loginRequest({ login, password });

      if (!data || typeof data !== 'object') {
        throw new Error('Unexpected response');
      }

      if (data.success === false) {
        setHasAuthError(true);
        setErrorText(LOGIN_ERROR_TEXT);
        return;
      }

      saveAuth(data);
      const nextPath = getHomePathByRoles(data.user?.roles);
      navigate(nextPath, { replace: true });
    } catch (err) {
      // If login fails, keep user inputs and allow to edit.
      setHasAuthError(true);

      if (err instanceof ApiError) {
        if (err.status === 400 || err.status === 401) {
          setErrorText(LOGIN_ERROR_TEXT);
        } else if (err.status === 500) {
          setErrorText('Внутренняя ошибка сервера');
        } else {
          // Prefer API-provided description if present.
          const apiDescription =
            err.data &&
            typeof err.data === 'object' &&
            'error_description' in err.data &&
            typeof err.data.error_description === 'string'
              ? err.data.error_description
              : '';

          setErrorText(apiDescription || err.message || 'Ошибка входа');
        }
      } else {
        setErrorText('Не удалось выполнить вход');
      }

      // Safety: if server responded with something inconsistent, ensure we don't keep broken auth.
      clearAuth();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Вход</h1>
        <div className="login-subtitle">С учетной записью вычислительной системы ИМИТ (kappa)</div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Имя пользователя
            <input
              className={`login-input ${hasAuthError ? 'login-input--error' : ''}`}
              value={login}
              onChange={(e) => {
                setLogin(e.target.value);
                if (hasAuthError) {
                  setHasAuthError(false);
                  setErrorText('');
                }
              }}
              placeholder="Введите имя пользователя"
              autoComplete="username"
              disabled={submitting}
            />
          </label>

          <label className="login-label">
            Пароль
            <div className="login-password">
              <input
                className={`login-input login-input--password ${hasAuthError ? 'login-input--error' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (hasAuthError) {
                    setHasAuthError(false);
                    setErrorText('');
                  }
                }}
                placeholder="Введите пароль"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={submitting}
              />

              <button
                type="button"
                className="login-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                disabled={submitting}
              >
                <EyeIcon crossed={!showPassword} />
              </button>
            </div>
          </label>

          {hasAuthError && (
            <div className="login-error" role="alert">
              {errorText || LOGIN_ERROR_TEXT}
            </div>
          )}

          <button className="login-submit" type="submit" disabled={submitting}>
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
