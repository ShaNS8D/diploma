import { createSlice } from '@reduxjs/toolkit';
import { fileAPI } from '../../api/api';
import { handleAsyncError } from '../error/errorSlice';

const initialState = {
  files: [],
  currentFolderFiles: [],
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
    setCurrentFolderFiles: (state, action) => {
      state.currentFolderFiles = action.payload;
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
        state.files[index] = { ...state.files[index], ...action.payload };
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

export const fetchFiles = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.getFiles();
    dispatch(setFiles(response.data));
  } catch (error) {
    dispatch(handleAsyncError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchFilesInFolder = (folderId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.getFiles({ folder: folderId });
    dispatch(setCurrentFolderFiles(response.data));
  } catch (error) {
    dispatch(handleAsyncError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const uploadFile = (formData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.uploadFile(formData);
    dispatch(addFile(response.data));
    if (formData.get('folder')) {
      dispatch(fetchFilesInFolder(formData.get('folder')));
    }    
    return { success: true };
  } catch (error) {
    dispatch(handleAsyncError(error));
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
    dispatch(setError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export const renameFile = (id, newName) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.renameFile(id, newName);
    dispatch(updateFile(response.data));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateFileComment = (id, comment) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fileAPI.updateComment(id, comment);
    dispatch(updateFile(response.data));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data || error.message));
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
    dispatch(setError(error.response?.data || error.message));
    return { success: false, error: error.response?.data };
  } finally {
    dispatch(setLoading(false));
  }
};

export default filesSlice.reducer;
