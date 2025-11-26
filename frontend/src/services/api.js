import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Tournament API
export const tournamentAPI = {
  getAll: () => api.get('/tournaments'),
  getById: (id) => api.get(`/tournaments/${id}`),
  getMy: () => api.get('/tournaments/my'),
  create: (data) => api.post('/tournaments', data),
  update: (id, data) => api.put(`/tournaments/${id}`, data),
  delete: (id) => api.delete(`/tournaments/${id}`),
  generateSchedule: (tournamentId, divisionId) => 
    api.post(`/tournaments/${tournamentId}/divisions/${divisionId}/generate-schedule`),
};

// Team API
export const teamAPI = {
  getByTournament: (tournamentId) => api.get(`/tournaments/${tournamentId}/teams`),
  getById: (id) => api.get(`/tournaments/0/teams/${id}`),
  create: (tournamentId, data) => api.post(`/tournaments/${tournamentId}/teams`, data),
  update: (id, data) => api.put(`/tournaments/0/teams/${id}`, data),
  delete: (id) => api.delete(`/tournaments/0/teams/${id}`),
};

// Division API
export const divisionAPI = {
  getByTournament: (tournamentId) => api.get(`/tournaments/${tournamentId}/divisions`),
  getById: (id) => api.get(`/tournaments/0/divisions/${id}`),
  create: (tournamentId, data) => api.post(`/tournaments/${tournamentId}/divisions`, data),
  update: (id, data) => api.put(`/tournaments/0/divisions/${id}`, data),
  delete: (id) => api.delete(`/tournaments/0/divisions/${id}`),
};

// Match API
export const matchAPI = {
  getByDivision: (tournamentId, divisionId) => 
    api.get(`/tournaments/${tournamentId}/divisions/${divisionId}/matches`),
  getById: (tournamentId, id) => api.get(`/tournaments/${tournamentId}/matches/${id}`),
  updateResult: (tournamentId, id, data) => 
    api.put(`/tournaments/${tournamentId}/matches/${id}/result`, data),
};

// Public API
export const publicAPI = {
  getTournaments: () => api.get('/public/tournaments'),
  getTournament: (id) => api.get(`/public/tournaments/${id}`),
  getTeams: (tournamentId) => api.get(`/public/tournaments/${tournamentId}/teams`),
  getDivisions: (tournamentId) => api.get(`/public/tournaments/${tournamentId}/divisions`),
  getMatches: (divisionId) => api.get(`/public/divisions/${divisionId}/matches`),
};

export default api;
