import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../api/api';

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

export const checkAuth = () => async (dispatch) => {
  try {
    const response = await authAPI.checkAuth();
    dispatch(setAuth({
      user: response.data.user,
      isAdmin: response.data.user.is_admin,
    }));
  } catch (error) {
    dispatch(clearAuth());
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authAPI.register(userData);
    dispatch(setAuth({
      user: response.data.user,
      isAdmin: response.data.user.is_admin,
    }));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || 'Registration failed' };
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
    return { success: false, error: error.message || 'Login failed' };
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await authAPI.logout();
    dispatch(clearAuth());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export default authSlice.reducer;