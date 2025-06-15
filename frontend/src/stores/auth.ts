import { defineStore } from 'pinia';
import { postRequest, AUTH_EVENTS } from '@/services/axios';

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
    // Flag to track if event listeners are already set up
    _listenersInitialized: false,

    setupEventListeners() {
      // Only set up listeners once
      if (this._listenersInitialized) {
        return;
      }

      // Use an arrow function to preserve the 'this' context
      window.addEventListener(AUTH_EVENTS.LOGOUT, () => {
        console.log('Received logout event from axios');
        this.user = null;
        this.token = null;
      });

      this._listenersInitialized = true;
      console.log('Event listener for AUTH_EVENTS.LOGOUT set up');
    },
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

    isTokenExpired(token: string): boolean {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expirationTime;
      } catch {
        return true; // If we can't decode the token, consider it expired
      }
    },

    decodeToken(token: string) {
      try {
        // Check if token is expired before decoding
        if (this.isTokenExpired(token)) {
          console.warn('Token is expired');
          this.logout();
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        this.user = {
          id: payload.id,
          email: payload.email,
          isAdmin: payload.isAdmin,
        };
      } catch {
        console.error('Failed to decode token');
        this.logout();
      }
    },

    checkStoredToken() {
      // Set up event listeners if not already set up
      this.setupEventListeners();

      const token = localStorage.getItem('token');
      if (token) {
        // Check if token is expired before using it
        if (this.isTokenExpired(token)) {
          console.warn('Stored token is expired');
          this.logout();
          return;
        }

        this.token = token;
        this.decodeToken(token);
      }
    },
  },
});
