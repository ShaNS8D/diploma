import { createSlice } from '@reduxjs/toolkit';
import { fileAPI } from '../../api/api';
import { handleAsyncError } from '../error/errorSlice';

const initialState = {
  files: [],
  loading: false,
  error: null,
  currentFile: null,
  publicLinks: {},
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
    setPublicLink: (state, action) => {
      state.publicLinks[action.payload.id] = action.payload.link;
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
  setCurrentFile,
  setPublicLink,
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

export const updateDataFile = (id, newName) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.updateDataFile(id, newName);
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
    dispatch(setPublicLink({ id, link: response.data.public_link }));
    return { success: true, link: response.data.public_link };
  } catch (error) {
    dispatch(handleAsyncError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export default filesSlice.reducer;
