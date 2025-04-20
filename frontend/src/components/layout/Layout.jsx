import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';
import ErrorHandler from '../../hoc/ErrorHandler';
import { useDispatch } from 'react-redux';
import './Layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <h1 className="logo">Облачное хранилище</h1>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/storage" className="nav-link">
                  Мое хранилище
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link">
                    Админ
                  </Link>
                )}
                <button onClick={handleLogout} className="nav-button">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Вход
                </Link>
                <Link to="/register" className="nav-link">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <ErrorHandler />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;