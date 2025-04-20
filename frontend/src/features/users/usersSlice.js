import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from '../../api/api';

const initialState = {
  users: [],
  loading: false,
  error: null,
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
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUsers, removeUser, updateUser, setLoading, setError } = usersSlice.actions;

export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authAPI.getUsers();
    dispatch(setUsers(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data || error.message));
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
    dispatch(setError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export const toggleAdminStatus = (id, isAdmin) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authAPI.updateDataUser(id, {is_admin: isAdmin });
    // console.log(response.data);
    dispatch(updateUser(response.data.user));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export default usersSlice.reducer;