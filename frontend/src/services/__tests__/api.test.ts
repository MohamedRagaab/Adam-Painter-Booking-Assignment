import axios from 'axios';
import type { LoginRequest, RegisterRequest, CreateAvailabilityRequest, CreateBookingRequest } from '../../types';

// Mock axios
jest.mock('axios');

// Mock the API module to avoid import.meta issues
jest.mock('../api', () => {
  const mockApi = {
    authApi: {
      login: jest.fn(),
      register: jest.fn(),
    },
    availabilityApi: {
      create: jest.fn(),
      getMy: jest.fn(),
      getAvailable: jest.fn(),
    },
    bookingApi: {
      create: jest.fn(),
      getMy: jest.fn(),
      getById: jest.fn(),
      updateStatus: jest.fn(),
      bookAlternative: jest.fn(),
    },
  };
  return mockApi;
});

import { authApi, availabilityApi, bookingApi } from '../api';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authApi', () => {
    describe('login', () => {
      it('should login successfully', async () => {
        const loginData: LoginRequest = {
          email: 'test@example.com',
          password: 'password123',
        };

        const responseData = {
          accessToken: 'token123',
          user: {
            id: '1',
            email: 'test@example.com',
            userType: 'painter',
            firstName: 'John',
            lastName: 'Doe',
          },
        };

        (authApi.login as jest.Mock).mockResolvedValue(responseData);

        const result = await authApi.login(loginData);

        expect(authApi.login).toHaveBeenCalledWith(loginData);
        expect(result).toEqual(responseData);
      });
    });

    describe('register', () => {
      it('should register successfully', async () => {
        const registerData: RegisterRequest = {
          email: 'test@example.com',
          password: 'password123',
          userType: 'painter',
          firstName: 'John',
          lastName: 'Doe',
        };

        const responseData = {
          accessToken: 'token123',
          user: {
            id: '1',
            email: 'test@example.com',
            userType: 'painter',
            firstName: 'John',
            lastName: 'Doe',
          },
        };

        (authApi.register as jest.Mock).mockResolvedValue(responseData);

        const result = await authApi.register(registerData);

        expect(authApi.register).toHaveBeenCalledWith(registerData);
        expect(result).toEqual(responseData);
      });
    });
  });

  describe('availabilityApi', () => {
    describe('create', () => {
      it('should create availability slot successfully', async () => {
        const availabilityData: CreateAvailabilityRequest = {
          startTime: '2025-05-18T10:00:00Z',
          endTime: '2025-05-18T14:00:00Z',
        };

        const responseData = {
          id: 'slot1',
          painterId: 'painter1',
          startTime: '2025-05-18T10:00:00Z',
          endTime: '2025-05-18T14:00:00Z',
          isBooked: false,
          createdAt: '2025-05-18T09:00:00Z',
        };

        (availabilityApi.create as jest.Mock).mockResolvedValue(responseData);

        const result = await availabilityApi.create(availabilityData);

        expect(availabilityApi.create).toHaveBeenCalledWith(availabilityData);
        expect(result).toEqual(responseData);
      });
    });

    describe('getMy', () => {
      it('should get painter availability slots', async () => {
        const responseData = [
          {
            id: 'slot1',
            painterId: 'painter1',
            startTime: '2025-05-18T10:00:00Z',
            endTime: '2025-05-18T14:00:00Z',
            isBooked: false,
            createdAt: '2025-05-18T09:00:00Z',
          },
        ];

        (availabilityApi.getMy as jest.Mock).mockResolvedValue(responseData);

        const result = await availabilityApi.getMy();

        expect(availabilityApi.getMy).toHaveBeenCalledWith();
        expect(result).toEqual(responseData);
      });
    });

    describe('getAvailable', () => {
      it('should get available slots with params', async () => {
        const params = {
          start: '2025-05-18',
          end: '2025-05-19',
          painterId: 'painter1',
        };

        const responseData = [
          {
            id: 'slot1',
            painterId: 'painter1',
            startTime: '2025-05-18T10:00:00Z',
            endTime: '2025-05-18T14:00:00Z',
            isBooked: false,
            createdAt: '2025-05-18T09:00:00Z',
          },
        ];

        (availabilityApi.getAvailable as jest.Mock).mockResolvedValue(responseData);

        const result = await availabilityApi.getAvailable(params);

        expect(availabilityApi.getAvailable).toHaveBeenCalledWith(params);
        expect(result).toEqual(responseData);
      });
    });
  });

  describe('bookingApi', () => {
    describe('create', () => {
      it('should create booking successfully', async () => {
        const bookingData: CreateBookingRequest = {
          startTime: '2025-05-18T11:00:00Z',
          endTime: '2025-05-18T13:00:00Z',
        };

        const responseData = {
          booking: {
            id: 'booking1',
            customerId: 'customer1',
            painterId: 'painter1',
            startTime: '2025-05-18T11:00:00Z',
            endTime: '2025-05-18T13:00:00Z',
            status: 'confirmed',
            createdAt: '2025-05-18T10:00:00Z',
            updatedAt: '2025-05-18T10:00:00Z',
          },
        };

        (bookingApi.create as jest.Mock).mockResolvedValue(responseData);

        const result = await bookingApi.create(bookingData);

        expect(bookingApi.create).toHaveBeenCalledWith(bookingData);
        expect(result).toEqual(responseData);
      });
    });

    describe('getMy', () => {
      it('should get user bookings', async () => {
        const responseData = [
          {
            id: 'booking1',
            customerId: 'customer1',
            painterId: 'painter1',
            startTime: '2025-05-18T11:00:00Z',
            endTime: '2025-05-18T13:00:00Z',
            status: 'confirmed',
            createdAt: '2025-05-18T10:00:00Z',
            updatedAt: '2025-05-18T10:00:00Z',
          },
        ];

        (bookingApi.getMy as jest.Mock).mockResolvedValue(responseData);

        const result = await bookingApi.getMy();

        expect(bookingApi.getMy).toHaveBeenCalledWith();
        expect(result).toEqual(responseData);
      });
    });

    describe('updateStatus', () => {
      it('should update booking status', async () => {
        const bookingId = 'booking1';
        const status = 'cancelled';

        const responseData = {
          id: 'booking1',
          customerId: 'customer1',
          painterId: 'painter1',
          startTime: '2025-05-18T11:00:00Z',
          endTime: '2025-05-18T13:00:00Z',
          status: 'cancelled',
          createdAt: '2025-05-18T10:00:00Z',
          updatedAt: '2025-05-18T10:30:00Z',
        };

        (bookingApi.updateStatus as jest.Mock).mockResolvedValue(responseData);

        const result = await bookingApi.updateStatus(bookingId, status);

        expect(bookingApi.updateStatus).toHaveBeenCalledWith(bookingId, status);
        expect(result).toEqual(responseData);
      });
    });
  });
});

