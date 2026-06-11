import client from './client';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

export const authApi = {
  register: async (email: string, password: string, name?: string): Promise<AuthResponse> => {
    const response = await client.post('/api/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await client.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  me: async () => {
    const response = await client.get('/api/auth/me');
    return response.data;
  },

  changePassword: async (email: string, newPassword: string) => {
    const response = await client.post('/api/auth/change-password', {
      email,
      new_password: newPassword,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  },

  storeToken: (token: string, userId: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_id', userId);
  },

  getToken: () => localStorage.getItem('access_token'),
  getUserId: () => localStorage.getItem('user_id'),
};
