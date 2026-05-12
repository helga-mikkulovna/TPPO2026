import React, { useState, useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BreadcrumbContext } from '../context/breadcrumbContext';
import { clearAuth, getUser } from '../subsystems/user/stores/authStorage';
import './Layout.css';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { breadcrumbs, clearBreadcrumbs } = useContext(BreadcrumbContext);
  const navigate = useNavigate();

  const roles = getUser()?.roles || [];
  const normalizedRoles = Array.isArray(roles) ? roles.map((r) => String(r).toUpperCase()) : [];
  const isStudent = normalizedRoles.includes('STUDENT');

  const user = getUser();
  const fullName = [user?.last_name, user?.first_name, user?.middle_name].filter(Boolean).join(' ');

  const roleTitle = (() => {
    if (normalizedRoles.includes('STUDENT')) return 'Студент';
    if (normalizedRoles.includes('TEACHER')) return 'Преподаватель';
    // Fallback: show first known role if present
    return normalizedRoles[0] || '';
  })();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    clearAuth();
    clearBreadcrumbs();
    setIsMenuOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="layout">
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Меню</h3>
          <button className="close-btn" onClick={toggleMenu}>&times;</button>
        </div>
        <div className="user-info-sidebar">
          {roleTitle && <p>{roleTitle}</p>}
          {fullName && <p>{fullName}</p>}
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/app" onClick={() => {
                toggleMenu();
                clearBreadcrumbs();
              }}>Моё расписание</Link>
            </li>
            <li>
              <Link to="/app/schedule-search" onClick={toggleMenu}>Поиск расписания</Link>
            </li>
            {!isStudent && (
              <>
                <li>
                  <Link to="/app/attendance" onClick={toggleMenu}>Посещаемость</Link>
                </li>
                <li>
                  <Link to="/app/disciplines" onClick={toggleMenu}>Дисциплины</Link>
                </li>
                <li>
                  <Link to="/app/reports" onClick={toggleMenu}>Отчеты</Link>
                </li>
                <li>
                  <Link to="/app/chats" onClick={toggleMenu}>Чаты</Link>
                </li>
              </>
            )}
            <li className="logout">
              <button type="button" className="logout-btn" onClick={handleLogout}>Выйти</button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <header>
          <button className="menu-toggle" onClick={toggleMenu}>
            Меню
          </button>
        </header>
        {breadcrumbs.length > 0 && (
          <nav className="breadcrumb">
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.path} className="breadcrumb-item">
                <button
                  className="breadcrumb-link"
                  onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                >
                  {breadcrumb.label}
                </button>
                {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator"> → </span>}
              </div>
            ))}
          </nav>
        )}
        <main>
          <Outlet />
        </main>
      </div>
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default Layout;

