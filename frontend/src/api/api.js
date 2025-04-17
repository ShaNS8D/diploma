import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const errorMessage = data.message || `Request failed with status code ${status}`;
    return Promise.reject({ status, message: errorMessage, data });
  } else if (error.request) {
    return Promise.reject({ status: 0, message: 'Нет ответа от сервера' });
  } else {
    return Promise.reject({ status: -1, message: error.message });
  }
};

api.interceptors.response.use(
  response => response,
  error => handleError(error)
);


export const authAPI = {
  register: (data) => api.post('users/register/', data),
  login: (data) => api.post('users/login/', data),
  logout: () => api.post('users/logout/'),
  getUsers: () => api.get('users/'),
  deleteUser: (id) => api.delete(`users/${id}/delete/`),
  checkAuth: () => api.get('users/session-check/'),
};

export const fileAPI = {
  uploadFile: (formData) => api.post('cloud/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getFiles: (params = {}) => api.get('cloud/files/', { params }),
  downloadFile: (id) => api.get(`cloud/files/${id}/download/`, { responseType: 'blob' }),
  deleteFile: (id) => api.delete(`cloud/files/${id}/`),
  updateFile: (id, data) => api.patch(`cloud/files/${id}/`, data),
  getPublicLink: (id) => api.get(`cloud/files/${id}/share/`),
};

export default api;