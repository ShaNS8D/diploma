import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import filesReducer from './files/filesSlice';
import usersReducer from './users/usersSlice';
import errorReducer from './error/errorSlice';
import successReducer from './success/successSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    users: usersReducer,
    error: errorReducer,
    success: successReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});