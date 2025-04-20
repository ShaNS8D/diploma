import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, authChecked } = useSelector((state) => state.auth);
  // console.log('isAuthenticated', isAuthenticated)
  // console.log('print', isAdmin)
  // console.log('authChecked', authChecked)
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkAuth());
    }
  }, [dispatch, authChecked]);

  if (!authChecked) {
    return <div>Проверка подлинности...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;