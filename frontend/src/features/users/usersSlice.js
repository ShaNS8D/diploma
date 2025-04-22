import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../api/api';
import { handleAsyncError } from '../error/errorSlice';

const initialState = {
  users: [],
  loading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUsers, removeUser, updateUser, setLoading } = usersSlice.actions;

const processError = (error, dispatch) => {
  const errorData = error.response?.data || error.message;
  dispatch(handleAsyncError(errorData));
  return { success: false, error: errorData };
};

export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authAPI.getUsers();
    dispatch(setUsers(response.data));
    return { success: true };
  } catch (error) {
    return processError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await authAPI.deleteUser(id);
    dispatch(removeUser(id));
    return { success: true };
  } catch (error) {
    return processError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export const toggleAdminStatus = (id, isAdmin) => async (dispatch) => {
  try {    
    dispatch(setLoading(true));
    
    const response = await authAPI.updateDataUser(id, { is_admin: isAdmin });
    dispatch(updateUser(response.data.user));
    return { success: true };
  } catch (error) {
    return processError(error, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

export default usersSlice.reducer;