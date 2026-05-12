/**
 * Convert RU date `DD.MM.YYYY` to ISO `YYYY-MM-DD`.
 * @param {string} ru
 */
export function ruDateToIso(ru) {
  const [dd, mm, yyyy] = ru.split('.');
  if (!dd || !mm || !yyyy) throw new Error(`Invalid RU date: ${ru}`);
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

/**
 * Convert ISO date `YYYY-MM-DD` to RU `DD.MM.YYYY`.
 * @param {string} iso
 */
export function isoDateToRu(iso) {
  const [yyyy, mm, dd] = iso.split('-');
  if (!dd || !mm || !yyyy) throw new Error(`Invalid ISO date: ${iso}`);
  return `${dd.padStart(2, '0')}.${mm.padStart(2, '0')}.${yyyy}`;
}

/**
 * @param {string} ruDate
 */
export function getMondayRuDate(ruDate) {
  const iso = ruDateToIso(ruDate);
  const d = new Date(`${iso}T00:00:00`);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  const dd = String(monday.getDate()).padStart(2, '0');
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  const yyyy = String(monday.getFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * @param {string} ruDate
 * @param {number} days
 */
export function addDaysRuDate(ruDate, days) {
  const iso = ruDateToIso(ruDate);
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * @param {string} mondayRuDate
 * @param {number} count
 */
export function buildWeekDays(mondayRuDate, count) {
  const weekDays = [];
  for (let i = 0; i < count; i++) {
    const date = addDaysRuDate(mondayRuDate, i);
    weekDays.push({
      date,
      dayName: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][i % 6],
    });
  }
  return weekDays;
}

/**
 * @param {string} isoDate
 */
export function getDayOfWeekRuFull(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  const idx = d.getDay();
  // JS: 0=Sun ... 6=Sat
  const map = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    0: 'Воскресенье',
  };
  return map[idx];
}

/**
 * ISO week number (1-53).
 * @param {string} isoDate
 */
export function getIsoWeekNumber(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  // Thursday in current week decides the year.
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7,
    )
  );
}
