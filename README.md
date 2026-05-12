## Установка и запуск

**Требования:** Node.js 18+

1. Клонировать репозиторий:
git clone https://github.com/helga-mikkulovna/TPPO2026.git
cd TPPO2026

2. Установить зависимости:
npm install

3. Запустить проект:
npm run dev

4. Открыть в браузере: http://localhost:5173

---

## API

### Environment variables
- `VITE_API_BASE_URL` — base URL of backend (e.g. `http://localhost:8000`). If empty, requests go to the same origin.
- `VITE_USE_API_SCHEDULE=1` — makes the Schedule page load timetable from API.
- `VITE_API_MOCK=1` — uses local mock implementation for timetable (useful before backend is ready).

Run (PowerShell):
$env:VITE_USE_API_SCHEDULE="1"; $env:VITE_API_MOCK="1"; npm run dev

### Timetable (Lecturer)
`GET /api/timetable/get_lecturer_lessons`

Query params:
- `first_name` (required)
- `second_name` (required)
- `middle_name` (required)
- `start_date` (ISO `YYYY-MM-DD`)
- `end_date` (ISO `YYYY-MM-DD`)

### Timetable (Group)
`GET /api/timetable/get_group_lessons`

Query params:
- `group` (required, e.g. `22306`)
- `start_date` (ISO `YYYY-MM-DD`)
- `end_date` (ISO `YYYY-MM-DD`)
