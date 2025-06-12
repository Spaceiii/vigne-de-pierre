import axios from 'axios';
import { type AxiosRequestConfig, type AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_URL || 'http://localhost:3000/api',

});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
})

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
  try {
    const response = await axiosInstance.post(url, data, config);
    return { data: response.data, status: response.status, error: false };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error making POST request:', error);
    return { data: axiosError.message, status: axiosError.status || 500, error: true };
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
