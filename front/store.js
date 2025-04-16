import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import filesReducer from './features/files/filesSlice';
import usersReducer from './features/users/usersSlice';
import foldersReducer from './features/folders/foldersSlice';
import errorReducer from './features/error/errorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    users: usersReducer,
    folders: foldersReducer,
    error: errorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});