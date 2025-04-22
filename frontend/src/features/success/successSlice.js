import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const successSlice = createSlice({
  name: 'success',
  initialState,
  reducers: {
    setSuccess: (state, action) => {
      return {
        status: action.payload.status || 200,
        message: action.payload.message || 'Успешная операция',
        details: action.payload.details || {},
      };
    },
    clearSuccess: () => initialState,
  },
});

export const { setSuccess, clearSuccess } = successSlice.actions;

export const handleAsyncSuccess = (response) => (dispatch) => {
  const successDetails = response.data || {};
  const normalizedSuccess = {
    status: response.status || 200,
    message: successDetails.detail || 'Операция выполнена успешно',
    details: {
      detail: successDetails.detail || null,
    },
  };
  dispatch(setSuccess(normalizedSuccess));
};

export default successSlice.reducer;