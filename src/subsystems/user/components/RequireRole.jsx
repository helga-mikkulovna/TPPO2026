import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '../stores/authStorage';

/**
 * @param {{
 *  allowed?: string[],
 *  denied?: string[],
 *  redirectTo?: string,
 *  children: React.ReactNode,
 * }} props
 */
export default function RequireRole({ allowed, denied, redirectTo = '/app', children }) {
  const location = useLocation();
  const roles = getUser()?.roles || [];
  const normalized = Array.isArray(roles) ? roles.map((r) => String(r).toUpperCase()) : [];

  const deniedSet = new Set((denied || []).map((r) => String(r).toUpperCase()));
  const allowedSet = new Set((allowed || []).map((r) => String(r).toUpperCase()));

  if (normalized.some((r) => deniedSet.has(r))) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (allowed && allowed.length > 0) {
    const ok = normalized.some((r) => allowedSet.has(r));
    if (!ok) {
      return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }
  }

  return children;
}
