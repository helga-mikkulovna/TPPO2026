import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SchedulePage from './pages/SchedulePage';
import ScheduleSearchPage from './pages/ScheduleSearchPage';
import AttendancePage from './pages/AttendancePage';
import DisciplinesPage from './pages/DisciplinesPage';
import LoginPage from './pages/LoginPage';
import { BreadcrumbProvider } from './context/BreadcrumbContext.jsx';
import RequireAuth from './subsystems/user/components/RequireAuth';
import RequireRole from './subsystems/user/components/RequireRole';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <SchedulePage />,
      },
      {
        path: 'schedule-search',
        element: <ScheduleSearchPage />,
      },
      {
        path: 'attendance',
        element: (
          <RequireRole denied={["STUDENT"]}>
            <AttendancePage />
          </RequireRole>
        ),
      },
      {
        path: 'disciplines/:subjectId?',
        element: (
          <RequireRole denied={["STUDENT"]}>
            <DisciplinesPage />
          </RequireRole>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BreadcrumbProvider>
      <RouterProvider router={router} />
    </BreadcrumbProvider>
  </StrictMode>
);
