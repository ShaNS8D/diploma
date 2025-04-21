import { createSlice } from '@reduxjs/toolkit';
import { fileAPI } from '../../api/api';
import { handleAsyncError } from '../error/errorSlice';

const initialState = {
  files: [],
  loading: false,
  error: null,
  currentFile: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    addFile: (state, action) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(file => file.id !== action.payload);
    },
    updateFile: (state, action) => {
      const index = state.files.findIndex(file => file.id === action.payload.id);
      if (index !== -1) {
        state.files[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
  },
});

export const {
  setFiles,
  addFile,
  removeFile,
  updateFile,
  setLoading,
  setError,
  setCurrentFile
} = filesSlice.actions;

export const fetchFiles = (params = {}) => async (dispatch) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const response = await fileAPI.getFiles(params);
    dispatch(setFiles(response.data));
  } catch (error) {
    dispatch(handleAsyncError(error.response?.data || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const uploadFile = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.uploadFile(formData);
    dispatch(addFile(response.data));
    return { success: true };
  } catch (error) {
    dispatch(handleAsyncError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteFile = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await fileAPI.deleteFile(id);
    dispatch(removeFile(id));
    return { success: true };
  } catch (error) {
    dispatch(handleAsyncError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateDataFile = (id, newData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.updateFile(id, newData);
    dispatch(updateFile(response.data));
    return { success: true };
  } catch (error) {
    dispatch(handleAsyncError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export const generatePublicLink = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.getPublicLink(id);
    const { share_url } = response.data;
    return { success: true, link: share_url };
  } catch (error) {
    dispatch(setError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export default filesSlice.reducer;
