import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '');

// Helper to convert snake_case to camelCase
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(value);
    }
    return result;
  }
  return obj;
};

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and snake_case to camelCase conversion
client.interceptors.response.use(
  (response) => {
    // Convert snake_case to camelCase
    const converted = toCamelCase(response.data);
    response.data = converted;
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      window.location.href = '/login';
    }
    const isEmptySavedBasket =
      error.response?.status === 404 && error.config?.url?.startsWith('/api/basket');

    if (!isEmptySavedBasket) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default client;
