import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { bookingApi } from '../services/api';
import { convertToUTC } from '../utils/timezone';
import type { CreateBookingRequest, AlternativeSlot } from '../types';

const schema = yup.object({
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
});

const CustomerDashboard: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [alternatives, setAlternatives] = useState<AlternativeSlot[]>([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBookingRequest>({
    resolver: yupResolver(schema),
  });

  // Fetch customer's bookings
  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => bookingApi.getMy(),
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingApi.create,
    onSuccess: (data) => {
      if (data.booking) {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        toast.success('Booking confirmed successfully!');
        reset();
        setShowBookingForm(false);
        setShowAlternatives(false);
        setAlternatives([]);
      } else if (data.alternatives) {
        setAlternatives(data.alternatives);
        setShowAlternatives(true);
        if (data.alternatives.length > 0) {
          toast('No painters available for your requested time. Here are some alternatives:');
        } else {
          toast.error('No painters available for your requested time. No alternative slots found.');
        }
      }
    },
    onError: () => {
      toast.error('Failed to create booking');
    },
  });

  // Book alternative slot mutation
  const bookAlternativeMutation = useMutation({
    mutationFn: ({ slotId, duration }: { slotId: string; duration: number }) =>
      bookingApi.bookAlternative(slotId, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Alternative slot booked successfully!');
      setShowAlternatives(false);
      setAlternatives([]);
      reset();
      setShowBookingForm(false);
    },
    onError: () => {
      toast.error('Failed to book alternative slot');
    },
  });

  const onSubmit = (data: CreateBookingRequest) => {
    try {
      // Convert local time to UTC before sending to server
      const utcData = {
        startTime: convertToUTC(data.startTime),
        endTime: convertToUTC(data.endTime),
      };
      createBookingMutation.mutate(utcData);
    } catch (error) {
      toast.error('Invalid date format. Please check your input.');
    }
  };

  const handleBookAlternative = (slot: AlternativeSlot) => {
    const duration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    bookAlternativeMutation.mutate({ slotId: slot.id, duration });
  };

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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Customer Dashboard
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Book painting services and manage your appointments.
        </p>
      </div>

      <div className="mt-6">
        {/* Booking Section */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Book a Painting Service
              </h3>
              <button
                onClick={() => {
                  setShowBookingForm(!showBookingForm);
                  setShowAlternatives(false);
                  setAlternatives([]);
                }}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {showBookingForm ? 'Cancel' : 'New Booking'}
              </button>
            </div>

            {showBookingForm && (
              <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      {...register('startTime')}
                      type="datetime-local"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.startTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      {...register('endTime')}
                      type="datetime-local"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors.endTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={createBookingMutation.isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {createBookingMutation.isPending ? 'Booking...' : 'Request Booking'}
                  </button>
                </div>
              </form>
            )}

            {/* Alternative Slots */}
            {showAlternatives && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-medium text-blue-900 mb-4">
                  Alternative Time Slots
                </h4>
                {alternatives.length > 0 ? (
                  <>
                    <p className="text-sm text-blue-700 mb-4">
                      Your requested time is not available, but here are some alternatives:
                    </p>
                    <div className="space-y-3">
                      {alternatives.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {slot.painter.firstName} {slot.painter.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDateTime(slot.startTime)} - {format(parseISO(slot.endTime), 'HH:mm')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleBookAlternative(slot)}
                            disabled={bookAlternativeMutation.isPending}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            {bookAlternativeMutation.isPending ? 'Booking...' : 'Book This'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-red-500 mb-2">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700 font-medium mb-2">
                      No alternative time slots available
                    </p>
                    <p className="text-xs text-red-600">
                      Please try a different time or contact support for assistance.
                    </p>
                    <button
                      onClick={() => {
                        setShowAlternatives(false);
                        setAlternatives([]);
                      }}
                      className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              My Bookings
            </h3>

            {loadingBookings ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Painter: {booking.painter?.firstName} {booking.painter?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.painter?.email}
                        </p>
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
                      Booked on {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No bookings yet.</p>
                <p className="text-sm text-gray-400">
                  Click "New Booking" to schedule a painting service.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
