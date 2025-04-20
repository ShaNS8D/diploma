import axios from 'axios';

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


const handleError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const errorMessage = data.message || `Запрос не выполнен с кодом состояния ${status}`;
    return Promise.reject({ status, message: errorMessage, data });
  } else if (error.request) {
    return Promise.reject({ status: 0, message: 'Нет ответа от сервера' });
  } else {
    return Promise.reject({ status: -1, message: error.message });
  }
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

// api.interceptors.request.use(async (config) => {
//   if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
//     const { data: { csrfToken } } = await authAPI.getCSRFToken();
//     config.headers['X-CSRFToken'] = csrfToken;
//     console.log('api.interceptors',csrfToken)
//   }
//   return config;
// });

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
  // getCSRFToken: () => api.get('users/get-csrf-token/')
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
  updateDataFile: (id, data) => api.patch(`cloud/${id}/`, data),
  getPublicLink: (id) => api.get(`cloud/${id}/share/`),
};

export default api;