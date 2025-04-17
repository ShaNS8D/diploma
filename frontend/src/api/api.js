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
  checkAuth: () => api.get('users/check-auth/'),// endpoint для проверки сессии
};

export const fileAPI = {
  uploadFile: (formData) => api.post('cloud/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getFiles: (params = {}) => api.get('cloud/', { params }),
  downloadFile: (id) => api.get(`cloud/${id}/download/`, { responseType: 'blob' }),
  deleteFile: (id) => api.delete(`cloud/${id}/delete/`),
  renameFile: (id, newName) => api.patch(`cloud/${id}/rename/`, { new_name: newName }),
  updateComment: (id, comment) => api.patch(`cloud/${id}/comment/`, { comment }),
  getPublicLink: (id) => api.get(`cloud/${id}/public-link/`),
  downloadByPublicLink: (link) => api.get(`cloud/public/${link}/download/`, { responseType: 'blob' }),
};

export default api;