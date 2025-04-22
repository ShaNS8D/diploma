import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../features/error/errorSlice';



const ErrorHandler = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  
  const getSeverityClass = (error) => {
    if (!error.status) return 'error-generic';       // Общие ошибки (нет статуса)
    if (error.status >= 500) return 'error-server';  // Ошибки сервера (5xx)
    if (error.status === 401) return 'error-unauthorized'; // Не авторизован
    if (error.status === 403) return 'error-forbidden';    // Доступ запрещен
    if (error.status === 404) return 'error-not-found';    // Не найдено
    return 'error-client';                          // Клиентские ошибки (4xx)
  };
  useEffect(() => {
    if (error) {
      // console.log('ErrorHandler', error);
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

  const renderErrors = () => {
    if (!error.details) return null;
    
    return (
      <div className="error-details">
        {error.details.form && (
          <ul className="form-errors">
            {Object.entries(error.details.form).map(([field, message]) => {
              return (
                <li key={field}>
                  <strong>{field}:</strong> {typeof message === 'string' ? message : JSON.stringify(message)}
                </li>
              );
            })}
          </ul>
        )}
        {error.details.api && (
          <ul className="api-errors">
            {Object.entries(error.details.api).map(([field, messages], index) => {
              console.log('Rendering field:', field, 'with messages:', messages); // Логирование
              return (
                <li key={`${field}-${index}`}>
                  <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : String(messages)}
                </li>
              );
            })}
          </ul>
        )}
        {error.details.raw?.detail && (
          <div className="api-detail-error">
            {error.details.raw.detail}
          </div>
        )}
        {error.details.raw && !error.details.form && !error.details.api && (
          <div className="raw-error">{JSON.stringify(error.details.raw)}</div>
        )}
      </div>
    );
  };

  if (!error || !showError) return null;

  return (
    <div className={`error-container ${getSeverityClass(error)}`}>
      <div className="error-content">
        <h3>Error {error.status || 'Unknown'}</h3>
        <p>{error.message}</p>
        {renderErrors()}
        <button onClick={handleClose} className="error-close">×</button>
      </div>
    </div>
  );
};


export default ErrorHandler;