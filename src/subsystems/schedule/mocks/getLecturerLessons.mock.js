import { ApiError } from '../../../api/ApiError';
import { lessons, users, groups, subjects, isLessonConfirmed } from '../../../data/database';
import { getDayOfWeekRuFull, getIsoWeekNumber } from '../utils/date';

/**
 * @typedef {{
 *   first_name: string,
 *   second_name: string,
 *   middle_name: string,
 *   start_date?: string,
 *   end_date?: string,
 * }} LecturerLessonsQuery
 */

/**
 * Convert RU `DD.MM.YYYY` to ISO `YYYY-MM-DD`.
 * Local helper to avoid circular imports with DB.
 * @param {string} ru
 */
function ruToIso(ru) {
  const [dd, mm, yyyy] = ru.split('.');
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
 * Mock implementation of GET /api/timetable/get_lecturer_lessons.
 * Returns data in backend format.
 * @param {LecturerLessonsQuery} query
 */
export async function mockGetLecturerLessons(query) {
  const { first_name, second_name, middle_name, start_date, end_date } = query;
  if (!first_name || !second_name || !middle_name) {
    throw new ApiError('Неверные параметры запроса', { status: 400, data: query });
  }

  const lecturer = users.find(
    (u) =>
      u.first_name === first_name && u.second_name === second_name && u.middle_name === middle_name,
  );

  if (!lecturer) {
    throw new ApiError('Преподаватель не найден', { status: 404, data: query });
  }

  const start = start_date || '1900-01-01';
  const end = end_date || '2999-12-31';

  const lecturerLessons = lessons
    .filter((l) => l.teacher_id === lecturer.id)
    .map((l) => ({
      ...l,
      isoDate: ruToIso(l.date),
    }))
    .filter((l) => l.isoDate >= start && l.isoDate <= end);

  /** @type {Record<string, {week_type: string, lessons: any[]}>} */
  const byDate = {};

  for (const l of lecturerLessons) {
    if (!byDate[l.isoDate]) {
      byDate[l.isoDate] = {
        week_type: pickWeekType(l.isoDate),
        lessons: [],
      };
    }

    // Merge "same lesson" (same date+time+subject+type+location) into one item with multiple groups.
    const subject = subjects.find((s) => s.id === l.subject_id);
    const group = groups.find((g) => g.id === l.group_id);

    const key = `${l.isoDate}|${l.start_time}|${l.end_time}|${l.subject_id}|${l.type}`;

    let item = byDate[l.isoDate].lessons.find((x) => x.__mergeKey === key);
    if (!item) {
      item = {
        __mergeKey: key,
        lesson_id: l.id,
        subject: subject?.name || '—',
        day_of_week: getDayOfWeekRuFull(l.isoDate),
        groups: [],
        start_at: l.start_time,
        end_at: l.end_time,
        location: `Ауд. ${300 + l.id}`,
        lesson_source: 'scheduled',
        lesson_type: l.type,
        is_confirmed: true,
        __lessonIds: [],
      };
      byDate[l.isoDate].lessons.push(item);
    }

    if (group && !item.groups.some((g) => g.group_id === group.id)) {
      item.groups.push({ group_id: group.id, name: group.name });
    }

    item.__lessonIds.push(l.id);
    item.lesson_id = Math.min(item.lesson_id, l.id);
    item.is_confirmed = item.is_confirmed && isLessonConfirmed(l.id);
  }

  // Cleanup internal fields
  for (const iso of Object.keys(byDate)) {
    byDate[iso].lessons = byDate[iso].lessons.map((x) => {
      const { __mergeKey, __lessonIds, ...rest } = x;
      return rest;
    });
  }

  // Make sure response is stable and sorted by time.
  const sortedDates = Object.keys(byDate).sort();
  /** @type {Record<string, {week_type: string, lessons: any[]}>} */
  const result = {};
  for (const iso of sortedDates) {
    result[iso] = {
      week_type: byDate[iso].week_type,
      lessons: [...byDate[iso].lessons].sort((a, b) => a.start_at.localeCompare(b.start_at)),
    };
  }

  // Artificial async to mimic network.
  await new Promise((r) => setTimeout(r, 50));

  return result;
}
