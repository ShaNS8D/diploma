import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../features/error/errorSlice';

const ErrorHandler = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleClose = () => {
    setShowError(false);
    dispatch(clearError());
  };

  if (!error || !showError) return null;

  const getErrorClass = () => {
    if (!error.status) return 'error';
    if (error.status >= 500) return 'error-server';
    if (error.status === 401) return 'error-unauthorized';
    if (error.status === 403) return 'error-forbidden';
    return 'error-client';
  };

  return (
    <div className={`error-container ${getErrorClass()}`}>
      <div className="error-content">
        <h3>Error {error.status || 'Unknown'}</h3>
        <p>{error.message || 'Something went wrong'}</p>
        <button onClick={handleClose} className="error-close">
          &times;
        </button>
      </div>
    </div>
  );
};

export default ErrorHandler;