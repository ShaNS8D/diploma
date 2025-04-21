import axios from 'axios';
import { store } from '../features/store';
import { handleAsyncError } from '../features/error/errorSlice';

const API_BASE_URL = 'http://localhost:8000/api/v1/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const handleError = (error) => (dispatch) => {
  let rejectedError;
  if (error.response) {
    const { status, data } = error.response;
    let userFriendlyMessage = 'Произошла ошибка';
    if (data.detail) {
      userFriendlyMessage = data.detail;
    } else if (data.errors?.non_field_errors) {
      userFriendlyMessage = data.errors.non_field_errors.join(', ');
    } else if (data.non_field_errors) {
      userFriendlyMessage = Array.isArray(data.non_field_errors) 
        ? data.non_field_errors.join(', ') 
        : data.non_field_errors;
    } else if (typeof data === 'object') {
      const fieldErrors = Object.entries(data)
        .filter(([key]) => key !== 'status' && key !== 'detail')
        .map(([key, value]) => {
          const errorText = Array.isArray(value) ? value.join(', ') : value;
          return `${key}: ${errorText}`;
        });      
      if (fieldErrors.length > 0) {
        userFriendlyMessage = fieldErrors.join('; ');
      }
    }
    rejectedError = {
      status,
      message: userFriendlyMessage,
      originalMessage: error.message,
      data,
      isServerError: true,
    };
  } else if (error.request) {
    rejectedError = { 
      status: 0, 
      message: 'Сервер не отвечает. Пожалуйста, проверьте подключение к интернету',
    };
  } else {
    rejectedError = { 
      status: -1, 
      message: error.message || 'Произошла неизвестная ошибка',
    };
  }
  return dispatch(handleAsyncError(rejectedError));
};

api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
      // console.log('CSRF Token added:', csrfToken);
    } else {
      console.warn('CSRF Token not found in cookies');
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => store.dispatch(handleError(error)) 
);

export const authAPI = {
  register: (data) => api.post('users/register/', data),
  login: (data) => api.post('users/login/', data),
  logout: () => api.post('users/logout/'),
  getUsers: () => api.get('users/'),
  updateDataUser: (id, data) => api.patch(`users/${id}/update/`, data),
  deleteUser: (id) => api.delete(`users/${id}/delete/`)
};

export const fileAPI = {
  uploadFile: (formData) => api.post('cloud/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getFiles: (params = {}) => api.get('cloud/', { params }),
  downloadFile: (id) => api.get(`cloud/${id}/download/`, { responseType: 'blob' }),
  deleteFile: (id) => api.delete(`cloud/${id}/`),
  updateFile: (id, data) => api.patch(`cloud/${id}/`, data),
  getPublicLink: (id) => api.get(`cloud/share/${id}/?info=true`),
};

export default api;