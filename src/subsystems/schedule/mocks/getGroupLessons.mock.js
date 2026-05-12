import { ApiError } from '../../../api/ApiError';
import { lessons, users, groups, subjects } from '../../../data/database';
import { getDayOfWeekRuFull, getIsoWeekNumber } from '../utils/date';

/**
 * @typedef {{
 *   group: string,
 *   start_date?: string,
 *   end_date?: string,
 * }} GroupLessonsQuery
 */

/**
 * Convert RU `DD.MM.YYYY` to ISO `YYYY-MM-DD`.
 * @param {string} ru
 */
function ruToIso(ru) {
  const [dd, mm, yyyy] = ru.split('.');
  if (!dd || !mm || !yyyy) return '';
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

/**
 * @param {string} iso
 */
function pickWeekType(iso) {
  const week = getIsoWeekNumber(iso);
  return week % 2 === 0 ? 'denumerator' : 'enumerator';
}

/**
 * Mock implementation of GET /api/timetable/get_group_lessons.
 * Returns data in backend format.
 * @param {GroupLessonsQuery} query
 */
export async function mockGetGroupLessons(query) {
  const { group, start_date, end_date } = query;
  if (!group) {
    throw new ApiError('Неверные параметры запроса', { status: 400, data: query });
  }

  const groupRow = groups.find((g) => g.name === group);
  if (!groupRow) {
    throw new ApiError('Группа не найдена', { status: 404, data: query });
  }

  const start = start_date || '1900-01-01';
  const end = end_date || '2999-12-31';

  const groupLessons = lessons
    .filter((l) => l.group_id === groupRow.id)
    .map((l) => ({
      ...l,
      isoDate: ruToIso(l.date),
    }))
    .filter((l) => l.isoDate && l.isoDate >= start && l.isoDate <= end);

  /** @type {Record<string, {week_type: string, lessons: any[]}>} */
  const byDate = {};

  for (const l of groupLessons) {
    if (!byDate[l.isoDate]) {
      byDate[l.isoDate] = {
        week_type: pickWeekType(l.isoDate),
        lessons: [],
      };
    }

    const subject = subjects.find((s) => s.id === l.subject_id);
    const lecturer = users.find((u) => u.id === l.teacher_id);

    byDate[l.isoDate].lessons.push({
      lesson_id: l.id,
      subject: subject?.name || '—',
      day_of_week: getDayOfWeekRuFull(l.isoDate),
      lecturer: lecturer
        ? {
            lecturer_id: lecturer.id,
            first_name: lecturer.first_name,
            last_name: lecturer.second_name,
            middle_name: lecturer.middle_name,
          }
        : null,
      start_at: l.start_time,
      end_at: l.end_time,
      location: `Ауд. ${300 + l.id}`,
      status: null,
      lesson_type: l.type,
      lesson_source: 'scheduled',
    });
  }

  // Stable sorting
  const sortedDates = Object.keys(byDate).sort();
  /** @type {Record<string, {week_type: string, lessons: any[]}>} */
  const result = {};
  for (const iso of sortedDates) {
    result[iso] = {
      week_type: byDate[iso].week_type,
      lessons: [...byDate[iso].lessons].sort((a, b) => a.start_at.localeCompare(b.start_at)),
    };
  }

  await new Promise((r) => setTimeout(r, 50));
  return result;
}
