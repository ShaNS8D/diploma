import React, { useEffect } from 'react';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { injectStore  } from './api/api';
import { store } from './features/store';
import ProtectedRoute from './hoc/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FileStoragePage from './pages/FileStoragePage';
import EditFilePage from './pages/EditFilePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import './App.css';

injectStore(store);
const AppWrapper = () => {
  
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App = () => {

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
    </>
  );
};

export default AppWrapper;