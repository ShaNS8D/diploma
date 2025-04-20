import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, setError } from '../features/error/errorSlice';

const ErrorHandler = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  // console.log('Current error in ErrorHandler:', error);

  useEffect(() => {
    if (error) {
      setShowError(true);
      // const timer = setTimeout(() => {
      //   handleClose();
      // // }, 6000);
      // return () => clearTimeout(timer);
    }
  }, [error]);
  const triggerTestError = () => {
    dispatch(setError({
      status: 400,
      message: "Тестовая ошибка",
      data: { detail: "Тестовое сообщение об ошибке" }
    }));
  };

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
    <>    
    <button 
        onClick={triggerTestError}
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
      >
        Тест ошибки
      </button>
    <div className={`error-container ${getErrorClass()}`}>
      <div className="error-content">
        <h3>Error {error.status || 'Unknown'}</h3>
        <p>{error.message || 'Something went wrong'}</p>
        {error.data?.errors && (
          <ul className="error-details">
            {Object.entries(error.data.errors).map(([field, messages]) => (
              <li key={field}>
                <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleClose} className="error-close">
          &times;
        </button>
      </div>
    </div>
    </>
  );
};

export default ErrorHandler;