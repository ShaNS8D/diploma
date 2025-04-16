import { createSlice } from '@reduxjs/toolkit';
import { folderAPI } from '../../api';
import { handleAsyncError } from '../error/errorSlice';

const initialState = {
  folders: [],
  currentFolder: null,
  loading: false,
  error: null,
};

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload;
    },
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    updateFolder: (state, action) => {
      const index = state.folders.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.folders[index] = { ...state.folders[index], ...action.payload };
      }
    },
    removeFolder: (state, action) => {
      state.folders = state.folders.filter(f => f.id !== action.payload);
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetFolders: () => initialState,
  },
});

export const {
  setFolders,
  addFolder,
  updateFolder,
  removeFolder,
  setCurrentFolder,
  setLoading,
  setError,
  resetFolders,
} = foldersSlice.actions;

export const fetchFolders = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await folderAPI.getFolders();
    dispatch(setFolders(response.data));
  } catch (error) {
    dispatch(handleAsyncError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createFolder = (name) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await folderAPI.createFolder(name);
    dispatch(addFolder(response.data));
    return { success: true, folder: response.data };
  } catch (error) {
    dispatch(handleAsyncError(error));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const editFolder = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await folderAPI.updateFolder(id, data);
    dispatch(updateFolder(response.data));
    return { success: true, folder: response.data };
  } catch (error) {
    dispatch(handleAsyncError(error));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteFolder = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await folderAPI.deleteFolder(id);
    dispatch(removeFolder(id));
    return { success: true };
  } catch (error) {
    dispatch(handleAsyncError(error));
    return { success: false, error: error.message };
  } finally {
    dispatch(setLoading(false));
  }
};

export const selectFolder = (id) => async (dispatch, getState) => {
  const { folders } = getState().folders;
  const folder = folders.find(f => f.id === id) || null;
  dispatch(setCurrentFolder(folder));
};

export default foldersSlice.reducer;