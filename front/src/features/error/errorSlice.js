import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      return {
        status: action.payload.status || 0,
        message: action.payload.message || 'Unknown error',
        ...action.payload,
      };
    },
    clearError: () => {
      return null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;


export const handleAsyncError = (error) => (dispatch) => {
  const errorData = {
    status: error.status || 500,
    message: error.message || 'Server error',
    ...error,
  };
  dispatch(setError(errorData));
  return Promise.reject(errorData);
};

export default errorSlice.reducer;