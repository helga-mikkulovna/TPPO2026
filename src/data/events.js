// Имитация хранилища мероприятий
let events = [];
let nextEventId = 1;

/**
 * Добавить новое мероприятие
 */
export function addEvent(eventData) {
  const newEvent = {
    id: nextEventId++,
    name: eventData.name,
    location: eventData.location,
    date: eventData.date,
    start_time: eventData.start_time,
    end_time: eventData.end_time,
    groups: eventData.groups || [],
    author: eventData.author,
    comment: eventData.comment || '',
    type: 'Мероприятие',
    created_at: new Date().toISOString().split('T')[0],
  };
  events.push(newEvent);
  return newEvent;
}

/**
 * Получить все мероприятия
 */
export function getAllEvents() {
  return [...events];
}

/**
 * Получить мероприятия на конкретную дату
 */
export function getEventsByDate(date) {
  return events.filter(event => event.date === date);
}

/**
 * Удалить мероприятие
 */
export function deleteEvent(eventId) {
  events = events.filter(event => event.id !== eventId);
}

/**
 * Обновить мероприятие
 */
export function updateEvent(eventId, updatedData) {
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex] = { ...events[eventIndex], ...updatedData };
    return events[eventIndex];
  }
  return null;
}

/**
 * Получить мероприятие по ID
 */
export function getEventById(eventId) {
  return events.find(e => e.id === eventId);
}

/**
 * Очистить все мероприятия (для тестирования)
 */
export function clearAllEvents() {
  events = [];
  nextEventId = 1;
}
