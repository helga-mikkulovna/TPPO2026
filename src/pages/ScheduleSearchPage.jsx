import React, { useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import './ScheduleSearchPage.css';
import { BreadcrumbContext } from '../context/breadcrumbContext';
import { Link } from 'react-router-dom';
import CalendarPicker from '../components/CalendarPicker';
import { addDaysRuDate, getMondayRuDate, ruDateToIso } from '../subsystems/schedule/utils/date';
import { groupTimetableStore } from '../subsystems/schedule/stores/groupTimetableStore';
import { lecturerTimetableStore } from '../subsystems/schedule/stores/lecturerTimetableStore';
import { groupTimetableToDayList } from '../subsystems/schedule/mappers/groupTimetableToUi';
import { lecturerTimetableToDayList } from '../subsystems/schedule/mappers/lecturerTimetableToUi';
import { attendance, groups, lessons, subjects, users } from '../data/database';
import { getUser } from '../subsystems/user/stores/authStorage';

const SCHEDULE_SEARCH_STATE_KEY = 'scheduleSearchPage.state.v1';

function readSavedScheduleSearchState() {
  try {
    const raw = sessionStorage.getItem(SCHEDULE_SEARCH_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSavedScheduleSearchState(state) {
  try {
    sessionStorage.setItem(SCHEDULE_SEARCH_STATE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function getDateOfMonday(ruDate) {
  const dateObj = new Date(ruDate.split('.').reverse().join('-'));
  const dayOfWeek = dateObj.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  dateObj.setDate(dateObj.getDate() + diff);
  return dateObj.toLocaleDateString('ru-RU');
}

function buildWeekRuDates(anyRuDate) {
  const monday = getMondayRuDate(anyRuDate);
  return Array.from({ length: 6 }, (_, i) => addDaysRuDate(monday, i));
}

function formatWeekRange(anyRuDate) {
  const monday = new Date(getMondayRuDate(anyRuDate).split('.').reverse().join('-'));
  const saturday = new Date(monday);
  saturday.setDate(saturday.getDate() + 5);
  const mondayStr = monday.toLocaleDateString('ru-RU');
  const saturdayStr = saturday.toLocaleDateString('ru-RU');
  return `${mondayStr} - ${saturdayStr}`;
}

function parseLecturerFio(text) {
  const parts = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length !== 3) return null;

  const [second_name, first_name, middle_name] = parts;
  return { first_name, second_name, middle_name };
}

function buildDayListFromDbForGroup(groupName, ruDate) {
  const groupRow = groups.find((g) => g.name === groupName);
  if (!groupRow) {
    return { error: 'Группа не найдена', items: [] };
  }

  const dayLessons = lessons
    .filter((l) => l.group_id === groupRow.id && l.date === ruDate)
    .map((l) => {
      const subject = subjects.find((s) => s.id === l.subject_id);
      const lecturer = users.find((u) => u.id === l.teacher_id);
      return {
        id: l.id,
        number: 0,
        time: `${l.start_time} - ${l.end_time}`,
        subject: subject?.name || '—',
        type: l.type,
        groups: [`Гр. ${groupName}`],
        room: `Ауд. ${300 + l.id}`,
        start_time: l.start_time,
        lecturer: lecturer
          ? {
              lecturer_id: lecturer.id,
              first_name: lecturer.first_name,
              last_name: lecturer.second_name,
              middle_name: lecturer.middle_name,
            }
          : null,
      };
    });

  dayLessons.forEach((x) => {
    const order = ['08:00', '09:45', '11:30', '13:30', '15:15', '17:00', '18:45'];
    const idx = order.indexOf(x.start_time);
    x.number = idx === -1 ? 999 : idx + 1;
  });

  dayLessons.sort((a, b) => a.number - b.number);
  return { error: null, items: dayLessons };
}

function buildDayListFromDbForLecturer(lecturer, ruDate) {
  const lecturerRow = users.find(
    (u) =>
      u.first_name === lecturer.first_name &&
      u.second_name === lecturer.second_name &&
      u.middle_name === lecturer.middle_name,
  );

  if (!lecturerRow) {
    return { error: 'Преподаватель не найден', items: [] };
  }

  const dayLessonsRaw = lessons
    .filter((l) => l.teacher_id === lecturerRow.id && l.date === ruDate)
    .map((l) => {
      const subject = subjects.find((s) => s.id === l.subject_id);
      const group = groups.find((g) => g.id === l.group_id);
      return {
        id: l.id,
        start_time: l.start_time,
        end_time: l.end_time,
        subject: subject?.name || '—',
        type: l.type,
        groupName: group?.name || '—',
        room: `Ауд. ${300 + l.id}`,
      };
    });

  const byKey = new Map();
  for (const l of dayLessonsRaw) {
    const key = `${l.start_time}|${l.end_time}|${l.subject}|${l.type}|${l.room}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, {
        id: l.id,
        number: 0,
        time: `${l.start_time} - ${l.end_time}`,
        subject: l.subject,
        type: l.type,
        groups: [`Гр. ${l.groupName}`],
        room: l.room,
        start_time: l.start_time,
      });
    } else {
      existing.groups.push(`Гр. ${l.groupName}`);
      existing.id = Math.min(existing.id, l.id);
    }
  }

  const items = Array.from(byKey.values());
  items.forEach((x) => {
    const order = ['08:00', '09:45', '11:30', '13:30', '15:15', '17:00', '18:45'];
    const idx = order.indexOf(x.start_time);
    x.number = idx === -1 ? 999 : idx + 1;
    x.groups = Array.from(new Set(x.groups)).sort();
  });

  items.sort((a, b) => a.number - b.number);
  return { error: null, items };
}

const ScheduleSearchPage = () => {
  const useApiSchedule = import.meta.env.VITE_USE_API_SCHEDULE === '1';
  const { addBreadcrumb, clearBreadcrumbs } = useContext(BreadcrumbContext);

  const savedState = useMemo(() => readSavedScheduleSearchState(), []);

  const viewer = getUser();
  const viewerRoles = Array.isArray(viewer?.roles)
    ? viewer.roles.map((r) => String(r).toUpperCase())
    : [];
  const isViewerStudent = viewerRoles.includes('STUDENT');
  const isViewerTeacher = viewerRoles.includes('TEACHER');

  const [searchMode, setSearchMode] = useState(() => savedState?.searchMode || 'group'); // group | lecturer
  const [searchText, setSearchText] = useState(() => savedState?.searchText || '');
  const [submittedQuery, setSubmittedQuery] = useState(() => savedState?.submittedQuery || null);

  const [period, setPeriod] = useState(() => savedState?.period || localStorage.getItem('scheduleSearchViewPeriod') || 'День');
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);

  const [currentDate, setCurrentDate] = useState(() => savedState?.currentDate || '03.03.2026');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [inputDate, setInputDate] = useState(() => savedState?.inputDate || savedState?.currentDate || '03.03.2026');

  const [localError, setLocalError] = useState(null);

  const periodSelectorRef = useRef(null);
  const dateButtonRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb('Поиск расписания', '/app/schedule-search');
  }, [addBreadcrumb, clearBreadcrumbs]);

  useEffect(() => {
    localStorage.setItem('scheduleSearchViewPeriod', period);
  }, [period]);

  useEffect(() => {
    writeSavedScheduleSearchState({
      searchMode,
      searchText,
      submittedQuery,
      period,
      currentDate,
      inputDate,
    });
  }, [searchMode, searchText, submittedQuery, period, currentDate, inputDate]);

  const groupState = useSyncExternalStore(groupTimetableStore.subscribe, groupTimetableStore.getSnapshot);
  const lecturerState = useSyncExternalStore(
    lecturerTimetableStore.subscribe,
    lecturerTimetableStore.getSnapshot,
  );

  const activeMode = submittedQuery?.mode || searchMode;
  const activeRemoteState = activeMode === 'group' ? groupState : lecturerState;

  const startEndIso = useMemo(() => {
    const monday = getMondayRuDate(currentDate);
    const startRu = period === 'День' ? currentDate : monday;
    const endRu = period === 'День' ? currentDate : addDaysRuDate(monday, 5);
    return { start_date: ruDateToIso(startRu), end_date: ruDateToIso(endRu) };
  }, [currentDate, period]);

  useEffect(() => {
    if (!useApiSchedule) return;
    if (!submittedQuery) return;

    setLocalError(null);

    if (submittedQuery.mode === 'group') {
      groupTimetableStore.load({
        group: submittedQuery.group,
        start_date: startEndIso.start_date,
        end_date: startEndIso.end_date,
      });
      return () => groupTimetableStore.abort();
    }

    lecturerTimetableStore.load({
      ...submittedQuery.lecturer,
      start_date: startEndIso.start_date,
      end_date: startEndIso.end_date,
    });

    return () => lecturerTimetableStore.abort();
  }, [useApiSchedule, submittedQuery, startEndIso]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (periodSelectorRef.current && !periodSelectorRef.current.contains(event.target)) {
        setIsPeriodSelectorOpen(false);
      }
      if (
        dateButtonRef.current &&
        !dateButtonRef.current.contains(event.target) &&
        !event.target.closest('.calendar-picker') &&
        !event.target.closest('.date-input-wrapper')
      ) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === 'Неделя') {
      setCurrentDate(getDateOfMonday(currentDate));
    }
    setPeriod(newPeriod);
    setIsPeriodSelectorOpen(false);
  };

  const handlePrev = () => {
    if (period === 'День') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() - 1);
      setCurrentDate(dateObj.toLocaleDateString('ru-RU'));
      return;
    }

    const dateObj = new Date(currentDate.split('.').reverse().join('-'));
    dateObj.setDate(dateObj.getDate() - 7);
    const newDate = dateObj.toLocaleDateString('ru-RU');
    setCurrentDate(getDateOfMonday(newDate));
  };

  const handleNext = () => {
    if (period === 'День') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() + 1);
      setCurrentDate(dateObj.toLocaleDateString('ru-RU'));
      return;
    }

    const dateObj = new Date(currentDate.split('.').reverse().join('-'));
    dateObj.setDate(dateObj.getDate() + 7);
    const newDate = dateObj.toLocaleDateString('ru-RU');
    setCurrentDate(getDateOfMonday(newDate));
  };

  const handleDateClick = () => {
    setShowCalendar((v) => !v);
    setShowDateInput(false);
  };

  const handleDateDoubleClick = () => {
    setShowDateInput(true);
    setShowCalendar(false);
  };

  const handleCalendarChange = (date) => {
    setCurrentDate(date);
    setShowCalendar(false);
    setShowDateInput(false);
  };

  const handleDateInputSubmit = () => {
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(inputDate)) {
      setLocalError('Неверный формат даты. Используйте ДД.ММ.ГГГГ');
      return;
    }

    setLocalError(null);
    setCurrentDate(inputDate);
    setShowDateInput(false);
  };

  const handleSubmitSearch = () => {
    setLocalError(null);

    if (searchMode === 'group') {
      const group = String(searchText || '').trim();
      if (!group) {
        setLocalError('Введите номер группы');
        return;
      }
      setSubmittedQuery({ mode: 'group', group });
      return;
    }

    const fio = parseLecturerFio(searchText);
    if (!fio) {
      setLocalError('Введите ФИО преподавателя (Фамилия Имя Отчество)');
      return;
    }

    setSubmittedQuery({ mode: 'lecturer', lecturer: fio });
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSubmittedQuery(null);
    setLocalError(null);
    try {
      groupTimetableStore.abort();
      lecturerTimetableStore.abort();
    } catch (e) {
      // ignore
    }
    inputRef.current?.focus();
  };

  const switchMode = (mode) => {
    setSearchMode(mode);
    setSearchText('');
    setSubmittedQuery(null);
    setLocalError(null);
    groupTimetableStore.abort();
    lecturerTimetableStore.abort();
  };

  const resultTitle = useMemo(() => {
    if (!submittedQuery) return '';
    if (submittedQuery.mode === 'group') return `Группа ${submittedQuery.group}`;
    const l = submittedQuery.lecturer;
    return `${l.second_name} ${l.first_name} ${l.middle_name}`;
  }, [submittedQuery]);

  const normalizeName = (v) => String(v || '').trim().toLowerCase();

  const getLessonIdFromItem = (item) => {
    // API mappers use lessonId; local DB fallback uses id.
    return item?.lessonId ?? item?.lesson_id ?? item?.id ?? null;
  };

  const hasAttendanceForLesson = (lessonId) => {
    if (!lessonId) return false;
    return attendance.some((a) => a.lesson_id === lessonId);
  };

  const isViewerSameLecturer = (lecturer) => {
    if (!lecturer) return false;
    const viewerFirst = normalizeName(viewer?.first_name);
    const viewerLast = normalizeName(viewer?.last_name);
    const viewerMiddle = normalizeName(viewer?.middle_name);

    const itemFirst = normalizeName(lecturer?.first_name);
    const itemLast = normalizeName(lecturer?.last_name);
    const itemMiddle = normalizeName(lecturer?.middle_name);

    if (!viewerFirst || !viewerLast || !viewerMiddle) return false;
    return viewerFirst === itemFirst && viewerLast === itemLast && viewerMiddle === itemMiddle;
  };

  const canNavigateToAttendance = (item) => {
    if (!submittedQuery) return false;

    // Students: never navigate from schedule search.
    if (isViewerStudent) return false;

    // Only teachers can navigate to attendance.
    if (!isViewerTeacher) return false;

    // Only from group timetable search.
    if (submittedQuery.mode !== 'group') return false;

    // Only for own lessons.
    if (!isViewerSameLecturer(item?.lecturer)) return false;

    // Only if attendance is already created for this lesson.
    const lessonId = getLessonIdFromItem(item);
    return hasAttendanceForLesson(lessonId);
  };

  const renderScheduleItem = (item, ruDate) => {
    const lessonId = getLessonIdFromItem(item);
    const actionAllowed = canNavigateToAttendance(item);

    const content = (
      <>
        <div className="item-number">{item.number}</div>
        <div className="item-time">{item.time}</div>
        <div className="item-subject">{item.subject}</div>
        <div className="item-details">
          <p>{item.type}</p>
          <p>{item.groups?.join(', ')}</p>
        </div>
        <div className="item-room">{item.room}</div>
        {actionAllowed && <div className="item-action blue">&rarr;</div>}
      </>
    );

    if (actionAllowed && lessonId) {
      return (
        <Link
          key={item.id}
          to="/app/attendance"
          state={{ lessonId, date: ruDate }}
          className="schedule-item"
        >
          {content}
        </Link>
      );
    }

    return (
      <div key={item.id} className="schedule-item">
        {content}
      </div>
    );
  };

  const dayList = useMemo(() => {
    if (!submittedQuery) return { items: [], error: null };

    if (useApiSchedule) {
      const timetable = activeRemoteState.data;
      if (submittedQuery.mode === 'group') {
        return { items: groupTimetableToDayList(timetable, submittedQuery.group, currentDate), error: null };
      }
      return { items: lecturerTimetableToDayList(timetable, currentDate), error: null };
    }

    if (submittedQuery.mode === 'group') {
      return buildDayListFromDbForGroup(submittedQuery.group, currentDate);
    }
    return buildDayListFromDbForLecturer(submittedQuery.lecturer, currentDate);
  }, [submittedQuery, useApiSchedule, activeRemoteState.data, currentDate]);

  const weekLists = useMemo(() => {
    if (period !== 'Неделя') return [];
    if (!submittedQuery) return [];

    const ruDates = buildWeekRuDates(currentDate);

    return ruDates.map((ruDate, idx) => {
      const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

      if (useApiSchedule) {
        const timetable = activeRemoteState.data;
        const items =
          submittedQuery.mode === 'group'
            ? groupTimetableToDayList(timetable, submittedQuery.group, ruDate)
            : lecturerTimetableToDayList(timetable, ruDate);
        return { dayName: dayNames[idx], date: ruDate, items, error: null };
      }

      const day =
        submittedQuery.mode === 'group'
          ? buildDayListFromDbForGroup(submittedQuery.group, ruDate)
          : buildDayListFromDbForLecturer(submittedQuery.lecturer, ruDate);
      return { dayName: dayNames[idx], date: ruDate, items: day.items, error: day.error };
    });
  }, [period, submittedQuery, useApiSchedule, activeRemoteState.data, currentDate]);

  const loading = useApiSchedule && submittedQuery ? activeRemoteState.loading : false;
  const remoteError = useApiSchedule && submittedQuery ? activeRemoteState.error : null;

  return (
    <div className="schedule-search-page">
      <h2 className="ssp-title">Поиск расписания</h2>

      <div className="ssp-controls">
        <div className="ssp-mode">
          <button
            type="button"
            className={`ssp-mode-btn ${searchMode === 'group' ? 'active' : ''}`}
            onClick={() => switchMode('group')}
          >
            Группа
          </button>
          <button
            type="button"
            className={`ssp-mode-btn ${searchMode === 'lecturer' ? 'active' : ''}`}
            onClick={() => switchMode('lecturer')}
          >
            Преподаватель
          </button>
        </div>

        <div className="ssp-search">
          <input
            className="ssp-search-input"
            ref={inputRef}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmitSearch();
            }}
            placeholder={searchMode === 'group' ? 'Введите номер группы' : 'Введите ФИО преподавателя'}
          />
          {searchText && (
            <button
              type="button"
              className="ssp-clear-btn"
              onClick={handleClearSearch}
              aria-label="Очистить"
            >
              ✕
            </button>
          )}
          <button type="button" className="ssp-search-btn" onClick={handleSubmitSearch} aria-label="Искать">
            🔍
          </button>
        </div>

        <div className="ssp-date">
          <div className="period-selector" ref={periodSelectorRef}>
            <button type="button" onClick={() => setIsPeriodSelectorOpen((v) => !v)}>
              {period} &raquo;
            </button>
            {isPeriodSelectorOpen && (
              <div className="period-options">
                <div onClick={() => handlePeriodChange('День')}>День</div>
                <div onClick={() => handlePeriodChange('Неделя')}>Неделя</div>
              </div>
            )}
          </div>

          <div className="date-navigation">
            <button type="button" onClick={handlePrev} aria-label="Назад">
              &laquo;
            </button>
            <div className="date-selector" ref={dateButtonRef}>
              <button
                type="button"
                onClick={handleDateClick}
                onDoubleClick={handleDateDoubleClick}
                className="date-button"
              >
                {period === 'Неделя' ? formatWeekRange(currentDate) : currentDate}
              </button>

              {showCalendar && (
                <div className="calendar-picker">
                  <CalendarPicker
                    value={currentDate}
                    onChange={handleCalendarChange}
                    mode={period === 'День' ? 'day' : 'week'}
                  />
                </div>
              )}

              {showDateInput && (
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    placeholder="ДД.ММ.ГГГГ"
                    className="date-input"
                  />
                  <button type="button" onClick={handleDateInputSubmit} className="date-submit">
                    Показать
                  </button>
                </div>
              )}
            </div>
            <button type="button" onClick={handleNext} aria-label="Вперёд">
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {(localError || remoteError) && <div className="ssp-error">{localError || remoteError}</div>}

      {submittedQuery && <h3 className="ssp-result-title">{resultTitle}</h3>}

      {loading && submittedQuery ? (
        <div className="no-schedule">Загрузка расписания…</div>
      ) : !submittedQuery ? (
        <div className="ssp-placeholder"></div>
      ) : period === 'День' ? (
        dayList.items.length > 0 ? (
          <div className="schedule-list">
            {dayList.items.map((item) => renderScheduleItem(item, currentDate))}
          </div>
        ) : (
          <div className="no-schedule">Нет данных о расписании на этот день</div>
        )
      ) : (
        <div className="ssp-week">
          {weekLists.map((d) => (
            <div key={d.date} className="ssp-week-day">
              <div className="ssp-week-day-title">
                {d.dayName} {d.date}
              </div>
              {d.items.length > 0 ? (
                <div className="schedule-list">
                  {d.items.map((item) => renderScheduleItem(item, d.date))}
                </div>
              ) : (
                <div className="ssp-week-empty">Нет занятий</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleSearchPage;
