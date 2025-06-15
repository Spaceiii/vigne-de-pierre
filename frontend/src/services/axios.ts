import axios from 'axios';
import { type AxiosRequestConfig, type AxiosError } from 'axios';

// Utility function to check if a token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    return true; // If we can't decode the token, consider it expired
  }
}

// Custom event for auth state changes
export const AUTH_EVENTS = {
  LOGOUT: 'auth:logout',
};

// Utility function to handle logout
function handleLogout() {
  localStorage.removeItem('token');

  // Dispatch a custom event to notify the auth store
  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));

  // Redirect to login page if needed
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:3000/api',
});

// Request interceptor to validate token before attaching it
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Only attach token if it's not expired
    if (!isTokenExpired(token)) {
      console.log('Attaching token to request:', config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Token is expired, removing from localStorage');
      handleLogout();
    }
  } else {
    console.log('No token found for request:', config.url);
  }

  return config;
});

// Response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.config?.url, error.response?.status, error.message);

    // Log the full error details
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }

    // Check if error is due to authentication issues
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication error:', error.response.data);
      handleLogout();
    }

    return Promise.reject(error);
  }
);

console.log(import.meta.env.API_URL || 'http://localhost:3000/api')

console.log('Base URL:', axiosInstance.defaults.baseURL);

interface Response {
  data: any;
  status: number;
  error: boolean;
}

async function getRequest(url: string, config?: AxiosRequestConfig<any>) : Promise<Response> {
  try {
    console.log(url);
    const response = await axiosInstance.get(url, config);
    return { data: response.data, status: response.status, error: false };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error making GET request:', error);
    return { data: axiosError.message, status: axiosError.status || 500, error: true };
  }
}

async function postRequest(url: string, data: any, config?: AxiosRequestConfig<any>): Promise<Response> {
  console.log(`Making POST request to ${url} with data:`, data);
  try {
    const response = await axiosInstance.post(url, data, config);
    console.log(`POST request to ${url} successful:`, response.data);
    return { data: response.data, status: response.status, error: false };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error making POST request to ${url}:`, error);

    // Get the actual error message from the server response if available
    const errorMessage = axiosError.response?.data?.error || axiosError.message;
    console.error('Error details:', errorMessage);

    // Log the request that failed
    console.error('Failed request data:', data);

    return { data: errorMessage, status: axiosError.response?.status || 500, error: true };
  }
}

async function putRequest(url: string, data: any, config?: AxiosRequestConfig<any>): Promise<Response> {
  try {
    const response = await axiosInstance.put(url, data, config);
    return { data: response.data, status: response.status, error: false };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error making PUT request:', error);
    return { data: axiosError.message, status: axiosError.status || 500, error: true };
  }
}

async function deleteRequest(url: string, config?: AxiosRequestConfig<any>): Promise<Response> {
  try {
    const response = await axiosInstance.delete(url, config);
    return { data: response.data, status: response.status, error: false };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error making DELETE request:', error);
    return { data: axiosError.message, status: axiosError.status || 500, error: true };
  }
}

export {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
};
