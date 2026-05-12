// Имитация базы данных

// Таблица: users (пользователи)
export const users = [
  { id: 1, first_name: 'Иван', second_name: 'Иванов', middle_name: 'Иванович', is_active: true, created_at: '2023-09-01' },
  { id: 2, first_name: 'Петр', second_name: 'Петров', middle_name: 'Петрович', is_active: true, created_at: '2023-09-01' },
  { id: 3, first_name: 'Сергей', second_name: 'Сидоров', middle_name: 'Сергеевич', is_active: true, created_at: '2023-09-01' },
  { id: 4, first_name: 'Кирилл', second_name: 'Кузнецов', middle_name: 'Кириллович', is_active: true, created_at: '2023-09-01' },
  { id: 5, first_name: 'Сергей', second_name: 'Смирнов', middle_name: 'Сергеевич', is_active: true, created_at: '2023-09-01' },
  { id: 6, first_name: 'Максим', second_name: 'Морозов', middle_name: 'Максимович', is_active: true, created_at: '2023-09-01' },
  { id: 7, first_name: 'Валерий', second_name: 'Волков', middle_name: 'Валерьевич', is_active: true, created_at: '2023-09-01' },
  { id: 8, first_name: 'Сергей', second_name: 'Соколов', middle_name: 'Сергеевич', is_active: true, created_at: '2023-09-01' },
  { id: 9, first_name: 'Львиный', second_name: 'Лебедев', middle_name: 'Львович', is_active: true, created_at: '2023-09-01' },
  { id: 10, first_name: 'Николай', second_name: 'Новиков', middle_name: 'Николаевич', is_active: true, created_at: '2023-09-01' },
  { id: 11, first_name: 'Олег', second_name: 'Орлов', middle_name: 'Олегович', is_active: true, created_at: '2023-09-01' },
  { id: 12, first_name: 'Григорий', second_name: 'Григорьев', middle_name: 'Григорьевич', is_active: true, created_at: '2023-09-01' },
  { id: 13, first_name: 'Захар', second_name: 'Зайцев', middle_name: 'Захарович', is_active: true, created_at: '2023-09-01' },
  { id: 14, first_name: 'Харитон', second_name: 'Хромов', middle_name: 'Харитонович', is_active: true, created_at: '2023-09-01' },
  { id: 15, first_name: 'Тимур', second_name: 'Ткачев', middle_name: 'Тимурович', is_active: true, created_at: '2023-09-01' },
  { id: 101, first_name: 'Александр', second_name: 'Преподаватель', middle_name: 'Александрович', is_active: true, created_at: '2023-09-01' },
];

// Таблица: subjects (дисциплины)
export const subjects = [
  { id: 1, name: 'Технология производства программного обеспечения' },
  { id: 2, name: 'Веб-технологии' },
  { id: 3, name: 'Базы данных' },
  { id: 4, name: 'Архитектура компьютера' },
  { id: 5, name: 'Компьютерные сети' },
  { id: 6, name: 'Операционные системы' },
];

// Таблица: groups (группы)
export const groups = [
  { id: 1, name: '22305', interval_id: 1 },
  { id: 2, name: '22306', interval_id: 1 },
  { id: 3, name: '22307', interval_id: 1 },
  { id: 4, name: '22308', interval_id: 1 },
  { id: 5, name: '22309', interval_id: 1 },
  { id: 6, name: '22310', interval_id: 1 },
  { id: 7, name: '22311', interval_id: 1 },
  { id: 8, name: '22312', interval_id: 1 },
  { id: 9, name: '22313', interval_id: 1 },
  { id: 10, name: '22314', interval_id: 1 },
];

// Таблица: group_students (студенты в группах)
export const group_students = [
  { group_id: 1, user_id: 1, is_deleted: false },
  { group_id: 1, user_id: 2, is_deleted: false },
  { group_id: 1, user_id: 3, is_deleted: false },
  { group_id: 2, user_id: 4, is_deleted: false },
  { group_id: 2, user_id: 5, is_deleted: false },
  { group_id: 2, user_id: 6, is_deleted: false },
  { group_id: 3, user_id: 7, is_deleted: false },
  { group_id: 3, user_id: 8, is_deleted: false },
  { group_id: 4, user_id: 9, is_deleted: false },
  { group_id: 4, user_id: 10, is_deleted: false },
  { group_id: 5, user_id: 1, is_deleted: false },
  { group_id: 5, user_id: 2, is_deleted: false },
  { group_id: 6, user_id: 3, is_deleted: false },
  { group_id: 6, user_id: 4, is_deleted: false },
  { group_id: 7, user_id: 6, is_deleted: false },
  { group_id: 7, user_id: 7, is_deleted: false },
  { group_id: 8, user_id: 8, is_deleted: false },
  { group_id: 8, user_id: 10, is_deleted: false },
  { group_id: 9, user_id: 11, is_deleted: false },
  { group_id: 9, user_id: 12, is_deleted: false },
  { group_id: 9, user_id: 15, is_deleted: false },
  { group_id: 10, user_id: 13, is_deleted: false },
  { group_id: 10, user_id: 14, is_deleted: false },
  { group_id: 10, user_id: 2, is_deleted: false },
];

// Таблица: study_intervals (учебные интервалы)
export const study_intervals = [
  { id: 1, name: 'Весна 2026', start_date: '2026-03-02', end_date: '2026-06-30', is_active: true },
];

// Таблица: lessons (занятия)
export const lessons = [
  // 02.03.2026
  { id: 1, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '02.03.2026' },
  { id: 2, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '02.03.2026' },
  { id: 3, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '09:45', end_time: '11:20', type: 'Лекция', interval_id: 1, date: '02.03.2026' },
  { id: 4, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '09:45', end_time: '11:20', type: 'Лекция', interval_id: 1, date: '02.03.2026' },
  { id: 5, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '11:30', end_time: '13:05', type: 'Лабораторное занятие', interval_id: 1, date: '02.03.2026' },
  { id: 6, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '11:30', end_time: '13:05', type: 'Лабораторное занятие', interval_id: 1, date: '02.03.2026' },
  
  // 03.03.2026
  { id: 7, subject_id: 2, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '03.03.2026' },
  { id: 8, subject_id: 2, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '03.03.2026' },
  { id: 20, subject_id: 5, teacher_id: 101, group_id: 3, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '03.03.2026' },
  { id: 21, subject_id: 3, teacher_id: 101, group_id: 4, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '03.03.2026' },
  { id: 9, subject_id: 2, teacher_id: 101, group_id: 1, start_time: '11:30', end_time: '13:05', type: 'Практическое занятие', interval_id: 1, date: '03.03.2026' },
  
  // 04.03.2026
  { id: 10, subject_id: 3, teacher_id: 101, group_id: 3, start_time: '09:45', end_time: '11:20', type: 'Семинар', interval_id: 1, date: '04.03.2026' },
  { id: 11, subject_id: 3, teacher_id: 101, group_id: 4, start_time: '09:45', end_time: '11:20', type: 'Семинар', interval_id: 1, date: '04.03.2026' },
  { id: 12, subject_id: 4, teacher_id: 101, group_id: 5, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '04.03.2026' },
  { id: 13, subject_id: 4, teacher_id: 101, group_id: 6, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '04.03.2026' },
  
  // 06.03.2026
  { id: 14, subject_id: 5, teacher_id: 101, group_id: 7, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '06.03.2026' },
  { id: 15, subject_id: 5, teacher_id: 101, group_id: 8, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '06.03.2026' },
  
  // 07.03.2026
  { id: 16, subject_id: 6, teacher_id: 101, group_id: 9, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '07.03.2026' },
  { id: 17, subject_id: 6, teacher_id: 101, group_id: 10, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '07.03.2026' },
  { id: 18, subject_id: 6, teacher_id: 101, group_id: 9, start_time: '11:30', end_time: '13:05', type: 'Лабораторное занятие', interval_id: 1, date: '07.03.2026' },
  { id: 19, subject_id: 6, teacher_id: 101, group_id: 10, start_time: '11:30', end_time: '13:05', type: 'Лабораторное занятие', interval_id: 1, date: '07.03.2026' },

  // Доп. занятия для проверки отображения посещаемости на множестве дат
  // ТППО (subject_id: 1) — еженедельно по понедельникам (groups 1,2)
  { id: 22, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '09.03.2026' },
  { id: 23, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '09.03.2026' },
  { id: 24, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '16.03.2026' },
  { id: 25, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '16.03.2026' },
  { id: 26, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '23.03.2026' },
  { id: 27, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '23.03.2026' },
  { id: 28, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '30.03.2026' },
  { id: 29, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '30.03.2026' },
  { id: 30, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '06.04.2026' },
  { id: 31, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '06.04.2026' },
  { id: 32, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '13.04.2026' },
  { id: 33, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '13.04.2026' },
  { id: 34, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '20.04.2026' },
  { id: 35, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '20.04.2026' },
  { id: 36, subject_id: 1, teacher_id: 101, group_id: 1, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '27.04.2026' },
  { id: 37, subject_id: 1, teacher_id: 101, group_id: 2, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '27.04.2026' },

  // Архитектура компьютера (subject_id: 4) — серия занятий по средам (groups 5,6)
  { id: 38, subject_id: 4, teacher_id: 101, group_id: 5, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '11.03.2026' },
  { id: 39, subject_id: 4, teacher_id: 101, group_id: 6, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '11.03.2026' },
  { id: 40, subject_id: 4, teacher_id: 101, group_id: 5, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '18.03.2026' },
  { id: 41, subject_id: 4, teacher_id: 101, group_id: 6, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '18.03.2026' },
  { id: 42, subject_id: 4, teacher_id: 101, group_id: 5, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '25.03.2026' },
  { id: 43, subject_id: 4, teacher_id: 101, group_id: 6, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '25.03.2026' },
  { id: 44, subject_id: 4, teacher_id: 101, group_id: 5, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '01.04.2026' },
  { id: 45, subject_id: 4, teacher_id: 101, group_id: 6, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '01.04.2026' },
  { id: 46, subject_id: 4, teacher_id: 101, group_id: 5, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '08.04.2026' },
  { id: 47, subject_id: 4, teacher_id: 101, group_id: 6, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '08.04.2026' },
  { id: 48, subject_id: 4, teacher_id: 101, group_id: 5, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '15.04.2026' },
  { id: 49, subject_id: 4, teacher_id: 101, group_id: 6, start_time: '13:30', end_time: '15:05', type: 'Лабораторное занятие', interval_id: 1, date: '15.04.2026' },

  // Операционные системы (subject_id: 6) — серия занятий по субботам (groups 9,10)
  { id: 50, subject_id: 6, teacher_id: 101, group_id: 9, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '14.03.2026' },
  { id: 51, subject_id: 6, teacher_id: 101, group_id: 10, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '14.03.2026' },
  { id: 52, subject_id: 6, teacher_id: 101, group_id: 9, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '21.03.2026' },
  { id: 53, subject_id: 6, teacher_id: 101, group_id: 10, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '21.03.2026' },
  { id: 54, subject_id: 6, teacher_id: 101, group_id: 9, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '28.03.2026' },
  { id: 55, subject_id: 6, teacher_id: 101, group_id: 10, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '28.03.2026' },
  { id: 56, subject_id: 6, teacher_id: 101, group_id: 9, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '04.04.2026' },
  { id: 57, subject_id: 6, teacher_id: 101, group_id: 10, start_time: '08:00', end_time: '09:35', type: 'Лекция', interval_id: 1, date: '04.04.2026' },
  { id: 58, subject_id: 6, teacher_id: 101, group_id: 9, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '11.04.2026' },
  { id: 59, subject_id: 6, teacher_id: 101, group_id: 10, start_time: '08:00', end_time: '09:35', type: 'Лабораторное занятие', interval_id: 1, date: '11.04.2026' },
];

// Таблица: attendance (посещаемость)
export const attendance = [
  // 02.03.2026 - 08:00 - Технология производства (groups 1,2)
  { id: 1, lesson_id: 1, student_id: 1, status: 'present', is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 2, lesson_id: 1, student_id: 2, status: null, is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 3, lesson_id: 1, student_id: 3, status: 'absent', is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 4, lesson_id: 2, student_id: 4, status: null, is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 5, lesson_id: 2, student_id: 5, status: 'present', is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 6, lesson_id: 2, student_id: 6, status: null, is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  
  // 02.03.2026 - 09:45 - Технология производства (groups 1,2)
  { id: 7, lesson_id: 3, student_id: 6, status: 'present', is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 8, lesson_id: 3, student_id: 7, status: null, is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 9, lesson_id: 3, student_id: 8, status: 'present', is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 10, lesson_id: 3, student_id: 9, status: 'excused', is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 11, lesson_id: 3, student_id: 10, status: null, is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 12, lesson_id: 4, student_id: 4, status: null, is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 13, lesson_id: 4, student_id: 5, status: 'present', is_confirmed: true, created_at: '2026-03-02', updated_at: '2026-03-02' },
  
  // 02.03.2026 - 11:30 - Технология производства (groups 1,2)
  { id: 14, lesson_id: 5, student_id: 11, status: null, is_confirmed: false, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 15, lesson_id: 5, student_id: 12, status: 'absent', is_confirmed: false, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 16, lesson_id: 5, student_id: 13, status: 'present', is_confirmed: false, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 17, lesson_id: 5, student_id: 14, status: null, is_confirmed: false, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 18, lesson_id: 5, student_id: 15, status: null, is_confirmed: false, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 19, lesson_id: 6, student_id: 4, status: null, is_confirmed: false, created_at: '2026-03-02', updated_at: '2026-03-02' },
  { id: 20, lesson_id: 6, student_id: 5, status: null, is_confirmed: false, created_at: '2026-03-02', updated_at: '2026-03-02' },
  
  // 03.03.2026 - 08:00 - Веб-технологии (groups 1,2)
  { id: 21, lesson_id: 7, student_id: 1, status: 'present', is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 22, lesson_id: 7, student_id: 2, status: 'present', is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 23, lesson_id: 7, student_id: 3, status: null, is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 24, lesson_id: 7, student_id: 4, status: 'present', is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 25, lesson_id: 7, student_id: 5, status: null, is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 26, lesson_id: 8, student_id: 7, status: null, is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  
  // 03.03.2026 - 08:00 - Базы данных (group 4)
  { id: 27, lesson_id: 21, student_id: 9, status: null, is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 28, lesson_id: 21, student_id: 10, status: null, is_confirmed: true, created_at: '2026-03-03', updated_at: '2026-03-03' },
  
  // 03.03.2026 - 11:30 - Веб-технологии (group 1)
  { id: 29, lesson_id: 9, student_id: 6, status: null, is_confirmed: false, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 30, lesson_id: 9, student_id: 7, status: 'absent', is_confirmed: false, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 31, lesson_id: 9, student_id: 8, status: 'present', is_confirmed: false, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 32, lesson_id: 9, student_id: 9, status: null, is_confirmed: false, created_at: '2026-03-03', updated_at: '2026-03-03' },
  { id: 33, lesson_id: 9, student_id: 10, status: 'present', is_confirmed: false, created_at: '2026-03-03', updated_at: '2026-03-03' },
  
  // 04.03.2026 - 09:45 - Базы данных (groups 3,4)
  { id: 34, lesson_id: 10, student_id: 11, status: 'present', is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 35, lesson_id: 10, student_id: 12, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 36, lesson_id: 10, student_id: 13, status: 'present', is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 37, lesson_id: 10, student_id: 14, status: 'excused', is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 38, lesson_id: 10, student_id: 15, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 39, lesson_id: 11, student_id: 9, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  
  // 04.03.2026 - 13:30 - Архитектура компьютера (groups 5,6)
  { id: 40, lesson_id: 12, student_id: 1, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 41, lesson_id: 12, student_id: 2, status: 'absent', is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 42, lesson_id: 12, student_id: 3, status: 'present', is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 43, lesson_id: 12, student_id: 4, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 44, lesson_id: 12, student_id: 5, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 45, lesson_id: 13, student_id: 3, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  { id: 46, lesson_id: 13, student_id: 4, status: null, is_confirmed: false, created_at: '2026-03-04', updated_at: '2026-03-04' },
  
  // 06.03.2026 - 08:00 - Компьютерные сети (groups 7,8)
  { id: 47, lesson_id: 14, student_id: 6, status: 'present', is_confirmed: true, created_at: '2026-03-06', updated_at: '2026-03-06' },
  { id: 48, lesson_id: 14, student_id: 7, status: 'present', is_confirmed: true, created_at: '2026-03-06', updated_at: '2026-03-06' },
  { id: 49, lesson_id: 14, student_id: 8, status: null, is_confirmed: true, created_at: '2026-03-06', updated_at: '2026-03-06' },
  { id: 50, lesson_id: 14, student_id: 9, status: 'present', is_confirmed: true, created_at: '2026-03-06', updated_at: '2026-03-06' },
  { id: 51, lesson_id: 14, student_id: 10, status: null, is_confirmed: true, created_at: '2026-03-06', updated_at: '2026-03-06' },
  { id: 52, lesson_id: 15, student_id: 8, status: null, is_confirmed: true, created_at: '2026-03-06', updated_at: '2026-03-06' },
  
  // 07.03.2026 - 08:00 - Операционные системы (groups 9,10)
  { id: 53, lesson_id: 16, student_id: 11, status: 'present', is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 54, lesson_id: 16, student_id: 12, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 55, lesson_id: 16, student_id: 13, status: 'present', is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 56, lesson_id: 16, student_id: 14, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 57, lesson_id: 16, student_id: 15, status: 'absent', is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 58, lesson_id: 17, student_id: 13, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 59, lesson_id: 17, student_id: 14, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 60, lesson_id: 17, student_id: 2, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  
  // 07.03.2026 - 11:30 - Операционные системы (groups 9,10)
  { id: 61, lesson_id: 18, student_id: 11, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 62, lesson_id: 18, student_id: 12, status: 'absent', is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 63, lesson_id: 18, student_id: 13, status: 'present', is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 64, lesson_id: 18, student_id: 14, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 65, lesson_id: 18, student_id: 15, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 66, lesson_id: 19, student_id: 13, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 67, lesson_id: 19, student_id: 14, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },
  { id: 68, lesson_id: 19, student_id: 2, status: null, is_confirmed: false, created_at: '2026-03-07', updated_at: '2026-03-07' },

  // Доп. посещаемость для новых занятий
  // subject 1 / group 1 (students 1-3)
  { id: 69, lesson_id: 22, student_id: 1, status: 'present', is_confirmed: true, created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 70, lesson_id: 22, student_id: 2, status: 'absent', is_confirmed: true, created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 71, lesson_id: 22, student_id: 3, status: 'excused', is_confirmed: true, created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 72, lesson_id: 24, student_id: 1, status: 'present', is_confirmed: true, created_at: '2026-03-16', updated_at: '2026-03-16' },
  { id: 73, lesson_id: 24, student_id: 2, status: 'present', is_confirmed: true, created_at: '2026-03-16', updated_at: '2026-03-16' },
  { id: 74, lesson_id: 24, student_id: 3, status: 'absent', is_confirmed: true, created_at: '2026-03-16', updated_at: '2026-03-16' },
  { id: 75, lesson_id: 26, student_id: 1, status: 'excused', is_confirmed: false, created_at: '2026-03-23', updated_at: '2026-03-23' },
  { id: 76, lesson_id: 26, student_id: 2, status: 'present', is_confirmed: false, created_at: '2026-03-23', updated_at: '2026-03-23' },
  { id: 77, lesson_id: 26, student_id: 3, status: 'present', is_confirmed: false, created_at: '2026-03-23', updated_at: '2026-03-23' },
  { id: 78, lesson_id: 28, student_id: 1, status: 'absent', is_confirmed: false, created_at: '2026-03-30', updated_at: '2026-03-30' },
  { id: 79, lesson_id: 28, student_id: 2, status: 'excused', is_confirmed: false, created_at: '2026-03-30', updated_at: '2026-03-30' },
  { id: 80, lesson_id: 28, student_id: 3, status: 'present', is_confirmed: false, created_at: '2026-03-30', updated_at: '2026-03-30' },
  { id: 81, lesson_id: 30, student_id: 1, status: 'present', is_confirmed: true, created_at: '2026-04-06', updated_at: '2026-04-06' },
  { id: 82, lesson_id: 30, student_id: 2, status: 'present', is_confirmed: true, created_at: '2026-04-06', updated_at: '2026-04-06' },
  { id: 83, lesson_id: 30, student_id: 3, status: 'present', is_confirmed: true, created_at: '2026-04-06', updated_at: '2026-04-06' },
  { id: 84, lesson_id: 32, student_id: 1, status: 'present', is_confirmed: true, created_at: '2026-04-13', updated_at: '2026-04-13' },
  { id: 85, lesson_id: 32, student_id: 2, status: 'absent', is_confirmed: true, created_at: '2026-04-13', updated_at: '2026-04-13' },
  { id: 86, lesson_id: 32, student_id: 3, status: 'excused', is_confirmed: true, created_at: '2026-04-13', updated_at: '2026-04-13' },
  { id: 87, lesson_id: 34, student_id: 1, status: 'present', is_confirmed: false, created_at: '2026-04-20', updated_at: '2026-04-20' },
  { id: 88, lesson_id: 34, student_id: 2, status: 'present', is_confirmed: false, created_at: '2026-04-20', updated_at: '2026-04-20' },
  { id: 89, lesson_id: 34, student_id: 3, status: 'absent', is_confirmed: false, created_at: '2026-04-20', updated_at: '2026-04-20' },
  { id: 90, lesson_id: 36, student_id: 1, status: 'excused', is_confirmed: false, created_at: '2026-04-27', updated_at: '2026-04-27' },
  { id: 91, lesson_id: 36, student_id: 2, status: 'present', is_confirmed: false, created_at: '2026-04-27', updated_at: '2026-04-27' },
  { id: 92, lesson_id: 36, student_id: 3, status: 'present', is_confirmed: false, created_at: '2026-04-27', updated_at: '2026-04-27' },

  // subject 1 / group 2 (students 4-6)
  { id: 93, lesson_id: 23, student_id: 4, status: 'present', is_confirmed: true, created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 94, lesson_id: 23, student_id: 5, status: 'present', is_confirmed: true, created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 95, lesson_id: 23, student_id: 6, status: 'absent', is_confirmed: true, created_at: '2026-03-09', updated_at: '2026-03-09' },
  { id: 96, lesson_id: 25, student_id: 4, status: 'excused', is_confirmed: true, created_at: '2026-03-16', updated_at: '2026-03-16' },
  { id: 97, lesson_id: 25, student_id: 5, status: 'present', is_confirmed: true, created_at: '2026-03-16', updated_at: '2026-03-16' },
  { id: 98, lesson_id: 25, student_id: 6, status: 'present', is_confirmed: true, created_at: '2026-03-16', updated_at: '2026-03-16' },
  { id: 99, lesson_id: 27, student_id: 4, status: 'present', is_confirmed: false, created_at: '2026-03-23', updated_at: '2026-03-23' },
  { id: 100, lesson_id: 27, student_id: 5, status: 'absent', is_confirmed: false, created_at: '2026-03-23', updated_at: '2026-03-23' },
  { id: 101, lesson_id: 27, student_id: 6, status: 'excused', is_confirmed: false, created_at: '2026-03-23', updated_at: '2026-03-23' },
  { id: 102, lesson_id: 29, student_id: 4, status: 'present', is_confirmed: false, created_at: '2026-03-30', updated_at: '2026-03-30' },
  { id: 103, lesson_id: 29, student_id: 5, status: 'present', is_confirmed: false, created_at: '2026-03-30', updated_at: '2026-03-30' },
  { id: 104, lesson_id: 29, student_id: 6, status: 'present', is_confirmed: false, created_at: '2026-03-30', updated_at: '2026-03-30' },
  { id: 105, lesson_id: 31, student_id: 4, status: 'absent', is_confirmed: true, created_at: '2026-04-06', updated_at: '2026-04-06' },
  { id: 106, lesson_id: 31, student_id: 5, status: 'present', is_confirmed: true, created_at: '2026-04-06', updated_at: '2026-04-06' },
  { id: 107, lesson_id: 31, student_id: 6, status: 'present', is_confirmed: true, created_at: '2026-04-06', updated_at: '2026-04-06' },
  { id: 108, lesson_id: 33, student_id: 4, status: 'present', is_confirmed: true, created_at: '2026-04-13', updated_at: '2026-04-13' },
  { id: 109, lesson_id: 33, student_id: 5, status: 'excused', is_confirmed: true, created_at: '2026-04-13', updated_at: '2026-04-13' },
  { id: 110, lesson_id: 33, student_id: 6, status: 'absent', is_confirmed: true, created_at: '2026-04-13', updated_at: '2026-04-13' },
  { id: 111, lesson_id: 35, student_id: 4, status: 'present', is_confirmed: false, created_at: '2026-04-20', updated_at: '2026-04-20' },
  { id: 112, lesson_id: 35, student_id: 5, status: 'present', is_confirmed: false, created_at: '2026-04-20', updated_at: '2026-04-20' },
  { id: 113, lesson_id: 35, student_id: 6, status: 'absent', is_confirmed: false, created_at: '2026-04-20', updated_at: '2026-04-20' },
  { id: 114, lesson_id: 37, student_id: 4, status: 'excused', is_confirmed: false, created_at: '2026-04-27', updated_at: '2026-04-27' },
  { id: 115, lesson_id: 37, student_id: 5, status: 'present', is_confirmed: false, created_at: '2026-04-27', updated_at: '2026-04-27' },
  { id: 116, lesson_id: 37, student_id: 6, status: 'present', is_confirmed: false, created_at: '2026-04-27', updated_at: '2026-04-27' },

  // subject 4 / group 5 (students 1,2)
  { id: 117, lesson_id: 38, student_id: 1, status: 'present', is_confirmed: false, created_at: '2026-03-11', updated_at: '2026-03-11' },
  { id: 118, lesson_id: 38, student_id: 2, status: 'absent', is_confirmed: false, created_at: '2026-03-11', updated_at: '2026-03-11' },
  { id: 119, lesson_id: 40, student_id: 1, status: 'excused', is_confirmed: true, created_at: '2026-03-18', updated_at: '2026-03-18' },
  { id: 120, lesson_id: 40, student_id: 2, status: 'present', is_confirmed: true, created_at: '2026-03-18', updated_at: '2026-03-18' },
  { id: 121, lesson_id: 42, student_id: 1, status: 'present', is_confirmed: false, created_at: '2026-03-25', updated_at: '2026-03-25' },
  { id: 122, lesson_id: 42, student_id: 2, status: 'present', is_confirmed: false, created_at: '2026-03-25', updated_at: '2026-03-25' },
  { id: 123, lesson_id: 44, student_id: 1, status: 'absent', is_confirmed: false, created_at: '2026-04-01', updated_at: '2026-04-01' },
  { id: 124, lesson_id: 44, student_id: 2, status: 'excused', is_confirmed: false, created_at: '2026-04-01', updated_at: '2026-04-01' },
  { id: 125, lesson_id: 46, student_id: 1, status: 'present', is_confirmed: true, created_at: '2026-04-08', updated_at: '2026-04-08' },
  { id: 126, lesson_id: 46, student_id: 2, status: 'present', is_confirmed: true, created_at: '2026-04-08', updated_at: '2026-04-08' },
  { id: 127, lesson_id: 48, student_id: 1, status: 'excused', is_confirmed: true, created_at: '2026-04-15', updated_at: '2026-04-15' },
  { id: 128, lesson_id: 48, student_id: 2, status: 'absent', is_confirmed: true, created_at: '2026-04-15', updated_at: '2026-04-15' },

  // subject 4 / group 6 (students 3,4)
  { id: 129, lesson_id: 39, student_id: 3, status: 'present', is_confirmed: false, created_at: '2026-03-11', updated_at: '2026-03-11' },
  { id: 130, lesson_id: 39, student_id: 4, status: 'present', is_confirmed: false, created_at: '2026-03-11', updated_at: '2026-03-11' },
  { id: 131, lesson_id: 41, student_id: 3, status: 'absent', is_confirmed: true, created_at: '2026-03-18', updated_at: '2026-03-18' },
  { id: 132, lesson_id: 41, student_id: 4, status: 'excused', is_confirmed: true, created_at: '2026-03-18', updated_at: '2026-03-18' },
  { id: 133, lesson_id: 43, student_id: 3, status: 'present', is_confirmed: false, created_at: '2026-03-25', updated_at: '2026-03-25' },
  { id: 134, lesson_id: 43, student_id: 4, status: 'absent', is_confirmed: false, created_at: '2026-03-25', updated_at: '2026-03-25' },
  { id: 135, lesson_id: 45, student_id: 3, status: 'present', is_confirmed: false, created_at: '2026-04-01', updated_at: '2026-04-01' },
  { id: 136, lesson_id: 45, student_id: 4, status: 'present', is_confirmed: false, created_at: '2026-04-01', updated_at: '2026-04-01' },
  { id: 137, lesson_id: 47, student_id: 3, status: 'excused', is_confirmed: true, created_at: '2026-04-08', updated_at: '2026-04-08' },
  { id: 138, lesson_id: 47, student_id: 4, status: 'present', is_confirmed: true, created_at: '2026-04-08', updated_at: '2026-04-08' },
  { id: 139, lesson_id: 49, student_id: 3, status: 'present', is_confirmed: true, created_at: '2026-04-15', updated_at: '2026-04-15' },
  { id: 140, lesson_id: 49, student_id: 4, status: 'absent', is_confirmed: true, created_at: '2026-04-15', updated_at: '2026-04-15' },

  // subject 6 / group 9 (students 11,12,15)
  { id: 141, lesson_id: 50, student_id: 11, status: 'present', is_confirmed: false, created_at: '2026-03-14', updated_at: '2026-03-14' },
  { id: 142, lesson_id: 50, student_id: 12, status: 'absent', is_confirmed: false, created_at: '2026-03-14', updated_at: '2026-03-14' },
  { id: 143, lesson_id: 50, student_id: 15, status: 'excused', is_confirmed: false, created_at: '2026-03-14', updated_at: '2026-03-14' },
  { id: 144, lesson_id: 52, student_id: 11, status: 'present', is_confirmed: true, created_at: '2026-03-21', updated_at: '2026-03-21' },
  { id: 145, lesson_id: 52, student_id: 12, status: 'present', is_confirmed: true, created_at: '2026-03-21', updated_at: '2026-03-21' },
  { id: 146, lesson_id: 52, student_id: 15, status: 'absent', is_confirmed: true, created_at: '2026-03-21', updated_at: '2026-03-21' },
  { id: 147, lesson_id: 54, student_id: 11, status: 'excused', is_confirmed: false, created_at: '2026-03-28', updated_at: '2026-03-28' },
  { id: 148, lesson_id: 54, student_id: 12, status: 'present', is_confirmed: false, created_at: '2026-03-28', updated_at: '2026-03-28' },
  { id: 149, lesson_id: 54, student_id: 15, status: 'present', is_confirmed: false, created_at: '2026-03-28', updated_at: '2026-03-28' },
  { id: 150, lesson_id: 56, student_id: 11, status: 'absent', is_confirmed: false, created_at: '2026-04-04', updated_at: '2026-04-04' },
  { id: 151, lesson_id: 56, student_id: 12, status: 'excused', is_confirmed: false, created_at: '2026-04-04', updated_at: '2026-04-04' },
  { id: 152, lesson_id: 56, student_id: 15, status: 'present', is_confirmed: false, created_at: '2026-04-04', updated_at: '2026-04-04' },
  { id: 153, lesson_id: 58, student_id: 11, status: 'present', is_confirmed: true, created_at: '2026-04-11', updated_at: '2026-04-11' },
  { id: 154, lesson_id: 58, student_id: 12, status: 'present', is_confirmed: true, created_at: '2026-04-11', updated_at: '2026-04-11' },
  { id: 155, lesson_id: 58, student_id: 15, status: 'present', is_confirmed: true, created_at: '2026-04-11', updated_at: '2026-04-11' },

  // subject 6 / group 10 (students 13,14,2)
  { id: 156, lesson_id: 51, student_id: 13, status: 'present', is_confirmed: false, created_at: '2026-03-14', updated_at: '2026-03-14' },
  { id: 157, lesson_id: 51, student_id: 14, status: 'present', is_confirmed: false, created_at: '2026-03-14', updated_at: '2026-03-14' },
  { id: 158, lesson_id: 51, student_id: 2, status: 'absent', is_confirmed: false, created_at: '2026-03-14', updated_at: '2026-03-14' },
  { id: 159, lesson_id: 53, student_id: 13, status: 'excused', is_confirmed: true, created_at: '2026-03-21', updated_at: '2026-03-21' },
  { id: 160, lesson_id: 53, student_id: 14, status: 'present', is_confirmed: true, created_at: '2026-03-21', updated_at: '2026-03-21' },
  { id: 161, lesson_id: 53, student_id: 2, status: 'present', is_confirmed: true, created_at: '2026-03-21', updated_at: '2026-03-21' },
  { id: 162, lesson_id: 55, student_id: 13, status: 'present', is_confirmed: false, created_at: '2026-03-28', updated_at: '2026-03-28' },
  { id: 163, lesson_id: 55, student_id: 14, status: 'absent', is_confirmed: false, created_at: '2026-03-28', updated_at: '2026-03-28' },
  { id: 164, lesson_id: 55, student_id: 2, status: 'excused', is_confirmed: false, created_at: '2026-03-28', updated_at: '2026-03-28' },
  { id: 165, lesson_id: 57, student_id: 13, status: 'present', is_confirmed: false, created_at: '2026-04-04', updated_at: '2026-04-04' },
  { id: 166, lesson_id: 57, student_id: 14, status: 'present', is_confirmed: false, created_at: '2026-04-04', updated_at: '2026-04-04' },
  { id: 167, lesson_id: 57, student_id: 2, status: 'absent', is_confirmed: false, created_at: '2026-04-04', updated_at: '2026-04-04' },
  { id: 168, lesson_id: 59, student_id: 13, status: 'present', is_confirmed: true, created_at: '2026-04-11', updated_at: '2026-04-11' },
  { id: 169, lesson_id: 59, student_id: 14, status: 'excused', is_confirmed: true, created_at: '2026-04-11', updated_at: '2026-04-11' },
  { id: 170, lesson_id: 59, student_id: 2, status: 'present', is_confirmed: true, created_at: '2026-04-11', updated_at: '2026-04-11' },
];

// Таблица: bluetooth_sessions (bluetooth сессии)
export const bluetooth_sessions = [
  { id: 1, lesson_id: 1, student_id: 1, started_at: '2026-03-02 08:00:00', ended_at: '2026-03-02 09:35:00', is_active: false },
  { id: 2, lesson_id: 2, student_id: 5, started_at: '2026-03-02 08:00:00', ended_at: '2026-03-02 09:35:00', is_active: false },
];

// Функции для работы с БД

/**
 * Получить все доступные даты занятий
 */
export function getAvailableDates() {
  const dates = new Set();
  lessons.forEach(lesson => {
    dates.add(lesson.date);
  });
  return Array.from(dates).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('.');
    const [dayB, monthB, yearB] = b.split('.');
    return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
  });
}

/**
 * Получить занятия для конкретной даты
 */
export function getLessonsByDate(date) {
  return lessons.filter(lesson => lesson.date === date);
}

/**
 * Получить занятие по ID
 */
export function getLessonById(id) {
  return lessons.find(lesson => lesson.id === id);
}

/**
 * Получить информацию о дисциплине по ID
 */
export function getSubjectById(id) {
  return subjects.find(subject => subject.id === id);
}

/**
 * Получить группу по ID
 */
export function getGroupById(id) {
  return groups.find(group => group.id === id);
}

/**
 * Получить студентов в группе
 */
export function getStudentsByGroupId(groupId) {
  const groupStudents = group_students.filter(gs => gs.group_id === groupId && !gs.is_deleted);
  return groupStudents.map(gs => {
    const user = users.find(u => u.id === gs.user_id);
    return {
      id: user.id,
      name: `${user.second_name} ${user.first_name}`,
      fullName: `${user.second_name} ${user.first_name} ${user.middle_name}`,
      group: getGroupById(groupId).name,
    };
  });
}

/**
 * Получить пользователя по ID
 */
export function getUserById(id) {
  return users.find(user => user.id === id);
}

/**
 * Получить название группы по ID
 */
export function getGroupNameById(id) {
  const group = getGroupById(id);
  return group ? group.name : '';
}

/**
 * Получить посещаемость для занятия
 */
export function getAttendanceByLessonId(lessonId) {
  return attendance.filter(a => a.lesson_id === lessonId);
}

/**
 * Получить информацию о занятии с полными данными
 */
export function getLessonFullInfo(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return null;
  
  const subject = getSubjectById(lesson.subject_id);
  const group = getGroupById(lesson.group_id);
  const teacher = getUserById(lesson.teacher_id);
  const attendanceData = getAttendanceByLessonId(lessonId);
  
  return {
    ...lesson,
    subject: subject.name,
    groupName: group.name,
    teacher: `${teacher.second_name} ${teacher.first_name}`,
    room: `Ауд. ${300 + lesson.id}`,
    attendanceData,
  };
}

/**
 * Определить номер пары по времени начала занятия
 * 1 - 08:00, 2 - 09:45, 3 - 11:30, 4 - 13:30, 5 - 15:15, 6 - 17:00, 7 - 18:45
 * Если времени нет, возвращает 999 (для сортировки в конец)
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
  return timeMap[startTime] || getNumberByStartTime(startTime);
}

/**
 * Вычислить номер пары на основе времени начала (для произвольных времен)
 * Находит пару, которая начинается <= времени мероприятия
 */
export function getNumberByStartTime(timeStr) {
  if (!timeStr) return 999;
  
  const times = ['08:00', '09:45', '11:30', '13:30', '15:15', '17:00', '18:45'];
  
  // Преобразуем время в минуты
  const [hours, minutes] = timeStr.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;
  
  // Находим пару, которая начинается в это время или раньше
  for (let i = times.length - 1; i >= 0; i--) {
    const [h, m] = times[i].split(':').map(Number);
    const pairTimeInMinutes = h * 60 + m;
    if (timeInMinutes >= pairTimeInMinutes) {
      return i + 1; // пары нумеруются с 1
    }
  }
  
  return 999; // если время раньше первой пары
}

/**
 * Получить расписание для даты с полной информацией
 * Объединяет занятия с одинаковым временем и дисциплиной в одну ячейку со списком групп
 */
export function getScheduleForDate(date) {
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
    const groups = similarLessons.map(l => {
      const group = getGroupById(l.group_id);
      return `Гр. ${group.name}`;
    }).sort();
    
    // Проверяем, все ли группы завершили занятие
    const allAttendanceData = similarLessons.flatMap(l => getAttendanceByLessonId(l.id));
    const isConfirmed = allAttendanceData.length > 0 && allAttendanceData.every(a => a.is_confirmed);
    
    result.push({
      id: lesson.id,
      number: getLessonNumberByTime(lesson.start_time),
      time: `${lesson.start_time} - ${lesson.end_time}`,
      subject: subject.name,
      type: lesson.type,
      groups: groups,
      room: `Ауд. ${300 + lesson.id}`,
      attendanceConfirmed: isConfirmed,
      isPast: true,
      isCurrent: false,
      lessonIds: similarLessons.map(l => l.id),
      lessonId: lesson.id,
    });
  });
  
  // Сортируем по номеру пары (по времени)
  result.sort((a, b) => a.number - b.number);
  
  return result;
}

/**
 * Получить студентов занятия с данными посещаемости
 */
export function getStudentsWithAttendance(lessonId) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return [];
  
  const students = getStudentsByGroupId(lesson.group_id);
  const attendanceData = getAttendanceByLessonId(lessonId);
  
  return students.map(student => {
    const studentAttendance = attendanceData.find(a => a.student_id === student.id);
    const bluetoothSession = bluetooth_sessions.find(
      bs => bs.lesson_id === lessonId && bs.student_id === student.id
    );
    
    return {
      id: student.id,
      name: student.name,
      group: student.group,
      bluetooth: !!bluetoothSession,
      paper: false,
      manual: studentAttendance?.status || null,
      document: null,
      attendanceId: studentAttendance?.id || null,
    };
  });
}

/**
 * Получить студентов из нескольких занятий с данными посещаемости
 * Используется для объединённых занятий (несколько групп в одно время)
 */
export function getStudentsWithAttendanceForMultipleLessons(lessonIds) {
  const allStudents = [];
  
  lessonIds.forEach(lessonId => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;
    
    const students = getStudentsByGroupId(lesson.group_id);
    const attendanceData = getAttendanceByLessonId(lessonId);
    
    students.forEach(student => {
      const studentAttendance = attendanceData.find(a => a.student_id === student.id);
      const bluetoothSession = bluetooth_sessions.find(
        bs => bs.lesson_id === lessonId && bs.student_id === student.id
      );
      
      allStudents.push({
        id: student.id,
        name: student.name,
        group: student.group,
        bluetooth: !!bluetoothSession,
        paper: false,
        manual: studentAttendance?.status || null,
        document: null,
        attendanceId: studentAttendance?.id || null,
        lessonId: lessonId,
      });
    });
  });
  
  return allStudents;
}

/**
 * Обновить статус посещаемости студента
 */
export function updateAttendanceStatus(attendanceId, status) {
  const attendanceRecord = attendance.find(a => a.id === attendanceId);
  if (attendanceRecord) {
    attendanceRecord.status = status;
    attendanceRecord.updated_at = new Date().toISOString().split('T')[0];
  }
  return attendanceRecord;
}

/**
 * Подтвердить посещаемость для занятия
 */
export function confirmAttendanceForLesson(lessonId) {
  const lessonAttendance = attendance.filter(a => a.lesson_id === lessonId);
  lessonAttendance.forEach(record => {
    record.is_confirmed = true;
    record.updated_at = new Date().toISOString().split('T')[0];
  });
  return lessonAttendance;
}

/**
 * Проверить, подтверждена ли посещаемость для занятия
 */
export function isLessonConfirmed(lessonId) {
  const lessonAttendance = attendance.filter(a => a.lesson_id === lessonId);
  if (lessonAttendance.length === 0) return false;
  return lessonAttendance.every(a => a.is_confirmed);
}

/**
 * Отменить подтверждение посещаемости для занятия
 */
export function unconfirmAttendanceForLesson(lessonId) {
  const lessonAttendance = attendance.filter(a => a.lesson_id === lessonId);
  lessonAttendance.forEach(record => {
    record.is_confirmed = false;
    record.updated_at = new Date().toISOString().split('T')[0];
  });
  return lessonAttendance;
}

/**
 * Получить фиксированные временные слоты расписания
 */
export function getFixedTimeSlots() {
  return [
    '08:00',
    '09:45',
    '11:30',
    '13:30',
    '15:15',
    '17:00',
    '18:45',
    'no-time', // Пустой слот для занятий без времени
  ];
}

/**
 * Получить все уникальные временные интервалы из расписания
 */
export function getAllTimeSlots() {
  const timeSlots = new Set();
  lessons.forEach(lesson => {
    timeSlots.add(lesson.start_time);
  });
  return Array.from(timeSlots).sort((a, b) => a.localeCompare(b));
}

/**
 * Получить расписание на неделю (начиная с понедельника)
 */
export function getScheduleForWeek(startDate) {
  // Парсим стартовую дату
  const [day, month, year] = startDate.split('.');
  const start = new Date(`${year}-${month}-${day}`);
  
  // Находим понедельник этой недели
  const dayOfWeek = start.getDay();
  const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(start);
  monday.setDate(diff);
  
  // Получаем 6 дней (Пн-Сб)
  const weekDays = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString('ru-RU');
    weekDays.push({
      date: dateStr,
      dayName: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][i],
    });
  }
  
  // Получаем фиксированные временные слоты
  const timeSlots = getFixedTimeSlots();
  
  // Строим матрицу расписания
  const schedule = {
    weekDays,
    timeSlots,
    lessons: {},
  };
  
  // Заполняем занятия по дням и времени
  weekDays.forEach(day => {
    const dayLessons = getLessonsByDate(day.date);
    timeSlots.forEach(time => {
      const key = `${day.date}-${time}`;
      
      let lessonsAtTime;
      if (time === 'no-time') {
        lessonsAtTime = dayLessons.filter(l => !timeSlots.slice(0, -1).includes(l.start_time));
      } else {
        lessonsAtTime = dayLessons.filter(l => l.start_time === time);
      }
      
      // Объединяем занятия с одинаковым временем и дисциплиной
      const processedKeys = new Set();
      const result = [];
      
      lessonsAtTime.forEach(lesson => {
        const lessonKey = `${lesson.subject_id}`;
        if (processedKeys.has(lessonKey)) return;
        
        const similarLessons = lessonsAtTime.filter(l => l.subject_id === lesson.subject_id);
        processedKeys.add(lessonKey);
        
        const subject = getSubjectById(lesson.subject_id);
        const groups = similarLessons.map(l => getGroupNameById(l.group_id)).sort();
        const isConfirmed = similarLessons.every(l => isLessonConfirmed(l.id));
        
        result.push({
          id: lesson.id,
          subject: subject.name,
          type: lesson.type,
          groups,
          room: `Ауд. ${300 + lesson.id}`,
          time: `${lesson.start_time} - ${lesson.end_time}`,
          date: day.date,
          isConfirmed,
          lessonIds: similarLessons.map(l => l.id),
        });
      });
      
      if (result.length > 0) {
        schedule.lessons[key] = result;
      }
    });
  });
  
  return schedule;
}

export function getScheduleForTwoWeeks(startDate) {
  // Парсим стартовую дату
  const [day, month, year] = startDate.split('.');
  const start = new Date(`${year}-${month}-${day}`);
  
  // Находим понедельник этой недели
  const dayOfWeek = start.getDay();
  const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(start);
  monday.setDate(diff);
  
  // Получаем 12 дней (два раза по Пн-Сб)
  const weekDays = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString('ru-RU');
    weekDays.push({
      date: dateStr,
      dayName: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][i % 6],
    });
  }
  
  // Получаем фиксированные временные слоты
  const timeSlots = getFixedTimeSlots();
  
  // Строим матрицу расписания
  const schedule = {
    weekDays,
    timeSlots,
    lessons: {},
  };
  
  // Заполняем занятия по дням и времени
  weekDays.forEach(day => {
    const dayLessons = getLessonsByDate(day.date);
    timeSlots.forEach(time => {
      const key = `${day.date}-${time}`;
      
      let lessonsAtTime;
      if (time === 'no-time') {
        lessonsAtTime = dayLessons.filter(l => !timeSlots.slice(0, -1).includes(l.start_time));
      } else {
        lessonsAtTime = dayLessons.filter(l => l.start_time === time);
      }
      
      // Объединяем занятия с одинаковым временем и дисциплиной
      const processedKeys = new Set();
      const result = [];
      
      lessonsAtTime.forEach(lesson => {
        const lessonKey = `${lesson.subject_id}`;
        if (processedKeys.has(lessonKey)) return;
        
        const similarLessons = lessonsAtTime.filter(l => l.subject_id === lesson.subject_id);
        processedKeys.add(lessonKey);
        
        const subject = getSubjectById(lesson.subject_id);
        const groups = similarLessons.map(l => getGroupNameById(l.group_id)).sort();
        const isConfirmed = similarLessons.every(l => isLessonConfirmed(l.id));
        
        result.push({
          id: lesson.id,
          subject: subject.name,
          type: lesson.type,
          groups,
          room: `Ауд. ${300 + lesson.id}`,
          time: `${lesson.start_time} - ${lesson.end_time}`,
          date: day.date,
          isConfirmed,
          lessonIds: similarLessons.map(l => l.id),
        });
      });
      
      if (result.length > 0) {
        schedule.lessons[key] = result;
      }
    });
  });
  
  return schedule;
}
