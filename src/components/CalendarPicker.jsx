import React, { useEffect, useMemo, useState } from 'react';
import './CalendarPicker.css';

function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * @param {Date} d
 */
function toRuDate(d) {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/**
 * @param {string} ru
 */
function fromRuDate(ru) {
  const m = /^\s*(\d{2})\.(\d{2})\.(\d{4})\s*$/.exec(String(ru || ''));
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

/**
 * Monday-start week.
 * @param {Date} d
 */
function getMonday(d) {
  const result = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = result.getDay();
  // JS: 0=Sun..6=Sat. We want Monday.
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}

/**
 * @param {Date} d
 * @param {number} days
 */
function addDays(d, days) {
  const result = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * @typedef {'day'|'week'|'twoWeeks'} CalendarMode
 */

/**
 * @param {{
 *  value: string,
 *  onChange: (ruDate: string) => void,
 *  availableDates?: string[],
 *  mode?: CalendarMode,
 * }} props
 */
export default function CalendarPicker({
  value,
  onChange,
  availableDates,
  mode = 'day',
}) {
  const selectedDate = useMemo(() => fromRuDate(value) || new Date(), [value]);

  const availableSet = useMemo(() => {
    if (!Array.isArray(availableDates) || availableDates.length === 0) return null;
    return new Set(availableDates.map((d) => String(d)));
  }, [availableDates]);

  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  const monthLabel = useMemo(() => {
    try {
      const dtf = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
      const s = dtf.format(new Date(viewYear, viewMonth, 1));
      return s.charAt(0).toUpperCase() + s.slice(1);
    } catch {
      return '';
    }
  }, [viewMonth, viewYear]);

  const handlePrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handleNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const weeks = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Monday-first index: 0..6
    const jsDay = firstOfMonth.getDay();
    const firstDayIndex = jsDay === 0 ? 6 : jsDay - 1;

    const cells = [];
    for (let i = 0; i < firstDayIndex; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(viewYear, viewMonth, day));
    }

    // chunk into weeks
    const out = [];
    for (let i = 0; i < cells.length; i += 7) {
      out.push(cells.slice(i, i + 7));
    }

    // pad last week
    const last = out[out.length - 1];
    if (last && last.length < 7) {
      while (last.length < 7) last.push(null);
    }

    return out;
  }, [viewMonth, viewYear]);

  const selectedRu = useMemo(() => toRuDate(selectedDate), [selectedDate]);

  const isEnabled = (ru) => {
    if (!availableSet) return true;
    return availableSet.has(ru);
  };

  const applySelection = (clickedDate) => {
    if (!clickedDate) return;

    if (mode === 'day') {
      onChange(toRuDate(clickedDate));
      return;
    }

    if (mode === 'week') {
      const monday = getMonday(clickedDate);
      onChange(toRuDate(monday));
      return;
    }

    // twoWeeks
    const monday = getMonday(clickedDate);
    onChange(toRuDate(monday));
  };

  return (
    <div className="cp-root">
      <div className="cp-header">
        <button type="button" className="cp-nav" onClick={handlePrevMonth} aria-label="Предыдущий месяц">
          ‹
        </button>
        <div className="cp-title">
          {monthLabel} {viewYear}
        </div>
        <button type="button" className="cp-nav" onClick={handleNextMonth} aria-label="Следующий месяц">
          ›
        </button>
      </div>

      <div className="cp-weekdays">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
          <div key={d} className="cp-weekday">
            {d}
          </div>
        ))}
      </div>

      <div className="cp-grid">
        {weeks.map((week, wi) => (
          <React.Fragment key={wi}>
            {week.map((cellDate, di) => {
              if (!cellDate) {
                return <div key={`${wi}-${di}`} className="cp-cell cp-cell--empty" />;
              }

              const ru = toRuDate(cellDate);
              const enabled = isEnabled(ru);
              const isSelected = ru === selectedRu;

              return (
                <button
                  key={`${wi}-${di}`}
                  type="button"
                  className={`cp-cell ${isSelected ? 'cp-cell--selected' : ''}`}
                  onClick={() => applySelection(cellDate)}
                  disabled={!enabled}
                  title={ru}
                >
                  {cellDate.getDate()}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
