import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      if (state && state.status) {
        return state;
      }
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
  // console.error('Error:', error);

  const errorDetails = error.details || {
    ...(error.validationErrors && { form: error.validationErrors }),
    ...(error.response?.data?.errors && { api: error.response.data.errors }),
    ...(error.response?.data && typeof error.response.data === 'object' && { raw: error.response.data })
  };

  const normalizedError = {
    status: error.status || error.response?.status || 500,
    message: error.message || error.response?.data?.detail || 'Произошла ошибка',
    details: errorDetails,
    originalError: error
  };

  dispatch(setError(normalizedError));
};

export default errorSlice.reducer;