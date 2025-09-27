import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { bookingApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch user's bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => bookingApi.getMy(),
  });

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy - HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupBookingsByStatus = () => {
    if (!bookings) return { confirmed: [], pending: [], cancelled: [] };

    return bookings.reduce(
      (acc, booking) => {
        acc[booking.status as keyof typeof acc].push(booking);
        return acc;
      },
      { confirmed: [] as typeof bookings, pending: [] as typeof bookings, cancelled: [] as typeof bookings }
    );
  };

  const groupedBookings = groupBookingsByStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          My Bookings
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          View and manage all your {user?.userType === 'painter' ? 'assigned' : 'requested'} bookings.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Confirmed Bookings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmed Bookings ({groupedBookings.confirmed.length})
            </h3>
            {groupedBookings.confirmed.length > 0 ? (
              <div className="space-y-3">
                {groupedBookings.confirmed.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-green-200 rounded-lg p-4 bg-green-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        {user?.userType === 'painter' ? (
                          <>
                            <p className="text-sm font-medium text-gray-900">
                              Customer: {booking.customer?.firstName} {booking.customer?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.customer?.email}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-900">
                              Painter: {booking.painter?.firstName} {booking.painter?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.painter?.email}
                            </p>
                          </>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.startTime)} - {format(parseISO(booking.endTime), 'HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No confirmed bookings.</p>
            )}
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Pending Bookings ({groupedBookings.pending.length})
            </h3>
            {groupedBookings.pending.length > 0 ? (
              <div className="space-y-3">
                {groupedBookings.pending.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        {user?.userType === 'painter' ? (
                          <>
                            <p className="text-sm font-medium text-gray-900">
                              Customer: {booking.customer?.firstName} {booking.customer?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.customer?.email}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-900">
                              Painter: {booking.painter?.firstName} {booking.painter?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.painter?.email}
                            </p>
                          </>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.startTime)} - {format(parseISO(booking.endTime), 'HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No pending bookings.</p>
            )}
          </div>
        </div>

        {/* Cancelled Bookings */}
        {groupedBookings.cancelled.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cancelled Bookings ({groupedBookings.cancelled.length})
              </h3>
              <div className="space-y-3">
                {groupedBookings.cancelled.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-red-200 rounded-lg p-4 bg-red-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        {user?.userType === 'painter' ? (
                          <>
                            <p className="text-sm font-medium text-gray-900">
                              Customer: {booking.customer?.firstName} {booking.customer?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.customer?.email}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-900">
                              Painter: {booking.painter?.firstName} {booking.painter?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {booking.painter?.email}
                            </p>
                          </>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(booking.startTime)} - {format(parseISO(booking.endTime), 'HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found.</p>
            <p className="text-gray-400 text-sm mt-2">
              {user?.userType === 'painter'
                ? 'Add availability slots to start receiving bookings.'
                : 'Create your first booking to get started.'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BookingsPage;


