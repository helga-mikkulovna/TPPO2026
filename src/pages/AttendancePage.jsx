import React, { useState, useRef, useContext, useEffect } from 'react';
import './AttendancePage.css';
import { BreadcrumbContext } from '../context/breadcrumbContext';
import { useLocation } from 'react-router-dom';
import CalendarPicker from '../components/CalendarPicker';
import { 
  getAvailableDates, 
  getLessonsByDate, 
  getStudentsWithAttendance,
  getStudentsWithAttendanceForMultipleLessons,
  getLessonById,
  getSubjectById,
  getGroupNameById,
  updateAttendanceStatus,
  confirmAttendanceForLesson,
  isLessonConfirmed,
  unconfirmAttendanceForLesson
} from '../data/database';

const AttendancePage = () => {
  const location = useLocation();
  const [period, setPeriod] = useState('День');
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('02.03.2026');
  const [showCalendar, setShowCalendar] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanFile, setScanFile] = useState(null);
  const [scanDraftFile, setScanDraftFile] = useState(null);
  const [showLessonSelector, setShowLessonSelector] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [students, setStudents] = useState([]);
  const [editMenu, setEditMenu] = useState({
    visible: false,
    studentIndex: null,
    x: 0,
    y: 0,
  });
  const fileInputRef = useRef(null);
  const scanInputRef = useRef(null);
  const periodSelectorRef = useRef(null);
  const dateButtonRef = useRef(null);
  const lessonSelectorRef = useRef(null);
  const editMenuRef = useRef(null);
  const { addBreadcrumb } = useContext(BreadcrumbContext);

  // Get all times for the selected lesson date
  // Объединяет занятия с одинаковым временем и дисциплиной
  const getAvailableLessonsForDate = (date) => {
    const dayLessons = getLessonsByDate(date);
    const processedKeys = new Set();
    const result = [];
    
    dayLessons.forEach((lesson) => {
      const key = `${lesson.start_time}-${lesson.subject_id}`;
      
      // Если это занятие уже обработано как часть группы, пропускаем
      if (processedKeys.has(key)) {
        return;
      }
      
      // Находим все занятия с тем же временем и дисциплиной
      const similarLessons = dayLessons.filter(l => 
        l.start_time === lesson.start_time && l.subject_id === lesson.subject_id
      );
      
      // Отмечаем все эти занятия как обработанные
      processedKeys.add(key);
      
      // Собираем информацию об объединённом занятии
      const subject = getSubjectById(lesson.subject_id);
      const groups = similarLessons.map(l => getGroupNameById(l.group_id)).sort();
      const formattedTime = `${lesson.start_time} - ${lesson.end_time}`;
      
      result.push({
        id: lesson.id,
        time: formattedTime,
        subject: subject.name,
        type: lesson.type,
        groups: groups,
        lessonIds: similarLessons.map(l => l.id),
      });
    });
    
    return result;
  };

  const availableLessons = getAvailableLessonsForDate(currentDate);

  // Установить дату при переходе со страницы расписания
  useEffect(() => {
    const { date } = location.state || {};
    if (date && date !== currentDate) {
      setCurrentDate(date);
    }
  }, [location.state?.date]);

  useEffect(() => {
    addBreadcrumb('Посещаемость', '/app/attendance');
  }, [addBreadcrumb]);

  // Загрузить студентов когда меняется выбранное занятие
  useEffect(() => {
    if (selectedLesson) {
      let lessonStudents;
      
      // Если есть несколько lessonIds (объединённое занятие), загружаем из всех
      if (selectedLesson.lessonIds && selectedLesson.lessonIds.length > 1) {
        lessonStudents = getStudentsWithAttendanceForMultipleLessons(selectedLesson.lessonIds);
      } else {
        // Иначе загружаем из одного занятия
        lessonStudents = getStudentsWithAttendance(selectedLesson.id);
      }
      
      setStudents(lessonStudents);
      
      // Проверить, подтверждена ли посещаемость из БД
      const isConfirmedInDB = isLessonConfirmed(selectedLesson.id);
      setConfirmed(isConfirmedInDB);
    }
  }, [selectedLesson]);

  // Store lessonId and date from location.state to avoid using object as dependency
  const navigationLessonId = location.state?.lessonId;
  const navigationDate = location.state?.date;

  // Автоматически выбрать первое занятие из списка при смене даты
  useEffect(() => {
    // Используем конкретное занятие только если дата из location.state совпадает с текущей
    if (navigationLessonId && navigationDate === currentDate) {
      const lessonToSelect = availableLessons.find(l => l.lessonIds.includes(navigationLessonId));
      if (lessonToSelect) {
        setSelectedLesson(lessonToSelect);
        return;
      }
    }
    
    // В остальных случаях выбираем первое занятие на текущую дату
    if (availableLessons.length > 0) {
      setSelectedLesson(availableLessons[0]);
    } else if (availableLessons.length === 0) {
      setSelectedLesson(null);
      setStudents([]);
    }
  }, [currentDate, navigationLessonId, navigationDate]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setIsPeriodSelectorOpen(false);
  };

  const handlePrevDay = () => {
    const dateObj = new Date(currentDate.split('.').reverse().join('-'));
    dateObj.setDate(dateObj.getDate() - 1);
    const newDate = dateObj.toLocaleDateString('ru-RU');
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const dateObj = new Date(currentDate.split('.').reverse().join('-'));
    dateObj.setDate(dateObj.getDate() + 1);
    const newDate = dateObj.toLocaleDateString('ru-RU');
    setCurrentDate(newDate);
  };

  const handleCalendarChange = (date) => {
    setCurrentDate(date);
    setShowCalendar(false);
  };

  const handleClickOutside = (event) => {
    if (periodSelectorRef.current && !periodSelectorRef.current.contains(event.target)) {
      setIsPeriodSelectorOpen(false);
    }
    if (dateButtonRef.current && !dateButtonRef.current.contains(event.target) && !event.target.closest('.calendar-picker')) {
      setShowCalendar(false);
    }
    if (lessonSelectorRef.current && !lessonSelectorRef.current.contains(event.target)) {
      setShowLessonSelector(false);
    }
    if (editMenuRef.current && !editMenuRef.current.contains(event.target)) {
      setEditMenu({ ...editMenu, visible: false });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateTotal = (student) => {
    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;

    if (student.bluetooth) {
      presentCount++;
    }
    if (student.paper) {
      presentCount++;
    }

    if (student.manual === 'present') {
      presentCount++;
    } else if (student.manual === 'absent') {
      absentCount++;
    } else if (student.manual === 'excused') {
      excusedCount++;
    }

    const totalMarks = presentCount + absentCount + excusedCount;

    if (totalMarks === 0) {
      return 'absent';
    }

    if (excusedCount > 0) {
      return 'excused';
    }

    if (presentCount > absentCount) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  const getTotalStatusClass = (status) => {
    switch (status) {
      case 'present':
        return 'present';
      case 'absent':
        return 'absent';
      case 'excused':
        return 'excused';
      default:
        return '';
    }
  };

  const calculateStatistics = () => {
    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;

    students.forEach((student) => {
      const totalStatus = calculateTotal(student);
      if (totalStatus === 'present') {
        presentCount++;
      } else if (totalStatus === 'absent') {
        absentCount++;
      } else if (totalStatus === 'excused') {
        excusedCount++;
      }
    });

    return { presentCount, absentCount, excusedCount };
  };

  const handleConfirm = () => {
    if (selectedLesson) {
      confirmAttendanceForLesson(selectedLesson.id);
      setConfirmed(true);
      setShowConfirmationModal(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    // Lesson уже содержит информацию об объединённом занятии или одиночном
    if (lesson && lesson.id) {
      setSelectedLesson(lesson);
    }
  };

  const handleDisciplineSelectorClick = (e) => {
    // Не открывать список если кликнули на выпадающий список или если доступно только одно занятие
    if (e.target.closest('.lesson-dropdown') || availableLessons.length <= 1) {
      return;
    }
    setShowLessonSelector(!showLessonSelector);
  };

  const handleEditClick = (e, index) => {
    const rect = e.target.getBoundingClientRect();
    setEditMenu({
      visible: true,
      studentIndex: index,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY + rect.height,
    });
  };

  const closeEditMenu = () => {
    setEditMenu({ ...editMenu, visible: false });
  };

  const handleStatusChange = (status) => {
    const newStudents = [...students];
    const attendanceId = newStudents[editMenu.studentIndex].attendanceId;
    
    // Обновить статус в БД
    if (attendanceId) {
      updateAttendanceStatus(attendanceId, status === 'null' ? null : status);
    }
    
    newStudents[editMenu.studentIndex].manual = status === 'null' ? null : status;
    setStudents(newStudents);
    
    // Отменить подтверждение если занятие было подтверждено
    if (confirmed) {
      unconfirmAttendanceForLesson(selectedLesson.id);
      setConfirmed(false);
    }
    
    if (status !== 'excused') {
        newStudents[editMenu.studentIndex].document = null;
    }
  };

  const handleDeleteMark = () => {
    const newStudents = [...students];
    newStudents[editMenu.studentIndex].manual = null;
    newStudents[editMenu.studentIndex].document = null;
    setStudents(newStudents);
    
    // Отменить подтверждение если занятие было подтверждено
    if (confirmed) {
      unconfirmAttendanceForLesson(selectedLesson.id);
      setConfirmed(false);
    }
    
    closeEditMenu();
  };

  const handleAddDocument = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const newStudents = [...students];
        newStudents[editMenu.studentIndex].document = file;
        setStudents(newStudents);
        
        // Отменить подтверждение если занятие было подтверждено
        if (confirmed) {
          unconfirmAttendanceForLesson(selectedLesson.id);
          setConfirmed(false);
        }
        
        closeEditMenu();
    }
  };

  const openScanModal = () => {
    setScanDraftFile(scanFile);
    setShowScanModal(true);
  };

  const closeScanModal = () => {
    setShowScanModal(false);
    setScanDraftFile(null);
  };

  const handleChooseScan = () => {
    scanInputRef.current?.click();
  };

  const handleScanChange = (e) => {
    const file = e.target.files?.[0] || null;
    setScanDraftFile(file);
    // Allow re-selecting the same file.
    e.target.value = '';
  };

  const handleAttachScan = () => {
    if (!scanDraftFile) return;
    setScanFile(scanDraftFile);
    setShowScanModal(false);
  };

  const getManualStatusClass = (status) => {
    switch (status) {
      case 'present':
        return 'present-manual';
      case 'absent':
        return 'absent-manual';
      case 'excused':
        return 'excused-manual';
      default:
        return '';
    }
  };

  return (
    <div className="attendance-page">
      <div className="schedule-header">
        <h2>Посещаемость
          <div className="period-selector" ref={periodSelectorRef}>
            <button onClick={() => setIsPeriodSelectorOpen(!isPeriodSelectorOpen)}>
              {period} &raquo;
            </button>
            {isPeriodSelectorOpen && (
              <div className="period-options">
                <div onClick={() => handlePeriodChange('День')}>День</div>
                <div onClick={() => handlePeriodChange('Неделя')}>Неделя</div>
                <div onClick={() => handlePeriodChange('Месяц')}>Месяц</div>
              </div>
            )}
          </div>
        </h2>
        <div className="date-navigation">
          <button onClick={handlePrevDay}>&laquo;</button>
          <div className="date-selector" ref={dateButtonRef}>
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="date-button"
            >
              {currentDate}
            </button>
            {showCalendar && (
              <div className="calendar-picker">
                <CalendarPicker
                  value={currentDate}
                  onChange={handleCalendarChange}
                  availableDates={getAvailableDates()}
                  mode="day"
                />
              </div>
            )}
          </div>
          <button onClick={handleNextDay}>&raquo;</button>
        </div>
      </div>

      {period === 'День' ? (
        <>
      <div className="attendance-top-row">
        <div className="attendance-header">
          <div className="discipline-selector" ref={lessonSelectorRef} onClick={handleDisciplineSelectorClick}>
            {selectedLesson ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <strong>{getSubjectById(selectedLesson.lessonIds ? getLessonById(selectedLesson.lessonIds[0]).subject_id : selectedLesson.id).name || getSubjectById(getLessonById(selectedLesson.id).subject_id).name}</strong>
                  {availableLessons.length > 1 && (
                    <button 
                      className="lesson-selector-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLessonSelector(!showLessonSelector);
                      }}
                      title="Выбрать занятие"
                    >
                      ▼
                    </button>
                  )}
                </div>
                {showLessonSelector && availableLessons.length > 1 && (
                  <div className="lesson-dropdown">
                    {availableLessons.map((lesson, idx) => (
                      <div 
                        key={idx}
                        className={`lesson-option ${lesson.id === selectedLesson.id ? 'active' : ''} ${isLessonConfirmed(lesson.id) ? 'confirmed' : 'unconfirmed'}`}
                        onClick={() => {
                          handleLessonSelect(lesson);
                          setShowLessonSelector(false);
                        }}
                      >
                        <div style={{ fontSize: '13px' }}>
                          <strong>{lesson.subject}</strong> ({lesson.time})
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Гр. {lesson.groups.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p>{selectedLesson.type} ({selectedLesson.time})</p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Гр. {selectedLesson.groups ? selectedLesson.groups.join(', ') : getGroupNameById(getLessonById(selectedLesson.id).group_id)}
                </p>
              </>
            ) : (
              <p>Нет занятий на эту дату</p>
            )}
          </div>
        </div>

        {selectedLesson && (
          <div className="confirmation-section">
            {confirmed ? (() => {
              const stats = calculateStatistics();
              return (
                <div className="confirmed-status">
                  <span>Подтверждено &#10003;</span>
                  <div className="summary">
                    <p>Присутствовало <span>{stats.presentCount}</span></p>
                    <p>Отсутствовало <span>{stats.absentCount}</span></p>
                    <p>По уважительной причине <span>{stats.excusedCount}</span></p>
                  </div>
                </div>
              );
            })() : (
              <div className="unconfirmed-status">
                <span>Не подтверждено</span>
                <button onClick={() => setShowConfirmationModal(true)}>Подтвердить</button>
              </div>
            )}

            <div className="scan-section">
              <div className="add-scan">
                <button onClick={openScanModal} title="Загрузить скан списка">+</button>
                <p>Добавить скан бумажного списка отметок</p>
                {scanFile && (
                  <p className="add-scan-file" title={scanFile.name}>
                    {scanFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedLesson && (
        <div className="attendance-table-row">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Студент</th>
                <th>Группа</th>
                <th><i className="fa fa-bluetooth-b"></i></th>
                <th><i className="fa fa-book"></i></th>
                <th><i className="fa fa-hand-paper"></i></th>
                <th>Итог</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.group}</td>
                  <td className={student.bluetooth ? 'present' : ''}></td>
                  <td></td>
                  <td
                    className={`manual-cell ${getManualStatusClass(student.manual)}`}
                    onClick={(e) => handleEditClick(e, index)}
                  ></td>
                  <td className={`total-cell ${getTotalStatusClass(calculateTotal(student))}`}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        </>
      ) : (
        <p style={{ padding: '20px', fontSize: '16px' }}>Просмотр посещаемости за {period === 'Неделя' ? 'неделю' : 'месяц'} находится в разработке.</p>
      )}

      {editMenu.visible && (
        <div ref={editMenuRef} className="edit-menu" style={{ top: editMenu.y, left: editMenu.x }}>
            <button className="close-edit-menu" onClick={closeEditMenu}>&times;</button>
            <div className={`edit-option ${students[editMenu.studentIndex]?.manual === 'present' ? 'active' : ''}`} onClick={() => handleStatusChange('present')}>
                <div className="color-box present-manual"></div>
                Присутствовал(а)
            </div>
            <div className={`edit-option ${students[editMenu.studentIndex]?.manual === 'absent' ? 'active' : ''}`} onClick={() => handleStatusChange('absent')}>
                <div className="color-box absent-manual"></div>
                Отсутствовал(а)
            </div>
            <div className={`edit-option ${students[editMenu.studentIndex]?.manual === 'excused' ? 'active' : ''}`} onClick={() => handleStatusChange('excused')}>
                <div className="color-box excused-manual"></div>
                По уважительной причине
            </div>
            {students[editMenu.studentIndex].manual === 'excused' && (
                <>
                    <div className="edit-option" onClick={handleAddDocument}>
                        <div className="color-box add-doc-btn">+</div>
                        Добавить документ
                    </div>
                    {students[editMenu.studentIndex].document && (
                        <div className="documents-list">
                            <div className="document-item">
                                {students[editMenu.studentIndex].document.name}
                            </div>
                        </div>
                    )}
                </>
            )}
            <div className="delete-mark" onClick={handleDeleteMark}>
                Удалить отметку
            </div>
        </div>
      )}
       <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <input
        type="file"
        ref={scanInputRef}
        style={{ display: 'none' }}
        accept="image/*,application/pdf"
        onChange={handleScanChange}
      />

      {showScanModal && (
        <div className="modal-overlay" onClick={closeScanModal}>
          <div className="modal scan-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Загрузка скана</h3>
            <p className="scan-modal-hint">
              Распознавание будет добавлено позже. Сейчас можно выбрать файл со сканом бумажного списка.
            </p>

            <div className="scan-dropzone" onClick={handleChooseScan} role="button" tabIndex={0}>
              <div className="scan-dropzone-title">Выбрать файл</div>
              <div className="scan-dropzone-subtitle">PDF, JPG, PNG</div>
              {scanDraftFile && <div className="scan-selected">Выбран: {scanDraftFile.name}</div>}
            </div>

            <div className="modal-actions">
              <button onClick={closeScanModal}>Отмена</button>
              <button onClick={handleAttachScan} className="confirm-btn" disabled={!scanDraftFile}>
                Загрузить
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmationModal && selectedLesson && (() => {
        const stats = calculateStatistics();
        const lesson = getLessonById(selectedLesson.id);
        const subject = getSubjectById(lesson.subject_id);
        return (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Подтверждение посещаемости</h3>
              <p><strong>{subject.name}</strong></p>
              <p>{currentDate} {lesson.start_time} - {lesson.end_time}</p>
              <div className="confirmation-summary">
                <p>Присутствовало <span>{stats.presentCount}</span></p>
                <p>Отсутствовало <span>{stats.absentCount}</span></p>
                <p>Отсутствовало по уважительной причине <span>{stats.excusedCount}</span></p>
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowConfirmationModal(false)}>Отмена</button>
                <button onClick={handleConfirm} className="confirm-btn">Подтвердить</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AttendancePage;
