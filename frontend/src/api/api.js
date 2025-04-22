import axios from 'axios';
import { handleAsyncError } from '../features/error/errorSlice';
import { handleAsyncSuccess } from '../features/success/successSlice';

const API_BASE_URL = 'http://localhost:8000/api/v1/';

let _store;

export const injectStore = (store) => {
  _store = store;
};

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

const normalizeError = (error) => {  
  if (error.validationErrors) {
    return {
      status: error.status || 422,
      message: error.message || 'Ошибка валидации',
      details: {
        form: error.validationErrors,
      },
    };
  }
  if (error.response) {
    const { status, data } = error.response;
    let message = 'Произошла ошибка';
    if (data.detail) {
      message = data.detail;
    } else if (data.errors) {
      message = Object.values(data.errors).flat().join(', ');
    }    
    return {
      status,
      message,
      details: {
        ...(data.errors && { api: data.errors }),
        raw: data,
      },
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'Сервер не отвечает. Проверьте подключение к интернету',
    };
  } else {
    return {
      status: -1,
      message: error.message || 'Неизвестная ошибка',
    };
  }
};

api.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    } else {
      console.warn('CSRF Token not found in cookies');
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const allowedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (
      response.status >= 200 &&
      response.status < 300 &&
      allowedMethods.includes(response.config.method?.toUpperCase()) &&
      _store
    ) {
      _store.dispatch(handleAsyncSuccess(response));
    }
    return response;
  },
  (error) => {
    const normalizedError = normalizeError(error);
    if (_store) {
      _store.dispatch(handleAsyncError(normalizedError));
    } else {
      console.error('Store not initialized! Error:', normalizedError);
    }
    return Promise.reject(normalizedError);
  }
);

export const authAPI = {
  checkAuth: () => api.get('users/auth/check/'),
  register: (data) => api.post('users/register/', data),
  login: (data) => api.post('users/login/', data),
  logout: () => api.post('users/logout/'),
  getUsers: () => api.get('users/'),
  updateDataUser: (id, data) => {
    // console.log("Отправляем PATCH-запрос:");
    // console.log("URL:", `users/${id}/update/`);
    // console.log("Тело запроса (data):", data);
    return api.patch(`users/${id}/update/`, data);
  },
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