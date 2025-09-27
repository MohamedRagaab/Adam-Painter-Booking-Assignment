import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  AvailabilitySlot,
  CreateAvailabilityRequest,
  Booking,
  CreateBookingRequest,
  BookingResponse,
  ApiError,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
    };

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    toast.error(apiError.message);
    return Promise.reject(apiError);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data);
    return response.data;
  },
};

// Availability API
export const availabilityApi = {
  create: async (data: CreateAvailabilityRequest): Promise<AvailabilitySlot> => {
    const response: AxiosResponse<AvailabilitySlot> = await api.post('/availability', data);
    return response.data;
  },

  getMy: async (): Promise<AvailabilitySlot[]> => {
    const response: AxiosResponse<AvailabilitySlot[]> = await api.get('/availability/me');
    return response.data;
  },

  getAvailable: async (params?: {
    start?: string;
    end?: string;
    painterId?: string;
  }): Promise<AvailabilitySlot[]> => {
    const response: AxiosResponse<AvailabilitySlot[]> = await api.get('/availability', { params });
    return response.data;
  },
};

// Booking API
export const bookingApi = {
  create: async (data: CreateBookingRequest): Promise<BookingResponse> => {
    const response: AxiosResponse<BookingResponse> = await api.post('/bookings', data);
    return response.data;
  },

  getMy: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Booking[]> => {
    const response: AxiosResponse<Booking[]> = await api.get('/bookings/me', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  bookAlternative: async (slotId: string, duration: number): Promise<Booking> => {
    const response: AxiosResponse<Booking> = await api.post(`/bookings/alternative/${slotId}`, {
      duration,
    });
    return response.data;
  },
};

export default api;

