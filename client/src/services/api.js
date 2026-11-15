import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinebook_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized or expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear storage if needed
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Option to broadcast or log
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Movies Services
export const moviesAPI = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  getShows: (id, params) => api.get(`/movies/${id}/shows`, { params }),
};

// Theatres Services
export const theatresAPI = {
  getAll: (params) => api.get('/theatres', { params }),
  getCities: () => api.get('/theatres/cities'),
  getById: (id) => api.get(`/theatres/${id}`),
};

// Shows Services
export const showsAPI = {
  getAll: (params) => api.get('/shows', { params }),
  getById: (id) => api.get(`/shows/${id}`),
};

// Bookings Services
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.post(`/bookings/${id}/cancel`),
};

// Admin Services
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  createMovie: (data) => api.post('/admin/movies', data),
  updateMovie: (id, data) => api.put(`/admin/movies/${id}`, data),
  deleteMovie: (id) => api.delete(`/admin/movies/${id}`),
  createTheatre: (data) => api.post('/admin/theatres', data),
  updateTheatre: (id, data) => api.put(`/admin/theatres/${id}`, data),
  deleteTheatre: (id) => api.delete(`/admin/theatres/${id}`),
  createScreen: (data) => api.post('/admin/screens', data),
  updateScreen: (id, data) => api.put(`/admin/screens/${id}`, data),
  deleteScreen: (id) => api.delete(`/admin/screens/${id}`),
  createShow: (data) => api.post('/admin/shows', data),
  updateShow: (id, data) => api.put(`/admin/shows/${id}`, data),
  deleteShow: (id) => api.delete(`/admin/shows/${id}`),
  getAllBookings: (params) => api.get('/admin/bookings', { params }),
};

export default api;
