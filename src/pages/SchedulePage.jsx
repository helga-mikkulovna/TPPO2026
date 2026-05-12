import React, { useState, useEffect, useRef, useContext, useSyncExternalStore } from 'react';
import './SchedulePage.css';
import { Link } from 'react-router-dom';
import { BreadcrumbContext } from '../context/breadcrumbContext';
import { getScheduleForDate, getScheduleForWeek, getScheduleForTwoWeeks, groups as allGroups, getLessonNumberByTime } from '../data/database';
import AddEventModal from '../components/AddEventModal';
import { addEvent } from '../data/events';
import { lecturerTimetableToDayList, lecturerTimetableToMatrixSchedule } from '../subsystems/schedule/mappers/lecturerTimetableToUi';
import { addDaysRuDate, getMondayRuDate, ruDateToIso } from '../subsystems/schedule/utils/date';
import { lecturerTimetableStore } from '../subsystems/schedule/stores/lecturerTimetableStore';
import { getUser } from '../subsystems/user/stores/authStorage';
import CalendarPicker from '../components/CalendarPicker';

const SchedulePage = () => {
  const useApiSchedule = import.meta.env.VITE_USE_API_SCHEDULE === '1';
  const roles = getUser()?.roles || [];
  const normalizedRoles = Array.isArray(roles) ? roles.map((r) => String(r).toUpperCase()) : [];
  const canUseAttendance = !normalizedRoles.includes('STUDENT');
  const [period, setPeriod] = useState(() => {
    // Получить сохраненный период из localStorage или использовать 'День' по умолчанию
    return localStorage.getItem('scheduleViewPeriod') || 'День';
  });
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('02.03.2026');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDateInput, setShowDateInput] = useState(false);
  const [inputDate, setInputDate] = useState(currentDate);
  const [selectedLessonDetail, setSelectedLessonDetail] = useState(null);
  const [lessonDetailPosition, setLessonDetailPosition] = useState({ x: 0, y: 0 });
  const [expandedCell, setExpandedCell] = useState(null);
  const [lessonRotations, setLessonRotations] = useState({});
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [events, setEvents] = useState([]);
  const periodSelectorRef = useRef(null);
  const dateButtonRef = useRef(null);
  const lessonDetailPopupRef = useRef(null);
  const { addBreadcrumb, clearBreadcrumbs } = useContext(BreadcrumbContext);

  useEffect(() => {
    clearBreadcrumbs();
    addBreadcrumb('Моё расписание', '/app');
  }, [addBreadcrumb, clearBreadcrumbs]);

  useEffect(() => {
    if (!useApiSchedule) return;

    const lecturer = {
      first_name: 'Александр',
      second_name: 'Преподаватель',
      middle_name: 'Александрович',
    };

    const monday = getMondayRuDate(currentDate);

    const startRu = period === 'День' ? currentDate : monday;
    const endRu =
      period === 'День'
        ? currentDate
        : period === 'Неделя'
          ? addDaysRuDate(monday, 5)
          : addDaysRuDate(monday, 11);

    const start_date = ruDateToIso(startRu);
    const end_date = ruDateToIso(endRu);

    lecturerTimetableStore.load({
      ...lecturer,
      start_date,
      end_date,
    });

    return () => lecturerTimetableStore.abort();
  }, [useApiSchedule, currentDate, period]);

  const timetableState = useSyncExternalStore(
    lecturerTimetableStore.subscribe,
    lecturerTimetableStore.getSnapshot,
  );

  const lecturerTimetable = timetableState.data;
  const timetableLoading = timetableState.loading;
  const timetableError = timetableState.error;

  // Сохранять выбор периода в localStorage
  useEffect(() => {
    localStorage.setItem('scheduleViewPeriod', period);
  }, [period]);

  const currentSchedule = useApiSchedule
    ? lecturerTimetableToDayList(lecturerTimetable, currentDate)
    : getScheduleForDate(currentDate);

  const getWeekDateRange = () => {
    const monday = new Date(currentDate.split('.').reverse().join('-'));
    const saturday = new Date(monday);
    saturday.setDate(saturday.getDate() + 5); // понедельник + 5 дней = суббота
    const mondayStr = monday.toLocaleDateString('ru-RU');
    const saturdayStr = saturday.toLocaleDateString('ru-RU');
    return `${mondayStr} - ${saturdayStr}`;
  };

  const getTwoWeeksDateRange = () => {
    const monday = new Date(currentDate.split('.').reverse().join('-'));
    const saturdayOfSecondWeek = new Date(monday);
    saturdayOfSecondWeek.setDate(saturdayOfSecondWeek.getDate() + 11); // понедельник + 11 дней = суббота второй недели
    const mondayStr = monday.toLocaleDateString('ru-RU');
    const saturdayStr = saturdayOfSecondWeek.toLocaleDateString('ru-RU');
    return `${mondayStr} - ${saturdayStr}`;
  };

  const isDateInRange = (dateStr, startDate, endDate) => {
    const [d, m, y] = dateStr.split('.');
    const date = new Date(`${y}-${m}-${d}`);
    const [sd, sm, sy] = startDate.split('.');
    const start = new Date(`${sy}-${sm}-${sd}`);
    const [ed, em, ey] = endDate.split('.');
    const end = new Date(`${ey}-${em}-${ed}`);
    
    return date >= start && date <= end;
  };

  const getCurrentWeekIndex = () => {
    // Определяет какой недели (1 или 2) соответствует сегодняшний день в двухнедельном расписании
    const today = '13.04.2026';
    const mondayOfDisplayedWeeks = new Date(currentDate.split('.').reverse().join('-'));
    const dayOfWeek = mondayOfDisplayedWeeks.getDay();
    const diff = mondayOfDisplayedWeeks.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(mondayOfDisplayedWeeks);
    monday.setDate(diff);

    const weekOneMondayStr = monday.toLocaleDateString('ru-RU');
    const weekOneSaturdayStr = (() => {
      const sat = new Date(monday);
      sat.setDate(sat.getDate() + 5);
      return sat.toLocaleDateString('ru-RU');
    })();

    const weekTwoMondayStr = (() => {
      const mon = new Date(monday);
      mon.setDate(mon.getDate() + 6);
      return mon.toLocaleDateString('ru-RU');
    })();

    const weekTwoSaturdayStr = (() => {
      const sat = new Date(monday);
      sat.setDate(sat.getDate() + 11);
      return sat.toLocaleDateString('ru-RU');
    })();

    if (isDateInRange(today, weekOneMondayStr, weekOneSaturdayStr)) {
      return 1;
    } else if (isDateInRange(today, weekTwoMondayStr, weekTwoSaturdayStr)) {
      return 2;
    }
    return 0;
  };

  const isLessonPast = (item) => {
    return item.isPast || item.isCurrent;
  };

  const getButtonClass = (item) => {
    if (item.isPast) {
      return item.attendanceConfirmed ? 'green' : 'red';
    }
    if (item.isCurrent) {
      return 'blue';
    }
    return '';
  };

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === 'Неделя' || newPeriod === '2 Недели') {
      // При переключении на неделю или две недели, устанавливаем дату на понедельник текущей недели
      setCurrentDate(getDateOfMonday(currentDate));
    }
    setPeriod(newPeriod);
    setIsPeriodSelectorOpen(false);
  };

  const getDateOfMonday = (date) => {
    const dateObj = new Date(date.split('.').reverse().join('-'));
    const dayOfWeek = dateObj.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 0 = воскресенье, 1 = понедельник
    dateObj.setDate(dateObj.getDate() + diff);
    return dateObj.toLocaleDateString('ru-RU');
  };

  const handlePrevDay = () => {
    if (period === 'День') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() - 1);
      const newDate = dateObj.toLocaleDateString('ru-RU');
      setCurrentDate(newDate);
    } else if (period === 'Неделя') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() - 7);
      const newDate = dateObj.toLocaleDateString('ru-RU');
      setCurrentDate(getDateOfMonday(newDate));
    } else if (period === '2 Недели') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() - 14);
      const newDate = dateObj.toLocaleDateString('ru-RU');
      setCurrentDate(getDateOfMonday(newDate));
    }
  };

  const handleNextDay = () => {
    if (period === 'День') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() + 1);
      const newDate = dateObj.toLocaleDateString('ru-RU');
      setCurrentDate(newDate);
    } else if (period === 'Неделя') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() + 7);
      const newDate = dateObj.toLocaleDateString('ru-RU');
      setCurrentDate(getDateOfMonday(newDate));
    } else if (period === '2 Недели') {
      const dateObj = new Date(currentDate.split('.').reverse().join('-'));
      dateObj.setDate(dateObj.getDate() + 14);
      const newDate = dateObj.toLocaleDateString('ru-RU');
      setCurrentDate(getDateOfMonday(newDate));
    }
  };

  const handleDateClick = () => {
    setShowCalendar(!showCalendar);
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
    if (dateRegex.test(inputDate)) {
      setCurrentDate(inputDate);
      setShowDateInput(false);
    } else {
      alert('Неверный формат даты. Используйте ДД.МММ.ГГГГ');
    }
  };

  const handleClickOutside = (event) => {
    if (periodSelectorRef.current && !periodSelectorRef.current.contains(event.target)) {
      setIsPeriodSelectorOpen(false);
    }
    if (dateButtonRef.current && !dateButtonRef.current.contains(event.target) && !event.target.closest('.calendar-picker') && !event.target.closest('.date-input-wrapper')) {
      setShowCalendar(false);
    }
    // Закрывать попап если клик вне его
    if (selectedLessonDetail && !event.target.closest('.lesson-detail-popup')) {
      setSelectedLessonDetail(null);
    }
    // Закрывать раскрытую ячейку если клик вне таблицы
    if (!event.target.closest('table')) {
      setExpandedCell(null);
    }
  };

  const calculatePopupPosition = (triggerRect, initialPosition) => {
    // Задержка для получения размеров DOM элемента
    setTimeout(() => {
      if (!lessonDetailPopupRef.current) return;

      const popupRect = lessonDetailPopupRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const padding = 10;
      let finalPosition = { ...initialPosition };

      // Горизонтальное позиционирование: справа или слева от элемента
      const spaceOnRight = windowWidth - triggerRect.right - padding;
      const spaceOnLeft = triggerRect.left - padding;

      if (spaceOnRight >= popupRect.width) {
        // Есть место справа - показываем справа
        finalPosition.x = triggerRect.right + padding;
      } else if (spaceOnLeft >= popupRect.width) {
        // Нет места справа, но есть место слева - показываем слева
        finalPosition.x = triggerRect.left - popupRect.width - padding;
      } else {
        // Нет места ни справа ни слева - позиционируем по центру экрана
        finalPosition.x = Math.max(padding, Math.min(windowWidth - popupRect.width - padding, (windowWidth - popupRect.width) / 2));
      }

      // Вертикальное позиционирование: пытаемся не закрывать триггер элемент
      // По умолчанию выравниваем по верхнему краю триггера
      finalPosition.y = triggerRect.top;

      // Проверяем, не выходим ли за нижний край экрана
      if (finalPosition.y + popupRect.height > windowHeight - padding) {
        // Если выходим за нижний край, пытаемся выравнять по нижнему краю триггера
        finalPosition.y = triggerRect.bottom - popupRect.height;
        
        // Если всё ещё выходим за нижний край, смещаем вверх на 10px от края
        if (finalPosition.y + popupRect.height > windowHeight - padding) {
          finalPosition.y = windowHeight - popupRect.height - padding;
        }
      }

      // Проверяем, не выходим ли за верхний край
      if (finalPosition.y < padding) {
        finalPosition.y = padding;
      }

      // Финальная проверка левого края
      if (finalPosition.x < padding) {
        finalPosition.x = padding;
      }

      // Финальная проверка правого края
      if (finalPosition.x + popupRect.width > windowWidth - padding) {
        finalPosition.x = windowWidth - popupRect.width - padding;
      }

      setLessonDetailPosition(finalPosition);
    }, 0);
  };

  const handleCellClick = (e, cellKey) => {
    // Останавливаем распространение события из lesson-block
    if (e.target.closest('.lesson-block')) {
      return;
    }
    
    e.stopPropagation();
    // Если клик на уже раскрытую ячейку - закрываем, иначе раскрываем новую
    setExpandedCell(expandedCell === cellKey ? null : cellKey);
  };

  const handleLessonClick = (e, lesson) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const initialPosition = {
      x: rect.right + 10,
      y: rect.top,
    };
    setSelectedLessonDetail(lesson);
    setLessonDetailPosition(initialPosition);
    calculatePopupPosition(rect, initialPosition);
  };

  const handleRotateLessons = (e, cellKey, lessonsCount) => {
    e.stopPropagation();
    setLessonRotations(prev => ({
      ...prev,
      [cellKey]: ((prev[cellKey] || 0) + 1) % lessonsCount
    }));
  };

  const handleAddEventClick = () => {
    setShowAddEventModal(true);
  };

  const handleSaveEvent = (formData) => {
    const newEvent = addEvent(formData);
    setEvents(prev => [...prev, newEvent]);
    setShowAddEventModal(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedLessonDetail, expandedCell]);

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h2>Расписание на 
          <div className="period-selector" ref={periodSelectorRef}>
            <button onClick={() => setIsPeriodSelectorOpen(!isPeriodSelectorOpen)}>
              {period} &raquo;
            </button>
            {isPeriodSelectorOpen && (
              <div className="period-options">
                <div onClick={() => handlePeriodChange('День')}>День</div>
                <div onClick={() => handlePeriodChange('Неделя')}>Неделя</div>
                <div onClick={() => handlePeriodChange('2 Недели')}>2 Недели</div>
              </div>
            )}
          </div>
        </h2>
        <div className="date-navigation">
          <button onClick={handlePrevDay}>&laquo;</button>
          <div className="date-selector" ref={dateButtonRef}>
            <button 
              onClick={handleDateClick}
              onDoubleClick={handleDateDoubleClick}
              className="date-button"
            >
              {period === 'Неделя' ? getWeekDateRange() : period === '2 Недели' ? getTwoWeeksDateRange() : currentDate}
            </button>
            {showCalendar && (
              <div className="calendar-picker">
                <CalendarPicker
                  value={currentDate}
                  onChange={handleCalendarChange}
                  mode={
                    period === 'День'
                      ? 'day'
                      : period === 'Неделя'
                        ? 'week'
                        : 'twoWeeks'
                  }
                />
              </div>
            )}
            {showDateInput && (
              <div className="date-input-wrapper">
                <input
                  type="text"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  placeholder="ДД.МММ.ГГГГ"
                  className="date-input"
                />
                <button onClick={handleDateInputSubmit} className="date-submit">Показать</button>
              </div>
            )}
          </div>
          <button onClick={handleNextDay}>&raquo;</button>
        </div>
        <button className="add-event-btn" onClick={handleAddEventClick}>+ Добавить мероприятие</button>
      </div>

      {period === 'День' && (
        <>
          {timetableLoading && useApiSchedule ? (
            <div className="no-schedule">Загрузка расписания…</div>
          ) : timetableError && useApiSchedule ? (
            <div className="no-schedule">{timetableError}</div>
          ) : currentSchedule && currentSchedule.length > 0 || events.filter(e => e.date === currentDate).length > 0 ? (
            <div className="schedule-list">
              {(() => {
                const dayEvents = events.filter(e => e.date === currentDate);
                const combinedItems = [
                  ...currentSchedule.map(item => ({ ...item, isEvent: false })),
                  ...dayEvents.map(event => ({
                    id: `event-${event.id}`,
                    number: getLessonNumberByTime(event.start_time),
                    time: `${event.start_time} - ${event.end_time}`,
                    subject: event.name,
                    type: event.type,
                    groups: event.groups.map(gId => {
                      const group = allGroups.find(g => g.id === gId);
                      return `Гр. ${group?.name || ''}`;
                    }),
                    room: event.location,
                    attendanceConfirmed: true,
                    isPast: true,
                    isCurrent: false,
                    isEvent: true,
                    originalEvent: event,
                  }))
                ].sort((a, b) => a.number - b.number);
                return combinedItems.map((item) => (
                  !item.isEvent ? (
                    isLessonPast(item) ? (
                      canUseAttendance ? (
                        <Link
                          key={item.id}
                          to="/app/attendance"
                          state={{ lessonId: item.id, date: currentDate }}
                          className={`schedule-item ${getButtonClass(item)}`}
                        >
                          <div className="item-number">{item.number}</div>
                          <div className="item-time">{item.time}</div>
                          <div className="item-subject">{item.subject}</div>
                          <div className="item-details">
                            <p>{item.type}</p>
                            <p>{item.groups.join(', ')}</p>
                          </div>
                          <div className="item-room">{item.room}</div>
                          <div className={`item-action ${getButtonClass(item)}`}>
                            &rarr;
                          </div>
                        </Link>
                      ) : (
                        <div key={item.id} className={`schedule-item ${getButtonClass(item)}`}>
                          <div className="item-number">{item.number}</div>
                          <div className="item-time">{item.time}</div>
                          <div className="item-subject">{item.subject}</div>
                          <div className="item-details">
                            <p>{item.type}</p>
                            <p>{item.groups.join(', ')}</p>
                          </div>
                          <div className="item-room">{item.room}</div>
                          <div className={`item-action ${getButtonClass(item)}`}>
                            &rarr;
                          </div>
                        </div>
                      )
                    ) : (
                      <div key={item.id} className={`schedule-item ${getButtonClass(item)}`}>
                        <div className="item-number">{item.number}</div>
                        <div className="item-time">{item.time}</div>
                        <div className="item-subject">{item.subject}</div>
                        <div className="item-details">
                          <p>{item.type}</p>
                          <p>{item.groups.join(', ')}</p>
                        </div>
                        <div className="item-room">{item.room}</div>
                        <button
                          className={`item-action disabled`}
                          disabled
                          title="Занятие ещё не проводилось"
                        >
                          &rarr;
                        </button>
                      </div>
                    )
                  ) : (
                    <div key={item.id} className="schedule-item event-item">
                      <div className="item-number"></div>
                      <div className="item-time">{item.time}</div>
                      <div className="item-subject">{item.subject}</div>
                      <div className="item-details">
                        <p>{item.type}</p>
                        <p>{item.groups.join(', ')}</p>
                      </div>
                      <div className="item-room">{item.room}</div>
                    </div>
                  )
                ));
              })()}
            </div>
          ) : (
            <div className="no-schedule">Нет данных о расписании на этот день</div>
          )}
        </>
      )}
      {period === 'Неделя' && (() => {
        const weekSchedule = useApiSchedule
          ? lecturerTimetableToMatrixSchedule(lecturerTimetable, currentDate, 6)
          : getScheduleForWeek(currentDate);
        const timeIntervals = {
          '08:00': '08:00-09:35',
          '09:45': '09:45-11:20',
          '11:30': '11:30-13:05',
          '13:30': '13:30-15:05',
          '15:15': '15:15-16:50',
          '17:00': '17:00-18:35',
          '18:45': '18:45-20:20',
          'no-time': 'Без времени',
        };

        return (
          <div className="week-schedule-container">
            {timetableLoading && useApiSchedule && (
              <div className="no-schedule">Загрузка расписания…</div>
            )}
            {timetableError && useApiSchedule && (
              <div className="no-schedule">{timetableError}</div>
            )}
            <table className="week-schedule-table">
              <thead>
                <tr>
                  <th className="time-header">Время</th>
                  {weekSchedule.weekDays.map((day, idx) => (
                    <th key={idx} className="day-header">
                      <div className="day-name">{day.dayName}</div>
                      <div className="day-date">{day.date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekSchedule.timeSlots.map((timeSlot, idx) => (
                  <tr key={idx}>
                    <td className="time-cell">{timeIntervals[timeSlot]}</td>
                    {weekSchedule.weekDays.map((day, dayIdx) => {
                      const cellKey = `${day.date}-${timeSlot}`;
                      const isExpanded = expandedCell === cellKey;
                      const lessonsList = weekSchedule.lessons[cellKey] || [];
                      const hasMultipleLessons = lessonsList.length > 1;
                      
                      // Применяем ротацию к списку занятий
                      const rotation = lessonRotations[cellKey] || 0;
                      const rotatedLessonsList = [...lessonsList.slice(rotation), ...lessonsList.slice(0, rotation)];
                      
                      return (
                        <td 
                          key={dayIdx} 
                          className={`lesson-cell ${hasMultipleLessons && isExpanded ? 'active' : ''}`}
                          onClick={(e) => {
                            if (hasMultipleLessons) {
                              handleCellClick(e, cellKey);
                            } else if (expandedCell) {
                              setExpandedCell(null);
                            }
                          }}
                        >
                          {rotatedLessonsList.map((lesson, lessonIdx) => (
                            <div
                              key={lessonIdx}
                              className={`lesson-block ${lesson.isConfirmed ? 'confirmed' : 'unconfirmed'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasMultipleLessons) {
                                  if (isExpanded) {
                                    // Если ячейка уже раскрыта - открыть попап
                                    handleLessonClick(e, lesson);
                                  } else {
                                    // Если ячейка не раскрыта - раскрыть её
                                    setExpandedCell(cellKey);
                                  }
                                } else {
                                  // Если только одно занятие - просто открыть попап
                                  handleLessonClick(e, lesson);
                                }
                              }}
                            >
                              <div className="lesson-block-title">{lesson.subject}</div>
                              <div className="lesson-block-info">Гр. {lesson.groups.join(', ')}</div>
                            </div>
                          ))}
                          {hasMultipleLessons && isExpanded && (
                            <button
                              className="rotate-lessons-btn"
                              onClick={(e) => handleRotateLessons(e, cellKey, lessonsList.length)}
                              title="Изменить порядок занятий"
                            >
                              ↻
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedLessonDetail && (
              <div 
                ref={lessonDetailPopupRef}
                className="lesson-detail-popup"
                style={{
                  top: `${lessonDetailPosition.y}px`,
                  left: `${lessonDetailPosition.x}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="close-popup"
                  onClick={() => setSelectedLessonDetail(null)}
                >
                  ×
                </button>
                <div className="popup-header">
                  <h3>{selectedLessonDetail.subject}</h3>
                </div>
                <div className="popup-content">
                  <p><strong>Дата и время:</strong> {selectedLessonDetail.date} {selectedLessonDetail.time}</p>
                  <p><strong>Тип:</strong> {selectedLessonDetail.type}</p>
                  <p><strong>Группы:</strong> {selectedLessonDetail.groups.join(', ')}</p>
                  <p><strong>Аудитория:</strong> {selectedLessonDetail.room}</p>
                </div>
                <div className="popup-actions">
                  {canUseAttendance && (
                    <Link
                      to="/app/attendance"
                      state={{ lessonId: selectedLessonDetail.id, date: selectedLessonDetail.date }}
                      className={`popup-btn ${selectedLessonDetail.isConfirmed ? 'confirmed' : 'unconfirmed'}`}
                    >
                      К посещаемости →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {period === '2 Недели' && (() => {
        const twoWeeksSchedule = useApiSchedule
          ? lecturerTimetableToMatrixSchedule(lecturerTimetable, currentDate, 12)
          : getScheduleForTwoWeeks(currentDate);
        const timeIntervals = {
          '08:00': '08:00-09:35',
          '09:45': '09:45-11:20',
          '11:30': '11:30-13:05',
          '13:30': '13:30-15:05',
          '15:15': '15:15-16:50',
          '17:00': '17:00-18:35',
          '18:45': '18:45-20:20',
          'no-time': 'Без времени',
        };

        return (
          <div className="two-weeks-view">
            <table className="week-schedule-table">
              <thead>
                <tr>
                  <th className="time-header">Время</th>
                  {twoWeeksSchedule.weekDays.map((day, idx) => {
                    const currentWeek = getCurrentWeekIndex();
                    const isCurrentWeek = (currentWeek === 1 && idx < 6) || (currentWeek === 2 && idx >= 6);
                    return (
                      <th 
                        key={idx} 
                        className={`day-header ${isCurrentWeek ? 'current-week' : ''}`}
                      >
                        <div className="day-name">{day.dayName}</div>
                        <div className="day-date">{day.date}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {twoWeeksSchedule.timeSlots.map((timeSlot, idx) => (
                  <tr key={idx}>
                    <td className="time-cell">{timeIntervals[timeSlot]}</td>
                    {twoWeeksSchedule.weekDays.map((day, dayIdx) => {
                      const cellKey = `${day.date}-${timeSlot}`;
                      const isExpanded = expandedCell === cellKey;
                      const lessonsList = twoWeeksSchedule.lessons[cellKey] || [];
                      const hasMultipleLessons = lessonsList.length > 1;
                      
                      // Применяем ротацию к списку занятий
                      const rotation = lessonRotations[cellKey] || 0;
                      const rotatedLessonsList = [...lessonsList.slice(rotation), ...lessonsList.slice(0, rotation)];
                      
                      return (
                        <td 
                          key={dayIdx} 
                          className={`lesson-cell ${hasMultipleLessons && isExpanded ? 'active' : ''}`}
                          onClick={(e) => {
                            if (hasMultipleLessons) {
                              handleCellClick(e, cellKey);
                            } else if (expandedCell) {
                              setExpandedCell(null);
                            }
                          }}
                        >
                          {rotatedLessonsList.map((lesson, lessonIdx) => (
                            <div
                              key={lessonIdx}
                              className={`lesson-block ${lesson.isConfirmed ? 'confirmed' : 'unconfirmed'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasMultipleLessons) {
                                  if (isExpanded) {
                                    // Если ячейка уже раскрыта - открыть попап
                                    handleLessonClick(e, lesson);
                                  } else {
                                    // Если ячейка не раскрыта - раскрыть её
                                    setExpandedCell(cellKey);
                                  }
                                } else {
                                  // Если только одно занятие - просто открыть попап
                                  handleLessonClick(e, lesson);
                                }
                              }}
                            >
                              <div className="lesson-block-title">{lesson.subject}</div>
                              <div className="lesson-block-info">Гр. {lesson.groups.join(', ')}</div>
                            </div>
                          ))}
                          {hasMultipleLessons && isExpanded && (
                            <button
                              className="rotate-lessons-btn"
                              onClick={(e) => handleRotateLessons(e, cellKey, lessonsList.length)}
                              title="Изменить порядок занятий"
                            >
                              ↻
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedLessonDetail && (
              <div 
                ref={lessonDetailPopupRef}
                className="lesson-detail-popup"
                style={{
                  top: `${lessonDetailPosition.y}px`,
                  left: `${lessonDetailPosition.x}px`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="close-popup"
                  onClick={() => setSelectedLessonDetail(null)}
                >
                  ×
                </button>
                <div className="popup-header">
                  <h3>{selectedLessonDetail.subject}</h3>
                </div>
                <div className="popup-content">
                  <p><strong>Дата и время:</strong> {selectedLessonDetail.date} {selectedLessonDetail.time}</p>
                  <p><strong>Тип:</strong> {selectedLessonDetail.type}</p>
                  <p><strong>Группы:</strong> {selectedLessonDetail.groups.join(', ')}</p>
                  <p><strong>Аудитория:</strong> {selectedLessonDetail.room}</p>
                </div>
                <div className="popup-actions">
                  {canUseAttendance && (
                    <Link
                      to="/app/attendance"
                      state={{ lessonId: selectedLessonDetail.id, date: selectedLessonDetail.date }}
                      className={`popup-btn ${selectedLessonDetail.isConfirmed ? 'confirmed' : 'unconfirmed'}`}
                    >
                      К посещаемости →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <AddEventModal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        onSave={handleSaveEvent}
        defaultDate={currentDate}
      />
    </div>
  );
};

export default SchedulePage;
