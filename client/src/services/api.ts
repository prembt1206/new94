import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Clear token on 401 if not already on login page
      localStorage.removeItem('mindguard_token');
      localStorage.removeItem('mindguard_user');
    }
    return Promise.reject(error);
  }
);

export interface CheckInPayload {
  moodScore: number;
  anxietyScore: number;
  sleepQuality: number;
  physicalTension: number;
  freeTextReflection?: string;
}

export const checkInApi = {
  submit: (data: CheckInPayload) => api.post('/check-ins', data).then(r => r.data),
  getHistory: (limit = 50) => api.get(`/check-ins/history?limit=${limit}`).then(r => r.data),
};

export const predictionApi = {
  getLatest: () => api.get('/predictions/latest').then(r => r.data),
  getTrends: (limit = 14) => api.get(`/predictions/trends?limit=${limit}`).then(r => r.data),
};

export const counselorApi = {
  getPatients: () => api.get('/counselor/patients').then(r => r.data),
  getPatientDetails: (id: string) => api.get(`/counselor/patient/${id}`).then(r => r.data),
  getAlerts: () => api.get('/counselor/alerts').then(r => r.data),
};

export const alertApi = {
  updateStatus: (id: string, status: 'pending' | 'acknowledged' | 'resolved') =>
    api.patch(`/alerts/${id}`, { status }).then(r => r.data),
  getAll: () => api.get('/alerts').then(r => r.data),
};

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials).then(r => r.data),
  register: (data: any) =>
    api.post('/auth/register', data).then(r => r.data),
  getMe: () =>
    api.get('/auth/me').then(r => r.data),
  updateSettings: (data: any) =>
    api.patch('/auth/settings', data).then(r => r.data),
};
