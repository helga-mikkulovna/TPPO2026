/**
 * Определяет главную страницу после логина по ролям.
 * Если роли неизвестны — отправляет на расписание.
 * @param {string[] | undefined | null} roles
 */
export function getHomePathByRoles(roles) {
  const normalized = Array.isArray(roles) ? roles.map((r) => String(r).toUpperCase()) : [];

  // По требованию: преподаватель после входа попадает на расписание.
  if (normalized.includes('TEACHER')) {
    return '/app';
  }

  // На текущий момент в приложении реализованы: расписание и посещаемость.
  // Если у пользователя есть роль, связанная с посещаемостью — отправляем туда.
  const attendanceRoles = new Set([
    'ATTENDANCE',
    'ATTENDANCE_VIEW',
    'ATTENDANCE_EDIT',
    'DEANERY',
    'CURATOR',
  ]);

  if (normalized.some((r) => attendanceRoles.has(r))) {
    return '/app/attendance';
  }

  return '/app';
}
