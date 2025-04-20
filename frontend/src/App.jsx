import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './features/store';
// import { authAPI } from './api/api';
import ProtectedRoute from './hoc/ProtectedRoute';
// import ErrorHandler from './hoc/ErrorHandler';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FileStoragePage from './pages/FileStoragePage';
import EditFilePage from './pages/EditFilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import { checkAuth } from './features/auth/authSlice';
import './App.css';

const AppWrapper = () => {

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'register',
          element: <RegisterPage />,
        },
        {
          path: 'storage',
          element: (
            <ProtectedRoute>
              <FileStoragePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'storage/edit/:fileId',
          element: (
            <ProtectedRoute>
              <EditFilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'admin',
          element: (
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      {/* <ErrorHandler /> */}
    </>
  );
};

export default AppWrapper;