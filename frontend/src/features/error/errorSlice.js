import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      return {
        status: action.payload.status || 0,
        message: action.payload.message || 'Неизвестная ошибка',
        ...action.payload,
      };
    },
    clearError: () => initialState,
  },
});

export const { setError, clearError } = errorSlice.actions;

export const handleAsyncError = (error) => (dispatch) => {
  const normalizedError = typeof error === 'string' 
    ? { message: error } 
    : error;

  const errorData = {
    status: normalizedError.status || 500,
    message: normalizedError.message || 'Ошибка сервера',
    ...normalizedError,
  };

  dispatch(setError(errorData));
  return Promise.reject(errorData);
};

export default errorSlice.reducer;