import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (typeof window !== 'undefined') localStorage.setItem('token', res.data.access_token);
    return res.data;
  },
  signup: async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    return res.data;
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
  }
};

export const sessions = {
  create: async (role, difficulty) => {
    const res = await api.post('/sessions', { role, difficulty });
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/sessions');
    return res.data;
  },
  getOne: async (id) => {
    const res = await api.get(`/sessions/${id}`);
    return res.data;
  },
  getResults: async (id) => {
    const res = await api.get(`/sessions/${id}/results`);
    return res.data;
  }
};

export const answers = {
  submit: async (questionId, userAnswer) => {
    const res = await api.post('/answers', { question_id: questionId, user_answer: userAnswer });
    return res.data;
  }
};
