# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## API

### Environment variables

- `VITE_API_BASE_URL` — base URL of backend (e.g. `http://localhost:8000`). If empty, requests go to the same origin.
- `VITE_USE_API_SCHEDULE=1` — makes the Schedule page load timetable from API.
- `VITE_API_MOCK=1` — uses local mock implementation for timetable (useful before backend is ready).

Run (PowerShell):

`$env:VITE_USE_API_SCHEDULE="1"; $env:VITE_API_MOCK="1"; npm run dev`

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
