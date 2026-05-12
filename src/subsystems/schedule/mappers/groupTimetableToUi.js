import { buildWeekDays, getMondayRuDate, isoDateToRu, ruDateToIso } from '../utils/date';
import { getFixedTimeSlots, FIXED_TIME_SLOTS } from '../utils/timeSlots';
import { getLessonNumberByTime } from '../utils/lessonNumber';

/**
 * Backend response shape:
 * { [isoDate: string]: { week_type: string, lessons: Lesson[] } }
 */

/**
 * @param {any} timetable
 * @param {string} groupName
 * @param {string} ruDate
 */
export function groupTimetableToDayList(timetable, groupName, ruDate) {
  if (!timetable) return [];
  const isoDate = ruDateToIso(ruDate);
  const day = timetable[isoDate];
  if (!day?.lessons) return [];

  const list = day.lessons.map((l) => {
    return {
      id: l.lesson_id,
      number: getLessonNumberByTime(l.start_at),
      time: `${l.start_at} - ${l.end_at}`,
      subject: l.subject,
      type: l.lesson_type,
      groups: groupName ? [`Гр. ${groupName}`] : [],
      room: l.location,
      attendanceConfirmed: false,
      isPast: false,
      isCurrent: false,
      lessonIds: [l.lesson_id],
      lessonId: l.lesson_id,
      lecturer: l.lecturer || null,
    };
  });

  list.sort((a, b) => a.number - b.number);
  return list;
}

/**
 * Builds week/two-weeks matrix compatible with existing UI.
 * @param {any} timetable
 * @param {string} groupName
 * @param {string} startRuDate
 * @param {number} daysCount 6 for week (Mon-Sat), 12 for two weeks
 */
export function groupTimetableToMatrixSchedule(timetable, groupName, startRuDate, daysCount) {
  const monday = getMondayRuDate(startRuDate);
  const weekDays = buildWeekDays(monday, daysCount);
  const timeSlots = getFixedTimeSlots();

  const schedule = {
    weekDays,
    timeSlots,
    lessons: {},
  };

  if (!timetable) return schedule;

  /** @type {Record<string, any[]>} */
  const byRuDate = {};
  for (const isoDate of Object.keys(timetable)) {
    const ru = isoDateToRu(isoDate);
    byRuDate[ru] = timetable[isoDate]?.lessons || [];
  }

  for (const day of weekDays) {
    const dayLessons = byRuDate[day.date] || [];

    for (const time of timeSlots) {
      const key = `${day.date}-${time}`;

      let lessonsAtTime;
      if (time === 'no-time') {
        lessonsAtTime = dayLessons.filter((l) => !FIXED_TIME_SLOTS.slice(0, -1).includes(l.start_at));
      } else {
        lessonsAtTime = dayLessons.filter((l) => l.start_at === time);
      }

      if (!lessonsAtTime.length) continue;

      // For group schedule, usually 1 lesson per time slot; still merge by subject+type+location.
      const merged = new Map();
      for (const l of lessonsAtTime) {
        const mergeKey = `${l.subject}|${l.lesson_type}|${l.location}`;
        const existing = merged.get(mergeKey);

        if (!existing) {
          merged.set(mergeKey, {
            id: l.lesson_id,
            subject: l.subject,
            type: l.lesson_type,
            groups: groupName ? [groupName] : [],
            room: l.location,
            time: `${l.start_at} - ${l.end_at}`,
            date: day.date,
            isConfirmed: false,
            lessonIds: [l.lesson_id],
            lecturer: l.lecturer || null,
          });
        } else {
          existing.lessonIds.push(l.lesson_id);
          existing.id = Math.min(existing.id, l.lesson_id);
        }
      }

      schedule.lessons[key] = Array.from(merged.values());
    }
  }

  return schedule;
}
