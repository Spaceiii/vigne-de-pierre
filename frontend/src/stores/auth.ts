import { defineStore } from 'pinia';
import { postRequest } from '@/services/axios';

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),

  actions: {
    async login(email: string, password: string) {
      const res = await postRequest('/login', { email, password });
      if (!res.error) {
        const token = res.data.token;
        this.token = token;
        localStorage.setItem('token', token);
        this.decodeToken(token);
      } else {
        throw new Error(res.data);
      }
    },

    async register(data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) {
      const res = await postRequest('/register', data);
      if (!res.error) {
        const token = res.data.token;
        this.token = token;
        localStorage.setItem('token', token);
        this.decodeToken(token);
      } else {
        throw new Error(res.data);
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },

    decodeToken(token: string) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.user = {
          id: payload.id,
          email: payload.email,
          isAdmin: payload.isAdmin,
        };
      } catch {
        this.logout();
      }
    },

    checkStoredToken() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.decodeToken(token);
      }
    },
  },
});
