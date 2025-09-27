export interface User {
  id: string;
  email: string;
  userType: 'painter' | 'customer';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userType: 'painter' | 'customer';
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AvailabilitySlot {
  id: string;
  painterId: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  painter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAvailabilityRequest {
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  customerId: string;
  painterId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  painter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  availabilitySlot?: {
    id: string;
    startTime: string;
    endTime: string;
  };
}

export interface CreateBookingRequest {
  startTime: string;
  endTime: string;
}

export interface BookingResponse {
  booking?: Booking;
  alternatives?: AlternativeSlot[];
}

export interface AlternativeSlot {
  id: string;
  painterId: string;
  startTime: string;
  endTime: string;
  painter: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
