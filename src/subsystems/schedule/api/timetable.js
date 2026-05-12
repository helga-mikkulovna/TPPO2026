import { apiGet } from '../../../api/httpClient';
import { mockGetLecturerLessons } from '../mocks/getLecturerLessons.mock';
import { mockGetGroupLessons } from '../mocks/getGroupLessons.mock';

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
 * GET /api/timetable/get_lecturer_lessons
 * @param {LecturerLessonsQuery} query
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function getLecturerLessons(query, options = {}) {
  if (!query?.first_name || !query?.second_name || !query?.middle_name) {
    throw new Error('first_name/second_name/middle_name are required');
  }

  const useMock = import.meta.env.VITE_API_MOCK === '1';
  if (useMock) {
    return mockGetLecturerLessons(query);
  }

  return apiGet('/api/timetable/get_lecturer_lessons', query, options.signal);
}

/**
 * @typedef {{
 *   group: string,
 *   start_date?: string,
 *   end_date?: string,
 * }} GroupLessonsQuery
 */

/**
 * GET /api/timetable/get_group_lessons
 * @param {GroupLessonsQuery} query
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function getGroupLessons(query, options = {}) {
  if (!query?.group) {
    throw new Error('group is required');
  }

  const useMock = import.meta.env.VITE_API_MOCK === '1';
  if (useMock) {
    return mockGetGroupLessons(query);
  }

  return apiGet('/api/timetable/get_group_lessons', query, options.signal);
}
