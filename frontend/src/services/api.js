import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login:  (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

export const expenseAPI = {
  submit:       (data) => api.post('/expenses', data),
  getMyExpenses:() => api.get('/expenses/my'),
  getTeam:      () => api.get('/expenses/team'),
};

export const approvalAPI = {
  getPending: ()          => api.get('/approvals/pending'),
  decide:     (id, data)  => api.post(`/approvals/${id}/decide`, data),
};

export const userAPI = {
  getAll:       ()            => api.get('/users'),
  create:       (data)        => api.post('/users', data),
  updateRole:   (id, role)    => api.patch(`/users/${id}/role`, { role }),
  setManager:   (id, mgrId)   => api.patch(`/users/${id}/manager`, { managerId: mgrId }),
};

export const companyAPI = {
  getCountries: () => api.get('/company/countries'),
  getRate:      (from, to) => api.get(`/company/rate?from=${from}&to=${to}`),
  createRule:   (data) => api.post('/company/rules', data),
};

export default api;
