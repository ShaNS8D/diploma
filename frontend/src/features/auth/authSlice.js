import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../api/api';
import { handleAsyncError } from '../error/errorSlice';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  authChecked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;
      state.authChecked = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.authChecked = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

export const { setAuth, clearAuth, setLoading, setAuthChecked } = authSlice.actions;

const processAuthError = (error, dispatch, defaultMessage) => {
  const errorData = error.response?.data || { message: error.message || defaultMessage };
  dispatch(handleAsyncError(errorData));
  return { success: false, error: errorData };
};

export const checkAuth = () => async (dispatch) => {
  try {
    const response = await authAPI.getUsers(); 
    console.log('checkAuth', response)
    dispatch(setAuth({
      user: response.data.user,
      isAdmin: response.data.user.is_admin,
    }));
    return { success: true };
  } catch (error) {
    dispatch(clearAuth());
    return processAuthError(error, dispatch, 'Ошибка проверки аутентификации');
  } finally {
    dispatch(setAuthChecked());
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await authAPI.register(userData);
    const loginResponse = await authAPI.login({
      username: userData.username,
      password: userData.password
    });
    dispatch(setAuth({
      user: loginResponse.data.user,
      isAdmin: loginResponse.data.user.is_admin,
    }));
    return { success: true };
  } catch (error) {
    return processAuthError(error, dispatch, 'Регистрация не удалась');
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authAPI.login(credentials);
    dispatch(setAuth({
      user: response.data.user,
      isAdmin: response.data.user.is_admin,
    }));
    return { success: true };
  } catch (error) {
    return processAuthError(error, dispatch, 'Вход в систему не удался');
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authAPI.logout();
    dispatch(clearAuth());
    return { success: true };
  } catch (error) {
    return processAuthError(error, dispatch, 'Ошибка при выходе из системы');
  }
};

export default authSlice.reducer;