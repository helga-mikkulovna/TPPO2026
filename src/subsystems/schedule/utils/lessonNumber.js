/**
 * 1 - 08:00, 2 - 09:45, 3 - 11:30, 4 - 13:30, 5 - 15:15, 6 - 17:00, 7 - 18:45
 * Unknown times go to the end (999).
 * @param {string | undefined | null} startTime
 */
export function getLessonNumberByTime(startTime) {
  const timeMap = {
    '08:00': 1,
    '09:45': 2,
    '11:30': 3,
    '13:30': 4,
    '15:15': 5,
    '17:00': 6,
    '18:45': 7,
  };
  if (!startTime) return 999;
  return timeMap[startTime] || 999;
}
