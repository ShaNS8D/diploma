import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearSuccess } from '../features/success/successSlice';

const SuccessHandler = () => {
  const success = useSelector((state) => state.success);
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleClose = () => {
    setShowSuccess(false);
    dispatch(clearSuccess());
  };

  const renderSuccessDetails = () => {
    if (!success.details || !success.details.detail) return null;

    return (
      <div className="success-details">
        <div className="success-detail">{success.details.detail}</div>
      </div>
    );
  };

  if (!success || !showSuccess) return null;

  return (
    <div className="success-container">
      <div className="success-content">
        <h3>Success {success.status || 'Unknown'}</h3>
        <p>{success.message}</p>
        {renderSuccessDetails()}
        <button onClick={handleClose} className="success-close">×</button>
      </div>
    </div>
  );
};

export default SuccessHandler;