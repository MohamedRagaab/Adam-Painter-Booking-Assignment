import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { availabilityApi, bookingApi } from '../services/api';
import { convertToUTC } from '../utils/timezone';
import type { CreateAvailabilityRequest } from '../types';

const schema = yup.object({
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
});

const PainterDashboard: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAvailabilityRequest>({
    resolver: yupResolver(schema),
  });

  // Fetch painter's availability slots
  const { data: availabilitySlots, isLoading: loadingAvailability } = useQuery({
    queryKey: ['availability', 'my'],
    queryFn: availabilityApi.getMy,
  });

  // Fetch painter's bookings
  const { data: bookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => bookingApi.getMy(),
  });

  // Create availability mutation
  const createAvailabilityMutation = useMutation({
    mutationFn: availabilityApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Availability slot added successfully');
      reset();
      setShowAddForm(false);
    },
    onError: () => {
      toast.error('Failed to add availability slot');
    },
  });

  const onSubmit = (data: CreateAvailabilityRequest) => {
    try {
      // Convert local time to UTC before sending to server
      const utcData = {
        startTime: convertToUTC(data.startTime),
        endTime: convertToUTC(data.endTime),
      };
      createAvailabilityMutation.mutate(utcData);
    } catch (error) {
      toast.error('Invalid date format. Please check your input.');
    }
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
          Painter Dashboard
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage your availability and view your upcoming bookings.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Availability Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                My Availability
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {showAddForm ? 'Cancel' : 'Add Slot'}
              </button>
            </div>

            {showAddForm && (
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
                    disabled={createAvailabilityMutation.isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {createAvailabilityMutation.isPending ? 'Adding...' : 'Add Availability'}
                  </button>
                </div>
              </form>
            )}

            {loadingAvailability ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            ) : availabilitySlots && availabilitySlots.length > 0 ? (
              <div className="space-y-3">
                {availabilitySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDateTime(slot.startTime)} - {format(parseISO(slot.endTime), 'HH:mm')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {slot.isBooked ? 'Booked' : 'Available'}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          slot.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No availability slots yet.</p>
                <p className="text-sm text-gray-400">Click "Add Slot" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Section */}
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
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.customer?.firstName} {booking.customer?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.customer?.email}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No bookings yet.</p>
                <p className="text-sm text-gray-400">
                  Add availability slots to start receiving bookings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainterDashboard;

