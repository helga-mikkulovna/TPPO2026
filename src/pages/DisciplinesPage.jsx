import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './DisciplinesPage.css';
import CalendarPicker from '../components/CalendarPicker';
import { BreadcrumbContext } from '../context/breadcrumbContext';
import {
  attendance,
  getGroupById,
  getStudentsByGroupId,
  getSubjectById,
  lessons,
  study_intervals,
  subjects,
} from '../data/database';
import { addDaysRuDate, getMondayRuDate, isoDateToRu, ruDateToIso } from '../subsystems/schedule/utils/date';

function toRuDate(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

function formatRuDateShort(ru) {
  const [dd, mm, yyyy] = String(ru).split('.');
  if (!dd || !mm || !yyyy) return ru;
  return `${dd}.${mm}.${yyyy.slice(-2)}`;
}

function ruDateToDate(ru) {
  const iso = ruDateToIso(ru);
  return new Date(`${iso}T00:00:00`);
}

function isRuDateInRange(ru, startRu, endRu) {
  const d = ruDateToDate(ru).getTime();
  const start = ruDateToDate(startRu).getTime();
  const end = ruDateToDate(endRu).getTime();
  return d >= start && d <= end;
}

function sortRuDatesAsc(a, b) {
  return ruDateToDate(a).getTime() - ruDateToDate(b).getTime();
}

function getMonthRangeRu(baseRu) {
  const base = ruDateToDate(baseRu);
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  return { startRu: toRuDate(start), endRu: toRuDate(end) };
}

function getActiveSemesterRangeRu() {
  const active = study_intervals.find((i) => i.is_active) || study_intervals[0];
  if (!active) return null;
  return { startRu: isoDateToRu(active.start_date), endRu: isoDateToRu(active.end_date) };
}

function getRangeLabel(period, startRu, endRu) {
  if (period === 'Неделя') {
    // 02.03-07.03.2026
    return `${startRu.slice(0, 5)}-${endRu}`;
  }
  if (period === 'Месяц') return `${startRu}-${endRu}`;
  return `${startRu}-${endRu}`;
}

function aggregateStatuses(statuses) {
  const has = (s) => statuses.includes(s);
  if (has('excused')) return 'excused';
  if (has('present')) return 'present';
  if (has('absent')) return 'absent';
  return null;
}

function normalizeQuery(s) {
  return String(s || '').trim().toLowerCase();
}

export default function DisciplinesPage() {
  // В мок-данных преподаватель имеет id=101
  const teacherId = 101;

  const { subjectId } = useParams();
  const navigate = useNavigate();
  const selectedSubjectId = subjectId ? Number(subjectId) : null;
  const selectedSubject = selectedSubjectId ? getSubjectById(selectedSubjectId) : null;

  const { addBreadcrumb } = useContext(BreadcrumbContext);

  const [period, setPeriod] = useState('Неделя');
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('02.03.2026');
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isSubjectSelectorOpen, setIsSubjectSelectorOpen] = useState(false);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);

  const periodSelectorRef = useRef(null);
  const dateButtonRef = useRef(null);
  const subjectSelectorRef = useRef(null);
  const monthSelectorRef = useRef(null);

  const teacherSubjects = useMemo(() => {
    const taught = new Set(lessons.filter((l) => l.teacher_id === teacherId).map((l) => l.subject_id));
    return subjects
      .filter((s) => taught.has(s.id))
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [teacherId]);

  const monthOptions = useMemo(() => {
    const months = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];
    const d = ruDateToDate(currentDate);
    const year = d.getFullYear();
    return months.map((label, monthIndex) => ({
      label,
      monthIndex,
      year,
    }));
  }, [currentDate]);

  const currentMonthLabel = useMemo(() => {
    const d = ruDateToDate(currentDate);
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    const label = monthOptions[monthIndex]?.label || '';
    return label ? `${label} ${year}` : String(year);
  }, [currentDate, monthOptions]);

  const range = useMemo(() => {
    if (period === 'Неделя') {
      const monday = getMondayRuDate(currentDate);
      const end = addDaysRuDate(monday, 5);
      return { startRu: monday, endRu: end };
    }

    if (period === 'Месяц') {
      return getMonthRangeRu(currentDate);
    }

    const semester = getActiveSemesterRangeRu();
    if (semester) return semester;

    // fallback: treat as week
    const monday = getMondayRuDate(currentDate);
    const end = addDaysRuDate(monday, 5);
    return { startRu: monday, endRu: end };
  }, [currentDate, period]);

  const rangeLabel = useMemo(() => getRangeLabel(period, range.startRu, range.endRu), [period, range.endRu, range.startRu]);

  const disciplineData = useMemo(() => {
    if (!selectedSubjectId || !selectedSubject) return null;

    const relevantLessons = lessons.filter(
      (l) =>
        l.teacher_id === teacherId &&
        l.subject_id === selectedSubjectId &&
        isRuDateInRange(l.date, range.startRu, range.endRu),
    );

    const groupIds = Array.from(new Set(relevantLessons.map((l) => l.group_id)))
      .filter(Boolean)
      .sort((a, b) => {
        const ga = getGroupById(a);
        const gb = getGroupById(b);
        return String(ga?.name || '').localeCompare(String(gb?.name || ''), 'ru', { numeric: true });
      });

    const attendanceIndex = new Map();
    attendance.forEach((rec) => {
      attendanceIndex.set(`${rec.lesson_id}:${rec.student_id}`, rec.status || null);
    });

    const groupsTables = groupIds.map((groupId) => {
      const group = getGroupById(groupId);
      const groupLessons = relevantLessons.filter((l) => l.group_id === groupId);

      const dateToLessonIds = new Map();
      groupLessons.forEach((l) => {
        const key = l.date;
        const prev = dateToLessonIds.get(key) || [];
        prev.push(l.id);
        dateToLessonIds.set(key, prev);
      });

      const dates = Array.from(dateToLessonIds.keys()).sort(sortRuDatesAsc);

      const students = getStudentsByGroupId(groupId).map((s) => ({
        id: s.id,
        name: s.name,
        fullName: s.fullName,
      }));

      const rows = students.map((student) => {
        const byDate = {};
        dates.forEach((date) => {
          const lessonIds = dateToLessonIds.get(date) || [];
          const statuses = lessonIds.map((lessonId) => attendanceIndex.get(`${lessonId}:${student.id}`)).filter(Boolean);
          byDate[date] = aggregateStatuses(statuses);
        });

        return { student, byDate };
      });

      return {
        group,
        dates,
        rows,
      };
    });

    return {
      subject: selectedSubject,
      groupsTables,
    };
  }, [range.endRu, range.startRu, selectedSubject, selectedSubjectId, teacherId]);

  const filteredGroupsTables = useMemo(() => {
    const q = normalizeQuery(searchQuery);
    const tables = disciplineData?.groupsTables;
    if (!tables) return [];
    if (!q) return tables;

    return tables
      .map((gt) => {
        const groupName = normalizeQuery(gt.group?.name);
        const groupMatches = groupName.includes(q);

        if (groupMatches) {
          return { ...gt, _displayRows: gt.rows };
        }

        const matchedRows = gt.rows.filter((row) => {
          const fullName = normalizeQuery(row.student?.fullName);
          const shortName = normalizeQuery(row.student?.name);
          return fullName.includes(q) || shortName.includes(q);
        });

        if (matchedRows.length === 0) return null;
        return { ...gt, _displayRows: matchedRows };
      })
      .filter(Boolean);
  }, [disciplineData?.groupsTables, searchQuery]);

  useEffect(() => {
    addBreadcrumb('Дисциплины', '/app/disciplines');
    if (selectedSubject) {
      addBreadcrumb(selectedSubject.name, `/app/disciplines/${selectedSubject.id}`);
    }
  }, [addBreadcrumb, selectedSubject]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodSelectorRef.current && !periodSelectorRef.current.contains(event.target)) {
        setIsPeriodSelectorOpen(false);
      }

      if (dateButtonRef.current && !dateButtonRef.current.contains(event.target) && !event.target.closest('.calendar-picker')) {
        setShowCalendar(false);
      }

      if (subjectSelectorRef.current && !subjectSelectorRef.current.contains(event.target)) {
        setIsSubjectSelectorOpen(false);
      }

      if (monthSelectorRef.current && !monthSelectorRef.current.contains(event.target)) {
        setIsMonthSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setIsPeriodSelectorOpen(false);
    setShowCalendar(false);
    setIsMonthSelectorOpen(false);
    // Для недели всегда держим currentDate на понедельнике
    if (newPeriod === 'Неделя') {
      setCurrentDate(getMondayRuDate(currentDate));
    }
  };

  const handleSubjectSelect = (id) => {
    setIsSubjectSelectorOpen(false);
    navigate(`/app/disciplines/${id}`);
  };

  const handleMonthSelect = (monthIndex) => {
    const base = ruDateToDate(currentDate);
    const year = base.getFullYear();
    const first = new Date(year, monthIndex, 1);
    setCurrentDate(toRuDate(first));
    setIsMonthSelectorOpen(false);
    setShowCalendar(false);
  };

  const handlePrev = () => {
    if (period === 'Неделя') {
      const monday = getMondayRuDate(currentDate);
      setCurrentDate(addDaysRuDate(monday, -7));
      return;
    }

    if (period === 'Месяц') {
      const base = ruDateToDate(currentDate);
      const prev = new Date(base.getFullYear(), base.getMonth() - 1, 1);
      setCurrentDate(toRuDate(prev));
      return;
    }
  };

  const handleNext = () => {
    if (period === 'Неделя') {
      const monday = getMondayRuDate(currentDate);
      setCurrentDate(addDaysRuDate(monday, 7));
      return;
    }

    if (period === 'Месяц') {
      const base = ruDateToDate(currentDate);
      const next = new Date(base.getFullYear(), base.getMonth() + 1, 1);
      setCurrentDate(toRuDate(next));
      return;
    }
  };

  const handleCalendarChange = (ru) => {
    setCurrentDate(ru);
    setShowCalendar(false);
  };

  if (!selectedSubjectId) {
    return (
      <div className="disciplines-page">
        <div className="dp-title-row">
          <h2>Дисциплины</h2>
        </div>

        <div className="dp-subjects">
          {teacherSubjects.map((s) => (
            <Link key={s.id} to={`/app/disciplines/${s.id}`} className="dp-subject-item">
              {s.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="disciplines-page">
        <div className="dp-title-row">
          <h2>Дисциплины</h2>
        </div>

        <div className="dp-empty">
          <div>Дисциплина не найдена.</div>
          <button type="button" className="dp-back" onClick={() => navigate('/app/disciplines')}>К списку дисциплин</button>
        </div>
      </div>
    );
  }

  return (
    <div className="disciplines-page">
      <div className="dp-title-row">
        <h2>Посещаемость по дисциплине</h2>
      </div>

      <div className="dp-header">
        <div className="dp-subject" ref={subjectSelectorRef}>
          <button
            type="button"
            className="dp-subject-btn"
            onClick={() => setIsSubjectSelectorOpen((v) => !v)}
          >
            <span className="dp-subject-name">{selectedSubject.name}</span>
            <span className="dp-caret">▾</span>
          </button>

          {isSubjectSelectorOpen && (
            <div className="dp-subject-options">
              {teacherSubjects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`dp-subject-option ${s.id === selectedSubject.id ? 'active' : ''}`}
                  onClick={() => handleSubjectSelect(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dp-controls">
          <div className="dp-period" ref={periodSelectorRef}>
            <button type="button" className="dp-btn" onClick={() => setIsPeriodSelectorOpen((v) => !v)}>
              {period}
            </button>
            {isPeriodSelectorOpen && (
              <div className="dp-period-options">
                {['Неделя', 'Месяц', 'Семестр'].map((p) => (
                  <button key={p} type="button" className="dp-period-option" onClick={() => handlePeriodChange(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dp-date-nav">
            <button type="button" className="dp-btn" onClick={handlePrev} disabled={period === 'Семестр'}>
              &lt;
            </button>

            {period === 'Месяц' ? (
              <div className="dp-month" ref={monthSelectorRef}>
                <button type="button" className="dp-btn" onClick={() => setIsMonthSelectorOpen((v) => !v)}>
                  {currentMonthLabel}
                </button>
                {isMonthSelectorOpen && (
                  <div className="dp-month-options">
                    {monthOptions.map((m) => (
                      <button
                        key={`${m.year}-${m.monthIndex}`}
                        type="button"
                        className="dp-month-option"
                        onClick={() => handleMonthSelect(m.monthIndex)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="dp-date" ref={dateButtonRef}>
                <button
                  type="button"
                  className="dp-btn"
                  onClick={() => {
                    if (period === 'Семестр') return;
                    setShowCalendar((v) => !v);
                  }}
                  disabled={period === 'Семестр'}
                >
                  {rangeLabel}
                </button>
                {showCalendar && period !== 'Семестр' && (
                  <div className="calendar-picker">
                    <CalendarPicker value={currentDate} onChange={handleCalendarChange} />
                  </div>
                )}
              </div>
            )}

            <button type="button" className="dp-btn" onClick={handleNext} disabled={period === 'Семестр'}>
              &gt;
            </button>
          </div>
        </div>
      </div>

      {!disciplineData || disciplineData.groupsTables.length === 0 ? (
        <div className="dp-empty">
          <div>
            {period === 'Месяц'
              ? 'На выбранный месяц нет данных о посещаемости.'
              : 'Нет занятий по этой дисциплине за выбранный период.'}
          </div>
        </div>
      ) : (
        <>
          <div className="dp-search">
            <input
              className="dp-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по группе или фамилии студента"
            />
          </div>

          {filteredGroupsTables.length === 0 ? (
            <div className="dp-empty">
              <div>Ничего не найдено.</div>
            </div>
          ) : (
            <div className="dp-tables">
              {filteredGroupsTables.map((gt) => {
                const displayRows = gt._displayRows || gt.rows;

                return (
                  <div key={gt.group?.id || Math.random()} className="dp-group">
                    <div className="dp-group-title">Группа {gt.group?.name}</div>

                    <div className="dp-table-wrap">
                      <table className="dp-table">
                        <thead>
                          <tr>
                            <th className="dp-th-student">Студент</th>
                            {gt.dates.map((d) => (
                              <th key={d} className="dp-th-date">{formatRuDateShort(d)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {displayRows.map((row) => (
                            <tr key={row.student.id}>
                              <td className="dp-td-student">{row.student.fullName}</td>
                              {gt.dates.map((d) => {
                                const status = row.byDate[d];
                                const cls =
                                  status === 'present'
                                    ? 'dp-cell dp-present'
                                    : status === 'absent'
                                      ? 'dp-cell dp-absent'
                                      : status === 'excused'
                                        ? 'dp-cell dp-excused'
                                        : 'dp-cell dp-empty-cell';

                                return <td key={d} className={cls} />;
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
