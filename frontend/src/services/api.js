import axios from 'axios';

// Use relative URL to leverage Vite proxy (configured in vite.config.js)
// The proxy forwards /api/* requests to http://localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// List of public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/public'];

// Add token to requests (except public endpoints)
api.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
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
  copy: (id, includeTeams = false) => api.post(`/tournaments/${id}/copy?includeTeams=${includeTeams}`),
  generateSchedule: (tournamentId, divisionId) => 
    api.post(`/tournaments/${tournamentId}/divisions/${divisionId}/generate-schedule`),
};

// Team API
export const teamAPI = {
  getByTournament: (tournamentId) => api.get(`/tournaments/${tournamentId}/teams`),
  getById: (tournamentId, id) => api.get(`/tournaments/${tournamentId}/teams/${id}`),
  create: (tournamentId, data) => api.post(`/tournaments/${tournamentId}/teams`, data),
  update: (tournamentId, id, data) => api.patch(`/tournaments/${tournamentId}/teams/${id}`, data),
  delete: (tournamentId, id) => api.delete(`/tournaments/${tournamentId}/teams/${id}`),
};

// Division API
export const divisionAPI = {
  getByTournament: (tournamentId) => api.get(`/tournaments/${tournamentId}/divisions`),
  getById: (tournamentId, id) => api.get(`/tournaments/${tournamentId}/divisions/${id}`),
  create: (tournamentId, data) => api.post(`/tournaments/${tournamentId}/divisions`, data),
  update: (tournamentId, id, data) => api.put(`/tournaments/${tournamentId}/divisions/${id}`, data),
  delete: (tournamentId, id) => api.delete(`/tournaments/${tournamentId}/divisions/${id}`),
};

// Match API
export const matchAPI = {
  getByDivision: (tournamentId, divisionId) => 
    api.get(`/tournaments/${tournamentId}/divisions/${divisionId}/matches`),
  getById: (tournamentId, id) => api.get(`/tournaments/${tournamentId}/matches/${id}`),
  updateResult: (tournamentId, id, data) => 
    api.put(`/tournaments/${tournamentId}/matches/${id}/result`, data),
  updateSchedule: (tournamentId, id, data) =>
    api.put(`/tournaments/${tournamentId}/matches/${id}/schedule`, data),
};

// Player API
export const playerAPI = {
  // New endpoints matching PlayerController
  getByTeam: (tournamentId, teamId) => api.get(`/tournaments/${tournamentId}/teams/${teamId}/players`),
  create: (tournamentId, teamId, data) => api.post(`/tournaments/${tournamentId}/teams/${teamId}/players`, data),
  bulkCreate: (tournamentId, teamId, players) => api.post(`/tournaments/${tournamentId}/teams/${teamId}/players/bulk`, players),
  
  // Legacy endpoints (keep for backwards compatibility if needed)
  getByTournament: (tournamentId) => api.get(`/tournaments/${tournamentId}/players`),
  getById: (id) => api.get(`/players/${id}`),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  getTopScorers: (tournamentId, limit = 10) => 
    api.get(`/tournaments/${tournamentId}/top-scorers?limit=${limit}`),
  updateStats: (id, stats) => 
    api.patch(`/players/${id}/stats`, null, { params: stats }),
};

// Referee API
export const refereeAPI = {
  getByTournament: (tournamentId) => api.get(`/tournaments/${tournamentId}/referees`),
  create: (tournamentId, data) => api.post(`/tournaments/${tournamentId}/referees`, data),
  bulkCreate: (tournamentId, referees) => api.post(`/tournaments/${tournamentId}/referees/bulk`, referees),
  update: (tournamentId, id, data) => api.patch(`/tournaments/${tournamentId}/referees/${id}`, data),
  delete: (tournamentId, id) => api.delete(`/tournaments/${tournamentId}/referees/${id}`),
};

// Administrator API
export const administratorAPI = {
  getByTournament: (tournamentId) => api.get(`/tournaments/${tournamentId}/administrators`),
  create: (tournamentId, data) => api.post(`/tournaments/${tournamentId}/administrators`, data),
  delete: (tournamentId, id) => api.delete(`/tournaments/${tournamentId}/administrators/${id}`),
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
