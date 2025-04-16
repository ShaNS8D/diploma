import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import filesReducer from './files/filesSlice';
import usersReducer from './users/usersSlice';
import errorReducer from './error/errorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    users: usersReducer,
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});